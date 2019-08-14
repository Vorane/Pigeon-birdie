import * as actionTypes from "./actionTypes";
import * as processTypes from "../Shared/processTypes";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"

const initialState = {
  _updateInventoryPriceProcess: { status: processTypes.IDLE },


  //process indicator when searching for a product
  _searchOutletProductsProcess: { status: processTypes.IDLE },
  outletProductsSearchResults: [],
  
}

const productsPersistConfig = {
    key: "products",
    storage,
    blacklist: ["_updateInventoryPriceProcess"]
}

const productsReducer = (state= initialState, action= {}) =>{
    switch(action.type){
        case  actionTypes.UPDATE_INVENTORY_PRICE_REQUESTED:
            return{
                ...state,
                _updateInventoryPriceProcess: { status: processTypes.PROCESSING },
                
            }
            
        case actionTypes.UPDATE_INVENTORY_PRICE_SUCCEEDED:
            return{
                ...state,
                _updateInventoryPriceProcess: { status: processTypes.SUCCESS},
                
            }
            
        case actionTypes.UPDATE_INVENTORY_PRICE_FAILED:
            return{
                ...state,
                _updateInventoryPriceProcess: { status: processTypes.ERROR, error: action.payload.error},
            }
        
        case actionTypes.UPDATE_INVENTORY_PRICE_RESET:{
            return{
                ...state,
                _updateInventoryPriceProcess: {status: processTypes.IDLE}
            }
        }


        //Search products
         case  actionTypes.SEARCH_OUTLET_PRODUCTS_REQUESTED:
            return{
                ...state,
                _searchOutletProductsProcess: { status: processTypes.PROCESSING },
                
            }
            
        case actionTypes.SEARCH_OUTLET_PRODUCTS_SUCCEEDED:
            return{
                ...state,
                _searchOutletProductsProcess: { status: processTypes.SUCCESS},
                outletProductsSearchResults: action.payload.results
            }
            
        case actionTypes.SEARCH_OUTLET_PRODUCTS_FAILED:
            return{
                ...state,
                _searchOutletProductsProcess: { status: processTypes.ERROR, error: action.payload.error},
            }
        
        case actionTypes.SEARCH_OUTLET_PRODUCTS_RESET:{
            return{
                ...state,
                _searchOutletProductsProcess: {status: processTypes.IDLE}
            }
        }

        default:
            return state
    }
}

export default persistReducer(productsPersistConfig, productsReducer)