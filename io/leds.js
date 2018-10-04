'use strict';

class DummyLEDs {
  networkActive() {
    console.log("Network LED Active");
  }

  networkInactive() {
    console.log("Network LED Inactive");
  }

  unhandledError() {
    console.log("Error LED Active");
  }
}

class LEDs {
  constructor(tessel) {
    this.tessel = tessel;
  }

  networkActive() {
    this.tessel.led[1].on();
  }

  networkInactive() {
    this.tessel.led[1].off();
  }

  unhandledError() {
    if (this.errorInterval) {
      return;
    }

    this.tessel.led[0].on();
    this.errorInterval = setInterval(() => this.tessel.led[0].toggle(), 500);
  }
}

module.exports = { LEDs, DummyLEDs };