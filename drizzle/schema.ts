import { 
  pgTable, 
  uuid, 
  varchar, 
  text, 
  boolean, 
  integer, 
  timestamp, 
  pgEnum,
  index
} from 'drizzle-orm/pg-core'

// Enums
export const projectStatusEnum = pgEnum('project_status', [
  'IN_PROGRESS',
  'COMPLETED',
  'ON_HOLD'
])

// Projects table
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  websiteUrl: varchar('website_url', { length: 500 }),
  technologies: text('technologies').array().notNull().default([]),
  aiPrompt: text('ai_prompt'),
  status: projectStatusEnum('status').notNull().default('COMPLETED'),
  featured: boolean('featured').notNull().default(false),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  statusIdx: index('projects_status_idx').on(table.status),
  featuredIdx: index('projects_featured_idx').on(table.featured),
  createdAtIdx: index('projects_created_at_idx').on(table.createdAt),
  orderIdx: index('projects_order_idx').on(table.order),
  // Composite index for common query patterns
  statusFeaturedOrderIdx: index('projects_status_featured_order_idx').on(
    table.status,
    table.featured,
    table.order
  ),
}))

// Project Images table
export const projectImages = pgTable('project_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  isPrimary: boolean('is_primary').notNull().default(false),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  projectIdIdx: index('project_images_project_id_idx').on(table.projectId),
}))

// Type definitions
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type ProjectImage = typeof projectImages.$inferSelect
export type NewProjectImage = typeof projectImages.$inferInsert
