import { reset, seed } from 'drizzle-seed';
// import { refundLogs, refundRfcSuccess } from './spn/refund.schema';
import * as schema from './spn/schema';
import { db_spn } from './spn/spn.connection';

import * as dotenv from 'dotenv';
import { auth } from '~/lib/auth';
import { user } from './spn/schema';

dotenv.config({ path: "./.env.development" });

if (!("SPN_BD_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env.development");

const main = async () => {
  // await authClient.signUp.email(
  //   {
  //     email: 'eduardo.berzunza@gmail.com',
  //     password: '123456790',
  //     name: 'eduardo berzunza',
  //     username: 'eduardo.berzunza',
  //   },
  //   {
  //     onError: (ctx) => {
  //       // Handle the error
  //       if (ctx.error.status === 403) {
  //         console.log(ctx.error.message);
  //         // eslint-disable-next-line no-console
  //         console.log('Please verify your email address');
  //       }
  //       //you can also show the original error message
  //     },
  //     onSuccess: () => {
  //       console.log('successed');
  //     },
  //   }
  // );
  console.log('Seeding database...');
  try {
    // ... tu código de reset existing...

    // Crear usuario por defecto
    await auth.api.signUpEmail({
      body: {
        email: "odraude28@live.com.mx",
        password: "12345678",
        name: "eduardo",
        username: "eduardo",
      },
    });

    console.log('Usuario de prueba creado exitosamente');
  } catch (error) {
    console.error('Error en seed:', error);
  }
};



async function main2() {
  console.log('Seeding database...');
  try {

    const firstUser = await db_spn.select().from(user).limit(1);
    await reset(db_spn, {
      refundLogs: schema.refundLogs,
      refundRfcSuccess: schema.refundRfcSuccess,
      refundRfcFailed: schema.refundRfcFailed,
    });
    await seed(db_spn, {
      refundLogs: schema.refundLogs,
      refundRfcSuccess: schema.refundRfcSuccess,
      refundRfcFailed: schema.refundRfcFailed,
    }).refine((f) => ({
      refundLogs: {
        count: 10,
        columns: {
          consecutive: f.int({ minValue: 1, maxValue: 30 }),
          recordsCreated: f.int({ minValue: 0, maxValue: 10 }),
          recordsDeletedResponsabilities: f.int({ minValue: 0, maxValue: 5 }),
          recordsDeletedEmployeeConcept: f.int({ minValue: 0, maxValue: 5 }),
          recordsClosedTerm: f.int({ minValue: 0, maxValue: 5 }),
          recordsSuccesed: f.int({ minValue: 0, maxValue: 20 }),
          recordsFailed: f.int({ minValue: 0, maxValue: 5 }),
          activeBefore: f.int({ minValue: 10, maxValue: 30 }),
          activeAfter: f.int({ minValue: 10, maxValue: 30 }),
          hasError: f.boolean(),
          userId: f.valuesFromArray({
            values: [firstUser[0]?.id || 'default-user-id'],
          }),
          processFortnight: f.valuesFromArray({ values: ['202509', '202510', '202508', '202509'] }),
          notes: f.valuesFromArray({
            values: [
              'No hay notas',
              'Notas de prueba',
              'Revisar RFC',
              'El RFC BELE930829TS5 se tuvo que hacer manualmente',
            ],
          }),
        },
        // with: {
        //   refundRfcSuccess: 5,
        //   refundRfcFailed: 2,
        // },
      },
      refundRfcSuccess: {
        count: 5,
        columns: {
          rfc: f.valuesFromArray({ values: ['XAXX010101000', 'XAXX010101001', 'XAXX010101002'] }),
          plaza: f.valuesFromArray({
            values: [
              '075037  E068700.0070332',
              '070402 S0180700.0300091',
              '075029  E148900.0040091',
            ],
          }),
        },
      },
      refundRfcFailed: {
        count: 5,
        columns: {
          rfc: f.valuesFromArray({ values: ['XAXX010101000', 'XAXX010101001', 'XAXX010101002'] }),
          plaza: f.valuesFromArray({
            values: [
              '070403 S0180700.0300376',
              '140412  E028100.0021339',
              '070413CF0105900.0200035',
            ],
          }),
        },
      },
    }));
    console.log('Finish database...');
  } catch (error) {
    console.log({ error });
  }
}

await main();
