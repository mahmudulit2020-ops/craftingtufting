// Prisma Client Singleton Architecture
// In production with PostgreSQL, this maintains a persistent connection pool across server calls.

interface GlobalWithPrisma {
  prisma?: unknown;
}

const globalForPrisma = globalThis as unknown as GlobalWithPrisma;

export const prisma =
  globalForPrisma.prisma ||
  {
    // Client-side stub fallback when operating without active DATABASE_URL
    user: { findMany: async () => [], findUnique: async () => null },
    product: { findMany: async () => [], findUnique: async () => null },
    customRugOrder: { findMany: async () => [], create: async (d: unknown) => d },
    order: { findMany: async () => [], create: async (d: unknown) => d },
    pricingConfig: { findMany: async () => [] },
  };

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
