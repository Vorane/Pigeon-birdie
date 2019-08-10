import * as actionTypes from "./actionTypes"
import * as sharedServices from "../Shared/services"




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