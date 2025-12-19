import { ErrorApp } from '~/shared';

interface RfcI {
  rfc: string;
}

export const groupByRFC = (data: RfcI[]) => {
  return data.reduce((acc, item) => {
    if (!item.rfc) {
      throw ErrorApp.badRequest('Se encontro un RFC vacio');
    }

    const rfc = item.rfc.trim().toUpperCase();

    if (rfc === '' || rfc.length < 13) {
      throw ErrorApp.badRequest(`El RFC ${item.rfc} de la captura no es válido`);
    }

    if (rfc in acc) {
      return acc;
    }

    acc.push(rfc);
    return acc;
  }, [] as string[]);
};

export const groupByRFCtoSQL = (data: RfcI[]) => {
  return groupByRFC(data).map((data) => [data]);
};

export const filterRfcs = <T extends RfcI>(data: T[], rfcToFilter: RfcI[]) => {
  const rfcToFilterSet = new Set(rfcToFilter.map((item) => item.rfc));
  return data.filter((item) => !rfcToFilterSet.has(item.rfc));
};
