import * as processTypes from "../Shared/processTypes";
import { isEmpty } from "../../lib/utils";

export const getOrders = ({ orders }) => {
  if (isEmpty(orders.orders)) {
    return orders.orders;
  } else {
    //sort orders by pickupt time
    let sortedOrders = orders.orders.orders.sort((a, b) => {
      return new Date(a.pickupTime) - new Date(b.pickupTime);
    });
    return { ...orders.orders, orders: sortedOrders };
  }
};
export const getFetchOrdersProcess = ({ orders }) => orders._fetchOrdersProcess;

export const getFetchOrderDetailsProcess = ({ orders }) =>
  orders._fetchOrderDetailsProcess;
export const getOrderDetails = ({ orders }) => {
  if (isEmpty(orders.orderDetails)) {
    return orders.orderDetails;
  }
  {
    let validOrderItems = orders.orderDetails.orderOrderItem.filter(
      (orderItem, index) => orderItem.isRemoved === false
    );
    return {
      ...orders.orderDetails,
      orderOrderItem: validOrderItems
    };
  }
};

export const getUpdateOrderStatusProcess = ({ orders }) =>
  orders._updateOrderStatusProcess;

export const getAddOrderItemProcess = ({ orders }) =>
  orders._addOrderItemProcess;
export const getRemoveOrderItemProcess = ({ orders }) =>
  orders._removeOrderItemProcess;
export const getSubstituteOrderItemProcess = ({ orders }) => {
  if (orders._addOrderItemProcess.status === orders._removeOrderItemProcess) {
    return orders._addOrderItemProcess;
  } else if (orders._addOrderItemProcess.status === processTypes.ERROR) {
    return orders._addOrderItemProcess;
  } else if (orders._removeOrderItemProcess.status === processTypes.ERROR) {
    return orders._removeOrderItemProcess;
  } else if (orders._addOrderItemProcess.status === processTypes.PROCESSING) {
    return orders._addOrderItemProcess;
  } else if (
    orders._removeOrderItemProcess.status === processTypes.PROCESSING
  ) {
    return orders._addOrderItemProcess;
  } else {
    return orders._addOrderItemProcess;
  }
};
