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
    const remoteFetchOrders = (startDate, endDate, page = 1, token = null) => {
      const url = sharedServices.API_ENDPOINT.concat(
        `api/orders/staff/?start_time=${startDate}&end_time=${endDate}&page=${page}`
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

    remoteFetchOrders(startDate, endDate, page)
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

export const fetchTodaysOrders = () => {
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
        1
      )
    );
  };
};
export const fetchTodaysEarlierOrders = () => {
  return (dispatch, getState) => {
    let startDate = moment().subtract(1, "days");

    var endDate = new moment().add(1, "days");

    dispatch(
      fetchOrders(
        startDate.utc().toISOString(),
        endDate.utc().toISOString(),
        getState().orders.orders.currentPage + 1
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