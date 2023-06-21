"use strict";

const ErrorFormatter = {
  /**
   * format nested exception with multiple "cause" to readable object
   * exception
   * @returns {object}
   */
  formatExceptionToObject(exception) {
    let cause = exception.cause ? this.formatExceptionToObject(exception.cause) : null;
    return {
      ...exception.dtoOut,
      exceptionMessage: exception.message,
      exceptionCode: exception.code,
      cause,
    };
  },
};

module.exports = ErrorFormatter;
