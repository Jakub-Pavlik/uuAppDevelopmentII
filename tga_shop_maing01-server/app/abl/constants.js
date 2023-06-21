"use strict";

const Constants = {
  Schemas: {
    APPSCHEMA: "eshopMain",
    PRODUCT: "product",
    ORDER: "order",
  },

  Profiles: {
    AUTHORITIES: "Authorities",
    EXECUTIVES: "Executives",
    CUSTOMERS: "Customers",

    get IsAuthoritiesOrExecutives() {
      return (authorizedProfiles) => {
        return authorizedProfiles.includes("Authorities") || authorizedProfiles.includes("Executives");
      };
    },
  },

  AppSchema: {
    States: {
      INIT: "initial",
      ACTIVE: "active",
      PASSIVE: "passive",
      FINAL: "closed",
    },
    get NonFinalStates() {
      return new Set([this.States.INIT, this.States.ACTIVE, this.States.PASSIVE]);
    },
    get ActiveStates() {
      return new Set([this.States.ACTIVE, this.States.PASSIVE]);
    },
  },

  Product: {
    States: {
      ACTIVE: "active",
      PASSIVE: "passive",
      CLOSED: "closed",
    },
    get FinalStates() {
      return new Set([this.States.CLOSED]);
    },
  },

  Order: {
    States: {
      CART: "cart",
      PROCESSED: "processed",
      CANCELLED: "cancelled",
    },
    get NormalStates() {
      return new Set([this.States.CART, this.States.TO_BE_BOUGHT, this.States.TO_BE_PROCESSED]);
    },
    get NonFinalStates() {
      return new Set([this.States.CART, this.States.TO_BE_BOUGHT, this.States.TO_BE_PROCESSED]);
    },
    get FinalStates() {
      return new Set([this.States.PROCESSED, this.States.CANCELLED]);
    },
  },

  UuObcErrors: {
    INVALID_HOME_FOLDER_STATE: "invalidHomeFolderState",
    LOCATION_DOES_NOT_EXIST: "locationDoesNotExist",
    USER_IS_NOT_AUTHORIZED_TO_ADD_ARTIFACT: "userIsNotAuthorizedToAddArtifact",
  },
};

module.exports = Constants;
