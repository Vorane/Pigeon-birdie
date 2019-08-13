import React, {Component, Fragment} from "react"
import {Text, View, ActivityIndicator} from "react-native"
import styled, {ThemeProvider} from "styled-components"
import {connect} from "react-redux"
import moment from "moment"
import { bindActionCreators} from "redux"
import Loader from "react-native-easy-content-loader";


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
        this._onProductPress = this._onProductPress.bind(this)
    }

    componentDidMount(){
        //fetch order details
        let order = this.props.navigation.getParam("order")        
        this.props.fetchOrderDetails(order.id)
    }

    componentWillUnmount(){
        this.props.resetUpdateOrderStatus()
    }


    componentDidUpdate(prevProps, prevState, snapShot){
        if( prevProps.updateOrderStatusProcess.status !== processTypes.SUCCESS &&
            this.props.updateOrderStatusProcess.status === processTypes.SUCCESS
        ) {
            if(                
                this.props.orderDetails.orderStatus === orderStatus.READY_FOR_DELIVERY 
            ){
                setTimeout(()=>{ 
                    this.props.resetUpdateOrderStatus()
                    this.props.navigation.goBack()
                }, 2000)

            }
            if(
                this.props.orderDetails.orderStatus === orderStatus.IN_PROCESSING
            ){                
                this.props.resetUpdateOrderStatus()                
            }
        }
            
        
    }

    _onProductPress(product){
        this.props.navigation.navigate("ProductDetailPage",{product})
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
                this._getCompleteFooter()
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
    _getCompleteFooter(){
        let { updateOrderStatusProcess,  updateOrderStatus, orderDetails} = this.props
        let showDefault = updateOrderStatusProcess.status === processTypes.IDLE
        let showLoading = updateOrderStatusProcess.status === processTypes.PROCESSING
        let showSuccess = updateOrderStatusProcess.status === processTypes.SUCCESS
        let showError = updateOrderStatusProcess.status === processTypes.ERROR

        return(
            <Fragment>
                {showDefault &&(
                    <ButtonFooter 
                        pressHandler={()=>{ updateOrderStatus(orderDetails, orderStatus.READY_FOR_DELIVERY)}} 
                        buttonText={"Complete order"}/>
                )}
                {showLoading &&(
                    <ButtonFooter  
                        loading={true} 
                        buttonText={"Completing order"}/>
                )}
                {showError &&(
                    <ButtonFooter      
                        color={"black"}                   
                        buttonText={"Error Completing order"}/>
                )}
                {showSuccess &&(
                    <ConfirmationFooter color={"green"} disabled >
                        <ConfirmationPrimaryText>
                            Success
                        </ConfirmationPrimaryText>
                    </ConfirmationFooter>
                )}
            </Fragment>
        )
    }

    _getDetailsLoader(){
        return(
            <Loader
                primaryColor='rgba(195, 191, 191, 1)'
                secondaryColor='rgba(218, 215, 215, 1)'
                animationDuration={500}
                loading={true}
                title={false}
                pRows={5}
                pWidth={["30%","30%","100%","100%","100%"]}
                active
                >    
            </Loader>
        )
    }
    _getProductsLoader(){
        return(
            <Loader
                primaryColor='rgba(195, 191, 191, 1)'
                secondaryColor='rgba(218, 215, 215, 1)'
                animationDuration={500}
                loading={true}
                pRows={5}
                active
                >    
            </Loader>
        )
    }

    


    
    

    render(){
        let {theme, orderDetails, fetchOrderDetailsProcess} = this.props
        let showLoading = fetchOrderDetailsProcess.status === processTypes.PROCESSING
        let showDetails = fetchOrderDetailsProcess.status === processTypes.SUCCESS
        
        return(
            <ThemeProvider theme={theme} >
                <Wrapper>
                    <Header title={`${orderDetails.orderContactPerson}'s order`} canGoBack={true} theme={theme} goBack={this.props.navigation.goBack}/>
                    <Content>
                        <Section>
                            <UnderlineHeader title="Order Details"/>
                            {showDetails &&(
                                <Section>
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
                            )}
                            {showLoading &&(
                                <Section>
                                {this._getDetailsLoader()}
                                </Section>
                            )}
                        </Section>
                        <Section>
                            <UnderlineHeader title="Products"/>
                            {showLoading &&(
                                <Fragment>
                                    {[1,2,3,4,5].map((index)=>(
                                        <Field>

                                            <Loader
                                                key={index}
                                                primaryColor='rgba(195, 191, 191, 1)'
                                                secondaryColor='rgba(218, 215, 215, 1)'
                                                animationDuration={500}
                                                loading={true}
                                                title={false}
                                                pRows={2}
                                                pWidth={["100%","20%"]}
                                                active
                                                avatar/>
                                        </Field>
                                    ))}
                                    
                                </Fragment>
                            )}
                            <ProductListContainer>
                                <ProductList products={orderDetails.orderOrderItem} orderPressHandler={this._onProductPress}/>
                            </ProductListContainer>    
                        </Section>

                    </Content>
                    {
                        showDetails &&(
                            <Fragment>
                                {this._getFooter(orderDetails)}
                            </Fragment>
                        )
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