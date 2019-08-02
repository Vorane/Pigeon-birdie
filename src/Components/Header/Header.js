import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components";
import Icon from "react-native-vector-icons/dist/Feather";

const Wrapper = styled.View`
  elevation: 1;
  background-color: ${props => props.theme.PRIMARY_COLOR};
`;
const HeaderContainer = styled.View`
  padding-top: 10;
  padding-bottom: 10;
  padding-left: 5;
  padding-right: 10;
  flex-direction: row;
  justify-content: space-between;
`;
const TitleAndButtonContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;
const Title = styled.Text`
  flex-shrink: 1;
  padding-horizontal: 0;
  text-align: center;
  color: ${props => props.theme.SECONDARY_TEXT_COLOR};
  font-family: ${props => props.theme.SECONDARY_FONT_FAMILY_BOLD};
  font-size: ${props => props.theme.FONT_SIZE_LARGE};
  
`;

const EmptyIcon = styled.View`
  height: 25;
  width: 25;
`;

const Header = ({
  theme,
  title = "Pigeon",
  canGoBack = false,
  goBack,
  menuIcon,
  children
}) => {
  return (
    <Wrapper>
      <HeaderContainer>
        <TitleAndButtonContainer>
          {canGoBack && (
            <TouchableOpacity
              onPress={() => {
                goBack();
              }}
            >
              <Icon
                name={"chevron-left"}
                size={30}
                color={theme.SECONDARY_TEXT_COLOR}
              />
            </TouchableOpacity>
          )}
          <Title numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Title>
        </TitleAndButtonContainer>
        {menuIcon ? (
          <TitleAndButtonContainer>{menuIcon}</TitleAndButtonContainer>
        ) : (
          <EmptyIcon />
        )}
      </HeaderContainer>
      {children}
    </Wrapper>
  );
};

export default Header;
