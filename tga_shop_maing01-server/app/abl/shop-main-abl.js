"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, UuAppWorkspace, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const InstanceChecker = require("../components/instance-checker");
const { UuTerrClient } = require("uu_territory_clientg01");
const Config = require("uu_appg01_server").Utils.Config;
const Errors = require("../api/errors/shop-main-error.js");
const Warnings = require("../api/warnings/shop-main-warnings");
const Constants = require("./constants");

const AWSC_CODE_PREFIX = "tgaEshopMain";
const AWSC_ALREADY_CONNECTED_CODE = "uu-businessterritory-maing01/uuAwsc/create/applicationIsAlreadyConnected";

class ShopMainAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Constants.Schemas.APPSCHEMA);
  }

  async init(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // validate dtoIn
    let validationResult = this.validator.validate("initDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      Warnings.InitUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    // create schemas
    const schemas = Object.values(Constants.Schemas);
    let schemaCreateResults = schemas.map(async (schema) => {
      try {
        return await DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        // A3
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
      }
    });
    await Promise.all(schemaCreateResults);

    const appSchemaUuObject = {
      awid,
      name: dtoIn.name || "TgaEshop application",
      state: Constants.AppSchema.States.ACTIVE,
    };

    // plug in to uuBt
    if (dtoIn.uuBtLocationUri) {
      const uuBtUri = UriBuilder.parse(dtoIn.uuBtLocationUri).toUri();
      const uuBtBaseUri = uuBtUri.getBaseUri();
      const uuBtUriParams = uuBtUri.getParameters();

      // create awsc
      // TODO AWSC - implement connection of uuAwsc into uuBt - into given folder / unit id (parameter id)

      // connect it
      const artifactUri = UriBuilder.parse(uuBtUri)
        .setUseCase(null)
        .clearParameters()
        .setParameter("id", awscDtoOut.id)
        .toUri();

      // TODO AWSC - connect workspace with created artifact

      // create folders
      // TODO AWSC - implement creation of 2 folders. 1 for products and 1 for orders.

      // set awsc state
      // TODO AWSC - implement setting state of awsc
    }

    // deal with sysProfiles
    if (dtoIn.uuAppProfileAuthorities) {
      try {
        await Profile.set(awid, "Authorities", dtoIn.uuAppProfileAuthorities);
      } catch (e) {
        if (e instanceof UuAppWorkspaceError) {
          // A4
          throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
        }
        throw e;
      }
    }

    // create app schema
    // TODO AWSC - Make sure you store all the required keys
    // ...
    const workspaceData = await this.dao.create(appSchemaUuObject);

    // return dtoOut
    return {
      ...workspaceData,
      uuAppErrorMap: uuAppErrorMap,
    };
  }

  async load(uri, session) {
    let awid = uri.getAwid();
    let uuAppErrorMap = {};

    // load uuAppWorkspace
    const dtoOut = await UuAppWorkspace.load(uri, session, uuAppErrorMap);

    // get app schema data
    const sysState = dtoOut.sysData.awidData.sysState;
    if (sysState !== UuAppWorkspace.SYS_STATES.CREATED && sysState !== UuAppWorkspace.SYS_STATES.ASSIGNED) {
      const eshopMain = await InstanceChecker.ensureInstance(awid, Errors, uuAppErrorMap);
      dtoOut.data = { ...eshopMain, relatedObjectsMap: {} };
    }

    // return dtoOut
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async setState(uri, dtoIn, session) {
    const awid = uri.getAwid();

    // validate dtoIn
    let validationResult = this.validator.validate("eshopMainSetStateDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      `${Errors.SetState.UC_CODE}unsupportedKeys`,
      Errors.SetState.InvalidDtoIn
    );

    // check application's state
    const eshopMain = await InstanceChecker.ensureInstanceAndState(awid, Errors.SetState);

    // update app state
    eshopMain.state = dtoIn.state || eshopMain.state;
    await this.dao.updateByAwid(eshopMain);

    // update awsc state
    // TODO AWSC - implement update of awsc state; use loadContext:true in dtoIn to get "artifact" and "context" data
    // const awsc = ...

    // return dtoOut
    return {
      ...eshopMain,
      artifact: awsc.artifact,
      context: awsc.context,
      uuAppErrorMap,
    };
  }

  async update(uri, dtoIn, session) {
    const awid = uri.getAwid();

    // validate dtoIn
    let validationResult = this.validator.validate("eshopMainUpdateDtoInType", dtoIn);
    const uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      `${Errors.SetState.UC_CODE}unsupportedKeys`,
      Errors.SetState.InvalidDtoIn
    );

    // check application's state
    const eshopMain = await InstanceChecker.ensureInstanceAndState(awid, Errors.SetState);

    // update app schema
    eshopMain.state = dtoIn.state || eshopMain.state;
    await this.dao.updateByAwid(eshopMain);

    // update awsc basic attributes
    // TODO AWSC - implement update of awsc basic attributes; use loadContext:true in dtoIn to get "artifact" and "context" data
    // const awsc = ...

    // return dtoOut
    return {
      ...eshopMain,
      artifact: awsc.artifact,
      context: awsc.context,
      uuAppErrorMap,
    };
  }

  getAwscCode(awid) {
    return `${AWSC_CODE_PREFIX}/${awid}`;
  }
}

module.exports = new ShopMainAbl();
