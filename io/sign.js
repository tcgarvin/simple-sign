'use strict';

let { LCD, Led } = require("johnny-five");

const signWidth = 16;

function trimmedAndRightPadded(message, width) {
  let trimmed = message.slice(0, width);
  let remaining = width - trimmed.length;
  let pad = " ".repeat(remaining);

  return trimmed + pad;
}

class DummySign {
  off() {
    console.log("Sign turned off");
  }

  setDoNotDisturb(message) {
    let paddedMessage = trimmedAndRightPadded(message, signWidth * 2);

    let topLine = paddedMessage.slice(0,16);
    let bottomLine = paddedMessage.slice(16,32);

    console.log(this.displaySegment(topLine));
    console.log(this.displaySegment(bottomLine));
  }

  displaySegment(message) {
    return "|" + trimmedAndRightPadded(message, signWidth) + "|";
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
    this.lcdBacklight.on();
    this.writeWithWrap(message);
  }

  writeWithWrap(message) {
    let paddedMessage = trimmedAndRightPadded(message, signWidth * 2);

    let topLine = paddedMessage.slice(0,16);
    let bottomLine = paddedMessage.slice(16,32);

    this.writeTopLine(topLine);
    this.writeBottomLine(bottomLine);
  }

  writeLine(message, lineNumber) {
    this.lcd.cursor(lineNumber, 0).print(trimmedAndRightPadded(message, signWidth));
  }

  writeTopLine(message) {
    this.writeLine(message, 0);
  }

  writeBottomLine(message) {
    this.writeLine(message, 1);
  }
}

module.exports = { Sign, DummySign };