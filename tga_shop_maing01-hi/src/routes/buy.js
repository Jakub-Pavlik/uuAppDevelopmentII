//@@viewOn:imports
import Core from "tga_shop_core";
import "uu5g04-bricks";
import { createVisualComponent, useRef } from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";
import UU5 from "uu5g04";
import Config from "./config/config.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Buy",
  //@@viewOff:statics
};

export const Buy = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render() {
    const alertBusRef = useRef();
    // const OrderContext = Core.Context.useOrderContext();

    //@@viewOn:private
    // async function toBeHandled() {
    //   await OrderContext.handlerMap.toBeHandled();
    // }
    function handleCancel() {
      UU5.Environment.setRoute("listForUser");
    }

    function handleDone(data) {
      console.log(data);
      alertBusRef.current.addAlert({
        content: "Order created",
        colorSchema: "success",
      });
      UU5.Environment.setRoute("home");
    }
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <UU5.Bricks.Container>
        <Core.Order.Form onCancel={handleCancel} onDone={handleDone} />
        <UU5.Bricks.AlertBus ref_={alertBusRef} />
      </UU5.Bricks.Container>
    );
    //@@viewOff:render
  },
});

export default Buy;
