'use strict';

class DummyAPI {
  getCurrentStatus() {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        message: "In a call",
        doNotDisturb: true
      }), 500);
    });
  }
}

class TCGarvinAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  getCurrentStatus() {
    return this.get("status");
  }

  get(query) {
    return Promise.reject(new Error(`Not implimented (Query: ${query})`));
  }
}

module.exports = { TCGarvinAPI, DummyAPI };