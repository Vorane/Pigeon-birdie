import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore } from "redux-persist";

import reducer from "./rootReducer";
const store = createStore(reducer, applyMiddleware(thunk));

export const persistor = persistStore(store);
export default store;
