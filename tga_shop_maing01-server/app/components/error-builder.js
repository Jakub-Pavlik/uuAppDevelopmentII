const ShopMainUseCaseError = require("../api/errors/shop-main-use-case-error.js");

function injectBasicErrors(errorDefinition) {
  errorDefinition.InvalidDtoIn = class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${errorDefinition.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  };
  errorDefinition.ShopDoesNotExist = class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${errorDefinition.UC_CODE}shopDoesNotExist`;
      this.message = "Shop does not exist.";
    }
  };
  errorDefinition.ShopIsNotInCorrectState = class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${errorDefinition.UC_CODE}shopIsNotInCorrectState`;
      this.message = "Shop is not in active state.";
    }
  };

  return errorDefinition;
}

module.exports = {
  injectBasicErrors,
};
