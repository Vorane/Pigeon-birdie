import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

//import all reducers
import configurationReducer from "./Configuration/reducers";
import authReducer from "./Authentication/reducers";

const persistConfig = {
  key: "root",
  blacklist: ["auth", "configuration"],
  storage
};

const rootReducer = persistReducer(
  persistConfig,
  combineReducers({
    configuration: configurationReducer,
    auth: authReducer
  })
);

export default rootReducer;
