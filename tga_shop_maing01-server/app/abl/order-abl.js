"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { UuTerrClient: UuTerritoryClient } = require("uu_territory_clientg01");
const InstanceChecker = require("../components/instance-checker");
const UuObjectCode = require("../components/uu-object-code");
const ObjectAuthorization = require("../components/object-authorization");
const ErrorFormatter = require("../components/error-formatter");
const Errors = require("../api/errors/order-error.js");
const Warnings = require("../api/warnings/order-warnings");
const Constants = require("./constants");

const LIST_DEFAULTS = {
  sortBy: "creationTime",
  order: "asc",
  pageIndex: 0,
  pageSize: 100,
};

const UseCaseMap = {
  GET: "tga-eshop-maing01/order/get",
  ADD_PRODUCT: "tga-eshop-maing01/order/addProduct",
  BUY: "tga-eshop-maing01/order/buy",
};

class OrderAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Constants.Schemas.ORDER);
    this.productDao = DaoFactory.getDao(Constants.Schemas.PRODUCT);
  }

  async create(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // validate dtoIn
    const validationResult = this.validator.validate("orderCreateDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Create.UnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // ensure and fetch app schema
    const tgaEshop = await InstanceChecker.ensureInstance(awid, Errors);

    // fetch products from db
    const idList = dtoIn.productList.map((product) => product.id);
    const productsFromDb = await this.productDao.listByIdList(idList);

    // check if listed products are in active state
    productsFromDb.itemList = productsFromDb.itemList.filter(
      (product) => product.state === Constants.Product.States.ACTIVE
    );
    if (!productsFromDb.itemList.length) {
      throw new Errors.Create.NoProductsActive({ uuAppErrorMap });
    }

    // build productList, add count from dtoIn
    const countMap = {};
    dtoIn.productList.forEach((product) => (countMap[product.id] = product.count));
    const productList = productsFromDb.itemList.map((item, i) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      count: countMap[item.id],
    }));

    // create order
    const orderCode = UuObjectCode.generate(8);
    const uuObject = {
      awid,
      code: orderCode,
      state: Constants.Order.States.CART,
      creationTime: new Date(),
      uuIdentity: session.getIdentity().getUuIdentity(),
      productList,
    };

    const order = await this.dao.create(uuObject);

    // create obc
    const orderDetailUri = UriBuilder.parse(uri)
      .setUseCase("order/detail")
      .setParameters({ id: order.id.toString() })
      .toUri();

    // TODO OBC - uuObcDtoIn is missing crucial keys; add them
    const uuObcDtoIn = {
      name: orderCode,
      location: tgaEshop.ordersFolderId,
      uuObUri: orderDetailUri.toString(),
      loadContext: true,
      //....
    };

    let uuObc;
    try {
      // TODO OBC - create uuObc
    } catch (err) {
      // TODO OBC - impement the body of the _rollback
      await this._rollback(awid, order.id, uuAppErrorMap);
      // check various error states fixable for a user
      if (err.code) {
        if (err.code.endsWith(Constants.UuObcErrors.INVALID_HOME_FOLDER_STATE)) {
          throw new Errors.Create.LocationIsNotInProperState({ uuAppErrorMap }, err);
        } else if (err.code.endsWith(Constants.UuObcErrors.LOCATION_DOES_NOT_EXIST)) {
          throw new Errors.Create.FolderDoesNotExist({ uuAppErrorMap }, err);
        } else if (err.code.endsWith(Constants.UuObcErrors.USER_IS_NOT_AUTHORIZED_TO_ADD_ARTIFACT)) {
          throw new Errors.Create.UserDoesNotHaveRightsForThisFolder({ uuAppErrorMap }, err);
        }
      }

      throw new Errors.Create.CallUuObcCreateFailed({ uuAppErrorMap }, err);
    }

    // update order (store uuObc id)
    // TODO OBC - update order in uuObjectStore with artifactId key
    // whose value is the id of the created uuObc
    const updateUuObject = {
      awid,
      //... finish
      sys: {
        rev: order.sys.rev,
      },
    };

    // return dtoOut
    return {
      ...updatedOrder,
      // TODO OBC - uncomment me
      //artifact: uuObc.artifact,
      //context: uuObc.context,
      uuAppErrorMap,
    };
  }

  async get(uri, dtoIn, session, authorizedProfiles) {
    const awid = uri.getAwid();
    // validate dtoIn
    const validationResult = this.validator.validate("orderGetDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Get.UnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // ensure app schema
    await InstanceChecker.ensureInstance(awid, Errors);

    // fetch order
    let order = await this.dao.get(awid, dtoIn.id);
    if (!order) {
      throw new Errors.Get.OrderDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    // authorize for user
    // TODO OBC: authorize user over particular order uuObc

    // return dtoOut
    return {
      ...order,
      uuAppErrorMap,
    };
  }

  async list(uri, dtoIn) {
    const awid = uri.getAwid();
    // validate dtoIn
    const validationResult = this.validator.validate("orderListDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.List.UnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // default values
    if (!dtoIn.sortBy) dtoIn.sortBy = LIST_DEFAULTS.sortBy;
    if (!dtoIn.order) dtoIn.order = LIST_DEFAULTS.order;
    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    if (!dtoIn.pageInfo.pageSize) dtoIn.pageInfo.pageSize = LIST_DEFAULTS.pageSize;
    if (!dtoIn.pageInfo.pageIndex) dtoIn.pageInfo.pageIndex = LIST_DEFAULTS.pageIndex;

    // ensure app schema
    await InstanceChecker.ensureInstance(awid, Errors);

    // list all orders
    const criteria = {
      awid,
      uuIdentity: dtoIn.uuIdentity,
      state: dtoIn.state,
    };
    const list = await this.dao.list(criteria, dtoIn.pageInfo, dtoIn.sortBy, dtoIn.order);

    // return dtoOut
    return {
      ...list,
      uuAppErrorMap,
    };
  }

  async addProduct(uri, dtoIn, session, authorizedProfiles) {
    const awid = uri.getAwid();
    // validate dtoIn
    const validationResult = this.validator.validate("orderAddProductDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.AddProduct.UnsupportedKeys.code,
      Errors.AddProduct.InvalidDtoIn
    );

    // ensure app schema
    await InstanceChecker.ensureInstance(awid, Errors);

    // fetch order
    const order = await this.dao.get(awid, dtoIn.id);
    if (!order) {
      throw new Errors.AddProduct.OrderDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    // authorize order for user
    // TODO OBC: authorize user over particular order uuObc

    // fetch product
    let product = await this.productDao.get(awid, dtoIn.productId);
    if (!product) {
      throw new Errors.AddProduct.ProductDoesNotExist({ uuAppErrorMap }, { productId: dtoIn.productId });
    }

    // check product's state
    if (product.state !== Constants.Product.States.ACTIVE) {
      throw new Errors.AddProduct.ProductStateNotActive(
        { uuAppErrorMap },
        { state: product.state, expectedState: Constants.Product.States.ACTIVE }
      );
    }

    // finding product in order with dtoIn.productId - adding count or adding product
    const foundProduct = order.productList.find((product) => product.id.toString() === dtoIn.productId);

    if (foundProduct) {
      foundProduct.count += dtoIn.count;
    } else {
      order.productList.push({
        id: product.id,
        name: product.name,
        price: product.price,
        count: dtoIn.count,
      });
    }

    // update order
    const updatedOrder = await this.dao.update(order);

    // return dtoOut
    return {
      ...updatedOrder,
      uuAppErrorMap,
    };
  }

  async buy(uri, dtoIn, session, authorizedProfiles) {
    const awid = uri.getAwid();
    // validate dtoIn
    const validationResult = this.validator.validate("orderBuyDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Buy.UnsupportedKeys.code,
      Errors.Buy.InvalidDtoIn
    );

    // fetch and ensure app schema
    const tgaEshop = await InstanceChecker.ensureInstance(awid, Errors);

    // fetch order
    const order = await this.dao.get(awid, dtoIn.id);
    if (!order) {
      throw new Errors.Buy.OrderDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    // check order not empty
    if (order.productList.length < 1) {
      throw new Errors.Buy.OrderIsEmpty({ uuAppErrorMap }, { id: dtoIn.id });
    }

    // authorize order for user
    // TODO OBC: authorize user over particular order uuObc

    // update order
    const uuObject = {
      awid,
      id: order.id,
      state: Constants.Order.States.PROCESSED,
    };

    const updatedOrder = await this.dao.update(uuObject);

    // propagate state change to the uuObc
    try {
      // TODO OBC: set state of the uuObc to the "processed" as well
    } catch (e) {
      ValidationHelper.addWarning(
        uuAppErrorMap,
        Warnings.Buy.FailedToSetStateInBt.code,
        Warnings.Buy.FailedToSetStateInBt.message,
        ErrorFormatter.formatExceptionToObject(e)
      );
    }

    // return dtoOut
    return {
      ...updatedOrder,
      uuAppErrorMap,
    };
  }

  async setState(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // validation of dtoIn
    let validationResult = this.validator.validate("orderSetStateDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.SetState.UnsupportedKeys.code,
      Errors.SetState.InvalidDtoIn
    );

    // ensure and fetch app schema
    const tgaEshop = await InstanceChecker.ensureInstance(awid, Errors);

    // load order
    const order = await this.dao.get(awid, dtoIn.id);

    // check product existence
    if (!order) {
      throw new Errors.SetState.OrderDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    // update order's state
    const updatedOrder = await this.dao.update({
      awid,
      id: dtoIn.id,
      state: dtoIn.state,
      sys: { rev: order.sys.rev },
    });

    // propagate state change to the uuObc
    let uuObc;
    try {
      uuObc = await UuTerritoryClient.Obc.setState(
        {
          id: order.artifactId,
          state: dtoIn.state,
          loadContext: true,
        },
        {
          baseUri: tgaEshop.uuBtBaseUri.toString(),
          session,
          appUri: uri.getBaseUri(),
        }
      );
    } catch (e) {
      ValidationHelper.addWarning(
        uuAppErrorMap,
        Warnings.SetState.FailedToSetStateInBt.code,
        Warnings.SetState.FailedToSetStateInBt.message,
        ErrorFormatter.formatExceptionToObject(e)
      );
    }

    // return dtoOut
    return {
      ...updatedOrder,
      artifact: uuObc.artifact,
      context: uuObc.context,
      uuAppErrorMap,
    };
  }

  /**
   * Rollbacks created order by deleting it from database. In case the delete fails,
   * it adds warning to uuAppErrorMap.
   * @param awid
   * @param orderId
   * @param uuAppErrorMap
   * @returns {Promise<void>}
   * @private
   */
  async _rollback(awid, orderId, uuAppErrorMap = {}) {
    // TODO OBC - impement the body of the _rollback
  }
}

module.exports = new OrderAbl();
