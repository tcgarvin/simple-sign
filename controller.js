'use strict';

class Controller {
  constructor(tcgarvinAPI, sign, leds) {
    this.tcgarvinAPI = tcgarvinAPI;
    this.sign = sign;
    this.leds = leds;

    this.infoPending = false;
  }

  run() {
    this.refreshInfo();
  }

  refreshInfo() {
    if (this.infoPending) {
      return;
    }

    this.leds.networkActive();
    this.tcgarvinAPI.getCurrentStatus().
      then((info) => {
        this.leds.networkInactive();

        return info;
      }).
      then(this.handleNewInfo.bind(this)).
      catch((error) => this.handleError("Error refreshing info", error));
  }

  handleNewInfo(info) {
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