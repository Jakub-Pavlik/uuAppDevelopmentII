"use strict";

const ShopMainUseCaseError = require("./shop-main-use-case-error.js");
const KNOCK_ERROR_PREFIX = `${ShopMainUseCaseError.ERROR_PREFIX}knock/`;

const TheDoor = {
  UC_CODE: `${KNOCK_ERROR_PREFIX}theDoor/`,
};

const Knock = {
  UC_CODE: `${KNOCK_ERROR_PREFIX}knock/`,
};

module.exports = {
  Knock,
  TheDoor,
};
