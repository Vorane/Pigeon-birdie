import React from "react";
import { ActivityIndicator } from 'react-native'

import styled from "styled-components";
import { colorOptions } from "../../Store/Configuration/theme";

const EmptyView = styled.View`
  flex: 1;
`;

const Footer = styled.View`
  border-width: 0.75;
  border-color: #f0f0f0;
  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding-top: 10;
  padding-bottom: 10;
  padding-left: 10;
  padding-right: 10;
`;

const OrderButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  elevation: 3;
  border-radius: 5;
  background-color: ${props => props.color? props.color:  props.theme.PRIMARY_COLOR};

  padding-top: 10;
  padding-bottom: 10;
  padding-left: 10;
  padding-right: 10;
`;

const OrderButtonText = styled.Text`
  text-align: center;
  color: ${props => props.theme.SECONDARY_TEXT_COLOR};
  font-family: ${props => props.theme.SECONDARY_FONT_FAMILY_BOLD};
  font-size: ${props => props.theme.FONT_SIZE_LARGE + 2};
`;
const DisabledButton = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  elevation: 3;
  border-radius: 5;
  background-color: ${colorOptions.gray.PRIMARY_COLOR_LIGHT};

  padding-top: 10;
  padding-bottom: 10;
  padding-left: 10;
  padding-right: 10;
`;

const DisabledButtonText = styled.Text`
  text-align: center;
  color: ${props => props.theme.SECONDARY_TEXT_COLOR};
  font-family: ${props => props.theme.SECONDARY_FONT_FAMILY_BOLD};
  font-size: ${props => props.theme.FONT_SIZE_LARGE + 2};
`;

export default ({
  children,
  buttonText = "Provide Button Text",
  pressHandler,
  buttonActive = true,
  loading=false,
  color=null
}) => {
  return (
    <Footer>
      {children ? children : <EmptyView />}
      {buttonActive ? (
        <OrderButton onPress={pressHandler} color={color}>
          <OrderButtonText>{buttonText}</OrderButtonText>
          {loading &&(
            <ActivityIndicator size="small" color="white"/>
          )}
        </OrderButton>
      ) : (
        <DisabledButton onPress={pressHandler} disabled={true}>
          <DisabledButtonText>{buttonText}</DisabledButtonText>
        </DisabledButton>
      )}
    </Footer>
  );
};
