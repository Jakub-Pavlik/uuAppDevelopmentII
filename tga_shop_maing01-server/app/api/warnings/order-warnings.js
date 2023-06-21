const Errors = require("../errors/order-error");
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
  Get: {
    UnsupportedKeys: {
      code: `${Errors.Get.UC_CODE}unsupportedKeys`,
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
      code: `${Errors.SetState.UC_CODE}failedToSetStateInBt`,
      message: "System failed to set state of uuObject in uuBt",
    },
  },
  AddProduct: {
    UnsupportedKeys: {
      code: `${Errors.AddProduct.UC_CODE}unsupportedKeys`,
    },
  },
  Buy: {
    UnsupportedKeys: {
      code: `${Errors.Buy.UC_CODE}unsupportedKeys`,
    },
    FailedToSetStateInBt: {
      code: `${Errors.Buy.UC_CODE}failedToSetStateInBt`,
      message: "System failed to set state of uuObject in uuBt",
    },
  },
};

module.exports = Warnings;
