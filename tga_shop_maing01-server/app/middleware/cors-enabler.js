"use strict";

const cors = require("cors");

const MIDDLEWARE_ORDER = -10;

class CorsEnabler {
  constructor() {
    this.order = MIDDLEWARE_ORDER;
  }

  get pre() {
    const corsOptions = {
      origin: true,
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      credentials: true,
    };

    return [cors(corsOptions)];
  }
}

module.exports = CorsEnabler;