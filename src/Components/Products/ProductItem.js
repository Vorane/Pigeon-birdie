import React, { Component } from "react";
import styled, { ThemeProvider } from "styled-components";
import { TouchableOpacity } from "react-native";

import FeatherIcon from "react-native-vector-icons/Feather";
import { colorOptions } from "../../Store/Configuration/theme";

const Row = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  padding-vertical: 10;
  padding-horizontal: 5;
  border-bottom-width: .2;
  border-bottom-color: #f0f0f0;
`;

const ProductImageContainer = styled.View`
  height: 60;
  width: 60;

  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-vertical: 5;
  padding-horizontal: 5;
  overflow: hidden;
`;

const ProductImage = styled.Image`
  height: 60;
  width: 60;
`;

const ProductDetailsSection = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;

  padding-right: 10;
  padding-left: 5;
`;

const ProductName = styled.Text`
  text-align: left;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY_THIN};
  font-size: ${props => props.theme.FONT_SIZE_MEDIUM};

  padding-vertical: 0;
  padding-left: 10;
`;
const ProductSize = styled.Text`
  text-align: left;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_MEDIUM};

  padding-vertical: 0;
  padding-left: 10;
`;

const ProductNameAndSizeSection = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding-right: 10;
`;

const OrderQuantity = styled.Text`
  text-align: right;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY_BOLD};
  font-size: ${props => props.theme.FONT_SIZE_EXTRA_LARGE};

  padding-vertical: 0;
`;

const CartList = ({ order }) => {
  return (
    <Row>
      <ProductImageContainer>
        <ProductImage
          resizeMode="contain"
          source={
            order.product.thumbnail
              ? { uri: order.product.thumbnail }
              : require("../../../assets/images/placeholder.png")
          }
        />
      </ProductImageContainer>
      <ProductDetailsSection>
        <ProductNameAndSizeSection>
          <ProductName>{order.product.displayName}</ProductName>
          <ProductSize>{order.product.size}</ProductSize>
          <ProductSize>{order.product.outletInventory.price}</ProductSize>
        </ProductNameAndSizeSection>
        <OrderQuantity>{order.quantity}</OrderQuantity>
      </ProductDetailsSection>
    </Row>
  );
};

export default CartList;
