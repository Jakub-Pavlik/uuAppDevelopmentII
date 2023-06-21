const Errors = require("../errors/shop-main-error");
const Warnings = {
  InitUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`,
  },
};

module.exports = Warnings;
