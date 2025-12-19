import { getManyCount } from '../employeePaymentCodeConcept.repository';
import { db } from '~/server/db';

export const getCount = async (fortnight: number) => {
  return await getManyCount({
    concept: '19',
    type: 'D',
    endFortnight: fortnight,
    endFortnightComparative: 'moreEqualThan',
  });
};

export const closeVigencyByRfc = async (fortnight: number, closeFortnight: number) => {
  return await db.siapsep.execute({
    query: `merge into emp_plaza_cpto as em
        using spn_rfcplaza as sp
        on sp.rfc = em.rfc 
        and (sp.cod_pago is null or sp.cod_pago = 0)
        and em.concepto = '19'
        and em.perc_ded = 'D'
        and em.qna_ini <= ?
        and em.qna_fin >= ? 
        when matched then update set em.qna_fin = ?;
    `,
    args: [fortnight, fortnight, closeFortnight],
  });
};

export const closeVigencyByRfcAndCode = async (fortnight: number, closeFortnight: number) => {
  return await db.siapsep.execute({
    query: `merge into emp_plaza_cpto as em
        using spn_rfcplaza as sp
        on sp.rfc = em.rfc  
        and sp.cod_pago = em.cod_pago
        and sp.unidad = em.unidad
        and sp.subunidad = em.subunidad
        and sp.cat_puesto = em.cat_puesto
        and sp.horas = em.horas
        and sp.cons_plaza = em.cons_plaza
        and em.qna_ini <= ?
        and em.qna_fin >= ? 
        and em.concepto = '19'
        and em.perc_ded = 'D'
        when matched then update set em.qna_fin = ?`,
    args: [fortnight, fortnight, closeFortnight],
  });
};

export const deleteByRfc = async (fortnight: number) => {
  return await db.siapsep.execute({
    query: `delete from emp_plaza_cpto
        where exists (
          select 1
          from spn_rfcplaza sp
          where sp.rfc = emp_plaza_cpto.rfc
          and (sp.cod_pago is null or sp.cod_pago = 0)
        )
        and concepto = '19'
        and perc_ded = 'D'
        and qna_ini = ?
        and qna_fin >= ?`,
    args: [fortnight, fortnight],
  });
};

export const deleteByRfcAndCode = async (fortnight: number) => {
  return await db.siapsep.execute({
    query: `delete from emp_plaza_cpto em
        where exists (
          select 1
          from spn_rfcplaza sp
          where sp.rfc = em.rfc
           and sp.cod_pago = em.cod_pago
           and sp.unidad = em.unidad
           and sp.subunidad = em.subunidad
           and sp.cat_puesto = em.cat_puesto
           and sp.horas = em.horas
           and sp.cons_plaza = em.cons_plaza
        )
        and concepto = '19'
        and perc_ded = 'D'
        and qna_ini = ?
        and qna_fin >= ?`,
    args: [fortnight, fortnight],
  });
};
