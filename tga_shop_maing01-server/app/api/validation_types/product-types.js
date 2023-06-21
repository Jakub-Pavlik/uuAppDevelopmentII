/* eslint-disable */
const productCreateDtoInType = shape({
  price: number(),
  name: string(255).isRequired(),
  text: string(4000),
  // TODO OBC: add locationId
});

const productDeleteDtoInType = shape({
  id: id().isRequired(),
});

const productGetDtoInType = shape({
  id: id().isRequired(),
});

const productLoadDtoInType = shape({
  id: id().isRequired(),
});

const productUpdateDtoInType = shape({
  id: id().isRequired(),
  price: number(),
  name: string(255),
  text: string(4000),
  sys: shape(
    {
      rev: integer().isRequired(),
    },
    true
  ).isRequired(),
});

const productListDtoInType = shape({
  sortBy: oneOf(["name", "price"]),
  order: oneOf(["asc", "desc"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

const productSetStateDtoInType = shape({
  id: id().isRequired(),
  state: oneOf(["active", "passive", "closed"]).isRequired(),
  sys: shape(
    {
      rev: integer().isRequired(),
    },
    true
  ).isRequired(),
});
