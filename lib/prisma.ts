import { PrismaClient } from '@prisma/client';

// See: https://www.prisma.io/docs/reference/database-reference/errors-reference#prisma-client-initialization-errors
// Avoid instantiating multiple PrismaClient instances in development.
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;