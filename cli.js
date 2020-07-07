let { google } = require('googleapis');
let path = require('path');

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, "gcp_cred.json");
process.env.GCLOUD_PROJECT = "tcgarvin-com";

function jsonToBase64(json) {
  let binary = Buffer.from(JSON.stringify(json), "utf-8");

  return binary.toString('base64');
}

if (process.argv.length < 4) {
  console.log('Usage: node cli.js "MY MESSAGE" TTL_MS');
  console.log('Example: node cli.js "Hello World" 60000');
  process.exit(-1);
}

let messageData = jsonToBase64({
  doNotDisturb: true,
  message: process.argv[2],
  msToLive: parseInt(process.argv[3])
});

google.auth.getClient({
  scopes: ['https://www.googleapis.com/auth/pubsub']
}).
then((authClient) => google.pubsub({ version: "v1", auth: authClient })).
then((pubsub) => pubsub.projects.topics.publish({
  topic: 'projects/tcgarvin-com/topics/doNotDisturb',
  requestBody: {
    messages: [
      {
        data: messageData
      }
    ]
  }
})).
then(
  () => console.log("Seems OK"),
  (error) => console.log("Seems to have failed", error)
);
