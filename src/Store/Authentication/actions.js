import * as actionTypes from "./actionTypes";
import * as sharedServices from "../Shared/services";
import { objectToCamelCase, objectToPlainLowercase } from "../../../lib/utils";

export const login = credentials => {
  return dispatch => {
    dispatch({
      type: actionTypes.LOG_IN_REQUESTED,
      payload: { user: credentials.userName }
    });

    const remoteLogin = credentials => {
      let url = sharedServices.API_ENDPOINT.concat(`api-token-auth/ `);
      let request = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objectToPlainLowercase(credentials))
      };

      return fetch(url, request)
        .then(response => {
          return response;
        })
        .catch(error => {
          throw error;
        });
    };

    // const cleanCredentials = credentials => {
    //   let usernameOrEmailOrPhone = credentials.usernameOrEmailOrPhone;
    //   //determine whether username is phone or id//
    //   //use regex for any kenyan phone phone_number
    //   let phoneRegex = /(([+]{1}254|254)|0)\d{9}/;
    //   if (phoneRegex.test(usernameOrEmailOrPhone)) {
    //     //test phone number for 07......
    //     let zeroSevenRegex = /0\d{9}/;
    //     if (zeroSevenRegex.test(usernameOrEmailOrPhone)) {
    //       //replace 0 with +254
    //       usernameOrEmailOrPhone =
    //         usernameOrEmailOrPhone.substr(0, 0) +
    //         "+254" +
    //         usernameOrEmailOrPhone.substr(0 + 1);
    //     }

    //     //test phone number for 25477....
    //     let twoFiveFourRegex = /([+]{1}254)\d{9}/;
    //     if (!twoFiveFourRegex.test(usernameOrEmailOrPhone)) {
    //       //add + to the beginning
    //       usernameOrEmailOrPhone = `+${usernameOrEmailOrPhone}`;
    //     }
    //   }

    //   return {
    //     ...credentials,
    //     usernameOrEmailOrPhone
    //   };
    // };
    remoteLogin(credentials)
      .then(response => {
        if (response.status === 200) {
          return response.json().then(response => {
            dispatch({
              type: actionTypes.LOG_IN_SUCCEEDED,
              payload: {
                token: response.token,
                userName: credentials.userName,
                credentials: credentials
              }
            });
          });
        }
        if (response.status === 400) {
          response.json().then(response => {
            return dispatch({
              type: actionTypes.LOG_IN_FAILED,
              payload: { error: "incorrect username or password" }
            });
          });
        } else {
          dispatch({
            type: actionTypes.LOG_IN_FAILED,
            payload: {
              error: "unable to Login",
              userName: credentials.userName
            }
          });
        }
      })
      .catch(error => {
        dispatch({
          type: actionTypes.LOG_IN_FAILED,
          payload: {
            error: "unable to Login",
            userName: credentials.userName
          }
        });
      });
  };
};

export const backgroundLogin = () => {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.BACKGROUND_LOG_IN_REQUESTED
    });

    const remoteLogin = credentials => {
      let url = sharedServices.API_ENDPOINT.concat(`api-token-auth/ `);
      let request = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objectToPlainLowercase(credentials))
      };

      return fetch(url, request)
        .then(response => {
          return response;
        })
        .catch(error => {
          throw error;
        });
    };

    return remoteLogin(getState().auth.credentials)
      .then(response => {
        if (response.status === 200) {
          return response.json().then(response => {
            return Promise.resolve(
              dispatch({
                type: actionTypes.BACKGROUND_LOG_IN_SUCCEEDED,
                payload: {
                  token: response.token,
                  userName: getState().auth.credentials.userName
                }
              })
            ).then(() => {
              return true;
            });
          });
        }
        if (response.status === 400) {
          return response.json().then(response => {
            dispatch({
              type: actionTypes.BACKGROUND_LOG_IN_FAILED,
              payload: { error: "Unable to log in" }
            });

            return false;
          });
        } else {
          dispatch({
            type: actionTypes.LOG_IN_FAILED,
            payload: {
              error: "unable to Login",
              userName: credentials.userName
            }
          });
          return true;
        }
      })
      .catch(error => {
        dispatch({
          type: actionTypes.LOG_IN_FAILED,
          payload: {
            error: "unable to Login",
            userName: credentials.userName
          }
        });
        return false;
      });
  };
};
