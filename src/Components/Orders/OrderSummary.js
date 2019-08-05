import React from "react";
import styled from "styled-components";

const CostSection = styled.View`
  padding-horizontal: 5;
`;

const CostField = styled.View`
  padding-vertical: 5;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CostLabel = styled.Text`
  text-align: left;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_MEDIUM};
`;
const CostValue = styled.Text`
  text-align: left;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY_THIN};
  font-size: ${props => props.theme.FONT_SIZE_MEDIUM};
`;

const CostSummaryField = styled.View`
  margin-vertical: 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const CostSummaryLabel = styled.Text`
  text-align: left;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_LARGE};
`;
const CostSummaryValue = styled.Text`
  text-align: left;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY_SEMI_BOLD};
  font-size: ${props => props.theme.FONT_SIZE_EXTRA_LARGE};
`;

const getServiceCharge = totalAmount => {
  if (totalAmount < 1000) {
    return 115;
  } else if (totalAmount < 2500) {
    return 177;
  } else if (totalAmount < 5000) {
    return 209;
  } else if (totalAmount < 10000) {
    return 243;
  } else {
    return 282;
  }
};

export default ({ orderItems }) => {
  let goods = orderItems.reduce((accumulator, current) => {
    return accumulator + current.quantity * current.product.price;
  }, 0);
  let serviceCharge = getServiceCharge(goods);
  return (
    <CostSection>
      <CostField>
        <CostLabel>Goods :</CostLabel>
        <CostValue>{goods}</CostValue>
      </CostField>
      <CostField>
        <CostLabel>Service & Packaging:</CostLabel>
        <CostValue>{serviceCharge}</CostValue>
      </CostField>
      <CostSummaryField>
        <CostSummaryLabel>Total</CostSummaryLabel>
        <CostSummaryValue>{serviceCharge + goods}</CostSummaryValue>
      </CostSummaryField>
    </CostSection>
  );
};
