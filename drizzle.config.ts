import type { Config } from 'drizzle-kit'

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Generate migrations in TypeScript
  migrations: {
    table: '__drizzle_migrations',
    schema: 'public',
  },
} satisfies Config
