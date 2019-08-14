import React, { Component, Fragment}  from "react"
import styled from "styled-components"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import FeatherIcon from "react-native-vector-icons/Feather"

//import local actions and selectors
import * as processTypes from "../../Store/Shared/processTypes"
import {colorOptions} from "../../Store/Configuration/theme"
import {substituteOrderItems , resetSubstituteOrderItem} from "../../Store/Orders/actions"
import { getSubstituteOrderItemProcess  } from "../../Store/Orders/selectors"

///import local components
import SearchOutletProduct from "./SearchOutletProduct"
import ButtonFooter from "../Footer/ButtonFooter"

//Define local styled components
const Wrapper = styled.View`
    flex: 1;
    
`
const Header = styled.View`

`
const Title = styled.Text`
font-family: ${props => props.theme.SECONDARY_FONT_FAMILY_BOLD}
font-size: ${props => props.theme.FONT_SIZE_LARGE}
color: ${props =>props.theme.PRIMARY_TEXT_COLOR}
`

const SearchOutletContainer = styled.View`
flex:1;
    padding-vertical: 10;
    padding-horizontal: 10;
    
`

const ProductContainer = styled.View`
    flex-direction:row;
    flex: 1;
`

const ProductImageContainer = styled.View`
    border-width: 0.5;
    border-color: #b0b0b0;
    height: 50;
    width: 50;
    border-radius: 50;
    overflow: hidden
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
    
const ProductImage = styled.Image`
    height: 40;
    width: 40;
    border-radius: 40;
`

const ProductDetailsSection = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  padding-right: 15;
  
  
`;

const ProductName = styled.Text`
  text-align: left;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_MEDIUM};

  padding-vertical: 0;
  padding-left: 10;
`;

const ProductCostSection = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  
`;

const QuantitySection = styled.View`
  flex: 1;
  min-width: 100;

  padding-horizontal: 10;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  
`;

const ButtonContainer = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
  height: 30;
  width: 30;
  border-radius: 30;
  border-width: 1;
  border-color: ${props => props.borderColor};

  margin-horizontal: 5;
`;

const QuantityText = styled.Text`
  text-align: center;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY_SEMI_BOLD};
  font-size: ${props => props.theme.FONT_SIZE_MEDIUM};

  min-width: 50;
`;

const ProductTotalCost = styled.Text`
  flex: 2;
  text-align: left;
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_MEDIUM};

  padding-left:20 ;
`;



class SubstituteProduct extends Component{
    constructor(props){
        super(props)
        this.state = {
            productSelected:false,
        }
        this._onProductPress = this._onProductPress.bind(this)
        this._reduceQuantity = this._reduceQuantity.bind(this)
        this._addQuantity = this._addQuantity.bind(this)
        this._onPressSwap = this._onPressSwap.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapShot){
        if(
            prevProps.subStituteOrderItemProcess.status !== processTypes.SUCCESS &&
            this.props.subStituteOrderItemProcess.status === processTypes.SUCCESS
        ){
            //close
            setTimeout(()=>{
                this.props.resetSubstituteOrderItem()
                this.props.close()
            }, 1000)
        }
    }

    _onProductPress(product){
        this.setState({
            ...this.state,
            productSelected: true,
            product: product,
            quantity: 1
        })
    }

    _addQuantity(){
        this.setState({
            ...this.state,
            quantity: this.state.quantity+ 1
        })
    }
    _reduceQuantity(){
        if(this.state.quantity >1 ){
            this.setState({
                ...this.state,
                quantity: this.state.quantity - 1
            })

        }
        else{
            this.setState({
                productSelected: false,
                product: null,
                quantity: 1
            })
        }
    }

    _onPressSwap(){
        let newOrderItem  = {
            product: this.state.product,
            quantity: this.state.quantity,
            isAdded: true,
        }
        this.props.substituteOrderItems(this.props.order, this.props.orderItem, newOrderItem )
    }


    render(){
        let { productSelected, product, quantity, } = this.state
        let {subStituteOrderItemProcess} = this.props
        let showIdle = subStituteOrderItemProcess.status === processTypes.IDLE
        let showLoading = subStituteOrderItemProcess.status === processTypes.PROCESSING
        let showSuccess = subStituteOrderItemProcess.status === processTypes.SUCCESS
        let showError = subStituteOrderItemProcess.status === processTypes.ERROR
        return(
            <Wrapper>
                <SearchOutletContainer>
                    <Header>
                        <Title>Swap products</Title>
                    </Header>
                    <SearchOutletProduct {...this.props} onProductPress={this._onProductPress}/>
                </SearchOutletContainer>
                {productSelected &&(
                    <Fragment>
                        {showIdle ?(
                            <ButtonFooter buttonText={"Swap"} pressHandler={this._onPressSwap}>
                                <ProductContainer>
                                    <ProductImageContainer>
                                        <ProductImage
                                            resizeMode={"contain"}  
                                            source={
                                                product.thumbnail
                                                    ? { uri: product.thumbnail }
                                                    : require("../../../assets/images/placeholder.png")}  
                                            />
                                    </ProductImageContainer>
                                    <ProductDetailsSection>
                                        <ProductName numberOfLines={1} ellipsizeMode='tail'>{product.displayName}</ProductName>
                                        <ProductCostSection>
                                            <QuantitySection>
                                                {quantity === 1 ? (
                                                    <ButtonContainer
                                                    color={colorOptions.gray.PRIMARY_COLOR_FAINT}
                                                    borderColor={colorOptions.gray.PRIMARY_COLOR_LIGHT}
                                                    onPress={this._reduceQuantity}
                                                    >
                                                    <FeatherIcon
                                                        name='trash-2'
                                                        size={15}
                                                        color={colorOptions.gray.PRIMARY_COLOR}
                                                    />
                                                    </ButtonContainer>
                                                ) : (
                                                    <ButtonContainer
                                                    color={colorOptions.gray.PRIMARY_COLOR_FAINT}
                                                    borderColor={colorOptions.gray.PRIMARY_COLOR_LIGHT}
                                                    onPress={this._reduceQuantity}
                                                    >
                                                    <FeatherIcon
                                                        name='minus'
                                                        size={15}
                                                        color={colorOptions.gray.PRIMARY_COLOR}
                                                    />
                                                    </ButtonContainer>
                                                )}
                                                <QuantityText>{quantity}</QuantityText>
                                                <ButtonContainer
                                                    color={colorOptions.gray.PRIMARY_COLOR_FAINT}
                                                    borderColor={colorOptions.gray.PRIMARY_COLOR_LIGHT}
                                                    onPress={this._addQuantity}
                                                >
                                                    <FeatherIcon
                                                    name='plus'
                                                    size={15}
                                                    color={colorOptions.green.PRIMARY_COLOR}
                                                    />
                                                </ButtonContainer>
                                            </QuantitySection>
                                        
                                            <ProductTotalCost>
                                                {quantity * product.price}
                                            </ProductTotalCost>
                                        
                                        </ProductCostSection>
                                    </ProductDetailsSection>
                                </ProductContainer>

                            </ButtonFooter>
                        ):(
                            <Fragment>
                                {showLoading ?(
                                    <ButtonFooter buttonText={"Swaping"} loading />
                                    ):(
                                        <Fragment>
                                        {showSuccess ?(
                                            <ButtonFooter buttonText={"Sucess"}  color={"green"}/>
                                            ):(                                            
                                            // Show error
                                            <ButtonFooter buttonText={"Swaping"}  color={"black"}/>
                                        )}
                                    </Fragment>
                                )}
                            </Fragment>
                        )}
                    </Fragment>
                    
                )}
            </Wrapper>

        )
    }
}


const mapStateToProps = (state) =>({
    subStituteOrderItemProcess: getSubstituteOrderItemProcess(state)
})
const mapDispatchToProps = (dispatch) =>({
    substituteOrderItems : bindActionCreators(substituteOrderItems, dispatch),
    resetSubstituteOrderItem : bindActionCreators(resetSubstituteOrderItem, dispatch)
})
export default connect (mapStateToProps, mapDispatchToProps)(SubstituteProduct)