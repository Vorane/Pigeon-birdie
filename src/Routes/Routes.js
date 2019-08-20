import React from "react";
import {
  createAppContainer,
  createStackNavigator,
  createDrawerNavigator
} from "react-navigation";

//import store actions and selectors
import * as orderStatus from "../Store/Orders/orderStatus";

import Drawer from "../Pages/Drawer/Drawer";
import Home from "../Pages/Home/Home";
import Orders from "../Pages/Orders/Orders";
import OrderDetailsPage from "../Pages/Orders/OrderDetail";
import ProductDetailPage from "../Pages/Products/ProductDetails";

const OrdersRoute = createAppContainer(
  createStackNavigator(
    {
      Orders,
      OrderDetailsPage,
      ProductDetailPage
    },
    {
      defaultNavigationOptions: {
        headerMode: "none"
      },
      headerMode: "none"
    }
  )
);
const HomeRoute = createAppContainer(
  createStackNavigator(
    {
      Home
    },
    {
      defaultNavigationOptions: {
        headerMode: "none"
      },
      headerMode: "none"
    }
  )
);

export const DrawerNavigation = createAppContainer(
  createDrawerNavigator(
    {
      AllOrders: {
        screen: ({ navigation }) => (
          <OrdersRoute
            screenProps={{
              drawerNavigation: navigation,
              status: Object.keys(orderStatus).map(key => orderStatus[key]),
              title: "All orders"
            }}
          />
        )
      },
      PendingOrders: {
        screen: ({ navigation }) => (
          <OrdersRoute
            screenProps={{
              drawerNavigation: navigation,
              status: [
                orderStatus.CREATED,
                orderStatus.IN_PROCESSING,
                orderStatus.RECEIVED_BY_STORE,
                orderStatus.IN_CHECKOUT,
                orderStatus.READY_FOR_PROCESSING
              ],
              title: "Pending orders"
            }}
          />
        )
      },
      Deliveries: {
        screen: ({ navigation }) => (
          <OrdersRoute
            screenProps={{
              drawerNavigation: navigation,
              title: "Deliveries",
              status: [
                orderStatus.READY_FOR_PICKUP,
                orderStatus.READY_FOR_DELIVERY,
                orderStatus.DELIVERY_IN_PROGRESS
              ]
            }}
          />
        )
      },
      Completed: {
        screen: ({ navigation }) => (
          <OrdersRoute
            screenProps={{
              drawerNavigation: navigation,
              title: "Completed orders",
              status: [orderStatus.DELIVERED, orderStatus.PICKED]
            }}
          />
        )
      },

      Attention: {
        screen: ({ navigation }) => (
          <OrdersRoute
            screenProps={{
              drawerNavigation: navigation,
              title: "Orders with issues",
              status: [
                orderStatus.AWAITING_FUNDS,
                orderStatus.AWAITING_SUBSTITUTION,
                orderStatus.CANCELLED_BY_USER,
                orderStatus.INSUFFICIENT_FUNDS_FAILURE,
                orderStatus.NOT_PICKED
              ]
            }}
          />
        )
      }
    },
    {
      contentComponent: Drawer
    }
  )
);
