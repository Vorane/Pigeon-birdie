import React, {Component} from "react"
import {Text} from "react-native"
import styled, {ThemeProvider} from "styled-components"
import {connect} from "react-redux"
import moment from "moment"
import { bindActionCreators} from "redux"


//Import store actions and selectors
import * as processTypes from "../../Store/Shared/processTypes"
import { getTheme } from "../../Store/Configuration/selectors"
import { fetchOrderDetails } from "../../Store/Orders/actions"
import { getFetchOrderDetailsProcess, getOrderDetails  } from "../../Store/Orders/selectors"

//Import local Components
import UnderlineHeader from "../../Components/Header/UnderlineHeader"
import Header from "../../Components/Header/Header"
import ProductList from "../../Components/Products/ProductList"
import OrderSummary from "../../Components/Orders/OrderSummary"

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

class OrderDetail extends Component{
    constructor(props){
        super(props)

    }

    componentDidMount(){
        //fetch order details
        let order = this.props.navigation.getParam("order")        
        this.props.fetchOrderDetails(order.id)
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
                </Wrapper>
            </ThemeProvider>
        )
    }
}

const mapStateToProps = state =>({
    theme: getTheme(state),
    fetchOrderDetailsProcess: getFetchOrderDetailsProcess(state),
    orderDetails : getOrderDetails(state)
})

const mapDispatchToProps = dispatch =>({
    fetchOrderDetails: bindActionCreators(fetchOrderDetails, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)