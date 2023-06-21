"use strict";

const ShopMainUseCaseError = require("./shop-main-use-case-error.js");
const PRODUCT_ERROR_PREFIX = `${ShopMainUseCaseError.ERROR_PREFIX}product/`;

const { injectBasicErrors } = require("../../components/error-builder");

const Create = injectBasicErrors({
  UC_CODE: `${PRODUCT_ERROR_PREFIX}create/`,
  FolderDoesNotExist: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}folderDoesNotExist`;
      this.message = "There is no folder for Rectangles in this unit.";
    }
  },
  LocationIsNotInProperState: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}locationIsNotInProperState`;
      this.message = "The location in uuBt is not in state that allows to create artifact.";
    }
  },
  UserDoesNotHaveRightsForThisFolder: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.status = QuadrilateralsUseCaseError.HttpStatus.FORBIDDEN;
      this.code = `${Create.UC_CODE}userDoesNotHaveRightsForThisFolder`;
      this.message = "Unfortunately, user doesn't have rights to create a Rectangles in this folder.";
    }
  },
  CallUuObcCreateFailed: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}callUuObcCreateFailed`;
      this.message = "Call uuObc/create failed.";
    }
  },
});

const Delete = injectBasicErrors({
  UC_CODE: `${PRODUCT_ERROR_PREFIX}delete/`,
  ProductDoesNotExist: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}productDoesNotExist`;
      this.message = "Product does not exist.";
    }
  },
  ProductIsNotInClosedState: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}productIsNotInClosedState`;
      this.message = "Cannot delete product. Product is not in closed state.";
    }
  },
  ProductHasRelations: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}productHasRelations`;
      this.message = "Product has active relations and can not be deleted.";
    }
  },
  UserNotAuthorized: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized for given product.";
    }
  },
});

const Get = injectBasicErrors({
  UC_CODE: `${PRODUCT_ERROR_PREFIX}get/`,
  ProductDoesNotExist: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}productDoesNotExist`;
      this.message = "Product does not exist.";
    }
  },

  UserNotAuthorized: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized for given product.";
    }
  },
});

const Load = injectBasicErrors({
  UC_CODE: `${PRODUCT_ERROR_PREFIX}load/`,
  ProductDoesNotExist: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}productDoesNotExist`;
      this.message = "Product does not exist.";
    }
  },
  UserNotAuthorized: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized for given product.";
    }
  },
});

const Update = injectBasicErrors({
  UC_CODE: `${PRODUCT_ERROR_PREFIX}update/`,
  ProductDoesNotExist: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}productDoesNotExist`;
      this.message = "Product does not exist.";
    }
  },
  ProductIsNotInProperState: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}productIsNotInProperState`;
      this.message = "Cannot update product. Product is not in proper state.";
    }
  },
  UserNotAuthorized: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized for given product.";
    }
  },
});

const List = injectBasicErrors({
  UC_CODE: `${PRODUCT_ERROR_PREFIX}list/`,
});

const SetState = injectBasicErrors({
  UC_CODE: `${PRODUCT_ERROR_PREFIX}setState/`,
  ProductDoesNotExist: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}productDoesNotExist`;
      this.message = "Product does not exist.";
    }
  },
  ProductDaoSetStateFailed: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}productDaoSetStateFailed`;
      this.message = "SetState product by product Dao setState failed.";
    }
  },
  UserNotAuthorized: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized for given product.";
    }
  },
  ProductIsNotInProperState: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}productIsNotInProperState`;
      this.message = "Cannot update product. Product is not in proper state.";
    }
  },
});

module.exports = {
  SetState,
  List,
  Update,
  Get,
  Load,
  Delete,
  Create,
};
