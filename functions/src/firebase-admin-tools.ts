import * as admin from 'firebase-admin';
import firebaseAccountCredential from './serviceAccountKey.json';

const DUPLICATE_APP_FIREBASE_ERROR_CODE = 'app/duplicate-app';
const EMULATOR_HOST_URL = 'localhost:8080';
const AUTH_EMULATOR_HOST_URL = 'localhost:9099';
const FIREBASE_PROJECT_ID = 'next-middleware-demo';
const PROD_FIREBASE_PROJECT_URL =
  'https://next-middleware-demo.firebaseio.com';
const isProd = !process.env['FUNCTIONS_EMULATOR'];

/**
 * Will initialize firebase for use in the current execution
 * of a function. This will look at the environment to
 * determine if it should connect to a production instance
 * or an emulator for local development.
 */
export function connectFirebaseAdminTools() {
  if (isProd) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(
          firebaseAccountCredential as admin.ServiceAccount
        ),
        databaseURL: PROD_FIREBASE_PROJECT_URL,
      });
    } catch (err: any) {
      if (err.code !== DUPLICATE_APP_FIREBASE_ERROR_CODE) {
        throw err;
      }
    }
  } else {
    process.env['FIRESTORE_EMULATOR_HOST'] = EMULATOR_HOST_URL;
    process.env['FIREBASE_AUTH_EMULATOR_HOST'] = AUTH_EMULATOR_HOST_URL;
    try {
      admin.initializeApp({
        projectId: FIREBASE_PROJECT_ID,
      });
    } catch (err: any) {
      // Don't break the process if the app has already been initialized.
      // It is common while testing with emulators
      if (err.code !== DUPLICATE_APP_FIREBASE_ERROR_CODE) {
        throw err;
      }
    }
  }
}

/**
 * (Admin version) Utility function to wrap the firebase batch capabilities for ease of use.
 * Firestore batches are limited to 500 writes per batch. This function will
 * allow the caller to specify a batch size and will split the writes accordingly.
 *
 * If the list or number of actions taken by the taskFn over the length of the list
 * exceeds the batch size, then multiple batches will be created and the execution
 * will no longer be atomic. Short of lacing together a manual batching strategy,
 * there isn't much that can be done at that point
 * @param taskFn Allows the user to specify a function to execute
 * and determine how a doc should interact with the current batch.
 * @param docs The list of documents that the user wishes to take a batch action on.
 * @param batchSize The number of documents to take in a batch. Must be 500 or fewer. Defaults to 400.
 */
export function executeInBatch(
  taskFn: (
    writeBatch: admin.firestore.WriteBatch,
    doc: admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>
  ) => void,
  docs: admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>[],
  batchSize = 400
) {
  if (batchSize > 500 || batchSize < 1) {
    throw new Error(
      `Batch size must be between 1 and 500, inclusive. Batch size supplied: ${batchSize}`
    );
  }
  let i = 0;
  let writeBatch = admin.firestore().batch();
  for (const doc of docs) {
    taskFn(writeBatch, doc);
    i++;
    if (i > batchSize) {
      i = 0;
      writeBatch.commit();
      writeBatch = admin.firestore().batch();
    }
  }
  if (i > 0) {
    writeBatch.commit();
  }
}
