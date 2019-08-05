import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components";

//import local components
import ProductItem from "./ProductItem";

const Wrapper = styled.FlatList`
  
  margin-vertical: 5;
  margin-horizontal: 5;
`;

const ProductList = ({ products, orderPressHandler }) => {
  const renderItem = ({ item: product }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          orderPressHandler(product);
        }}
      >
        <ProductItem order={product} />
      </TouchableOpacity>
    );
  };
  return (
    <Wrapper
      data={products}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default ProductList;
