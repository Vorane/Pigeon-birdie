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

  padding-left: 10;
  padding-right: 20;
  flex-direction: column;
  justify-content: flex-start;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 10;
`;

const MenuContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 10;
`;
const Title = styled.Text`
  padding-horizontal: 0;
  text-align: center;
  color: ${props => props.theme.SECONDARY_TEXT_COLOR};
  font-family: ${props => props.theme.SECONDARY_FONT_FAMILY_BOLD};
  font-size: ${props => props.theme.FONT_SIZE_LARGE};
  margin-horizontal: 5;
  padding-bottom: 0;
`;

const EmptyIcon = styled.View`
  height: 25;
  width: 25;
`;

const Header = ({
  theme,
  title = "Pigeon",
  onMenuPress,
  menuIcon,
  children
}) => {
  return (
    <Wrapper>
      <HeaderContainer>
        <MenuContainer>
          <TouchableOpacity
            onPress={() => {
              onMenuPress();
            }}
          >
            <Icon name={"menu"} size={25} color={theme.SECONDARY_TEXT_COLOR} />
          </TouchableOpacity>
        </MenuContainer>
        <TitleContainer>
          <Title numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Title>
          {menuIcon ? <MenuContainer>{menuIcon}</MenuContainer> : <EmptyIcon />}
        </TitleContainer>
      </HeaderContainer>
      {children}
    </Wrapper>
  );
};

export default Header;
