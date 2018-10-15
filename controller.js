'use strict';

const msPerDay = 24 * 60 * 60 * 1000;

const Message = require('./message');

class Controller {
  constructor(tcgarvinAPI, sign, leds) {
    this.tcgarvinAPI = tcgarvinAPI;
    this.sign = sign;
    this.leds = leds;

    this.currentMessage = new Message("", 1000, false);
  }

  run() {
    this.tcgarvinAPI.on("error", (error) => this.handleError("Error from tcgarvin API", error));
    this.tcgarvinAPI.on("update", (info) => this.handleNewInfo(info));
    this.tcgarvinAPI.on("networkActive", (isActive) => this.handleNetworkActivity(isActive));
    this.tcgarvinAPI.startPollLoop();
    this.handleNewInfo(this.currentMessage);
  }

  handleNewInfo(message) {
    console.log(`Received new info: ${JSON.stringify(message)}`);
    this.leds.pulseData();
    if (message.getDoNotDisturb()) {
      this.sign.setDoNotDisturb(message.getMessage());
      this.expireMessageAfterTTL(message);
    }
    else {
      this.sign.off();
    }
  }

  expireMessageAfterTTL(message) {
    this.currentMessage = message;
    setTimeout(
      () => {
        if (message !== this.currentMessage) {
          return;
        }

        this.sign.off();
      },
      message.getMsToLive()
    );
  }

  handleError(locator, error) {
    console.error(locator + ":", error.stack);
    this.leds.unhandledError();

    let timeToErrorOff = msPerDay;

    this.lastErrorTime = Date.now();
    setTimeout(() => {
      if (Date.now() > this.lastErrorTime + timeToErrorOff) {
        this.leds.stopErrorLed();
      }
    }, timeToErrorOff);
  }

  handleNetworkActivity(isActive) {
    if (isActive) {
      this.leds.networkActive();
    }
    else {
      this.leds.networkInactive();
    }
  }
}

module.exports = Controller;