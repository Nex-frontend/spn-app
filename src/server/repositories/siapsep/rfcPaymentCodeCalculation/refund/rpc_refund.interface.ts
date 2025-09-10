import { PaymentCode, Rfc } from '~/server/repositories/siapsep/interfaces';

export type GetRfcNotEPCI = Rfc;
export type GetRfcPaymentCodeNotEPCI = Rfc & PaymentCode;
