import * as actionTypes from "./actionTypes";
import * as processTypes from "../Shared/processTypes";
import CreateSensitiveStorage from "redux-persist-sensitive-storage";
import { persistReducer } from "redux-persist";

const initialState = {
  credentials: {},
  userDetails: {},

  _backgroundLoginProcess: { status: processTypes.IDLE },
  _loginProcess: { status: processTypes.IDLE },
  auth: {
    isUserAuthenticated: false,
    token: {}
  }
};

const storage = CreateSensitiveStorage({
  keychainService: "authKeychain",
  sharedPreferencesName: "authSharedPrefs"
});

const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["_loginProcess", "_backgroundLoginProcess"]
};

const authReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.LOG_IN_REQUESTED:
      return {
        ...state,
        _loginProcess: { status: processTypes.PROCESSING }
      };

    case actionTypes.LOG_IN_SUCCEEDED:
      return {
        ...state,
        _loginProcess: { status: processTypes.SUCCESS },
        auth: { isUserAuthenticated: true, token: action.payload.token },
        credentials: action.payload.credentials
      };

    case actionTypes.LOG_IN_FAILED:
      return {
        ...state,
        _loginProcess: {
          status: processTypes.ERROR,
          error: action.payload.error
        }
      };
    case actionTypes.BACKGROUND_LOG_IN_REQUESTED:
      return {
        ...state,
        _backgroundLoginProcess: { status: processTypes.PROCESSING }
      };
    case actionTypes.BACKGROUND_LOG_IN_SUCCEEDED:
      return {
        ...state,
        _backgroundLoginProcess: { status: processTypes.SUCCESS },
        auth: { isUserAuthenticated: true, token: action.payload.token }
      };
    case actionTypes.BACKGROUND_LOG_IN_FAILED:
      return {
        ...state,
        _backgroundLoginProcess: {
          status: processTypes.ERROR,
          error: action.payload.error
        }
      };
    default:
      return state;
  }
};

export default persistReducer(authPersistConfig, authReducer);
