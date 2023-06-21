//@@viewOn:imports
import Core from "tga_shop_core";
import UU5 from "uu5g04";
import { createComponent } from "uu5g04-hooks";
import Config from "./config/config";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "StateResolvers",
  //@@viewOff:statics
};

export const StateResolvers = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const orderData = Core.Context.useOrderContext();
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    // any other state resolver to handle data loading
    return <Core.Common.DataStateResolver dataObject={orderData}>{props.children}</Core.Common.DataStateResolver>;
    //@@viewOff:render
  },
});

export default StateResolvers;
