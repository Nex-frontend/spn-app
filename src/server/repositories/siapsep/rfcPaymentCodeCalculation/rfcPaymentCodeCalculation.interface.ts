import { PaymentCode, Rfc } from '../interfaces';

export type RfcPaymentCodeCalculationI = Rfc & Partial<PaymentCode>;

export type RfcPaymentCodeCalculationColumns = keyof RfcPaymentCodeCalculationI;

// QUERY TO CREATE TABLE IN SIAPSEP (INFORMIX)
// create table spn_rfcplaza (
//         rfc char(13) not null,
//         cod_pago smallint,
//         unidad smallint,
//         subunidad smallint,
//         cat_puesto char(7),
//         horas float,
//         cons_plaza integer,
//         status smallint default 0
// )
