/* eslint-disable */

const knockTheDoorDtoInType = shape({
  awid: code().isRequired(),
  message: string(150),
});

const knockKnockDtoInType = shape({
  message: string(150),
});
