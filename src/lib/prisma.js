import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis;

let prisma;

if (!globalForPrisma.prisma) {
  // Use pure JS cross-platform LibSQL driver to bypass Turbopack C++ bindings issues
  const libsql = createClient({ url: 'file:./dev.db' });
  const adapter = new PrismaLibSql(libsql);
  globalForPrisma.prisma = new PrismaClient({ 
    adapter,
    // Explicitly pass url to prevent Prisma 7 from crashing on an undefined environment variable lookup
    datasourceUrl: 'file:./dev.db',
    datasources: { db: { url: 'file:./dev.db' } }
  });
}

prisma = globalForPrisma.prisma;
export { prisma };
