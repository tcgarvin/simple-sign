class Message {
  constructor(message, msToLive, doNotDisturb) {
    if (!Number.isInteger(msToLive) || msToLive < 0) {
      throw "msToLive must be zero or positive integer";
    }

    if (doNotDisturb !== true && doNotDisturb !== false) {
      throw "doNotDisturb must be true or false";
    }

    this.message = message;
    this.msToLive = msToLive;
    this.doNotDisturb = doNotDisturb;
  }

  getMessage() {
    return this.message;
  }

  getMsToLive() {
    return this.msToLive;
  }

  getDoNotDisturb() {
    return this.doNotDisturb;
  }
}

module.exports = Message;