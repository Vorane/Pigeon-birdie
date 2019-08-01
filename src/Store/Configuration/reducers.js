import {
  base,
  colorOptions,
  secondaryColorOptions,
  darkTheme,
  lightTheme
} from "./theme";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const initialState = {
  // theme: { ...base, ...colorOptions.orange, ...darkTheme },
  theme: {
    ...base,
    ...colorOptions.red,
    ...secondaryColorOptions.gray,
    ...lightTheme
  }
};

const configurationPersistConfig = {
  key: "configuration",
  storage,
  blacklist: ["theme"]
};

const configurationReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default persistReducer(configurationPersistConfig, configurationReducer);
