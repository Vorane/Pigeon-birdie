import React from "react";
import { FlatList, View, Text } from "react-native";
import styled from "styled-components";

//import local components
import OrderItem from "../../Components/Orders/OrderItem";

const Wrapper = styled.FlatList`
  elevation: 1;
  margin-vertical: 5;
  margin-horizontal: 5;
`;

const Orders = ({ orders, orderItemPress }) => {
  const renderItem = ({ item: order }) => {
    return <OrderItem order={order} orderItemPress={orderItemPress} />;
  };
  return (
    <Wrapper
      data={orders}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default Orders;
