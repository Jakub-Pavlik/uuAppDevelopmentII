const CmdEnvironmentHandler = {
  /**
   * The function helps to obtain all needed cmdEnv values
   * @param {UseCaseEnvironment} cmdEnv
   * @returns {{authorizationResult: *, dtoIn: *, getRequest: *, getResponse: *, session: *, awid: *, uri: *}}
   */
  get(cmdEnv) {
    let { awid, uri, dtoIn, session, authorizationResult } = cmdEnv;

    if (!uri && cmdEnv.getUri) uri = cmdEnv.getUri();
    if (!dtoIn && cmdEnv.getDtoIn) dtoIn = cmdEnv.getDtoIn();
    if (!session && cmdEnv.getSession) session = cmdEnv.getSession();
    if (!awid && uri.getAwid) awid = uri.getAwid();
    if (!authorizationResult && cmdEnv.getAuthorizationResult) authorizationResult = cmdEnv.getAuthorizationResult();

    return {
      ...cmdEnv,
      // even though this is in original ucEnv, it is not copied with the spread operator so it has to be named explicitly
      getRequest: cmdEnv.getRequest,
      getResponse: cmdEnv.getResponse,
      awid,
      uri,
      dtoIn,
      session,
      authorizationResult,
    };
  },
};

module.exports = CmdEnvironmentHandler;
