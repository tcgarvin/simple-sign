'use strict';

let { LCD, Led } = require("johnny-five");

const signWidth = 16;

function trimmedAndRightPadded(message) {
  let trimmed = message.slice(0, signWidth);
  let remaining = signWidth - trimmed.length;
  let pad = " ".repeat(remaining);

  return trimmed + pad;
}

class DummySign {
  off() {
    console.log("Sign turned off");
  }

  setDoNotDisturb(message) {
    console.log(this.displaySegment(message));
  }

  displaySegment(message) {
    return "|" + trimmedAndRightPadded(message) + "|";
  }
}

class Sign {
  constructor(tessel, board) {
    this.tessel = tessel;
    this.board = board;

    this.lcd = new LCD({
      pins: ["a2", "a3", "a4", "a5", "a6", "a7"]
    });

    this.lcdBacklight = new Led("a1");
  }

  off() {
    this.lcdBacklight.off();
  }

  setDoNotDisturb(message) {
    this.writeTopLine(message);

    this.doNotDisturbListener = setInterval(() => this.writeTopLine(message), 1000);
  }

  writeTopLine(message) {
    this.lcdBacklight.on();
    this.lcd.cursor(0,0).print(trimmedAndRightPadded(message));
  }
}

module.exports = { Sign, DummySign };