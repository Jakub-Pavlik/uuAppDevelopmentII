"use strict";
const { AuthorizationService } = require("uu_appg01_server").Authorization;

const ObjectAuthorization = {
  /**
   * Authorizes user for uuObc
   * @param entity
   * @param session
   * @param useCase
   * @param errors
   * @param uuAppErrorMap
   * @returns {Promise<>}
   * @private
   */
  async authorize(entity, session, useCase, errors, uuAppErrorMap) {
    const authorizationData = {
      authorizationStrategy: "artifact",
      artifactId: entity.artifactId,
    };

    const authorizationResult = await AuthorizationService.authorizeObject(
      session,
      { name: useCase },
      authorizationData
    );

    if (!authorizationResult.isObjectAuthorized()) {
      throw new errors.UserNotAuthorized({ uuAppErrorMap }, { authorizationResult });
    }

    return authorizationResult;
  },
};

module.exports = ObjectAuthorization;
