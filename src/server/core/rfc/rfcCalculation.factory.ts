import { core } from '..';
import { repository } from '~/server/repositories';

type RfcCalculationTables = 'rfc_calculo' | 'rfc2' | 'rfc3';
type Rfc = { rfc: string };

const rfcCalculationFactory = (rfcTable: RfcCalculationTables) => {
  let table = rfcTable;

  const setTable = (rfcTable: RfcCalculationTables) => {
    table = rfcTable;
  };

  const getTable = () => table;

  const getRfcs = async () => {
    return await repository.siapsep.rfcCalculation.getAll(table);
  };

  const createUniqueRFCs = async (rfcs: Rfc[]) => {
    const rfcUniques = core.rfc.groupByRFCtoSQL(rfcs);
    return await createRFCs(rfcUniques);
  };

  const createRFCs = async (rfcs: string[][]) => {
    await repository.siapsep.rfcCalculation.deleteAll(table);
    return await repository.siapsep.rfcCalculation.createMany(table, rfcs);
  };

  const getRfcNotInEmployee = async () => {
    return await repository.siapsep.rfcCalculation.getNotInEmployee(table);
  };

  const deleteRfcNotInEmployee = async () => {
    return await repository.siapsep.rfcCalculation.deleteNotInEmployee(table);
  };

  return {
    deleteRfcNotInEmployee,
    getRfcNotInEmployee,
    getRfcs,
    createRFCs,
    createUniqueRFCs,
    setTable,
    getTable,
  };
};

const rfc2 = rfcCalculationFactory('rfc2');
const rfc3 = rfcCalculationFactory('rfc3');
const rfcCalculation = rfcCalculationFactory('rfc_calculo');

export { rfc2, rfc3, rfcCalculation };
