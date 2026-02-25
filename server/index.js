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
  const {
    nom,
    email,
    event,
    accompteVerser = false,
    accompteMontant = null,
  } = req.body || {}

  if (!nom || !email || !event) {
    return res.status(400).json({ error: 'missing_fields' })
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'invalid_email' })
  }
  if (event !== 'MICHOUI' && event !== 'VIDE_GRENIER') {
    return res.status(400).json({ error: 'invalid_event' })
  }

  let montantValue = null
  if (accompteVerser) {
    const parsed = Number(accompteMontant)
    if (Number.isNaN(parsed) || parsed < 0) {
      return res.status(400).json({ error: 'invalid_accompte' })
    }
    montantValue = Math.round(parsed)
  }

  const created = await prisma.inscription.create({
    data: {
      nom: String(nom).trim(),
      email: String(email).trim(),
      event,
      accompteVerser: Boolean(accompteVerser),
      accompteMontant: montantValue,
    },
  })

  return res.status(201).json(created)
})

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

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
