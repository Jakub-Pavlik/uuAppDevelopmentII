"use strict";
const ShopMainAbl = require("../../abl/shop-main-abl.js");

class ShopMainController {
  init(ucEnv) {
    return ShopMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  load(ucEnv) {
    return ShopMainAbl.load(ucEnv.getUri(), ucEnv.getSession(), ucEnv.authzContext);
  }
  setState(ucEnv) {
    return ShopMainAbl.setState(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  update(ucEnv) {
    return ShopMainAbl.update(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new ShopMainController();
