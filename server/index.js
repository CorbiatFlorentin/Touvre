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
  const validated = validateInscriptionPayload(req.body || {})
  if (validated.error) {
    return res.status(400).json({ error: validated.error })
  }

  const created = await prisma.inscription.create({
    data: validated.data,
  })

  return res.status(201).json(created)
})

const validateInscriptionPayload = ({
  nom,
  email,
  phoneNumber = null,
  event,
  accompteVerser = false,
  accompteMontant = null,
}) => {
  if (!nom || !email || !event) {
    return { error: 'missing_fields' }
  }
  if (!isValidEmail(email)) {
    return { error: 'invalid_email' }
  }
  if (event !== 'MICHOUI' && event !== 'VIDE_GRENIER') {
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
      nom: String(nom).trim(),
      email: String(email).trim(),
      phoneNumber: phoneNumber != null ? String(phoneNumber).trim() : null,
      event,
      accompteVerser: Boolean(accompteVerser),
      accompteMontant: montantValue,
    },
  }
}

app.get('/api/inscriptions', requireAuth, async (req, res) => {
  const event = req.query.event
  const where = {}
  if (event) {
    if (event !== 'MICHOUI' && event !== 'VIDE_GRENIER') {
      return res.status(400).json({ error: 'invalid_event' })
    }
    where.event = event
  }

  const entries = await prisma.inscription.findMany({
    where,
    orderBy: { createdAt: 'desc' },
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

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
