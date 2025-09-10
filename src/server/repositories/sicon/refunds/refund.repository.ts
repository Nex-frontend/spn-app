import { eq, sql } from 'drizzle-orm';
import { db } from '~/server/db';
import { reEmpleadosCapturados } from '~/server/db/sicon/schema';

export const getCaptureByIdOpenClose = async (idOpenClose: number) => {
  return await db.sicon
    .select({
      id: reEmpleadosCapturados.id,
      uVersion: sql<string>`'#'`,
      rfc: reEmpleadosCapturados.rfc,
      payCode: sql<string>`substr(${reEmpleadosCapturados.plaza},1,2)`,
      unit: sql<string>`substr(${reEmpleadosCapturados.plaza},3,2)`,
      subunit: sql<string>`substr(${reEmpleadosCapturados.plaza},5,2)`,
      positionCategory: sql<string>`substr(${reEmpleadosCapturados.plaza},7,7)`,
      hours: sql<string>`substr(${reEmpleadosCapturados.plaza},14,4)`,
      consecutivePayment: sql<string>`substr(${reEmpleadosCapturados.plaza},18)`,
      conceptType: sql<string>`'D'`,
      concept: sql<string>`'19'`,
      fortnightEnd: reEmpleadosCapturados.quincenaFinConcepto,
      fortnightStart: reEmpleadosCapturados.quincenaInicioConcepto,
      monthlyAmount: reEmpleadosCapturados.importeMensual,
      document: sql<number>`0`,
      documentDate: sql<string>`ifnull(${reEmpleadosCapturados.modified}, ${reEmpleadosCapturados.created})`,
      flag: sql<number>`0`,
      typeFlag: sql<number>`0`,
      applicationNumber: sql<number>`0`,
      paymentCode: reEmpleadosCapturados.plaza,
      biweeklyAmount: reEmpleadosCapturados.importeQuincenal,
      status: reEmpleadosCapturados.estatus,
      fortnight: reEmpleadosCapturados.quincena,
      idUser: reEmpleadosCapturados.idUser,
    })
    .from(reEmpleadosCapturados)
    .where(eq(reEmpleadosCapturados.idAperturaCierre, idOpenClose));
};
