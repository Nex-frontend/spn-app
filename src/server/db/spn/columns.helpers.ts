import { timestamp } from 'drizzle-orm/pg-core';

export const createdAt = timestamp().notNull().defaultNow();

export const timestamps = {
  createdAt,
  deletedAt: timestamp(),
  updatedAt: timestamp(),
};
