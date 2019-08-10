import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

//import all reducers
import configurationReducer from "./Configuration/reducers";
import authReducer from "./Authentication/reducers";
import ordersReducer from "./Orders/reducers";
import productsReducer from "./Products/reducers";

const persistConfig = {
  key: "root",
  blacklist: ["auth", "configuration", "orders", "products"],
  storage
};

const rootReducer = persistReducer(
  persistConfig,
  combineReducers({
    configuration: configurationReducer,
    auth: authReducer,
    orders: ordersReducer,
    products: productsReducer
  })
);

export default rootReducer;
