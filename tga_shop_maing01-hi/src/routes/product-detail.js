//@@viewOn:imports
import Core from "tga_shop_core";
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "./config/config";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ProductDetail",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const ProductDetail = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ params = {} }) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return <Core.Products.Detail productId={params.id} />;
    //@@viewOff:render
  },
});

export default ProductDetail;
