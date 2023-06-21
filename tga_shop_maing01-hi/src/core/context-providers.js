//@@viewOn:imports
import Core from "tga_shop_core";
import UU5 from "uu5g04";
import { createComponent } from "uu5g04-hooks";
import Config from "./config/config";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ContextProviders",
  //@@viewOff:statics
};

export const ContextProviders = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <Core.Context.Home.Provider value={true}>
        <Core.Common.AppLoader>
          <Core.Order.OrderProvider>{props.children}</Core.Order.OrderProvider>
        </Core.Common.AppLoader>
      </Core.Context.Home.Provider>
    );
    //@@viewOff:render
  },
});

export default ContextProviders;
