const Errors = require("../errors/product-error.js");

const Warnings = {
  Create: {
    UnsupportedKeys: {
      code: `${Errors.Create.UC_CODE}unsupportedKeys`,
    },
    FailedToDeleteAfterRollback: {
      code: `${Errors.Create.UC_CODE}failedToDeleteAfterRollback`,
      message: "System failed to delete uuObject after an exception has been thrown in uuObcIfc/create use case.",
    },
  },
  Delete: {
    UnsupportedKeys: {
      code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
    },
  },
  Get: {
    UnsupportedKeys: {
      code: `${Errors.Get.UC_CODE}unsupportedKeys`,
    },
  },
  Load: {
    UnsupportedKeys: {
      code: `${Errors.Load.UC_CODE}unsupportedKeys`,
    },
  },
  Update: {
    UnsupportedKeys: {
      code: `${Errors.Update.UC_CODE}unsupportedKeys`,
    },
  },
  List: {
    UnsupportedKeys: {
      code: `${Errors.List.UC_CODE}unsupportedKeys`,
    },
  },
  SetState: {
    UnsupportedKeys: {
      code: `${Errors.SetState.UC_CODE}unsupportedKeys`,
    },
    FailedToSetStateInBt: {
      code: `${Errors.Create.UC_CODE}failedToSetStateInBt`,
      message: "System failed to set state of uuObject in uuBt",
    },
  },
};

module.exports = Warnings;
