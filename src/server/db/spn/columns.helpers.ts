import { timestamp } from 'drizzle-orm/pg-core';

export const createdAt = timestamp().defaultNow().notNull();

export const timestamps = {
  createdAt,
  deletedAt: timestamp(),
  updatedAt: timestamp(),
};
