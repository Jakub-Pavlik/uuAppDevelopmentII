"use strict";
const crypto = require("crypto");

const UuObjectCode = {
  /**
   * Generate unique code - default is 32 length hex.
   * byteLength
   * format
   * @returns {string} unique code
   */
  generate(byteLength = 16, format = "hex") {
    return crypto.randomBytes(byteLength).toString(format);
  },
};

module.exports = UuObjectCode;
