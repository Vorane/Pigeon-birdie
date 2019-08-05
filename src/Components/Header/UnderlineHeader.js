import React from "react";
import styled from "styled-components";

const TitleContainer = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding-top: 25;
  padding-bottom: 5;
`;

const TitleIndicator = styled.View`
  width: 25;
  height: 5;
  border-radius: 1;
  background-color: ${props => props.theme.PRIMARY_COLOR};
`;
const Title = styled.Text`
  color: ${props => props.color};
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_LARGE};
  
`;

const SectionHeader = ({ title }) => {
  return (
    <TitleContainer>
      <Title>{title}</Title>
      <TitleIndicator />
    </TitleContainer>
  );
};

export default SectionHeader;
