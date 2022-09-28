import { onRequest } from 'firebase-functions/v2/https';

const app = require('next')({
  dir: '../',
  // Build the next app and 
  // toggle the following to false
  // and the hosting works fine
  dev: true,
  // Update the following if your emulator environment
  // differs for the hosting port
  port: 5000,
  hostname: 'localhost',
});
const handle = app.getRequestHandler();
const prepared = app.prepare();
export const server = onRequest((request, response) => {
  console.log(
    'firebase function received the request about to pass it to next',
    request.originalUrl
  );
  return prepared.then(() => {
    console.log('app is prepared');
    return handle(request, response);
  });
});
