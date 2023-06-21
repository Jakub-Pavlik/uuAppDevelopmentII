"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UriBuilder } = require("uu_appg01_server").Uri;
const AppClient = require("uu_appg01_server").AppClient;

class KnockAbl {
  constructor() {
    this.validator = Validator.load();
  }

  async knock(awid, dtoIn, session) {
    // TODO AWSC - use console.log() to write out the uuIdentity of the caller
    console.log("yep", awid, dtoIn.message);

    return dtoIn;
  }

  async theDoor(uri, dtoIn, session) {
    // validate dtoIn
    let validationResult = this.validator.validate("knockTheDoorDtoInType", dtoIn);
    ValidationHelper.processValidationResult(dtoIn, validationResult, "dtoInWarningCode", Error);

    // call the passed awid
    const targetUri = UriBuilder.parse(uri.getBaseUri()).setAwid(dtoIn.awid).setUseCase("knock/knock");

    // TODO AWSC - call "knock/knock" cmd with the system identity session
    return AppClient.post(targetUri, { message: dtoIn.message }, { session });
  }
}

module.exports = new KnockAbl();
