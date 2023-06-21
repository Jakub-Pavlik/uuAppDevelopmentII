"use strict";
const ShopMainUseCaseError = require("./shop-main-use-case-error.js");

const Init = {
  UC_CODE: `${ShopMainUseCaseError.ERROR_PREFIX}init/`,

  InvalidDtoIn: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  SetProfileFailed: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sys/setProfileFailed`;
      this.message = "Set profile failed.";
    }
  },

  CreateAwscFailed: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}createAwscFailed`;
      this.message = "Create uuAwsc failed.";
    }
  },
};

const Load = {
  UC_CODE: `${ShopMainUseCaseError.ERROR_PREFIX}load/`,

  ShopDoesNotExist: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}circlesDoesNotExist`;
      this.message = "Shop instance does not exist.";
    }
  },

  UuAwscLoadFailed: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}uuAwscLoadFailed`;
      this.message = "Load uuAwsc failed.";
    }
  },
};

const SetState = {
  UC_CODE: `${ShopMainUseCaseError.ERROR_PREFIX}setState/`,

  InvalidDtoIn: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  ShopDoesNotExist: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}circlesDoesNotExist`;
      this.message = "Shop instance does not exist.";
    }
  },

  UuAwscLoadFailed: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}uuAwscLoadFailed`;
      this.message = "Load uuAwsc failed.";
    }
  },

  UpdateAwscStateFailed: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}updateAwscStateFailed`;
      this.message = "Update awsc state failed.";
    }
  },
};

module.exports = {
  Init,
  Load,
  SetState,
};
