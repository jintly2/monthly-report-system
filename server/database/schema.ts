import { pgTable, uuid, varchar, text, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const staff = pgTable('staff', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  position: varchar('position', { length: 100 }).notNull(),
  team: varchar('team', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  userId: varchar('user_id', { length: 100 }),
  createdAt: varchar('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: varchar('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index('idx_staff_status').on(table.status),
]);

export const monthlyReport = pgTable('monthly_report', {
  id: uuid('id').primaryKey().defaultRandom(),
  reporterId: varchar('reporter_id', { length: 100 }).notNull(),
  reporterName: varchar('reporter_name', { length: 50 }).notNull(),
  reportMonth: varchar('report_month', { length: 7 }).notNull(),
  performanceItems: jsonb('performance_items').notNull().default(sql`'[]'::jsonb`),
  bonusItems: jsonb('bonus_items').notNull().default(sql`'[]'::jsonb`),
  efficiencyItems: jsonb('efficiency_items').notNull().default(sql`'[]'::jsonb`),
  crossDeptCollab: text('cross_dept_collab').notNull().default(''),
  highlights: text('highlights').notNull().default(''),
  nextMonthPlan: text('next_month_plan').notNull().default(''),
  resourcesNeeded: text('resources_needed').notNull().default(''),
  reviewComments: jsonb('review_comments').notNull().default(sql`'[]'::jsonb`),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  createdAt: varchar('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: varchar('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex('idx_monthly_report_reporter_month').on(table.reporterId, table.reportMonth),
  index('idx_monthly_report_month').on(table.reportMonth),
  index('idx_monthly_report_status').on(table.status),
]);
