const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

dotenv.config()

const app = express()
const prisma = new PrismaClient()

const PORT = Number(process.env.PORT || 3001)
const JWT_SECRET = process.env.JWT_SECRET || ''

if (!JWT_SECRET) {
  console.warn('JWT_SECRET is missing. Set it in .env for auth to work.')
}

app.use(cors({ origin: ['http://localhost:5173'], credentials: true }))
app.use(express.json())

const isValidEmail = (value) => {
  return typeof value === 'string' && value.includes('@') && value.includes('.')
}

const VALID_EVENTS = ['MICHOUI', 'VIDE_GRENIER']
const VALID_TARIFS = ['ADULTE', 'ENFANT_MOINS_12', 'ENFANT_MOINS_3']
const newsletters = []
let newsletterId = 1

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: 'missing_token' })
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    return next()
  } catch (error) {
    return res.status(401).json({ error: 'invalid_token' })
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'missing_fields' })
  }

  const admin = await prisma.admin.findUnique({
    where: { email: String(email).toLowerCase() },
  })
  if (!admin) {
    return res.status(401).json({ error: 'invalid_credentials' })
  }

  const passwordOk = await bcrypt.compare(String(password), admin.passwordHash)
  if (!passwordOk) {
    return res.status(401).json({ error: 'invalid_credentials' })
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ error: 'jwt_not_configured' })
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  })

  const token = jwt.sign(
    { role: 'admin', email: admin.email },
    JWT_SECRET,
    { expiresIn: '8h' }
  )
  return res.json({ token })
})

app.post('/api/inscriptions', async (req, res) => {
  const payload = req.body || {}

  if (payload.event === 'MICHOUI' && Array.isArray(payload.participants)) {
    const validated = validateMechouiPayload(payload)
    if (validated.error) {
      return res.status(400).json({ error: validated.error })
    }

    const created = await prisma.$transaction(async (tx) => {
      const lastGroup = await tx.inscription.findFirst({
        where: {
          event: 'MICHOUI',
          NOT: { formulaireId: null },
        },
        orderBy: { formulaireId: 'desc' },
      })
      const formulaireId = (lastGroup?.formulaireId || 0) + 1

      return Promise.all(
        validated.data.map((entry) =>
          tx.inscription.create({
            data: {
              ...entry,
              formulaireId,
            },
          })
        )
      )
    })

    return res.status(201).json(created)
  }

  const validated = validateInscriptionPayload(payload)
  if (validated.error) {
    return res.status(400).json({ error: validated.error })
  }

  const created = await prisma.inscription.create({
    data: validated.data,
  })

  return res.status(201).json(created)
})

const validateSharedFields = ({
  email,
  phoneNumber = null,
  event,
  accompteVerser = false,
  accompteMontant = null,
}) => {
  if (!email || !event) {
    return { error: 'missing_fields' }
  }
  if (!isValidEmail(email)) {
    return { error: 'invalid_email' }
  }
  if (!VALID_EVENTS.includes(event)) {
    return { error: 'invalid_event' }
  }
  if (phoneNumber != null) {
    const trimmed = String(phoneNumber).trim()
    if (!/^[0-9]{1,20}$/.test(trimmed)) {
      return { error: 'invalid_phone' }
    }
  }

  let montantValue = null
  if (accompteVerser) {
    const parsed = Number(accompteMontant)
    if (Number.isNaN(parsed) || parsed < 0) {
      return { error: 'invalid_accompte' }
    }
    montantValue = Math.round(parsed)
  }

  return {
    data: {
      email: String(email).trim(),
      phoneNumber: phoneNumber != null ? String(phoneNumber).trim() : null,
      event,
      accompteVerser: Boolean(accompteVerser),
      accompteMontant: montantValue,
    },
  }
}

const validateInscriptionPayload = ({
  nom,
  prenom = null,
  tarif = null,
  ...sharedFields
}) => {
  const shared = validateSharedFields(sharedFields)
  if (shared.error) {
    return shared
  }

  if (!nom) {
    return { error: 'missing_fields' }
  }

  if (shared.data.event === 'MICHOUI') {
    if (!prenom || !VALID_TARIFS.includes(tarif)) {
      return { error: 'invalid_mechoui_participant' }
    }
  }

  return {
    data: {
      ...shared.data,
      nom: String(nom).trim(),
      prenom:
        shared.data.event === 'MICHOUI' ? String(prenom).trim() : null,
      tarif: shared.data.event === 'MICHOUI' ? tarif : null,
    },
  }
}

const validateMechouiPayload = ({ participants = [], ...sharedFields }) => {
  const shared = validateSharedFields({
    ...sharedFields,
    event: 'MICHOUI',
  })
  if (shared.error) {
    return shared
  }

  if (!Array.isArray(participants) || participants.length === 0) {
    return { error: 'missing_participants' }
  }

  const data = []
  for (const participant of participants) {
    const nom = participant?.nom ? String(participant.nom).trim() : ''
    const prenom = participant?.prenom ? String(participant.prenom).trim() : ''
    const tarif = participant?.tarif

    if (!nom || !prenom || !VALID_TARIFS.includes(tarif)) {
      return { error: 'invalid_mechoui_participant' }
    }

    data.push({
      ...shared.data,
      nom,
      prenom,
      tarif,
    })
  }

  return { data }
}

const validateNewsletterPayload = (payload = {}) => {
  const title = payload.title ? String(payload.title).trim() : ''
  const subject = payload.subject ? String(payload.subject).trim() : ''
  const summary = payload.summary ? String(payload.summary).trim() : ''
  const content = payload.content ? String(payload.content).trim() : ''
  const ctaLabel = payload.ctaLabel ? String(payload.ctaLabel).trim() : ''
  const ctaUrl = payload.ctaUrl ? String(payload.ctaUrl).trim() : ''
  const scheduledAt = payload.scheduledAt ? String(payload.scheduledAt).trim() : ''

  if (!title || !subject || !summary || !content) {
    return { error: 'missing_fields' }
  }

  let scheduledValue = null
  if (scheduledAt) {
    const parsed = Date.parse(scheduledAt)
    if (Number.isNaN(parsed)) {
      return { error: 'invalid_scheduled_at' }
    }
    scheduledValue = new Date(parsed).toISOString()
  }

  return {
    data: {
      title,
      subject,
      summary,
      content,
      ctaLabel: ctaLabel || null,
      ctaUrl: ctaUrl || null,
      scheduledAt: scheduledValue,
    },
  }
}

app.get('/api/inscriptions', requireAuth, async (req, res) => {
  const event = req.query.event
  const where = {}
  if (event) {
    if (!VALID_EVENTS.includes(event)) {
      return res.status(400).json({ error: 'invalid_event' })
    }
    where.event = event
  }

  const entries = await prisma.inscription.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  })

  return res.json(entries)
})

app.put('/api/inscriptions/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'invalid_id' })
  }

  const validated = validateInscriptionPayload(req.body || {})
  if (validated.error) {
    return res.status(400).json({ error: validated.error })
  }

  try {
    const updated = await prisma.inscription.update({
      where: { id },
      data: validated.data,
    })
    return res.json(updated)
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'not_found' })
    }
    return res.status(500).json({ error: 'server_error' })
  }
})

app.delete('/api/inscriptions/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'invalid_id' })
  }

  try {
    await prisma.inscription.delete({
      where: { id },
    })
    return res.status(204).send()
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'not_found' })
    }
    return res.status(500).json({ error: 'server_error' })
  }
})

app.post('/api/newsletters', requireAuth, (req, res) => {
  const validated = validateNewsletterPayload(req.body || {})
  if (validated.error) {
    return res.status(400).json({ error: validated.error })
  }

  const created = {
    id: newsletterId++,
    ...validated.data,
    createdAt: new Date().toISOString(),
  }
  newsletters.unshift(created)
  return res.status(201).json(created)
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
