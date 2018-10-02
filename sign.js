'use strict';

let tessel = require('tessel');
let TesselIO = require('tessel-io');
let five = require("johnny-five");

let board = new five.Board({
  io: new TesselIO()
});

let names = ["Tim","David","World","Everyone"];

function getRandomName() {
  return names[Math.floor(Math.random() * names.length)];
}

board.on("ready", () => {
  // Blink!
  setInterval(() => {
    tessel.led[2].toggle();
  }, 500);

  var lcd = new five.LCD({
    pins: ["b2", "b3", "b4", "b5", "b6", "b7"]
  });

  lcd.cursor(0,0).print("Hello, world!");
  lcd.cursor(1,0).print("#JSConfUS 2018");

  setInterval(() => {
    lcd.cursor(0,0).print(("Hello, " + getRandomName() + " ".repeat(16)).substring(0,16));
  }, 2000);

  console.log("(Press CTRL + C to stop)");
});