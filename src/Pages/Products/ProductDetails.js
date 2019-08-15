import React, {Component, Fragment} from "react"
import { TouchableOpacity , StyleSheet, Text, Button} from "react-native"
import  styled, {ThemeProvider} from "styled-components"
import { connect } from "react-redux"
import {bindActionCreators} from "redux"
import FeatherIcon from "react-native-vector-icons/Feather"
import Modal from 'react-native-modalbox';



//import store actions and selectos
import { getTheme } from "../../Store/Configuration/selectors"
import { fetchOrderDetails} from "../../Store/Orders/actions"
import { updateInventoryPrice} from "../../Store/Products/actions"
import { getUpdateInventoryPriceProcess} from "../../Store/Products/selectors"

//Import local Components
import Header from "../../Components/Header/Header"
import UnderlineHeader from "../../Components/Header/UnderlineHeader"
import UpdateInventoryPrice from "../../Components/Inventory/UpdateInventoryPrice"
import SubStituteProduct from "../../Components/Products/SubstituteProduct"

//Define local styled components
const Wrapper = styled.View`
    flex:1;
    background-color :${props => props.theme.PRIMARY_BACKGROUND_COLOR}
`
const Content = styled.ScrollView`
    flex:1;
    padding-horizontal: 10;    
`

const ProductImage   = styled.Image`
    height: 250;
`
const ProductName = styled.Text`
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    font-family: ${props => props.theme.PRIMARY_FONT_FAMILY_BOLD};
    font-size: ${props => props.theme.FONT_SIZE_LARGE}    
    `
    const ProductNameContainer = styled.View`
    flex:1;
    `
const ProductContainer = styled.View`
    padding-top: 15;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`
const OptionsContainer = styled.View`
    padding-horizontal: 5;
    background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
    height: 100%;

`
const OptionSection = styled.View`
    padding-vertical: 5;
    border-bottom-width: 0.4;
    border-bottom-color: #b0b0b0;
`
const OptionField = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center
    padding-vertical: 10;
`
const OptionLabel = styled.Text`
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    font-family: ${props => props.theme.SECONDARY_FONT_FAMILY};
    font-size: ${props => props.theme.FONT_SIZE_MEDIUM}    
    padding-horizontal: 15;
    `
    
    const ProductsModal = styled(Modal)`
    background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
    max-height: 45%;
    `

const OutletSearchModal = styled(Modal)`
    background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
    height: 90%;
    `
    



class ProductDetail extends Component{
    constructor(props){
        super(props)        

        this.state= {
            isModalOpen: false,
            isSubstituteProductModalOpen: false
        }
        
        this._closeModal  = this._closeModal.bind(this);
        this._openModal  = this._openModal.bind(this);
        this._closeSubStituteProductModal = this._closeSubStituteProductModal.bind(this);
        this._openSubstituteProductModal = this._openSubstituteProductModal.bind(this);
        this._onSubStituteProductModalComplete = this._onSubStituteProductModalComplete.bind(this)
    }
    


    _openSubstituteProductModal(){
        this.setState({
            ...this.state,
            isSubstituteProductModalOpen: true
        })
    }
    _closeSubStituteProductModal(){
        this.setState({
            ...this.state,
            isSubstituteProductModalOpen: false
        })
    }
    _onSubStituteProductModalComplete(){
        //fetch order details
        let order = this.props.navigation.getParam("order")        
        this.props.fetchOrderDetails(order.id)
        this.props.navigation.goBack()
    }

    _closeModal(){
        this.setState({
            ...this.state,
            isModalOpen: false
        })
    }
    _openModal(){
        this.setState({
            ...this.state,
            isModalOpen: true
        })
    }

    render(){
        
        let {theme, navigation} = this.props
        let orderItem = this.props.navigation.getParam("product")
        let order = this.props.navigation.getParam("order")
        return(
            <ThemeProvider theme={theme}>
                <Fragment>

                <Wrapper>

                    <Header title="Product Details" canGoBack={true} goBack={navigation.goBack} theme={theme}/>
                    <Content >
                        
                        <ProductImage resizeMode="contain" source={{uri: orderItem.product.thumbnail}}/>
                        <ProductContainer>
                            <ProductNameContainer>
                                <ProductName>{orderItem.product.displayName}</ProductName>
                            </ProductNameContainer>
                            <TouchableOpacity onPress={this._openActionSheet} >
                                <FeatherIcon name={"more-vertical"} size={25} color={theme.PRIMARY_TEXT_COLOR}/>
                            </TouchableOpacity>
                        </ProductContainer>
                        <Fragment>

                        <UnderlineHeader title="Quantity"></UnderlineHeader>
                        <ProductName>{orderItem.quantity}</ProductName>
                        </Fragment>
                        <Fragment>
                            <UnderlineHeader title="Product Options"></UnderlineHeader>
                            <OptionsContainer>
                                <OptionSection>
                                    <OptionField onPress={this._openModal }>
                                        <FeatherIcon name="tag" size={15} color={"#3d3d3d"}/>
                                        <OptionLabel>Change Price</OptionLabel>
                                    </OptionField>
                                    <OptionField>
                                        <FeatherIcon name="slash" size={15} color={"#3d3d3d"}/>
                                        <OptionLabel>Not sold here</OptionLabel>
                                    </OptionField>
                                </OptionSection>
                                <OptionSection>
                                    
                                    <OptionField onPress={this._openSubstituteProductModal }>
                                        <FeatherIcon name="shuffle" size={15} color={"#3d3d3d"}/>
                                        <OptionLabel>Swap products</OptionLabel>
                                    </OptionField>
                                    <OptionField>
                                        <FeatherIcon name="trash" size={15} color={"#3d3d3d"}/>
                                        <OptionLabel>Remove from order</OptionLabel>
                                    </OptionField>
                                </OptionSection>
                                <OptionSection>                
                                    <OptionField>
                                        <FeatherIcon name="phone" size={15} color={"#3d3d3d"}/>
                                        <OptionLabel>Call customer</OptionLabel>
                                    </OptionField>
                                </OptionSection>
                            </OptionsContainer>                                            
                        </Fragment>
                    </Content>
                    
                </Wrapper>
                    <ProductsModal backButtonClose={true} isOpen={this.state.isModalOpen} onClosed={this._closeModal}  position={"bottom"} >
                        <UpdateInventoryPrice close={this._closeModal} inventory={orderItem.product.outletInventory} />
                    </ProductsModal>
                    <OutletSearchModal backButtonClose={true} isOpen={this.state.isSubstituteProductModalOpen} onClosed={this._closeSubStituteProductModal}  position={"bottom"} >
                        <SubStituteProduct close={this._closeSubStituteProductModal} order={order} orderItem={orderItem} complete={this._onSubStituteProductModalComplete} />
                    </OutletSearchModal>
                </Fragment>
            </ThemeProvider>
        )    
    }
}


const mapStateToProps = state =>({
    theme: getTheme(state),
    updateInventoryPriceProcess: getUpdateInventoryPriceProcess(state)
})

const mapDispatchToProps = dispatch =>({
    updateInventoryPrice : bindActionCreators(updateInventoryPrice , dispatch),
    fetchOrderDetails : bindActionCreators(fetchOrderDetails , dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail)