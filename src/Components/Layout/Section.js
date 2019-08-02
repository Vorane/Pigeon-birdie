import styled from "styled-components";
export default styled.View`  
  flex-direction: ${props =>
    props.flexDirection ? props.flexDirection : "column"}
  align-items: ${props => (props.alignItems ? props.alignItems : "flex-start")}
  justify-content: ${props =>
    props.justifyContent ? props.justifyContent : "flex-start"}
  ${props => props.full && "flex:1"};
  padding-top: ${props => (props.paddingTop ? props.paddingTop : 0)};
  padding-bottom: ${props => (props.paddingBottom ? props.paddingBottom : 0)};
  padding-left: ${props => (props.paddingLeft ? props.paddingLeft : 0)};
  padding-right: ${props => (props.paddingRight ? props.paddingRight : 0)};
  ${props => props.full && "flex:1"}
`;
