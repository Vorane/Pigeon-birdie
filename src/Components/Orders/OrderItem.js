import React from "react";
import styled from "styled-components";
import moment from "moment";
import { Text } from "react-native";

import { orderStatusDetails } from "../../Store/Orders/OrderStatusDetails";
import { isEmpty } from "../../lib/utils";

const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;

  padding-vertical: 5;
  padding-horizontal: 5;
`;

const OutletImageContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50;
  width: 50;
  border-radius: 50;
  elevation: 1;
`;
const OutletImage = styled.Image`
  height: 50;
  width: 50;
  border-radius: 50;
`;

const OrderDetailsContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;
const OrderContentContainer = styled.View`
  padding-horizontal: 10;
`;
const OrderTitle = styled.Text`
  font-family: ${props => props.theme.SECONDARY_FONT_FAMILY_SEMI_BOLD};
  font-size: ${props => props.theme.FONT_SIZE_MEDIUM};
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
`;
const OrderTime = styled.Text`
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_SMALL};
  color: ${props => props.theme.PRIMARY_TEXT_COLOR_LIGHT};
`;
const OrderStatus = styled.Text`
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_MEDIUM};
  color: ${props => props.theme.PRIMARY_TEXT_COLOR_LIGHT};
`;

const OrderItem = ({ order, orderItemPress }) => {
  return (
    <Wrapper onPress={()=>{orderItemPress(order)}}>
      <OrderDetailsContainer>
        <OutletImageContainer>
          <OutletImage source={{ uri: order.outlet.image }} />
        </OutletImageContainer>
        <OrderContentContainer>
          <OrderTitle>{order.orderContactPerson}'s order</OrderTitle>
          <OrderStatus>
            {orderStatusDetails[order.orderStatus].title}
          </OrderStatus>
          <OrderTime>{moment(order.pickupTime).format("hh:mm a")}</OrderTime>
        </OrderContentContainer>
      </OrderDetailsContainer>
    </Wrapper>
  );
};

export default OrderItem;
