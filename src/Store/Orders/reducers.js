import * as actionTypes from "./actionTypes";
import * as processTypes from "../Shared/processTypes";
import CreateSensitiveStorage from "redux-persist-sensitive-storage";
import { persistReducer } from "redux-persist";

const initialState = {
  _fetchOrdersProcess: { status: processTypes.IDLE },
  orders: {
    currentPage: 0,
    completed: false,
    orders:[]
  },

  _fetchOrderDetailsProcess:{status: processTypes.IDLE},
  orderDetails:{},
  
  _updateOrderStatusProcess: {status: processTypes.IDLE},
  _addOrderItemProcess: { status: processTypes.IDLE },
  _removeOrderItemProcess: { status: processTypes.IDLE },
};

const storage = CreateSensitiveStorage({
  keychainService: "ordersKeychain",
  sharedPreferencesName: "ordersSharedPrefs"
});

const ordersPersistConfig = {
  key: "orders",
  storage,
  blacklist: ["_fetchOrdersProcess","_fetchOrderDetailsProcess", "orders","orderDetails","_updateOrderStatusProcess", "_addOrderItemProcess", "_removeOrderItemProcess"]
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

    case actionTypes.UPDATE_ORDER_STATUS_REQUESTED:
      return{
        ...state,
        _updateOrderStatusProcess:{status: processTypes.PROCESSING}
      }

    case actionTypes.UPDATE_ORDER_STATUS_SUCCEEDED:
      return{
        ...state,
        _updateOrderStatusProcess:{status: processTypes.SUCCESS},
        orderDetails:action.payload.orderDetails,
        orders: action.payload.orders
      }

    case actionTypes.UPDATE_ORDER_STATUS_FAILED:
      return{
        ...state,
        _updateOrderStatusProcess:{status: processTypes.ERROR, error: action.payload.error}
      }

    case actionTypes.UPDATE_ORDER_STATUS_RESET:
      return{
        ...state,
        _updateOrderStatusProcess:{status: processTypes.IDLE}
      }

    //Add Order Item
    case  actionTypes.ADD_ORDER_ITEM_REQUESTED:
      return{
          ...state,
          _addOrderItemProcess: { status: processTypes.PROCESSING },
          
      }
        
    case actionTypes.ADD_ORDER_ITEM_SUCCEEDED:
        return{
            ...state,
            _addOrderItemProcess: { status: processTypes.SUCCESS},            
        }
        
    case actionTypes.ADD_ORDER_ITEM_FAILED:
        return{
            ...state,
            _addOrderItemProcess: { status: processTypes.ERROR, error: action.payload.error},
        }
    
    case actionTypes.ADD_ORDER_ITEM_RESET:{
        return{
            ...state,
            _addOrderItemProcess: {status: processTypes.IDLE}
        }
    }
    //Remove Order Item
    case  actionTypes.REMOVE_ORDER_ITEM_REQUESTED:
      return{
          ...state,
          _removeOrderItemProcess: { status: processTypes.PROCESSING },
          
      }
        
    case actionTypes.REMOVE_ORDER_ITEM_SUCCEEDED:
        return{
            ...state,
            _removeOrderItemProcess: { status: processTypes.SUCCESS},            
        }
        
    case actionTypes.REMOVE_ORDER_ITEM_FAILED:
        return{
            ...state,
            _removeOrderItemProcess: { status: processTypes.ERROR, error: action.payload.error},
        }
    
    case actionTypes.REMOVE_ORDER_ITEM_RESET:{
        return{
            ...state,
            _removeOrderItemProcess: {status: processTypes.IDLE}
        }
    }


    default:
      return state;
  }
};

export default persistReducer(ordersPersistConfig, ordersReducer);
