import { authClient } from '~/lib/utils/authClient';

// dotenv.config({ path: "./.env.development" });

// if (!("DATABASE_URL" in process.env))
//         throw new Error("DATABASE_URL not found on .env.development");

const main = async () => {
  await authClient.signUp.email(
    {
      email: 'eduardo@gmail.com',
      password: '123456790',
      name: 'eduardo berzunza',
      username: 'eduardoBerzunza',
    },
    {
      onError: (ctx) => {
        // Handle the error
        if (ctx.error.status === 403) {
          // eslint-disable-next-line no-console
          console.log('Please verify your email address');
        }
        //you can also show the original error message
      },
      onSuccess: () => {
        console.log('successed');
      }
    }
  );
};

main();
