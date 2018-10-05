'use strict';

let EventEmitter = require('events');
let { google } = require('googleapis');

let dummyMessages = ["In a call", "Beating deadline", "Free at 4:30"];

function base64ToJson(base64) {
  let binary = Buffer.from(base64, "base64");

  return JSON.parse(binary.toString('utf-8'));
}

class DummyAPI extends EventEmitter {
  startPollLoop() {
    setInterval(() => {
      let dummyMessage = dummyMessages[Math.floor(Math.random() * dummyMessages.length)];
      let dummyDoNotDisturb = Math.random() < 0.8;

      this.emit("update", { doNotDisturb: dummyDoNotDisturb, message: dummyMessage });
    }, 5000);
  }
}

class TCGarvinAPI extends EventEmitter {
  checkForUpdate() {
    let update = this.pubsub.projects.subscriptions.pull({
      subscription: "projects/tcgarvin-com/subscriptions/officeDoor",
      requestBody: {
        // TODO: Think through multiple messages
        maxMessages: 1,
        returnImmediately: true
      }
    }).
    then((response) => {

      if (!response.data.receivedMessages || response.data.receivedMessages.length === 0) {
        // If no messages, throw an ugly string to skip the next part.  It's
        // getting late, and I don't want to think about this anymore.
        throw "NO_MESSAGES";
      }

      let receivedMessage = response.data.receivedMessages[0];
      return this.acknowledgeMessage(receivedMessage);
    }).
    then((receivedMessage) => {
      let receivedData = base64ToJson(receivedMessage.message.data);

      console.log(JSON.stringify(receivedData));
      this.emit("update", receivedData);
    }).
    catch((rejection) => {
      // See non-apology above.
      if (rejection === "NO_MESSAGES") {
        return true;
      }
      throw rejection;
    });

    return update;
  }

  acknowledgeMessage(message) {
    return this.pubsub.projects.subscriptions.acknowledge({
      subscription: "projects/tcgarvin-com/subscriptions/officeDoor",
      requestBody: {
        ackIds: [ message.ackId ]
      }
    }).
    then(() => message);
  }

  doPollLoop() {
    this.checkForUpdate().
    catch((rejection) => {
      this.emit("error", rejection);
    }).
    then(
      // Duplication here is because "finally" isn't supported in node 8;
      () => setTimeout(() => this.doPollLoop(), 2000),
      () => setTimeout(() => this.doPollLoop(), 2000)
    );
  }

  startPollLoop() {
    google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/pubsub']
    }).
    then((authClient) => google.pubsub({ version: "v1", auth: authClient })).
    then((pubsub) => {
      this.pubsub = pubsub;
      this.doPollLoop();
    });
  }
}

module.exports = { TCGarvinAPI, DummyAPI };