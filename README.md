# Minimum reproduction of the Next.js Custom Server Bug

## Steps to reproduce
Prerequisites -  install and login to firebase cli:
https://firebase.google.com/docs/cli

You may also need to create a project in the firebase console
1. npm i
2. cd functions && npm i && npm run build
3. (from root) npm run dev
4. Navigate to localhost:5000 (or whatever port your hosting emulator is running on)
5. Observe the console log statements in the terminal that indicate the failure of prepare to resolve on subsequent requests.