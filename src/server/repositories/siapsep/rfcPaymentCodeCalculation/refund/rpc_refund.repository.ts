import { GetRfcNotEPCI, GetRfcPaymentCodeNotEPCI } from './rpc_refund.interface';
import { db } from '~/server/db';

export const getRfcNotEPC = async (fortnight: string) => {
  return await db.siapsep.execute<GetRfcNotEPCI>({
    query: `SELECT a.rfc from spn_rfcplaza as a
            left join emp_plaza_cpto as b
            on a.rfc = b.rfc
            and b.concepto = 19 and b.perc_ded = 'D' and b.qna_fin >= ?
            where (a.cod_pago is null or a.cod_pago = 0) and a.status = 4
            and b.rfc is null`,
    args: [fortnight],
  });
};

export const getRfcPaymentCodeNotEPC = async (fortnight: string) => {
  return await db.siapsep.execute<GetRfcPaymentCodeNotEPCI>({
    query: `SELECT a.* from spn_rfcplaza as a
            left join emp_plaza_cpto as b
            on a.rfc = b.rfc
            and a.cod_pago = b.cod_pago
            and a.unidad = b.unidad
            and a.subunidad = b.subunidad
            and a.cat_puesto = b.cat_puesto
            and a.horas = b.horas
            and a.cons_plaza = b.cons_plaza
            and b.concepto = 19 and b.perc_ded = 'D' and b.qna_fin >= ?
            where (a.cod_pago is not null or a.cod_pago != 0) and b.status = 4
            and b.rfc is null`,
    args: [fortnight],
  });
};
