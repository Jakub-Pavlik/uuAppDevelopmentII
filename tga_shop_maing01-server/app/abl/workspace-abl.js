"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { UuTerrClient } = require("uu_territory_clientg01");
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Config } = require("uu_appg01_server").Utils;
const { UuAppWorkspace } = require("uu_appg01_server").Workspace;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { UriBuilder } = require("uu_appg01_server").Uri;
const AppClient = require("uu_appg01_server").AppClient;
const Errors = require("../api/errors/workspace-error.js");
const InstanceChecker = require("../components/instance-checker");
const { Schemas } = require("../../app/abl/constants");

const WARNINGS = {
  RemoveUnsupportedKeys: {
    code: `${Errors.Remove.UC_CODE}unsupportedKeys`,
  },
  WorkspaceAlreadyClosed: {
    code: `${Errors.Remove.UC_CODE}workspaceAlreadyClosed`,
    message: "Workspace is already closed. Skipped.",
  },
  AwscDoesNotExist: {
    code: `${Errors.Remove.UC_CODE}awscDoesNotExist`,
    message: "Awsc does not exist. Already deleted. Skipped.",
  },
  FolderAlreadyClosed: {
    code: `${Errors.Remove.UC_CODE}folderAlreadyClosed`,
    message: "At least one folder was already closed. Skipped.",
  },
  ShopDoesNotExist: {
    code: `${Errors.Remove.UC_CODE}shopDoesNotExist`,
    message: "Application schema eshopMain does not exist. Use dtoIn.settings or uuBt steps will be skipped.",
  },
};

class WorkspaceAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.APPSCHEMA);
  }

  async remove(uri, dtoIn, session) {
    const awid = uri.getAwid();

    // validate dtoIn
    let validationResult = this.validator.validate("workspaceRemoveDtoInType", dtoIn);
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.RemoveUnsupportedKeys.code,
      Errors.Remove.InvalidDtoIn
    );

    // set environment data
    let settings = {};
    if (dtoIn.settings) {
      settings = { ...dtoIn.settings };
    } else {
      let tgaEshop;
      try {
        tgaEshop = await InstanceChecker.ensureInstance(awid, Errors.Remove);
        settings = {
          uuBtBaseUri: tgaEshop.uuBtBaseUri.toString(),
          awscId: tgaEshop.awscId,
          ordersFolderId: tgaEshop.ordersFolderId,
          productsFolderId: tgaEshop.productsFolderId,
        };
      } catch (e) {
        if (e.code === "tga-shop-main/workspace/remove/shopDoesNotExist") {
          ValidationHelper.addWarning(
            uuAppErrorMap,
            WARNINGS.ShopDoesNotExist.code,
            WARNINGS.ShopDoesNotExist.message,
            e
          );
        } else {
          throw e;
        }
      }
    }

    if (Object.keys(settings).length) {
      // set up territory client; MUST be done before closing workspace; listKeys cmd won't work in
      // closed state and appClientToken cannot be set without listing public keys?
      const uuTerritoryClient = new UuTerrClient({
        baseUri: settings.uuBtBaseUri,
        session,
        appUri: uri.getBaseUri(),
      });

      // delete awsc
      try {
        await uuTerritoryClient.Awsc.delete({
          id: settings.awscId,
        });
      } catch (e) {
        if (e.code === "uu-businessterritory-maing01/authorization/artifactDoesNotExist") {
          ValidationHelper.addWarning(
            uuAppErrorMap,
            WARNINGS.AwscDoesNotExist.code,
            WARNINGS.AwscDoesNotExist.message,
            e
          );
        } else {
          throw e;
        }
      }

      // close folders
      try {
        await uuTerritoryClient.Folder.setState({
          id: settings.productsFolderId,
          state: "closed",
        });
        await uuTerritoryClient.Folder.setState({
          id: settings.ordersFolderId,
          state: "closed",
        });
      } catch (e) {
        if (e.code === "uu-businessterritory-maing01/uuFolder/setState/invalidFolderState") {
          ValidationHelper.addWarning(
            uuAppErrorMap,
            WARNINGS.FolderAlreadyClosed.code,
            WARNINGS.FolderAlreadyClosed.message,
            e
          );
        } else {
          throw e;
        }
      }

      // delete folders
      await uuTerritoryClient.Folder.delete({
        id: settings.productsFolderId,
      });

      await uuTerritoryClient.Folder.delete({
        id: settings.ordersFolderId,
      });
    }

    // delete app schema
    await this.dao.removeByAwid(awid);

    // close awid
    try {
      await UuAppWorkspace.close(awid);
    } catch (e) {
      if (e.code === "uu-app-workspace/sys/uuAppWorkspace/close/sysUuAppWorkspaceAlreadyClosed") {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          WARNINGS.WorkspaceAlreadyClosed.code,
          WARNINGS.WorkspaceAlreadyClosed.message,
          e
        );
      } else {
        throw e;
      }
    }

    // delete sys workspace
    // note: if this fails for some reason on authorization, call the cmd via Insomnia directly
    const targetUri = UriBuilder.parse(uri)
      .setAwid(Config.get("asid"))
      .setUseCase("sys/uuAppWorkspace/delete")
      .clearParameters()
      .toUri();
    await AppClient.post(targetUri, { awid }, { session });

    return {
      uuAppErrorMap,
    };
  }
}

module.exports = new WorkspaceAbl();
