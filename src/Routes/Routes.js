import React from "react"
import { createAppContainer, createStackNavigator, createDrawerNavigator} from "react-navigation"

import Drawer from "../Pages/Drawer/Drawer"
import Home from "../Pages/Home/Home"

const OrdersRoute = createAppContainer(
    createStackNavigator({Home},{defaultNavigationOptions: {
        headerMode: "none"
      },
      headerMode: "none"})
)
const HomeRoute = createAppContainer(
    createStackNavigator({
        Home
    },{ defaultNavigationOptions: {
        headerMode: "none"
      },
      headerMode: "none"})
)

export const DrawerNavigation = createAppContainer(
    createDrawerNavigator({
        PendingOrders:{
            screen:({navigation})=>(<OrdersRoute screenProps={{drawerNavigation: navigation}} />)
        },
        Home:{
            screen:({navigation})=>(<HomeRoute  screenProps={{drawerNavigation: navigation}} /> )
        }
    },{
      contentComponent: Drawer
    })
)

