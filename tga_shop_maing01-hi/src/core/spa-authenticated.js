//@@viewOn:imports
import "uu5g04-bricks";
import { createVisualComponent } from "uu5g04-hooks";
import "uu_plus4u5g01-app";

import Config from "./config/config";
import ContextProviders from "./context-providers";
import StateResolvers from "./state-resolvers";
import SpaReady from "./spa-ready";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "SpaAuthenticated",
  //@@viewOff:statics
};

export const SpaAuthenticated = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface
    //@@viewOn:render
    return (
      <ContextProviders>
        <StateResolvers>
          <SpaReady {...props} />
        </StateResolvers>
      </ContextProviders>
    );
    //@@viewOff:render
  },
});

export default SpaAuthenticated;
