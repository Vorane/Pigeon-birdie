import React , { Component, Fragment} from "react"
import {TouchableOpacity, ActivityIndicator} from "react-native"
import styled from "styled-components"
import FeatherIcon from "react-native-vector-icons/Feather"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"


//import store actions and selectors
import * as processTypes from "../../Store/Shared/processTypes"
import { updateInventoryPrice, _resetUpdateInventoryPrice } from "../../Store/Products/actions"
import { getUpdateInventoryPriceProcess  } from "../../Store/Products/selectors"

const UpdateInventoryPriceContainer =styled.View`
    flex:1;
    justify-content: space-between
    padding-vertical: 5;
    padding-horizontal: 5;
`
    
const UpdateInventoryPriceHeaderContainer = styled.View`
    padding-top: 10;
    border-bottom-width: 0.4;
    border-bottom-color: #f0f0f0;   
    `
    
    const UpdateInventoryPriceHeader = styled.Text`
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    font-family: ${props => props.theme.SECONDARY_FONT_FAMILY_BOLD};
    font-size: ${props => props.theme.FONT_SIZE_LARGE}    
    `
    
    const UpdateInventoryPriceContentContainer =styled.View`
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`

const UpdateInventoryPricePriceContainer     = styled.View`
    justify-content: center;
    align-items: center;    
    padding-horizontal 5;


    border-radius: 15;
    border-width: 3;
    border-color: #f0f0f0;   

`
const UpdateInventoryPrice = styled.TextInput`
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    font-family: ${props => props.theme.SECONDARY_FONT_FAMILY_SEMI_BOLD};
    font-size: ${props => props.theme.FONT_SIZE_MASSIVE + 30}    
    padding-vertical: 0;
`

const UpdateInventoryPriceButton = styled.TouchableOpacity`
    padding-vertical: 5;
    justify-content: center;
    align-items: center;
    background-color: ${props=> props.color ? props.color : props.theme.PRIMARY_COLOR}
`
const UpdateInventoryPriceButtonText = styled.Text`
    color: ${props => props.theme.SECONDARY_TEXT_COLOR};
    font-family: ${props => props.theme.SECONDARY_FONT_FAMILY_SEMI_BOLD};
    font-size: ${props => props.theme.FONT_SIZE_LARGE}    
    padding-vertical: 0;
`

class UpdateInventoryPriceModal extends Component{
    constructor(props){
        super(props)
        this.state={
            price: this.props.inventory.price
        }

        this._onAddPrice = this._onAddPrice.bind(this)
        this._onSubtractPrice = this._onSubtractPrice.bind(this)
        this._onSetPrice = this._onSetPrice.bind(this)
        this._onSubmitPrice = this._onSubmitPrice.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(
            (prevProps.updateInventoryPriceProcess.status !== processTypes.ERROR ) && 
            (this.props.updateInventoryPriceProcess.status === processTypes.ERROR  ) ){
            //reset the process
            setTimeout(()=>{
                this.props._resetUpdateInventoryPrice()
            }, 1500)
        }
        if(
            (prevProps.updateInventoryPriceProcess.status !== processTypes.SUCCESS ) && 
            (this.props.updateInventoryPriceProcess.status === processTypes.SUCCESS  ) ){
                //reset the process and close the modal
            setTimeout(()=>{
                this.props.close()
                this.props._resetUpdateInventoryPrice()
            }, 1500)
        }
    }

    _onAddPrice(value=1){
        this.setState({
            ...this.state,
            price: this.state.price + 1
        })
    }
    
    _onSubtractPrice(value=1){
        this.setState({
            ...this.state,
            price: this.state.price - 1
        })
    }
    _onSetPrice(newPrice){
        this.setState({
            ...this.state,
            price: newPrice
        })
    }

    _onSubmitPrice(){
        this.props.updateInventoryPrice(this.props.inventory, this.state.price)
    }

    render(){
        let { updateInventoryPriceProcess} = this.props
        let showLoading = updateInventoryPriceProcess.status === processTypes.PROCESSING
        let showSuccess = updateInventoryPriceProcess.status === processTypes.SUCCESS
        let showIdle = updateInventoryPriceProcess.status === processTypes.IDLE
        let showError = updateInventoryPriceProcess.status === processTypes.ERROR
        return(
            <UpdateInventoryPriceContainer>
                <UpdateInventoryPriceHeaderContainer>
                    <UpdateInventoryPriceHeader>Update price
                    </UpdateInventoryPriceHeader>
                </UpdateInventoryPriceHeaderContainer>
                <UpdateInventoryPriceContentContainer>
                    <TouchableOpacity onPress={this._onSubtractPrice}>
                        <FeatherIcon size={75} name="minus" color={"black"}/>
                    </TouchableOpacity>
                    <UpdateInventoryPricePriceContainer>
                        <UpdateInventoryPrice keyboardType={"decimal-pad"} onChangeText={this._onSetPrice}>
                            {this.state.price}
                        </UpdateInventoryPrice>
                    </UpdateInventoryPricePriceContainer>
                    <TouchableOpacity onPress={this._onAddPrice}>
                        <FeatherIcon size={75} name="plus" color={"black"}/>
                    </TouchableOpacity>
                </UpdateInventoryPriceContentContainer>
                <Fragment>
                    {showIdle ?(
                        <UpdateInventoryPriceButton onPress={this._onSubmitPrice}>
                            <UpdateInventoryPriceButtonText>
                                Update price
                            </UpdateInventoryPriceButtonText>
                        </UpdateInventoryPriceButton>
                    ):(
                        <Fragment>
                            {showLoading ?(
                                <UpdateInventoryPriceButton>
                                    <ActivityIndicator size="large" color="#fff"/>
                                </UpdateInventoryPriceButton>
                            ):(
                                <Fragment>
                                    {showSuccess ?(
                                        <UpdateInventoryPriceButton color={"green"}>                                                        
                                            <UpdateInventoryPriceButtonText>
                                                Price updated successfully
                                            </UpdateInventoryPriceButtonText>
                                        </UpdateInventoryPriceButton>
                                    ):(
                                        // Show error
                                        <UpdateInventoryPriceButton  color={"#3d3d3d"}>
                                            <UpdateInventoryPriceButtonText>
                                                An error occured updating the price.
                                            </UpdateInventoryPriceButtonText>
                                        </UpdateInventoryPriceButton>                                        
                                    )}
                                </Fragment>
                            )}
                        </Fragment>
                    )}
                </Fragment>
            </UpdateInventoryPriceContainer>
        )
    }
}


const mapStateToProps = (state) =>({
    updateInventoryPriceProcess: getUpdateInventoryPriceProcess(state)
})

const mapDispatchToProps = (dispatch) => ({
    updateInventoryPrice: bindActionCreators(updateInventoryPrice, dispatch),
    _resetUpdateInventoryPrice: bindActionCreators(_resetUpdateInventoryPrice, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)( UpdateInventoryPriceModal)