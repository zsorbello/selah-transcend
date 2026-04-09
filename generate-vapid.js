// Run this ONCE to generate VAPID keys if you don't have your private key:
//   node generate-vapid.js
// Then add the keys to your Vercel env vars

const webpush = require("web-push");
const keys = webpush.generateVAPIDKeys();
console.log("VAPID_PUBLIC_KEY:", keys.publicKey);
console.log("VAPID_PRIVATE_KEY:", keys.privateKey);
console.log("\nAdd these to Vercel → Settings → Environment Variables");
console.log("NOTE: If you generate new keys, update VAPID_PUBLIC_KEY in App.jsx too!");
