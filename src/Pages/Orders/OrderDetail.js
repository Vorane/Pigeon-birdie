import React, {Component, Fragment} from "react"
import {Text, ActivityIndicator} from "react-native"
import styled, {ThemeProvider} from "styled-components"
import {connect} from "react-redux"
import moment from "moment"
import { bindActionCreators} from "redux"


//Import store actions and selectors
import * as processTypes from "../../Store/Shared/processTypes"
import * as orderStatus from "../../Store/Orders/orderStatus"
import * as orderStatusDetails from "../../Store/Orders/orderStatus"
import { getTheme } from "../../Store/Configuration/selectors"
import { fetchOrderDetails, updateOrderStatus, resetUpdateOrderStatus } from "../../Store/Orders/actions"
import { getFetchOrderDetailsProcess, getUpdateOrderStatusProcess,  getOrderDetails  } from "../../Store/Orders/selectors"

//Import local Components
import UnderlineHeader from "../../Components/Header/UnderlineHeader"
import Header from "../../Components/Header/Header"
import ProductList from "../../Components/Products/ProductList"
import OrderSummary from "../../Components/Orders/OrderSummary"
import ButtonFooter from "../../Components/Footer/ButtonFooter"

//Define Local Styled Components
const Wrapper = styled.View`
    flex: 1
`

const Content = styled.ScrollView`
    padding-horizontal: 10;
`

const Section = styled.View`

`

const Field  = styled.View`
padding-top: 5;
    flex-direction: row;
    justify-content: flex-start;    

`
const Label  = styled.Text`
    font-family: ${props => props.theme.PRIMARY_FONT_FAMILY_THIN};
    font-size: ${props => props.theme.FONT_SIZE_MEDIUM};
    color: ${props => props.theme.PRIMARY_TEXT_COLOR_LIGHT};
`  
const Value  = styled.Text`
    font-family: ${props => props.theme.PRIMARY_FONT_FAMILY_SEMI_BOLD};
    font-size: ${props => props.theme.FONT_SIZE_MEDIUM};
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    padding-horizontal: 5;
    `  
    
    const ProductListContainer = styled.View`
    background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
    elevation: 7;
    padding-horizontal: 2.5;
    padding-vertical: 2.5;
    `
    
    const ConfirmationFooter = styled.TouchableOpacity`
    padding-vertical: 10;
    background-color: ${props => props.color ? props.color : props.theme.PRIMARY_COLOR};
    
    flex-direction: column;
    justify-content: center;
    align-items: center
    `
    const ConfirmationPrimaryText = styled.Text`
    font-family: ${props => props.theme.PRIMARY_FONT_FAMILY_SEMI_BOLD};
    font-size: ${props => props.theme.FONT_SIZE_LARGE};
    color: ${props => props.theme.SECONDARY_TEXT_COLOR};
    padding-horizontal: 5;
    text-align: center;

`
    const ConfirmationSecondaryText = styled.Text`
    font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
    font-size: ${props => props.theme.FONT_SIZE_SMALL};
    color: ${props => props.theme.SECONDARY_TEXT_COLOR};
    padding-horizontal: 5;
    text-align: center;

`

class OrderDetail extends Component{
    constructor(props){
        super(props)

        this._getConfirmationFooter = this._getConfirmationFooter.bind(this)
    }

    componentDidMount(){
        //fetch order details
        let order = this.props.navigation.getParam("order")        
        this.props.fetchOrderDetails(order.id)
    }


    componentDidUpdate(prevProps, prevState, snapShot){
        if(
            prevProps.updateOrderStatusProcess.status === processTypes.PROCESSING &&
            this.props.updateOrderStatusProcess.status === processTypes.SUCCESS
        )
        {
            //reset the update order status process
            setTimeout(()=>{ this.props.resetUpdateOrderStatus()}, 3000)
        }
    }

    _getFooter(orderDetails){
        const statusesRequiringConfirmation = [orderStatus.CREATED, orderStatus.READY_FOR_PROCESSING , orderStatus.RECEIVED_BY_STORE]

        if ( statusesRequiringConfirmation.includes( orderDetails.orderStatus )){
            //prompt the user to confirm the orders
            return(
                this._getConfirmationFooter()
            )
        }
        else{
            return (

                <ButtonFooter buttonText="Complete"/>
            )
        }
    }

    _getConfirmationFooter(){
        let { updateOrderStatusProcess, orderDetails, updateOrderStatus} = this.props
        let showDefault = updateOrderStatusProcess.status === processTypes.IDLE
        let showLoading = updateOrderStatusProcess.status === processTypes.PROCESSING
        let showSuccess = updateOrderStatusProcess.status === processTypes.SUCCESS
        let showError = updateOrderStatusProcess.status === processTypes.ERROR

        return(
            <Fragment>
                {showDefault &&(
                    <ConfirmationFooter onPress={()=>{ updateOrderStatus(orderDetails, orderStatus.IN_PROCESSING)}} >
                        <ConfirmationPrimaryText>
                            Confirm order
                        </ConfirmationPrimaryText>
                        <ConfirmationSecondaryText>
                            {orderDetails.orderContactPerson.split(' ')[0] } will be notified that their order is in progress.
                        </ConfirmationSecondaryText>
                    </ConfirmationFooter>
                )}
                {showLoading &&(
                    <ConfirmationFooter >
                        <ActivityIndicator size="large" color="#ffffff"/>
                        <ConfirmationSecondaryText>
                            Confirming
                        </ConfirmationSecondaryText>
                    </ConfirmationFooter>
                )} 
                {showSuccess &&(
                    <ConfirmationFooter color={"green"} >
                        <ConfirmationPrimaryText>
                            Success
                        </ConfirmationPrimaryText>
                        <ConfirmationSecondaryText>
                            {orderDetails.orderContactPerson.split(' ')[0] } has been notified
                        </ConfirmationSecondaryText>
                    </ConfirmationFooter>
                )}
                {showError &&(
                    <ConfirmationFooter color={"black"} onPress={()=>{ updateOrderStatus(orderDetails, orderStatus.IN_PROCESSING)}} >
                        <ConfirmationPrimaryText>
                            ERROR
                        </ConfirmationPrimaryText>
                        <ConfirmationSecondaryText>
                            An error has occurred while updating the order. Please retry
                        </ConfirmationSecondaryText>
                    </ConfirmationFooter>
                )}
                    
            </Fragment>
        )

    }

    
    

    render(){
        let {theme, orderDetails, fetchOrderDetailsProcess} = this.props
        let showDetails = fetchOrderDetailsProcess.status === processTypes.SUCCESS
        
        return(
            <ThemeProvider theme={theme} >
                <Wrapper>
                    <Header title={`${orderDetails.orderContactPerson}'s order`} canGoBack={true} theme={theme} goBack={this.props.navigation.goBack}/>
                    <Content>
                        <Section>

                        <UnderlineHeader title="Order Details"/>
                        <Field>
                            {/* <Label>Contact person:</Label> */}
                            <Value>{orderDetails.orderContactPerson}</Value>
                        </Field>
                        <Field>
                            {/* <Label>Delivery time:</Label> */}
                            <Value>{moment(orderDetails.pickupTime).format("hh:mm a")}</Value>
                        </Field>

                        {showDetails &&(
                            <OrderSummary orderItems={orderDetails.orderOrderItem} />
                        )}
                        </Section>
                        <Section>

                            <UnderlineHeader title="Products"/>
                            <ProductListContainer>
                                <ProductList products={orderDetails.orderOrderItem}/>
                            </ProductListContainer>
                            
                        </Section>

                    </Content>
                    {
                        this._getFooter(orderDetails)
                    }
                </Wrapper>
            </ThemeProvider>
        )
    }
}

const mapStateToProps = state =>({
    theme: getTheme(state),
    fetchOrderDetailsProcess: getFetchOrderDetailsProcess(state),
    orderDetails : getOrderDetails(state),

    updateOrderStatusProcess: getUpdateOrderStatusProcess(state)
})

const mapDispatchToProps = dispatch =>({
    fetchOrderDetails: bindActionCreators(fetchOrderDetails, dispatch),
    updateOrderStatus: bindActionCreators(updateOrderStatus, dispatch),
    resetUpdateOrderStatus: bindActionCreators(resetUpdateOrderStatus, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)