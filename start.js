'use strict';

let { DummyAPI, TCGarvinAPI } = require('./io/tcgarvin-api');
let { DummyLEDs, LEDs } = require('./io/leds');
let { DummySign, Sign } = require('./io/sign');
let { Board } = require("johnny-five");
let Controller = require('./controller');
let settings = require('./settings.json');

let tessel = null;
let TesselIO = null;
let board = null;

try {
  tessel = require('tessel'); // eslint-disable-line global-require
  TesselIO = require('tessel-io'); // eslint-disable-line global-require
  board = new Board({
    io: new TesselIO()
  });
}
catch (error) {
  console.log("No tessel library found, running in off-board mode");

  tessel = null;
  TesselIO = null;
  board = {
    on: (event, callback) => callback()
  };
}

let leds = tessel
           ? new LEDs(tessel)
           : new DummyLEDs();

let sign = tessel
           ? new Sign(tessel, board)
           : new DummySign();

sign.off();

let tcgarvinAPI = settings["use-dummy-api"]
                  ? new DummyAPI()
                  : new TCGarvinAPI(settings.apiKey);

let controller = new Controller(tcgarvinAPI, sign, leds);

board.on("ready", () => {
  controller.run();
  console.log("(Press CTRL + C to stop)");
});