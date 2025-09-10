import { boolean, char, integer, pgEnum, pgSchema, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from './auth.db.schema';
import { createdAt } from './columns.helpers';

export const refundTypesEnum = pgEnum('type_refund', [
  'cierre_vigencia',
  'creacion',
  'eliminacion_responsabilidades',
]);

export const refundErrorsEnum = pgEnum('error_refund', [
  'RFC no encontrado',
  'plaza no encontrada',
  'RFC, plaza no activa',
]);

export const refundSchema = pgSchema('refunds');

export const refundLogs = refundSchema.table(
  're_logs',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    processFortnight: char({ length: 6 }).notNull(),
    userId: text()
      .notNull()
      .references(() => user.id),
    createdAt,
    consecutive: integer().default(1).notNull(),
    recordsCreated: integer().default(0).notNull(),
    recordsDeletedResponsabilities: integer().default(0).notNull(),
    recordsDeletedEmployeeConcept: integer().default(0).notNull(),
    recordsClosedTerm: integer().default(0).notNull(),
    recordsSuccesed: integer().default(0).notNull(),
    recordsFailed: integer().default(0).notNull(),
    hasError: boolean().default(false).notNull(),
    activeBefore: integer().default(0).notNull(),
    activeAfter: integer().default(0).notNull(),
    notes: text().default('').notNull(),
  },
  (table) => [uniqueIndex('re_logs_consecutive').on(table.processFortnight, table.consecutive)]
);

export const refundRfcSuccess = refundSchema.table('re_rfc_success', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  refundLogsId: integer()
    .notNull()
    .references(() => refundLogs.id),
  rfc: char({ length: 13 }).notNull(),
  paymentCode: char({ length: 23 }).notNull(),
  type: refundTypesEnum().notNull(),
});

export const refundRfcFailed = refundSchema.table('re_rfc_failed', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  refundLogsId: integer()
    .notNull()
    .references(() => refundLogs.id),
  rfc: char({ length: 13 }).notNull(),
  paymentCode: char({ length: 23 }).notNull(),
  type: refundTypesEnum().notNull(),
  error: refundErrorsEnum().notNull(),
});
