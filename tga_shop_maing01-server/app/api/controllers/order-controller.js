"use strict";
const OrderAbl = require("../../abl/order-abl.js");

class OrderController {
  create(ucEnv) {
    return OrderAbl.create(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  get(ucEnv) {
    return OrderAbl.get(
      ucEnv.getUri(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.authzContext.getAuthorizedProfileList()
    );
  }

  list(ucEnv) {
    return OrderAbl.list(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  setState(ucEnv) {
    return OrderAbl.setState(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  addProduct(ucEnv) {
    return OrderAbl.addProduct(
      ucEnv.getUri(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.authzContext.getAuthorizedProfileList()
    );
  }

  buy(ucEnv) {
    return OrderAbl.buy(
      ucEnv.getUri(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.authzContext.getAuthorizedProfileList()
    );
  }
}

module.exports = new OrderController();
