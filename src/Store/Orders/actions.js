import * as actionTypes from "./actionTypes";
import * as sharedServices from "../Shared/services";
import { isNull, objectToCamelCase, isUndefined } from "../../lib/utils";
import moment from "moment";
import { getOrders } from "./selectors"


export const fetchOrders = (startDate, endDate, page = 1, status = []) => {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.FETCH_ORDERS_REQUESTED
    });

    //function to fetch from the api
    const remoteFetchOrders = (startDate, endDate, status=[], page = 1, token = null) => {
      const url = sharedServices.API_ENDPOINT.concat(
        `api/orders/staff/?start_time=${startDate}&end_time=${endDate}&page=${page}&order_status=${status.map(status =>`${status},`)}`
      );
      let request = {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      };

      return fetch(url, request)
        .then(response => {
          return response;
        })
        .catch(error => {
          throw error;
        });
    };

    remoteFetchOrders(startDate, endDate, status, page)
      .then(response => {
        if (response.status === 200) {
          //update Todays list of orders
          response.json().then(orders => {
            dispatch({
              type: actionTypes.FETCH_ORDERS_SUCCEEDED,
              payload: {
                orders: objectToCamelCase(orders.results),
                completed: isNull(orders.next),
                currentPage: page
              }
            });
          });
        }

        //TODO handle authentication
        // if (response.status === 403) {
        //   //not authenticated, invoke the background log in and retry
        //   Promise.resolve(dispatch(backgroundLogin())).then(response => {
        //     response
        //       ? dispatch(fetchTodaysOrders())
        //       : dispatch({
        //           type: actionTypes.FETCH_TODAYS_ORDERS_FAILED,
        //           payload: {
        //             error:
        //               "Unable to fetch authenticate when fetching todays orders"
        //           }
        //         });
        //   });
        // }
      })
      .catch(error => {
        dispatch({
          type: actionTypes.FETCH_ORDERS_FAILED,
          payload: { error }
        });
      });
  };
};

export const fetchTodaysOrders = (status=[]) => {
  return (dispatch, getState) => {
    let startDate = moment()
                      .set('hour', 0)
                      .set('minute', 0)
                      .set('second', 0)
                      .utc();
                      
    var endDate = moment()
                    .add(1, "days")
                    .set('hour', 0)
                    .set('minute', 0)
                    .set('second', 0)
                    .utc();

    dispatch(
      fetchOrders(
        startDate.utc().toISOString(),
        endDate.utc().toISOString(),
        1,
        status,
      )
    );
  };
};
export const fetchTodaysEarlierOrders = (status=[]) => {
  return (dispatch, getState) => {
    let startDate = moment().subtract(1, "days");

    var endDate = new moment().add(1, "days");

    dispatch(
      fetchOrders(
        startDate.utc().toISOString(),
        endDate.utc().toISOString(),
        getState().orders.orders.currentPage + 1,
        status
      )
    );
  };
};


export const fetchOrderDetails = (id) =>{
  return (dispatch,getState)=>{
    dispatch({
      type: actionTypes.FETCH_ORDER_DETAILS_REQUESTED,
      payload:{id}
    })


     //function to fetch from the api
    const remoteFetchDetails = (orderId, token = null) => {
      const url = sharedServices.API_ENDPOINT.concat(
        `api/orders/${orderId}`
      );
      let request = {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      };

      return fetch(url, request)
        .then(response => {
          return response;
        })
        .catch(error => {
          throw error;
        });
    };


    remoteFetchDetails(id).then(response=>{
      if(response.status === 200){
        response.json().then(orderDetails =>{
          dispatch({
            type: actionTypes.FETCH_ORDER_DETAILS_SUCCEEDED,
            payload:{orderDetails: objectToCamelCase(orderDetails)}
          })
        })
      }
    }).catch(error=>{
      dispatch({
        type: actionTypes.FETCH_ORDER_DETAILS_FAILED,
        payload:{error}
      })
    })


  }
}



//#region Update an order

export const updateOrderStatus = (order, newOrderStatus )=>{
  return (dispatch, getState)=>{
    dispatch({
      type: actionTypes.UPDATE_ORDER_STATUS_REQUESTED,
      payload: {order, newOrderStatus}
    })


    const remoteUpdateStatus = (orderId, newStatus)=>{
      const url = sharedServices.API_ENDPOINT.concat(
        `api/orders/update-order-status/`
      );
      let request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          order_id: orderId,
          order_status: newStatus
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


    remoteUpdateStatus(order.id, newOrderStatus).then(response=>{
      if(response.status === 200){
        //update the list of orders to reflect the change
        let orders = {...getOrders(getState())}
        let foundOrder  = orders.orders.findIndex(item => item.id ===order.id)
        if(foundOrder > -1){
          orders.orders[foundOrder] = {...orders.orders[foundOrder], orderStatus: newOrderStatus}        
        }
        dispatch({
          type: actionTypes.UPDATE_ORDER_STATUS_SUCCEEDED, 
          payload:{
            orderDetails: {...order, orderStatus: newOrderStatus}, 
            orders
          }         
        })

      }
      else{
        dispatch({
          type: actionTypes.UPDATE_ORDER_STATUS_FAILED,
          payload:{error: "unable to update order status. Please try again"}
        })
      }
    }).catch(error=>{
      dispatch({
          type: actionTypes.UPDATE_ORDER_STATUS_FAILED,
          payload:{error: "unable to update order status. Please try again"}
        })
    })

  }
}
export const resetUpdateOrderStatus = ()=>{
  return dispatch=>(dispatch({type: actionTypes.UPDATE_ORDER_STATUS_RESET}))
}

export const addOrderItem = (order, newOrderItem) =>{
  return (dispatch,getState) =>{
    dispatch({
      type: actionTypes.ADD_ORDER_ITEM_REQUESTED,
      payload: {order, newOrderItem}
    })

    const remoteAddOrderItem = (orderId, quantity, isAdded, productId) =>{
      const url = sharedServices.API_ENDPOINT.concat(
        `api/orders/add-item/`
      );
      let request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          order_id: orderId,
          quantity: quantity,
          is_added: isAdded,
          product_id: productId
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


    return remoteAddOrderItem(order.id , newOrderItem.quantity, newOrderItem.isAdded, newOrderItem.product.id)
      .then(response=>{
        if(response.status === 201){
          //TODO update local order details
          dispatch({
            type: actionTypes.ADD_ORDER_ITEM_SUCCEEDED
          })
        }else{
          dispatch({
            type: actionTypes.ADD_ORDER_ITEM_FAILED,
            payload: {error: "unable to add the product to the order"}
          })
          
        }
      })
      .catch(error =>{
          dispatch({
            type: actionTypes.ADD_ORDER_ITEM_FAILED,
            payload: {error}
          })
      })

  }
}

export const resetAddOrderItem = ()=>{
  return(dispatch)=>{
    dispatch({
      type: actionTypes.ADD_ORDER_ITEM_RESET
    })
  }
}

export const removeOrderItem = (order, orderItem) =>{
  return (dispatch,getState) =>{
    dispatch({
      type: actionTypes.REMOVE_ORDER_ITEM_REQUESTED,
      payload: {order, orderItem}
    })

    const remoteAddOrderItem = (orderItemId) =>{
      const url = sharedServices.API_ENDPOINT.concat(
        `api/orders/order-item/${orderItemId}/remove/`
      );
      let request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },       
      };

      return fetch(url, request)
        .then(response => {
          return response;
        })
        .catch(error => {
          throw error;
        });
    }


    return remoteAddOrderItem(orderItem.id)
      .then(response=>{
        if(response.status === 201){
          //TODO update local order details
          dispatch({
            type: actionTypes.REMOVE_ORDER_ITEM_SUCCEEDED
          })
        }else{
          dispatch({
            type: actionTypes.REMOVE_ORDER_ITEM_FAILED,
            payload: {error: "unable to add the product to the order"}
          })
          
        }
      })
      .catch(error =>{
          dispatch({
            type: actionTypes.REMOVE_ORDER_ITEM_FAILED,
            payload: {error}
          })
      })

  }
}

export const resetRemoveOrderItem = ()=>{
  return(dispatch)=>{
    dispatch({
      type: actionTypes.REMOVE_ORDER_ITEM_RESET
    })
  }
}

export const substituteOrderItems = (order, newOrderItem, oldOrderItem) =>{
  return(dispatch) =>{
    dispatch({
      type: actionTypes.SUBSTITUTE_ORDER_ITEM_REQUESTED,
      payload:{ order, oldOrderItem , newOrderItem}
    })

    dispatch(addOrderItem(order, newOrderItem)).then(result =>{
      dispatch(removeOrderItem(order,oldOrderItem))
    })
  }
}
export const resetSubstituteOrderItem = ()=>{
  return(dispatch)=>{
    dispatch({
      type: actionTypes.SUBSTITUTE_ORDER_ITEM_RESET
    })

    dispatch(resetAddOrderItem())
    dispatch(resetRemoveOrderItem())
  }
}



//#endregion