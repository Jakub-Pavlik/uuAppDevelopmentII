/* eslint-disable */

const initDtoInType = shape({
  uuAppProfileAuthorities: uri().isRequired("uuBtLocationUri"),
  uuBtLocationUri: uri(),
  name: uu5String(512),
});

const eshopMainUpdateDtoInType = shape({
  name: string(),
  desc: string(),
  stateData: shape({ progress: shape({ weight: integer(), current: integer() }) }, true, 10000),
  revision: integer(),
});

const eshopMainSetStateDtoInType = shape({
  state: oneOf(["passive", "active"]),
  desc: uu5String(5000),
  stateData: shape({ progress: shape({ weight: integer(), current: integer() }) }, true, 10000),
  revision: integer(),
});
