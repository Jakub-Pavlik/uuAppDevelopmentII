"use strict";
const WorkspaceAbl = require("../../abl/workspace-abl.js");

class WorkspaceController {
  remove(ucEnv) {
    return WorkspaceAbl.remove(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new WorkspaceController();
