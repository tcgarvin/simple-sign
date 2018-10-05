'use strict';

class Controller {
  constructor(tcgarvinAPI, sign, leds) {
    this.tcgarvinAPI = tcgarvinAPI;
    this.sign = sign;
    this.leds = leds;
  }

  run() {
    this.tcgarvinAPI.on("error", (error) => this.handleError("Error from tcgarvin API", error));
    this.tcgarvinAPI.on("update", (info) => this.handleNewInfo(info));
    this.tcgarvinAPI.startPollLoop();
  }

  handleNewInfo(info) {
    console.log(`Received new info: ${JSON.stringify(info)}`);
    this.leds.pulseData();
    if (info.doNotDisturb) {
      this.sign.setDoNotDisturb(info.message);
    }
    else {
      this.sign.off();
    }
  }

  handleError(locator, error) {
    console.error(locator + ":", error.stack);
    this.leds.unhandledError();
  }
}

module.exports = Controller;