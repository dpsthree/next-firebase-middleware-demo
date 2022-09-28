import * as functions from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

import { connectFirebaseAdminTools } from './firebase-admin-tools';
import { User } from './models/user';

const app = require('next')({
  dir: '../',
  dev: true,
  port: 5000,
  hostname: 'localhost',
});
const handle = app.getRequestHandler();
export const server = onRequest((request, response) => {
  console.log(
    'firebase function received the request about to pass it to next'
  );
  return app.prepare().then(() => {
    console.log('app is prepared')
    return handle(request, response);
  });
});

const USER_PATH = 'users';
export const helloWorld = functions.https.onRequest(
  async (request, response) => {
    connectFirebaseAdminTools();
    const token = request.query['token'];
    if (typeof token !== 'string') {
      response.status(400).send(`Invalid token: ${token}`);
    } else {
      const user = await createUserIfNotExists(token);
      response.send(user);
    }
  }
);

async function createUserIfNotExists(user: string): Promise<User> {
  try {
    const userDoc = await admin.firestore().doc(`/${USER_PATH}/${user}`).get();
    if (userDoc.exists) {
      return userDoc.data() as User;
    } else {
      const newUser: User = {
        id: user,
        canAccess: user === '12345',
      };
      await admin.firestore().doc(`/${USER_PATH}/${newUser.id}`).set(newUser);
      return newUser;
    }
  } catch (e) {
    console.log('failed to communicate with firestore', e);
    throw e;
  }
}
