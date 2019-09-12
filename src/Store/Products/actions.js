import * as actionTypes from "./actionTypes"
import * as sharedServices from "../Shared/services"

import { objectToCamelCase} from "../../lib/utils"


export const updateInventoryPrice =(outletInventory, newPrice)=>{
    return(dispatch, getState)=>{
        dispatch({
            type: actionTypes.UPDATE_INVENTORY_PRICE_REQUESTED,
            payload:{ outletInventory, newPrice}
        })


        const remoteUpdatePrice = ( inventory, newPrice) =>{
            const url = sharedServices.API_ENDPOINT.concat(
                `api/storelisting/outlet/${inventory.outlet}/inventory/${inventory.id}/update/`
            );
            let request = {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    id: inventory.id,
                    outlet: inventory.outlet,
                    quantity: inventory.quantity,
                    price: newPrice,
                })
            };

            return fetch(url, request)
                .then(response => {
                    return response;
                })
                .catch(error => {
                    throw error;
                });
        }


        remoteUpdatePrice(outletInventory, newPrice).then(response=>{
            if(response.status === 200){
                dispatch({
                    type: actionTypes.UPDATE_INVENTORY_PRICE_SUCCEEDED
                })
            }
            else{
                dispatch({
                    type: actionTypes.UPDATE_INVENTORY_PRICE_FAILED,
                    payload:{error:"unable to update the inventory price"}
                })
            }
        }).catch(error=>{
            
            dispatch({
                type: actionTypes.UPDATE_INVENTORY_PRICE_FAILED,
                payload:{error}
            })
        })

    }
}

export const _resetUpdateInventoryPrice= ()=>{
    return dispatch=>( dispatch({type:actionTypes.UPDATE_INVENTORY_PRICE_RESET}))
}



export const searchOutletProducts = (outletId, searchText) => {
  return dispatch => {
    dispatch({
      type: actionTypes.SEARCH_OUTLET_PRODUCTS_REQUESTED,
      payload: { outletId, searchText }
    });

    if (searchText === "") {
      return dispatch({
        type: actionTypes.SEARCH_OUTLET_PRODUCTS_SUCCEEDED,
        payload: { results: [] }
      });
    }

    const remoteSearchProduct = (outletId, searchText) => {
      const url = sharedServices.API_ENDPOINT.concat(
        `api/storelisting/outlet/${outletId}/products/?search=${searchText}`
      );
      let request = {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      };

      return fetch(url, request)
        .then(response => response)
        .catch(error => {
          dispatch({
            type: actionTypes.SEARCH_OUTLET_PRODUCTS_FAILED,
            payload: { error }
          });
        });
    };

    remoteSearchProduct(outletId, searchText)
      .then(response => {
        if (response.status === 200) {
          response.json().then(products => {
            dispatch({
              type: actionTypes.SEARCH_OUTLET_PRODUCTS_SUCCEEDED,
              payload: { results: objectToCamelCase(products).results }
            });
          });
        } else {
          
          dispatch({
            type: actionTypes.SEARCH_OUTLET_PRODUCTS_FAILED,
            payload: { error: "We encountered an error searching for the file" }
          });
        }
      })
      .catch(error => {
        dispatch({
          type: actionTypes.SEARCH_OUTLET_PRODUCTS_FAILED,
          payload: { error }
        });
      });
  };
};

export const resetSearchOutletProducts = ()=>{
  return(dispatch)=>{
    dispatch({
      type: actionTypes.SEARCH_OUTLET_PRODUCTS_RESET
    })
  }
}