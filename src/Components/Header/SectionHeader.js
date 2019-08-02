import React from "react";
import styled from "styled-components";

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-top: 25;
  padding-bottom: 5;
`;

const TitleIndicator = styled.View`
  width: 20;
  height: 3;
  background-color: ${props => props.theme.PRIMARY_COLOR};
`;
const Title = styled.Text`
  color: ${props => props.color};
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_LARGE};
  padding-horizontal: 10;
`;

const SectionHeader = ({ title }) => {
  return (
    <TitleContainer>
      <TitleIndicator />
      <Title>{title}</Title>
    </TitleContainer>
  );
};

export default SectionHeader;
