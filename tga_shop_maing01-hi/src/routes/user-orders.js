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
  displayName: Config.TAG + "UserOrders",
  //@@viewOff:statics
};

export const UserOrders = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <Core.Order.OrderUserListProvider>
        {(listDataValues) => {
          return (
            <Core.Common.DataStateResolver dataObject={listDataValues}>
              <Core.Order.OrderList orders={listDataValues.data} />
            </Core.Common.DataStateResolver>
          );
        }}
      </Core.Order.OrderUserListProvider>
    );

    //@@viewOff:render
  },
});

export default UserOrders;
