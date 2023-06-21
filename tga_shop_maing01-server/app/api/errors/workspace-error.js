"use strict";

const ShopMainUseCaseError = require("./shop-main-use-case-error.js");
const WORKSPACE_ERROR_PREFIX = `${ShopMainUseCaseError.ERROR_PREFIX}workspace/`;

const Remove = {
  UC_CODE: `${WORKSPACE_ERROR_PREFIX}remove/`,

  InvalidDtoIn: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Remove.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  ShopDoesNotExist: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Remove.UC_CODE}shopDoesNotExist`;
      this.message = "Shop does not exist.";
    }
  },
};

module.exports = {
  Remove,
};
