//@@viewOn:imports
import Core from "tga_shop_core";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useState } from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";
import P4C from "uu_plus4u5g01-context";

import Config from "./config/config";
import Left from "./left";
import Bottom from "./bottom";
import Home from "../routes/home";
import Products from "../routes/products";
import Cart from "../routes/cart";
import UserOrders from "../routes/user-orders";
import AdminOrders from "../routes/admin-orders";
import Buy from "../routes/buy";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "SpaAuthenticated",
  //@@viewOff:statics
};

const ProductDetail = UU5.Common.Component.lazy(() => import("../routes/product-detail"));
const About = UU5.Common.Component.lazy(() => import("../routes/about"));
const InitAppWorkspace = UU5.Common.Component.lazy(() => import("../routes/init-app-workspace"));
const ControlPanel = UU5.Common.Component.lazy(() => import("../routes/control-panel"));

const DEFAULT_USE_CASE = "home";
const ROUTES = {
  "": DEFAULT_USE_CASE,
  home: { component: <Home /> },
  about: { component: <About /> },
  "sys/uuAppWorkspace/initUve": { component: <InitAppWorkspace /> },
  controlPanel: { component: <ControlPanel /> },
  products: { component: <Products /> },
  "product/detail": { component: <ProductDetail /> },
  listForUser: { component: <UserOrders /> },
  listForAdmin: { component: <AdminOrders /> },
  buy: { component: <Buy /> },
  cart: { component: <Cart /> },
};

export const SpaReady = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    let [initialActiveItemId] = useState(() => {
      let url = UU5.Common.Url.parse(window.location.href);
      return url.useCase || DEFAULT_USE_CASE;
    });

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <P4C.SubAppProvider baseUri={UU5.Environment.appBaseUri}>
        <Plus4U5.App.MenuProvider activeItemId={initialActiveItemId}>
          <Plus4U5.App.Page
            {...props}
            top={
              <Plus4U5.App.TopBt>
                Best shop in the uuWorld
                <Core.Order.CartIcon onClick={() => UU5.Environment.getRouter().setRoute("cart")} />
              </Plus4U5.App.TopBt>
            }
            topFixed="smart"
            bottom={<Bottom />}
            type={3}
            displayedLanguages={["cs", "en"]}
            left={<Left />}
            leftWidth="!xs-300px !s-300px !m-288px !l-288px !xl-288px"
            leftFixed
            leftRelative="m l xl"
            leftResizable="m l xl"
            leftResizableMinWidth={220}
            leftResizableMaxWidth={500}
            isLeftOpen="m l xl"
            showLeftToggleButton
            fullPage
          >
            <Plus4U5.App.MenuConsumer>
              {({ setActiveItemId }) => {
                let handleRouteChanged = ({ useCase, parameters }) => setActiveItemId(useCase || DEFAULT_USE_CASE);
                return <UU5.Common.Router routes={ROUTES} controlled={false} onRouteChanged={handleRouteChanged} />;
              }}
            </Plus4U5.App.MenuConsumer>
          </Plus4U5.App.Page>
        </Plus4U5.App.MenuProvider>
      </P4C.SubAppProvider>
    );
    //@@viewOff:render
  },
});

export default SpaReady;
