//@@viewOn:imports
import Core from "tga_shop_core";
import "uu5g04-bricks";
import { createVisualComponent } from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";
import UU5 from "uu5g04";

import Config from "./config/config.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Products",
  //@@viewOff:statics
};

export const Products = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    function handleDetail(data) {
      UU5.Environment.setRoute("product/detail", {
        id: data.id,
      });
    }
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return <Core.Products.List onDetail={handleDetail} />;
    //@@viewOff:render
  },
});

export default Products;
