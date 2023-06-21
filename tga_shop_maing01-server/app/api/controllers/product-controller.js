"use strict";
const ProductAbl = require("../../abl/product-abl");

class ProductController {
  setState(ucEnv) {
    return ProductAbl.setState(
      ucEnv.getUri(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.authzContext.getAuthorizedProfileList()
    );
  }

  list(ucEnv) {
    return ProductAbl.list(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.authzContext.getAuthorizedProfileList());
  }

  update(ucEnv) {
    return ProductAbl.update(
      ucEnv.getUri(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.authzContext.getAuthorizedProfileList()
    );
  }

  get(ucEnv) {
    return ProductAbl.get(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  load(ucEnv) {
    return ProductAbl.load(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  delete(ucEnv) {
    return ProductAbl.delete(
      ucEnv.getUri(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.authzContext.getAuthorizedProfileList()
    );
  }

  create(ucEnv) {
    return ProductAbl.create(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new ProductController();
