"use strict";
const KnockAbl = require("../../abl/knock-abl.js");

class KnockController {
  knock(ucEnv) {
    return KnockAbl.knock(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  theDoor(ucEnv) {
    return KnockAbl.theDoor(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new KnockController();
