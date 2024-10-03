import {
  pgTable,
  serial,
  varchar,
  timestamp,
  bigint,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';

import { relations, sql } from 'drizzle-orm';

// Enum definition
export const userTypeEnum = pgEnum('userType', ['common', 'shopkeeper']);

// User table definition
export const users = pgTable('users', {
  id: serial('id').primaryKey().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  type: userTypeEnum('type').default('common').notNull(),
  hash: varchar('hash').notNull(),
  cpf: varchar('cpf', { length: 14 }).unique(),
  cnpj: varchar('cnpj', { length: 18 }).unique(),
  name: varchar('name', { length: 40 }).notNull(),
  email: varchar('email', { length: 120 }).unique().notNull(),
});

// Wallet table definition
export const wallet = pgTable('wallet', {
  id: serial('id').primaryKey().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  balance: bigint('balance', { mode: 'bigint' }).notNull(),
  userId: integer('userId')
    .unique()
    .notNull()
    .references(() => users.id),
});

// Transference table definition
export const transferences = pgTable('transferences', {
  id: serial('id').primaryKey().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  creditorId: integer('creditorId')
    .notNull()
    .references(() => users.id),
  debitorId: integer('debitorId')
    .notNull()
    .references(() => users.id),
  amount: bigint('amount', { mode: 'bigint' }).notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  wallet: one(wallet, { fields: [users.id], references: [wallet.userId] }),
  sentTransferences: many(transferences, { relationName: 'SentTransferences' }),
  receivedTransferences: many(transferences, {
    relationName: 'ReceivedTransferences',
  }),
}));

export const walletRelations = relations(wallet, ({ one }) => ({
  user: one(users, { fields: [wallet.userId], references: [users.id] }),
}));

export const transferencesRelations = relations(transferences, ({ one }) => ({
  creditor: one(users, {
    fields: [transferences.creditorId],
    references: [users.id],
    relationName: 'SentTransferences',
  }),
  debitor: one(users, {
    fields: [transferences.debitorId],
    references: [users.id],
    relationName: 'ReceivedTransferences',
  }),
}));

// Infer models
export type InsertUser = typeof users.$inferInsert;
// export type Wallet = InferInsertModel<typeof wallet>;
// export type Transference = InferInsertModel<typeof transferences>;
