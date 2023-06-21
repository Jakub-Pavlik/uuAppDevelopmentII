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
  displayName: Config.TAG + "AdminOrders",
  //@@viewOff:statics
};

export const AdminOrders = createVisualComponent({
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
      <UU5.Bricks.Container>
        <Core.Order.AdminUserListProvider>
          {(adminProvidedData) => {
            return (
              <>
                <Core.Order.FindUserOrders onClick={adminProvidedData.handlerMap.getUserOrders} />
                <Core.Common.DataStateResolver data={adminProvidedData}>
                  <Core.Order.OrderList showActions={false} orders={adminProvidedData.data} />
                </Core.Common.DataStateResolver>
              </>
            );
          }}
        </Core.Order.AdminUserListProvider>
      </UU5.Bricks.Container>
    );

    //@@viewOff:render
  },
});

export default AdminOrders;
