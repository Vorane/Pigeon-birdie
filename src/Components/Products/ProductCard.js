import React from "react";
import styled from "styled-components";

import { colorOptions } from "../../Store/Configuration/theme";
import FeatherIcon from "react-native-vector-icons/Feather";

const Card = styled.TouchableOpacity`
  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
`;

const Header = styled.ImageBackground`
  padding-horizontal: 5;
  padding-vertical: 5;
  height: 85;
`;

const Content = styled.View`
  padding-horizontal: 10;
  padding-vertical: 5;

  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
  border-top-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR_LIGHT};
  border-top-width: 0;
`;

const PriceAndSizeContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.Text`
  text-align: left;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_LARGE - 3};
  padding-horizontal: 0;
  padding-vertical: 2.5;
`;

const Name = styled.Text`
  text-align: left;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_SMALL};
  
  margin-horizontal: 0;
`;
const Size = styled.Text`
  text-align: left;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY_THIN};
  font-size: ${props => props.theme.FONT_SIZE_SMALL};
  padding-horizontal: 0;
  padding-vertical: 2.5;
`;

const AddButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.SECONDARY_COLOR};
  flex-direction: column;
  justify-content: center
  align-items: center;
  margin-top: 5;
  border-radius:2;
`;

const AddButtonText = styled.Text`
  text-align: left;
  color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_SMALL};
  padding-vertical: 5;
`;

const QuantitySection = styled.View`
  padding-top: 5;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1;
  border-bottom-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR_LIGHT};
`;

const ButtonContainer = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
  height: 25;
  width: 25;
  border-radius: 25;
  border-width: 0.5;
  border-color: ${props => props.theme.PRIMARY_TEXT_COLOR_LIGHT};

  margin-horizontal: 5;
`;

const QuantityText = styled.Text`
  text-align: center;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_LARGE};

  min-width: 50;
`;

const ProductCard = ({
  product: product,
  productPressHandler,

}) => {
  return (
    <Card
      onPress={() => {
        productPressHandler(product);
      }}
    >
      <Header
        source={
          product.thumbnail
            ? { uri: product.thumbnail }
            : require("../../../assets/images/placeholder.png")
        }
        resizeMode='contain'
      />
      <Content>
        <PriceAndSizeContainer>
          <Price>{product.outletInventory.price}/=</Price>
          <Size>{product.size}</Size>
        </PriceAndSizeContainer>
        <Name >
          {product.displayName}
        </Name>

        {/* {quantity > 0 ? (
          <QuantitySection>
            {quantity === 1 ? (
              <ButtonContainer
                color={colorOptions.gray.PRIMARY_COLOR_FAINT}
                borderColor={colorOptions.gray.PRIMARY_COLOR_LIGHT}
                onPress={() => {
                  removeFromCart(product);
                }}
              >
                <FeatherIcon
                  name='trash-2'
                  size={12}
                  color={colorOptions.gray.PRIMARY_COLOR_BOLD}
                />
              </ButtonContainer>
            ) : (
              <ButtonContainer
                color={colorOptions.gray.PRIMARY_COLOR_FAINT}
                borderColor={colorOptions.gray.PRIMARY_COLOR_LIGHT}
                onPress={() => {
                  deductFromCart(product);
                }}
              >
                <FeatherIcon
                  name='minus'
                  size={12}
                  color={colorOptions.gray.PRIMARY_COLOR_BOLD}
                />
              </ButtonContainer>
            )}
            <QuantityText>{quantity}</QuantityText>
            <ButtonContainer
              color={colorOptions.gray.PRIMARY_COLOR_FAINT}
              borderColor={colorOptions.gray.PRIMARY_COLOR_LIGHT}
              onPress={() => {
                addToCart(product);
              }}
            >
              <FeatherIcon
                name='plus'
                size={12}
                color={colorOptions.green.PRIMARY_COLOR_LIGHT}
              />
            </ButtonContainer>
          </QuantitySection>
        ) : (
          <AddButton
            onPress={() => {
              addToCart(product);
            }}
          >
            <AddButtonText color={colorOptions.orange.PRIMARY_COLOR}>
              Add
            </AddButtonText>
          </AddButton>
        )} */}
      </Content>
    </Card>
  );
};

export default ProductCard;
