import React from "react";
import { Provider } from "react-redux";
import { SafeAreaView, View, Text } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import { DrawerNavigation} from "./Routes/Routes"

import store, { persistor } from "./Store/configureStore";
// import Routes from "./Pages/Routes/Routes";

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
        <DrawerNavigation />
      </SafeAreaView>
    </PersistGate>
  </Provider>
);

export default App;
