import React from "react";
import styled from "styled-components";
import FeatherIcon from "react-native-vector-icons/Feather";

const Wrapper = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: ${props => props.color || "white"};
  padding-horizontal: 10;
`;

const SearchInput = styled.TextInput`
  
  border-radius: 2;
  padding-vertical: 5;
  padding-horizontal: 5;
  flex:1;
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY}
  font-size: ${props => props.theme.FONT_SIZE_MEDIUM}
`;

const SearchBox = ({
  placeholder = "Search",
  onSubmit,
  color = null,
  theme,
  menu = "search",
  returnKeyType = "search",
  onChangeText,
  onFocus
}) => {
  return (
    <Wrapper color={color}>
      <FeatherIcon size={15} color={"#3d3d3d"} name={menu} />
      <SearchInput
        onFocus={onFocus}
        returnKeyType={returnKeyType}
        placeholder={placeholder}
        onSubmitEditing={onSubmit}
        onChangeText={onChangeText}
      />
    </Wrapper>
  );
};

export default SearchBox;
