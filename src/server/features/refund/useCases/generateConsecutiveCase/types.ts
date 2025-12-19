import { refundErrorsEnum, refundTypesEnum } from '~/server/db/spn/schema';
import { repository } from '~/server/repositories';
import { RefundLogsCreate } from '~/server/repositories/spn/refund';
import { ReturnArrayElement } from '~/shared';

export type StatusAviable = '1' | '4' | '5' | '6';

export type CaptureOpenClose = typeof repository.sicon.refunds.getCaptureByIdOpenClose;

export type RefundErrors = (typeof refundErrorsEnum.enumValues)[number];

export type RefundTypes = (typeof refundTypesEnum.enumValues)[number];

export type ReturnArrayCaptureOpenClose = ReturnArrayElement<CaptureOpenClose>;

export type PrepareCreateEPCColumn = keyof ReturnArrayCaptureOpenClose;

export type RfcError = ReturnArrayCaptureOpenClose & {
  error: RefundErrors;
};

export type RfcSuccess = ReturnArrayCaptureOpenClose;

export type RfcSicon = Awaited<ReturnType<CaptureOpenClose>>;

export type StatusGrouped = Record<StatusAviable, RfcSicon>;

export interface GetSiconCaptureI {
  id: number;
  fortnight: number;
}

export interface HandleEmptyCreateOrCloseRecordsI {
  stats: RefundLogsCreate;
  rfcSuccess: RfcSuccess[];
  rfcErrors: RfcError[];
  statusGrouped: StatusGrouped;
}

export interface VerifyCloseVigenI {
  statusGrouped: StatusGrouped;
  fortnight: number;
}

export interface CloseVigenRefundsI {
  fortnight: number;
}

export interface DeleteRefundsI {
  fortnight: number;
}

export interface DeleteInOtherConsecutiveI {
  statusGrouped: StatusGrouped;
  fortnight: number;
}

export interface CreateRefundsI {
  statusGrouped: StatusGrouped;
}

export interface CreateRecordI {
  stats: RefundLogsCreate;
  rfcSuccess: RfcSuccess[];
  rfcErrors: RfcError[];
}
