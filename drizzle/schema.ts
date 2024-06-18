import {
  pgTable,
  serial,
  varchar,
  timestamp,
  bigint,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';

import { InferSelectModel, sql } from 'drizzle-orm';

// Enum definition
export const userTypeEnum = pgEnum('userType', ['common', 'otherTypes']);

// User table definition
const users = pgTable('users', {
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
const wallet = pgTable('wallet', {
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
const transferences = pgTable('transferences', {
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

// Infer models
export type User = InferSelectModel<typeof users>;
export type Wallet = InferSelectModel<typeof wallet>;
export type Transference = InferSelectModel<typeof transferences>;
