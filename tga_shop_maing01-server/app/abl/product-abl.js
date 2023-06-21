"use strict";
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UuTerrClient: UuTerritoryClient } = require("uu_territory_clientg01");
const { UriBuilder } = require("uu_appg01_server").Uri;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Validator } = require("uu_appg01_server").Validation;
const InstanceChecker = require("../components/instance-checker");
const ErrorFormatter = require("../components/error-formatter");
const ObjectAuthorization = require("../components/object-authorization");
const Errors = require("../api/errors/product-error.js");
const Warnings = require("../api/warnings/product-warnings");
const Constants = require("./constants.js");

const LIST_DEFAULTS = {
  sortBy: "name",
  order: "asc",
  pageIndex: 0,
  pageSize: 100,
};

const UseCaseMap = {
  UPDATE: "tga-eshop-maing01/product/update",
  SET_STATE: "tga-eshop-maing01/product/setState",
  DELETE: "tga-eshop-maing01/product/delete",
};

class ProductAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Constants.Schemas.PRODUCT);
  }

  async create(uri, dtoIn, session) {
    const awid = uri.getAwid();

    // validation of dtoIn
    const validationResult = this.validator.validate("productCreateDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Create.UnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // fetch app data
    const tgaEshop = await InstanceChecker.ensureInstance(awid, Errors);

    // build uuObject
    const uuObject = {
      ...dtoIn,
      awid,
      state: Constants.Product.States.ACTIVE,
    };

    // create product in db
    const product = await this.dao.create(uuObject);

    // create obc
    const productDetailUri = UriBuilder.parse(uri)
      .setUseCase("product/detail")
      .setParameters({ id: product.id.toString() })
      .toUri();

    const uuObcDtoIn = {
      name: product.name,
      text: product.text,
      // TODO OBC: add possibility of custom location
      location: tgaEshop.productsFolderId,
      uuObId: product.id,
      uuObUri: productDetailUri.toString(),
      typeCode: "tga-eshop-maing01/product",
      loadContext: true,
    };

    let uuObc;
    try {
      // TODO OBC: uncomment me
      // uuObc = await UuTerritoryClient.Obc.create(uuObcDtoIn, {
      //   baseUri: tgaEshop.uuBtBaseUri.toString(),
      //   session,
      //   appUri: uri.getBaseUri(),
      // });
    } catch (err) {
      await this._rollback(awid, product.id, uuAppErrorMap);
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

    // update product (store uuObc id)
    const updatedProduct = await this.dao.update({
      awid,
      id: product.id,
      // TODO OBC: uncomment me
      //artifactId: uuObc.artifact.id,
      sys: {
        rev: product.sys.rev,
      },
    });

    // return dtoOut
    return {
      ...updatedProduct,
      // TODO OBC: uncomment me
      // artifact: uuObc.artifact,
      // context: uuObc.context,
      uuAppErrorMap,
    };
  }

  async get(uri, dtoIn) {
    const awid = uri.getAwid();

    // validation of dtoIn
    const validationResult = this.validator.validate("productGetDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Get.UnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // ensure app schema
    await InstanceChecker.ensureInstance(awid, Errors);

    // load product
    const product = await this.dao.get(awid, dtoIn.id);

    // check productexistence
    if (!product) {
      throw new Errors.Get.ProductDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    // return dtoOut
    return {
      ...product,
      uuAppErrorMap,
    };
  }

  async load(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // validation of dtoIn
    const validationResult = this.validator.validate("productLoadDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Load.UnsupportedKeys.code,
      Errors.Load.InvalidDtoIn
    );

    // ensure and fetch app schema
    const tgaEshop = await InstanceChecker.ensureInstance(awid, Errors);

    // load product
    const product = await this.dao.get(awid, dtoIn.id);

    // check product existence
    if (!product) {
      throw new Errors.Load.ProductDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    // load context form uuBt
    const uuObc = await UuTerritoryClient.Obc.load(
      {
        id: product.artifactId,
        loadContext: true,
      },
      {
        baseUri: tgaEshop.uuBtBaseUri.toString(),
        session,
        appUri: uri.getBaseUri(),
      }
    );

    // return dtoOut
    return {
      ...product,
      artifact: uuObc.artifact,
      context: uuObc.context,
      uuAppErrorMap,
    };
  }

  async list(uri, dtoIn, authorizedProfiles) {
    const awid = uri.getAwid();

    // validation of dtoIn
    const validationResult = this.validator.validate("productListDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.List.UnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // ensure app schema
    await InstanceChecker.ensureInstance(awid, Errors);

    // set default values
    if (!dtoIn.sortBy) dtoIn.sortBy = LIST_DEFAULTS.sortBy;
    if (!dtoIn.order) dtoIn.order = LIST_DEFAULTS.order;
    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    if (!dtoIn.pageInfo.pageSize) dtoIn.pageInfo.pageSize = LIST_DEFAULTS.pageSize;
    if (!dtoIn.pageInfo.pageIndex) dtoIn.pageInfo.pageIndex = LIST_DEFAULTS.pageIndex;

    let onlyState = null;
    if (authorizedProfiles.length === 1 && authorizedProfiles.includes("Customers")) {
      onlyState = Constants.Product.States.ACTIVE;
    }

    // list products
    const list = await this.dao.list(awid, onlyState, dtoIn.sortBy, dtoIn.order, dtoIn.pageInfo);

    // return dtoOut
    return {
      ...list,
      uuAppErrorMap,
    };
  }

  async update(uri, dtoIn, session, authorizedProfiles) {
    const awid = uri.getAwid();
    // validation of dtoIn
    const validationResult = this.validator.validate("productUpdateDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Update.UnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // ensure and fetch app schema
    const tgaEshop = await InstanceChecker.ensureInstance(awid, Errors);

    // load product
    const product = await this.dao.get(awid, dtoIn.id);

    // check product existence
    if (!product) {
      throw new Errors.Update.ProductDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    // check state
    if (Constants.Product.FinalStates.has(product.state)) {
      throw new Errors.Update.ProductIsNotInProperState(
        { uuAppErrorMap },
        { id: dtoIn.id, state: product.state, expectedStateList: [Constants.Product.States.ACTIVE, Constants.Product.States.PASSIVE] }
      );
    }

    // authorize for user
    // TODO OBC: authorize user over particular product uuObc

    // update product
    const uuObject = {
      ...dtoIn,
      awid,
    };

    const updatedProduct = await this.dao.update(uuObject);

    // propagate change of shared data into the uuObc
    let uuObc;
    if (dtoIn.name) {
      // TODO OBC: synchonize changed name with the uuObc
    }

    // return dtoOut
    return {
      ...updatedProduct,
      artifact: uuObc.artifact,
      context: uuObc.context,
      uuAppErrorMap,
    };
  }

  async setState(uri, dtoIn, session, authorizedProfiles) {
    const awid = uri.getAwid();
    // validation of dtoIn
    const validationResult = this.validator.validate("productSetStateDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.SetState.UnsupportedKeys.code,
      Errors.SetState.InvalidDtoIn
    );

    // ensure and fetch app schema
    const tgaEshop = await InstanceChecker.ensureInstance(awid, Errors);

    // load product
    const product = await this.dao.get(awid, dtoIn.id);

    // check product existence
    if (!product) {
      throw new Errors.SetState.ProductDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    // check state
    if (Constants.Product.FinalStates.has(product.state)) {
      throw new Errors.SetState.ProductIsNotInProperState(
        { uuAppErrorMap },
        { id: dtoIn.id, state: product.state, expectedStateList: [Constants.Product.States.ACTIVE, Constants.Product.States.PASSIVE] }
      );
    }

    // authorize for user
    // TODO OBC: authorize user over particular product uuObc

    // update product's state
    const updatedProduct = await this.dao.update({
      awid,
      id: dtoIn.id,
      state: dtoIn.state,
      sys: dtoIn.sys,
    });

    // propagate state change to the uuObc
    let uuObc;
    try {
      uuObc = await UuTerritoryClient.Obc.setState(
        {
          id: product.artifactId,
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
      ...updatedProduct,
      artifact: uuObc.artifact,
      context: uuObc.context,
      uuAppErrorMap,
    };
  }

  async delete(uri, dtoIn, session, authorizedProfiles) {
    const awid = uri.getAwid();
    // validation of dtoIn
    const validationResult = this.validator.validate("productDeleteDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.Delete.UnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // ensure and fetch app schema
    const tgaEshop = await InstanceChecker.ensureInstance(awid, Errors);

    // load product
    const product = await this.dao.get(awid, dtoIn.id);

    // check product existence
    if (!product) {
      throw new Errors.Delete.ProductDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    // check state
    if (!Constants.Product.FinalStates.has(product.state)) {
      throw new Errors.SetState.ProductIsNotInProperState(
        { uuAppErrorMap },
        { id: dtoIn.id, state: product.state, expectedStateList: [Constants.Product.States.CLOSED] }
      );
    }

    // authorize for user
    // TODO OBC: authorize user over particular product uuObc

    // delete
    await this.dao.delete(awid, dtoIn.id);

    // delete uuObc
    // TODO OBC: delete the corresponding uuObc

    return { uuAppErrorMap };
  }

  /**
   * Rollbacks created product by deleting it from database. In case the delete fails,
   * it adds warning to uuAppErrorMap.
   * @param awid
   * @param productId
   * @param uuAppErrorMap
   * @returns {Promise<void>}
   * @private
   */
  async _rollback(awid, productId, uuAppErrorMap = {}) {
    try {
      await this.dao.delete(awid, productId);
    } catch (e) {
      ValidationHelper.addWarning(
        uuAppErrorMap,
        Warnings.Create.FailedToDeleteAfterRollback.code,
        Warnings.Create.FailedToDeleteAfterRollback.message,
        ErrorFormatter.formatExceptionToObject(e)
      );
    }
  }
}

module.exports = new ProductAbl();
