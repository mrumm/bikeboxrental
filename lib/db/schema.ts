import { pgTable, serial, varchar, date, timestamp, integer, boolean, text } from 'drizzle-orm/pg-core';

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 50 }),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  totalPrice: integer('total_price').notNull(),
  stripeSessionId: varchar('stripe_session_id', { length: 255 }),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  paymentStatus: varchar('payment_status', { length: 50 }).default('pending').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const blockedDates = pgTable('blocked_dates', {
  id: serial('id').primaryKey(),
  date: date('date').notNull().unique(),
  reason: varchar('reason', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type BlockedDate = typeof blockedDates.$inferSelect;
export type NewBlockedDate = typeof blockedDates.$inferInsert;