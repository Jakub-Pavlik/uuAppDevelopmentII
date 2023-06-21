/* eslint-disable */
const workspaceRemoveDtoInType = shape({
  settings: shape({
    uuBtBaseUri: uri().isRequired(),
    awscId: id().isRequired(),
    ordersFolderId: id().isRequired(),
    productsFolderId: id().isRequired(),
  }),
});