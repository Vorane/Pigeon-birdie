/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component, Fragment } from "react";
import firebase from "react-native-firebase";
import { Clipboard, AsyncStorage} from "react-native"

import Birdie from "./src";

class App extends Component {
  async componentDidMount() {
    this.checkPermission();
  }

  //1
  async checkPermission() {
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          console.warn("Permission granted");
          this.getToken();
        } else {
          console.warn("Request Permission");
          this.requestPermission();
        }
      });
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    Clipboard.setString(fcmToken);
    console.warn("before fcmToken: ", fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        console.warn("after fcmToken: ", fcmToken);
        await AsyncStorage.setItem("fcmToken", fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        this.getToken();
      })
      .catch(error => {
        console.warn("permission rejected");
      });
  }

  render() {
    return (
      <Fragment>
        <Birdie />
      </Fragment>
    );
  }
}

export default App;
