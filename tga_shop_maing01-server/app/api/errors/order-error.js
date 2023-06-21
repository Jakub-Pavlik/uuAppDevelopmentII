"use strict";

const ShopMainUseCaseError = require("./shop-main-use-case-error.js");
const ORDER_ERROR_PREFIX = `${ShopMainUseCaseError.ERROR_PREFIX}order/`;

const { injectBasicErrors } = require("../../components/error-builder");

const Create = injectBasicErrors({
  UC_CODE: `${ORDER_ERROR_PREFIX}create/`,
  NoProductsActive: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}noProductsActive`;
      this.message = "There is no product active from the dtoIn.";
    }
  },
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

const Get = injectBasicErrors({
  UC_CODE: `${ORDER_ERROR_PREFIX}get/`,
  OrderDoesNotExist: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}orderDoesNotExist`;
      this.message = "Order does not exist.";
    }
  },
  CallUuObcAuthorizeMeFailed: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}callUuObcAuthorizeMeFailed`;
      this.message = "Call UuObc authorizeMe failed";
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

const AddProduct = injectBasicErrors({
  UC_CODE: `${ORDER_ERROR_PREFIX}addProduct/`,
  OrderDoesNotExist: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${AddProduct.UC_CODE}orderDoesNotExist`;
      this.message = "Order does not exist.";
    }
  },
  ProductDoesNotExist: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${AddProduct.UC_CODE}addedProductDoesNotExist`;
      this.message = "Added product does not exist.";
    }
  },
  ProductStateNotActive: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${AddProduct.UC_CODE}addedProductIsNotActive`;
      this.message = "Added product is not in active state.";
    }
  },
  UserNotAuthorized: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${AddProduct.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized for given product.";
    }
  },
});

const Buy = injectBasicErrors({
  UC_CODE: `${ORDER_ERROR_PREFIX}buy/`,
  OrderDoesNotExist: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Buy.UC_CODE}orderDoesNotExist`;
      this.message = "Order does not exist.";
    }
  },
  OrderIsEmpty: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Buy.UC_CODE}orderIsEmpty`;
      this.message = "Order is empty.";
    }
  },
  UserNotAuthorized: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Buy.UC_CODE}userNotAuthorized`;
      this.message = "User is not authorized for given product.";
    }
  },
});


const List = injectBasicErrors({
  UC_CODE: `${ORDER_ERROR_PREFIX}list/`,
});

const SetState = injectBasicErrors({
  UC_CODE: `${ORDER_ERROR_PREFIX}setState/`,
  OrderDoesNotExist: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}orderDoesNotExist`;
      this.message = "Order does not exist.";
    }
  },
  OrderDaoSetStateFailed: class extends ShopMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}orderDaoSetStateFailed`;
      this.message = "Update order state Dao update failed.";
    }
  },
});

module.exports = {
  SetState,
  List,
  Get,
  Create,
  AddProduct,
  Buy
};
