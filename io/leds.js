'use strict';

class DummyLEDs {
  networkActive() {
    console.log("Network LED Active");
  }

  networkInactive() {
    console.log("Network LED Inactive");
  }

  pulseData() {
    console.log("Data LED Pulsed");
  }

  unhandledError() {
    console.log("Error LED Active");
  }

  stopErrorLed() {
    console.log("Error LED Inactive");
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

  pulseData() {
    this.tessel.led[3].on();
    setTimeout(() => this.tessel.led[3].off(), 2000);
  }

  unhandledError() {
    if (this.errorInterval) {
      return;
    }

    this.tessel.led[0].on();
    this.errorInterval = setInterval(() => this.tessel.led[0].toggle(), 500);
  }

  stopErrorLed() {
    if (this.errorInterval) {
      clearInterval(this.errorInterval);
    }

    this.tessel.led[0].off();
  }
}

module.exports = { LEDs, DummyLEDs };