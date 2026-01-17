import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  // Optimize for production
  ...(process.env.NODE_ENV === 'production' && {
    // Disable query logging in production for better performance
  }),
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
} else {
  // In production, ensure singleton pattern
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma
  }
}
