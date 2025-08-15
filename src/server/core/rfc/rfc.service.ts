import { ErrorApp } from '~/shared';

interface GroupByRFCData {
  rfc: string;
}

export const groupByRFC = (data: GroupByRFCData[]) => {
  const grouped = data.reduce((acc, item) => {
    if (!item.rfc) {
      throw ErrorApp.badRequest(`El RFC de la captura no es válido`);
    }

    if (item.rfc in acc) {
      return acc;
    }

    acc.push(item.rfc);
    return acc;
  }, [] as string[]);

  return grouped;
};

export const groupByRFCtoSQL = (data: GroupByRFCData[]) => {
  return groupByRFC(data).map((data) => [data]);
};
