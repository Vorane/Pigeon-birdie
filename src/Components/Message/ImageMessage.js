import React from "react";
import styled from "styled-components";

const Wrapper = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
  padding-horizontal: 5;
`;

const Image = styled.Image`
  ${props =>
    props.small ? "height: 120; " : "height: 180; "}
`;

const MessageText = styled.Text`
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_LARGE};
  text-align: center;
`;

const MessageButton = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  elevation: 3;
  border-radius: 2;
  background-color: ${props => props.theme.PRIMARY_COLOR};

  margin-top: 10;
  padding-vertical: 5;
  padding-horizontal: 25;
`;

const MessageButtonText = styled.Text`
  text-align: center;
  color: ${props => props.theme.SECONDARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_MEDIUM};
`;

const ImageMessage = ({
  message = "Message Text goes here",
  image,
  hasButton = false,
  buttonText,
  buttonHandler,
  small = false
}) => {
  return (
    <Wrapper>
      <Image resizeMode='contain' source={image} small={small} />
      <MessageText>{message}</MessageText>

      {hasButton && (
        <MessageButton onPress={buttonHandler}>
          <MessageButtonText>{buttonText}</MessageButtonText>
        </MessageButton>
      )}
    </Wrapper>
  );
};

export default ImageMessage;
