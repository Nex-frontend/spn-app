import { reset, seed } from 'drizzle-seed';
// import { refundLogs, refundRfcSuccess } from './spn/refund.schema';
import * as schema from './spn/schema';
import { db_spn } from './spn/spn.connection';
import { authClient } from '~/lib/utils/authClient';

// dotenv.config({ path: "./.env.development" });

// if (!("DATABASE_URL" in process.env))
//         throw new Error("DATABASE_URL not found on .env.development");

// const main = async () => {
//   await authClient.signUp.email(
//     {
//       email: 'eduardo@gmail.com',
//       password: '123456790',
//       name: 'eduardo berzunza',
//       username: 'eduardoBerzunza',
//     },
//     {
//       onError: (ctx) => {
//         // Handle the error
//         if (ctx.error.status === 403) {
//           // eslint-disable-next-line no-console
//           console.log('Please verify your email address');
//         }
//         //you can also show the original error message
//       },
//       onSuccess: () => {
//         console.log('successed');
//       }
//     }
//   );
// };

// main();

async function main() {
  console.log('Seeding database...');
  try {
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
          rfcCreated: f.int({ minValue: 0, maxValue: 10 }),
          rfcDeletedResponsabilities: f.int({ minValue: 0, maxValue: 5 }),
          rfcDeletedEmployeeConcept: f.int({ minValue: 0, maxValue: 5 }),
          rfcClosedTerm: f.int({ minValue: 0, maxValue: 5 }),
          rfcSuccesed: f.int({ minValue: 0, maxValue: 20 }),
          rfcFailed: f.int({ minValue: 0, maxValue: 5 }),
          activeBefore: f.int({ minValue: 10, maxValue: 30 }),
          activeAfter: f.int({ minValue: 10, maxValue: 30 }),
          hasError: f.boolean(),
          userId: f.valuesFromArray({ values: ['0FRSQbW41WbGHWBd4SRTtG9Z0cmaB3YN'] }),
          processFortnight: f.valuesFromArray({ values: ['202509', '202510', '202508', '202509'] }),
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
        },
      },
      refundRfcFailed: {
        count: 5,
        columns: {
          rfc: f.valuesFromArray({ values: ['XAXX010101000', 'XAXX010101001', 'XAXX010101002'] }),
        },
      },
    }));
    console.log('Finish database...');
  } catch (error) {
    console.log({ error });
  }
}

main();
