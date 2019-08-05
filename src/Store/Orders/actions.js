import * as actionTypes from "./actionTypes";
import * as sharedServices from "../Shared/services";
import { isNull, objectToCamelCase } from "../../lib/utils";
import moment from "moment";

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
