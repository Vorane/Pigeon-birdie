import React, { Component } from "react";
import firebase from "react-native-firebase";
import { Clipboard, AsyncStorage } from "react-native";
import { DrawerNavigation } from "./Routes/Routes";

class BirdieApp extends Component {
  async componentDidMount() {
    this.checkPermission();

    this.messageListener = firebase.messaging().onMessage(message => {
      // Process your message as required
      alert(JSON.stringify(message));
    });
    this.removeNotificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification => {
        alert(JSON.stringify(Object.keys(notification)));
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      });
    this.removeNotificationListener = firebase
      .notifications()
      .onNotification(notification => {
        var seen = [];

        Clipboard.setString(
          JSON.stringify(notification, function(key, val) {
            if (val != null && typeof val == "object") {
              if (seen.indexOf(val) >= 0) {
                return;
              }
              seen.push(val);
            }
            return val;
          })
        );
        // alert(JSON.stringify(notification));
        // Process your notification as required
      });
  }
  componentWillUnmount() {
    this.messageListener();
    this.removeNotificationDisplayedListener();
    this.removeNotificationListener();
  }

  //1
  async checkPermission() {
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          this.getToken();
        } else {
          this.requestPermission();
        }
      });
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    Clipboard.setString(fcmToken);
    // Clipboard.setString(JSON.stringify(firebase.iid.get()));
    firebase
      .iid()
      .get()
      .then(string => {});
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
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
      .catch(error => {});
  }
  render() {
    return <DrawerNavigation {...this.props} />;
  }
}

export default BirdieApp;
