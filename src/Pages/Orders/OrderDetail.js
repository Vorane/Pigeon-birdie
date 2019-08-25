import React, { Component, Fragment } from "react";
import {
  RefreshControl,
  ActivityIndicator,
  Linking,
  Platform
} from "react-native";
import styled, { ThemeProvider } from "styled-components";
import { connect } from "react-redux";
import moment from "moment";
import { bindActionCreators } from "redux";
import Loader from "react-native-easy-content-loader";
import FAIcon from "react-native-vector-icons/FontAwesome";
import FeatherIcon from "react-native-vector-icons/Feather";
import Modal from "react-native-modalbox";

//Import store actions and selectors
import * as processTypes from "../../Store/Shared/processTypes";
import * as orderStatus from "../../Store/Orders/orderStatus";
import AddProduct from "../../Components/Products/AddProduct";

import * as orderStatusDetails from "../../Store/Orders/orderStatus";
import { getTheme } from "../../Store/Configuration/selectors";
import {
  fetchOrderDetails,
  updateOrderStatus,
  resetUpdateOrderStatus
} from "../../Store/Orders/actions";
import {
  getFetchOrderDetailsProcess,
  getUpdateOrderStatusProcess,
  getOrderDetails
} from "../../Store/Orders/selectors";

//Import local Components
import UnderlineHeader from "../../Components/Header/UnderlineHeader";
import Header from "../../Components/Header/Header";
import ProductList from "../../Components/Products/ProductList";
import OrderSummary from "../../Components/Orders/OrderSummary";
import ButtonFooter from "../../Components/Footer/ButtonFooter";

//Define Local Styled Components
const Wrapper = styled.View`
  flex: 1;
`;

const Content = styled.ScrollView`
  padding-horizontal: 10;
`;

const Section = styled.View``;

const Field = styled.View`
  padding-top: 5;
  flex-direction: row;
  justify-content: flex-start;
`;

const OptionsContainer = styled.View`
  padding-horizontal: 5;
  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
`;
const OptionSection = styled.View`
  padding-vertical: 5;
`;
const OptionField = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center
    padding-vertical: 10;
`;
const OptionLabel = styled.Text`
    color: ${props => props.theme.PRIMARY_TEXT_COLOR};
    font-family: ${props => props.theme.SECONDARY_FONT_FAMILY};
    font-size: ${props => props.theme.FONT_SIZE_MEDIUM}    
    padding-horizontal: 15;
`;

const Value = styled.Text`
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY_SEMI_BOLD};
  font-size: ${props => props.theme.FONT_SIZE_MEDIUM};
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  padding-horizontal: 5;
`;

const ProductListContainer = styled.View`
  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
  
  padding-horizontal: 2.5;
  padding-vertical: 2.5;
`;

const ConfirmationFooter = styled.TouchableOpacity`
  padding-vertical: 10;
  background-color: ${props =>
    props.color ? props.color : props.theme.PRIMARY_COLOR};

  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const ConfirmationPrimaryText = styled.Text`
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY_SEMI_BOLD};
  font-size: ${props => props.theme.FONT_SIZE_LARGE};
  color: ${props => props.theme.SECONDARY_TEXT_COLOR};
  padding-horizontal: 5;
  text-align: center;
`;
const ConfirmationSecondaryText = styled.Text`
  font-family: ${props => props.theme.PRIMARY_FONT_FAMILY};
  font-size: ${props => props.theme.FONT_SIZE_SMALL};
  color: ${props => props.theme.SECONDARY_TEXT_COLOR};
  padding-horizontal: 5;
  text-align: center;
`;
const OutletSearchModal = styled(Modal)`
  elevation:4;
  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
  height: 90%;
`;

class OrderDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddProductModalOpen: false
    };
    this._getConfirmationFooter = this._getConfirmationFooter.bind(this);
    this._onProductPress = this._onProductPress.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this._callCustomer = this._callCustomer.bind(this);
    this._onPressWhatsAppCard = this._onPressWhatsAppCard.bind(this);
    this._openAddProductModal = this._openAddProductModal.bind(this);
    this._closeAddProductModal = this._closeAddProductModal.bind(this);
    this._onAddProductModalComplete = this._onAddProductModalComplete.bind(
      this
    );
  }

  componentDidMount() {
    //fetch order details
    let order = this.props.navigation.getParam("order");
    this.props.fetchOrderDetails(order.id);
  }

  componentWillUnmount() {
    this.props.resetUpdateOrderStatus();
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (
      prevProps.updateOrderStatusProcess.status !== processTypes.SUCCESS &&
      this.props.updateOrderStatusProcess.status === processTypes.SUCCESS
    ) {
      if (
        this.props.orderDetails.orderStatus === orderStatus.READY_FOR_DELIVERY
      ) {
        setTimeout(() => {
          this.props.resetUpdateOrderStatus();
          this.props.navigation.goBack();
        }, 2000);
      }
      if (this.props.orderDetails.orderStatus === orderStatus.IN_PROCESSING) {
        this.props.resetUpdateOrderStatus();
      }
    }
  }

  _callCustomer = () => {
    let phoneNumber = this.props.orderDetails.wallet.phoneNumber;

    if (Platform.OS === "android") {
      phoneNumber = `tel:${phoneNumber}`;
    } else {
      phoneNumber = `telprompt:${phoneNumber}`;
    }

    Linking.openURL(phoneNumber);
  };

  _onPressWhatsAppCard = () => {
    let phoneNumber = this.props.orderDetails.wallet.phoneNumber;
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };

  _onRefresh = () => {
    let order = this.props.navigation.getParam("order");
    this.props.fetchOrderDetails(order.id);
  };

  _onProductPress(product) {
    this.props.navigation.navigate("ProductDetailPage", {
      product,
      order: this.props.navigation.getParam("order")
    });
  }

  _getFooter(orderDetails) {
    const statusesRequiringConfirmation = [
      orderStatus.CREATED,
      orderStatus.READY_FOR_PROCESSING,
      orderStatus.RECEIVED_BY_STORE
    ];

    if (statusesRequiringConfirmation.includes(orderDetails.orderStatus)) {
      //prompt the user to confirm the orders
      return this._getConfirmationFooter();
    } else {
      return this._getCompleteFooter();
    }
  }
  _getConfirmationFooter() {
    let {
      updateOrderStatusProcess,
      orderDetails,
      updateOrderStatus
    } = this.props;
    let showDefault = updateOrderStatusProcess.status === processTypes.IDLE;
    let showLoading =
      updateOrderStatusProcess.status === processTypes.PROCESSING;
    let showSuccess = updateOrderStatusProcess.status === processTypes.SUCCESS;
    let showError = updateOrderStatusProcess.status === processTypes.ERROR;

    return (
      <Fragment>
        {showDefault && (
          <ConfirmationFooter
            onPress={() => {
              updateOrderStatus(orderDetails, orderStatus.IN_PROCESSING);
            }}
          >
            <ConfirmationPrimaryText>Confirm order</ConfirmationPrimaryText>
            <ConfirmationSecondaryText>
              {orderDetails.orderContactPerson.split(" ")[0]} will be notified
              that their order is in progress.
            </ConfirmationSecondaryText>
          </ConfirmationFooter>
        )}
        {showLoading && (
          <ConfirmationFooter>
            <ActivityIndicator size="large" color="#ffffff" />
            <ConfirmationSecondaryText>Confirming</ConfirmationSecondaryText>
          </ConfirmationFooter>
        )}
        {showSuccess && (
          <ConfirmationFooter color={"green"}>
            <ConfirmationPrimaryText>Success</ConfirmationPrimaryText>
            <ConfirmationSecondaryText>
              {orderDetails.orderContactPerson.split(" ")[0]} has been notified
            </ConfirmationSecondaryText>
          </ConfirmationFooter>
        )}
        {showError && (
          <ConfirmationFooter
            color={"black"}
            onPress={() => {
              updateOrderStatus(orderDetails, orderStatus.IN_PROCESSING);
            }}
          >
            <ConfirmationPrimaryText>ERROR</ConfirmationPrimaryText>
            <ConfirmationSecondaryText>
              An error has occurred while updating the order. Please retry
            </ConfirmationSecondaryText>
          </ConfirmationFooter>
        )}
      </Fragment>
    );
  }
  _getCompleteFooter() {
    let {
      updateOrderStatusProcess,
      updateOrderStatus,
      orderDetails
    } = this.props;
    let showDefault = updateOrderStatusProcess.status === processTypes.IDLE;
    let showLoading =
      updateOrderStatusProcess.status === processTypes.PROCESSING;
    let showSuccess = updateOrderStatusProcess.status === processTypes.SUCCESS;
    let showError = updateOrderStatusProcess.status === processTypes.ERROR;

    return (
      <Fragment>
        {showDefault && (
          <ButtonFooter
            pressHandler={() => {
              updateOrderStatus(orderDetails, orderStatus.READY_FOR_DELIVERY);
            }}
            buttonText={"Complete order"}
          />
        )}
        {showLoading && (
          <ButtonFooter loading={true} buttonText={"Completing order"} />
        )}
        {showError && (
          <ButtonFooter color={"black"} buttonText={"Error Completing order"} />
        )}
        {showSuccess && (
          <ConfirmationFooter color={"green"} disabled>
            <ConfirmationPrimaryText>Success</ConfirmationPrimaryText>
          </ConfirmationFooter>
        )}
      </Fragment>
    );
  }

  _getDetailsLoader() {
    return (
      <Loader
        primaryColor="rgba(195, 191, 191, 1)"
        secondaryColor="rgba(218, 215, 215, 1)"
        animationDuration={500}
        loading={true}
        title={false}
        pRows={5}
        pWidth={["30%", "30%", "100%", "100%", "100%"]}
        active
      ></Loader>
    );
  }
  _getProductsLoader() {
    return (
      <Loader
        primaryColor="rgba(195, 191, 191, 1)"
        secondaryColor="rgba(218, 215, 215, 1)"
        animationDuration={500}
        loading={true}
        pRows={5}
        active
      ></Loader>
    );
  }

  _openAddProductModal() {
    this.setState({
      ...this.state,
      isAddProductModalOpen: true
    });
  }
  _closeAddProductModal() {    
    this.setState({
      ...this.state,
      isAddProductModalOpen: false
    });
  }
  _onAddProductModalComplete() {
    //fetch order details
    let order = this.props.navigation.getParam("order");
    this.props.fetchOrderDetails(order.id);
  }

  render() {
    let order = this.props.navigation.getParam("order");
    let { theme, orderDetails, fetchOrderDetailsProcess } = this.props;
    let showLoading =
      fetchOrderDetailsProcess.status === processTypes.PROCESSING;
    let showDetails = fetchOrderDetailsProcess.status === processTypes.SUCCESS;

    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          <Header
            title={`${orderDetails.orderContactPerson}'s order`}
            canGoBack={true}
            theme={theme}
            goBack={this.props.navigation.goBack}
          />
          <Content
            refreshControl={
              <RefreshControl
                refreshing={showLoading}
                onRefresh={this._onRefresh}
              />
            }
          >
            <Section>
              <UnderlineHeader title="Order Details" />
              {showDetails && (
                <Section>
                  <Field>
                    {/* <Label>Contact person:</Label> */}
                    <Value>{orderDetails.orderContactPerson}</Value>
                  </Field>
                  <Field>
                    {/* <Label>Delivery time:</Label> */}
                    <Value>
                      {moment(orderDetails.pickupTime).format("hh:mm a")}
                    </Value>
                  </Field>

                  {showDetails && (
                    <OrderSummary orderItems={orderDetails.orderOrderItem} />
                  )}
                </Section>
              )}
              {showLoading && <Section>{this._getDetailsLoader()}</Section>}
            </Section>
            <Section>
              <UnderlineHeader title="Options" />
              {showLoading ? (
                <Loader
                  primaryColor="rgba(195, 191, 191, 1)"
                  secondaryColor="rgba(218, 215, 215, 1)"
                  animationDuration={500}
                  loading={true}
                  title={false}
                  pRows={3}
                  pWidth={["75%", "75%", "75%"]}
                  active
                />
              ) : (
                <OptionsContainer>
                  <OptionSection>
                    <OptionField onPress={this._callCustomer}>
                      <FeatherIcon name="phone" size={15} color={"#3d3d3d"} />
                      <OptionLabel>
                        Call {orderDetails.orderContactPerson}
                      </OptionLabel>
                    </OptionField>
                    <OptionField onPress={this._onPressWhatsAppCard}>
                      <FAIcon name="whatsapp" size={15} color={"#3d3d3d"} />
                      <OptionLabel>Text on whatsapp</OptionLabel>
                    </OptionField>
                    <OptionField onPress={this._openAddProductModal}>
                      <FeatherIcon
                        name="shopping-bag"
                        size={15}
                        color={"#3d3d3d"}
                      />
                      <OptionLabel>Add product to order</OptionLabel>
                    </OptionField>
                  </OptionSection>
                </OptionsContainer>
              )}
            </Section>
            <Section>
              <UnderlineHeader title="Products" />
              {showLoading && (
                <Fragment>
                  {[1, 2, 3, 4, 5].map(index => (
                    <Field>
                      <Loader
                        key={index}
                        primaryColor="rgba(195, 191, 191, 1)"
                        secondaryColor="rgba(218, 215, 215, 1)"
                        animationDuration={500}
                        loading={true}
                        title={false}
                        pRows={2}
                        pWidth={["100%", "20%"]}
                        active
                        avatar
                      />
                    </Field>
                  ))}
                </Fragment>
              )}
              <ProductListContainer>
                <ProductList
                  products={orderDetails.orderOrderItem}
                  orderPressHandler={this._onProductPress}
                />
              </ProductListContainer>
            </Section>
          </Content>
          {showDetails && <Fragment>{this._getFooter(orderDetails)}</Fragment>}
          <OutletSearchModal
            backButtonClose={true}
            isOpen={this.state.isAddProductModalOpen}
            onClosed={this._closeAddProductModal}
            position={"bottom"}
          >
            <AddProduct
              close={this._closeAddProductModal}
              order={order}
              orderItem={null}
              complete={this._onAddProductModalComplete}
              title="Add Product"
            />
          </OutletSearchModal>
        </Wrapper>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  theme: getTheme(state),
  fetchOrderDetailsProcess: getFetchOrderDetailsProcess(state),
  orderDetails: getOrderDetails(state),

  updateOrderStatusProcess: getUpdateOrderStatusProcess(state)
});

const mapDispatchToProps = dispatch => ({
  fetchOrderDetails: bindActionCreators(fetchOrderDetails, dispatch),
  updateOrderStatus: bindActionCreators(updateOrderStatus, dispatch),
  resetUpdateOrderStatus: bindActionCreators(resetUpdateOrderStatus, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetail);
