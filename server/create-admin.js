const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const run = async () => {
  const [, , emailArg, passwordArg, ...rest] = process.argv
  const force = rest.includes('--force')

  if (!emailArg || !passwordArg) {
    console.error('Usage: node server/create-admin.js <email> <password> [--force]')
    process.exit(1)
  }

  const email = String(emailArg).toLowerCase().trim()
  const password = String(passwordArg)

  const existingCount = await prisma.admin.count()
  if (existingCount > 0 && !force) {
    console.error('Admin already exists. Use --force to overwrite.')
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 10)

  if (existingCount > 0 && force) {
    await prisma.admin.deleteMany()
  }

  await prisma.admin.create({
    data: { email, passwordHash },
  })

  console.log(`Admin created for ${email}`)
}

run()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
