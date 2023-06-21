"use strict";
//@@viewOn:revision
// coded: Petr Příhoda (21-7222-1), 09/09/2020
//@@viewOff:revision

//@@viewOn:imports
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Schemas, AppSchema } = require("../../app/abl/constants");
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:component
class InstanceChecker {
  constructor() {
    this.dao = DaoFactory.getDao(Schemas.APPSCHEMA);
  }

  /**
   * Loads circles instance, check its existence and verifies proper state.
   * @param awid
   * @param errors
   * @param uuAppErrorMap
   * @param states Set of allowed states
   * @returns {Promise<void>}
   */
  async ensureInstanceAndState(awid, errors, states = AppSchema.NonFinalStates, uuAppErrorMap = {}) {
    // HDS 1
    let circles = await this.ensureInstance(awid, errors, uuAppErrorMap);

    // HDS 2
    if (!states.has(circles.state)) {
      // 2.1.A
      throw new errors.CirclesIsNotInCorrectState(
        { uuAppErrorMap },
        {
          awid,
          state: circles.state,
          expectedState: Array.from(states),
        }
      );
    }

    return circles;
  }

  /**
   * Loads circles instance and check its existence
   * @param awid
   * @param errors
   * @param uuAppErrorMap
   * @returns {Promise<void>}
   */
  async ensureInstance(awid, errors, uuAppErrorMap = {}) {
    // HDS 1
    let tgaShop = await this.dao.getByAwid(awid);

    // HDS 2
    if (!tgaShop) {
      // 2.1.A
      throw new errors.ShopDoesNotExist({ uuAppErrorMap }, { awid });
    }

    return tgaShop;
  }
}
//@@viewOff:component

//@@viewOn:exports
module.exports = new InstanceChecker();
//@@viewOff:exports
