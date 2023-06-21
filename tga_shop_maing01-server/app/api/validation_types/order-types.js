/* eslint-disable */
const orderCreateDtoInType = shape({
  productList: array(
    shape({
      id: id().isRequired(),
      count: number().isRequired(),
    })
  ).isRequired(),
});

const orderGetDtoInType = shape({
  id: id().isRequired(),
});

const orderAddProductDtoInType = shape({
  id: id().isRequired(),
  productId: id().isRequired(),
  count: integer().isRequired(),
});

const orderBuyDtoInType = shape({
  id: id().isRequired(),
});

const orderSetStateDtoInType = shape({
  id: id().isRequired(),
  state: oneOf(["cart", "processed", "closed"]).isRequired(),
});

const orderListDtoInType = shape({
  sortBy: oneOf(["state", "creationTime"]),
  order: oneOf(["asc", "desc"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
  uuIdentity: uu5String(),
  state: oneOf(["cart", "processed", "closed"]),
});
