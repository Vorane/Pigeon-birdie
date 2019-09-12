import React , {Component, Fragment} from "react"
import {ActivityIndicator} from "react-native"
import styled from "styled-components"
import { connect }  from "react-redux"
import { bindActionCreators } from "redux"

//import store actions and selectors
import * as processTypes from "../../Store/Shared/processTypes"
import { removeOrderItem, resetRemoveOrderItem } from "../../Store/Orders/actions"
import { getRemoveOrderItemProcess } from "../../Store/Orders/selectors"

//Define Local StyledComponents
const Wrapper =styled.View`
    flex:1;
    justify-content: space-between
    padding-vertical: 5;
    padding-horizontal: 5;
`
    
const Header = styled.View`
    padding-top: 10;
    border-bottom-width: 0.4;
    border-bottom-color: #f0f0f0;   
`
    
const Title = styled.Text`
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    font-family: ${props => props.theme.SECONDARY_FONT_FAMILY_BOLD};
    font-size: ${props => props.theme.FONT_SIZE_LARGE}    
`
const Content = styled.View`
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-horizontal: 20
`

const ProductImage = styled.Image`
    height: 80;
    width: 80;
`
const ContentDescription = styled.Text`
    text-align: center;
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
    font-size: ${props => props.theme.FONT_SIZE_MEDIUM}    
`
const Footer = styled.View`

`

const ConfirmationButton = styled.TouchableOpacity`
    border-radius: 3;
    elevation: 1;
    padding-vertical: 10;
    justify-content: center;
    align-items: center;
    background-color: ${props=> props.color ? props.color : props.theme.PRIMARY_COLOR}
`
const ConfirmationButtonText = styled.Text`
    color: ${props => props.theme.SECONDARY_TEXT_COLOR};
    font-family: ${props => props.theme.SECONDARY_FONT_FAMILY_SEMI_BOLD};
    font-size: ${props => props.theme.FONT_SIZE_LARGE}    
    padding-vertical: 0;
`

class RemoveProduct extends  Component{
    constructor(props){
        super(props)

        this._onSubmitPrice = this._onSubmitPrice.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(
            (prevProps.removeOrderItemProcess.status !== processTypes.ERROR ) && 
            (this.props.removeOrderItemProcess.status === processTypes.ERROR  ) ){
            //reset the process
            setTimeout(()=>{
                this.props.resetRemoveOrderItem()
            }, 100)
        }
        if(
            (prevProps.removeOrderItemProcess.status !== processTypes.SUCCESS ) && 
            (this.props.removeOrderItemProcess.status === processTypes.SUCCESS  ) ){
                //reset the process and close the modal
            setTimeout(()=>{
                this.props.close()
                this.props.resetRemoveOrderItem()
                this.props.complete()
            }, 100)
        }
    }
    _onSubmitPrice(){
        this.props.removeOrderItem(this.props.order , this.props.orderItem)
    }



    render(){
        let {removeOrderItemProcess, orderItem} = this.props
        let showLoading = removeOrderItemProcess.status === processTypes.PROCESSING
        let showSuccess = removeOrderItemProcess.status === processTypes.SUCCESS
        let showIdle = removeOrderItemProcess.status === processTypes.IDLE
        let showError = removeOrderItemProcess.status === processTypes.ERROR
        return(
            <Wrapper>
                <Header>
                    <Title>Remove Product</Title>
                </Header>
                <Content>
                    <ProductImage 
                        resizeMode={"contain"}  
                        source={
                            orderItem.product.thumbnail
                                ? { uri: orderItem.product.thumbnail }
                                : require("../../../assets/images/placeholder.png")}   
                    />
                    <ContentDescription>Are you sure you want to remove this item from the order?</ContentDescription>
                </Content>
                <Footer>
                    <Fragment>
                        {showIdle ?(
                            <ConfirmationButton onPress={this._onSubmitPrice}>
                                <ConfirmationButtonText>Remove</ConfirmationButtonText>
                            </ConfirmationButton>
                        ):(
                            <Fragment>
                                {showLoading ?(
                                    <ConfirmationButton>
                                        <ActivityIndicator color={"#ffffff"} size="small"/>
                                        <ConfirmationButtonText>Removing</ConfirmationButtonText>
                                    </ConfirmationButton>
                                    ):(
                                    <Fragment>
                                        {showSuccess ?(
                                            <ConfirmationButton color="green">                                                
                                                <ConfirmationButtonText>Success</ConfirmationButtonText>
                                            </ConfirmationButton>
                                            
                                            ):(
                                                // Show error
                                            <ConfirmationButton color="black">                                                
                                                <ConfirmationButtonText>An error occured while removing the product.</ConfirmationButtonText>
                                            </ConfirmationButton>
                                            
                                            )}
                                    </Fragment>
                                )}
                            </Fragment>
                        )}
                    </Fragment>
                    
                </Footer>
            </Wrapper>
        )
    }
}

const mapStateToProps = state =>({
    removeOrderItemProcess: getRemoveOrderItemProcess(state),
})
const mapDispatchToProps = dispatch =>({
    removeOrderItem: bindActionCreators(removeOrderItem, dispatch),
    resetRemoveOrderItem : bindActionCreators(resetRemoveOrderItem, dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(RemoveProduct)