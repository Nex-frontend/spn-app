import { EmployeePaymentCodeConceptI } from './employeePaymentCodeConcept.interface';
import { db } from '~/server/db';
import { BulkInsertArgs } from '~/server/db/siapsep';

type TypeConcept = 'P' | 'D';
type Comparative = 'moreThan' | 'lessThan' | 'equals' | 'moreEqualThan' | 'lessEqualThan';

interface GetManyProps {
  type?: TypeConcept;
  concept?: string;
  endFortnight?: number;
  startFortnight?: number;
  endFortnightComparative?: Comparative;
  startFortnightComparative?: Comparative;
}

const comparativeHash: Record<Comparative, string> = {
  moreThan: '>',
  lessThan: '<',
  equals: '=',
  moreEqualThan: '>=',
  lessEqualThan: '<=',
};

const getWhereClause = (props: GetManyProps) => {
  const {
    type,
    concept,
    endFortnight,
    startFortnight,
    endFortnightComparative,
    startFortnightComparative,
  } = props;

  const whereClauses: string[] = [];
  if (type) {
    whereClauses.push(`perc_ded = '${type}'`);
  }
  if (concept) {
    whereClauses.push(`concepto = '${concept}'`);
  }
  if (endFortnight !== undefined && endFortnightComparative) {
    whereClauses.push(`qna_fin ${comparativeHash[endFortnightComparative]} ${endFortnight}`);
  }
  if (startFortnight !== undefined && startFortnightComparative) {
    whereClauses.push(`qna_ini ${comparativeHash[startFortnightComparative]} ${startFortnight}`);
  }

  return whereClauses;
};

export const getManyCount = async (props: GetManyProps) => {
  const whereClauses = getWhereClause(props);
  return await db.siapsep.execute<{ count: number }>({
    query: `SELECT COUNT(*) AS count FROM emp_plaza_cpto
    where ${whereClauses.join(' and ')} `,
  });
};

export const getMany = async (props: GetManyProps) => {
  const whereClauses = getWhereClause(props);
  return await db.siapsep.execute<EmployeePaymentCodeConceptI>({
    query: `SELECT * FROM emp_plaza_cpto
    where ${whereClauses.join(' and ')} `,
  });
};

export const createMany = async (args: BulkInsertArgs) => {
  return await db.siapsep.executeBulkInsert({
    table: 'emp_plaza_cpto',
    columns: [
      'u_version',
      'rfc',
      'cod_pago',
      'unidad',
      'subunidad',
      'cat_puesto',
      'horas',
      'cons_plaza',
      'perc_ded',
      'concepto',
      'qna_fin',
      'qna_ini',
      'importe',
      'num_doc',
      'fec_doc',
      'ban_ins_cpto',
      'ban_tipo_cpto_ep',
      'num_aplic',
    ],
    args,
  });
};
