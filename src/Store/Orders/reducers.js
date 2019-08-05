import * as actionTypes from "./actionTypes";
import * as processTypes from "../Shared/processTypes";
import CreateSensitiveStorage from "redux-persist-sensitive-storage";
import { persistReducer } from "redux-persist";

const initialState = {
  _fetchOrdersProcess: { status: processTypes.IDLE },
  orders: {
    currentPage: 0,
    completed: false,
    order:[]
  },

  _fetchOrderDetailsProcess:{status: processTypes.IDLE},
  orderDetails:{}
};

const storage = CreateSensitiveStorage({
  keychainService: "ordersKeychain",
  sharedPreferencesName: "ordersSharedPrefs"
});

const ordersPersistConfig = {
  key: "orders",
  storage,
  blacklist: ["_fetchOrdersProcess","_fetchOrderDetailsProcess", "orders","orderDetails"]
};

const ordersReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.FETCH_ORDERS_REQUESTED:
      return {
        ...state,
        _fetchOrdersProcess: { status: processTypes.PROCESSING }
      };
    case actionTypes.FETCH_ORDERS_SUCCEEDED:
      return {
        ...state,
        _fetchOrdersProcess: { status: processTypes.SUCCESS },
        orders: {
          orders: action.payload.orders,
          currentPage: action.payload.currentPage,
          completed: action.payload.completed
        }
      };

    case actionTypes.FETCH_ORDERS_FAILED:
      return {
        ...state,
        _fetchOrdersProcess: {
          status: processTypes.ERROR,
          error: action.payload.error
        }
      };

    case actionTypes.FETCH_ORDER_DETAILS_REQUESTED:
      return{
        ...state,
        _fetchOrderDetailsProcess:{status: processTypes.PROCESSING},
        orderDetails:{}
      }
    
    case actionTypes.FETCH_ORDER_DETAILS_SUCCEEDED:
      return{
        ...state,
        _fetchOrderDetailsProcess: {status: processTypes.SUCCESS},
        orderDetails:action.payload.orderDetails
      }

    case actionTypes.FETCH_ORDER_DETAILS_FAILED:
      return{
        ...state,
        _fetchOrderDetailsProcess:{status: processTypes.ERROR, error: action.payload.error}
      }

    default:
      return state;
  }
};

export default persistReducer(ordersPersistConfig, ordersReducer);
