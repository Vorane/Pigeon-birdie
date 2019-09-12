import React, { Component, Fragment } from "react";
import { Linking, Platform, ActivityIndicator } from "react-native";
import styled, { ThemeProvider } from "styled-components";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Loader from "react-native-easy-content-loader";
import FeatherIcon from "react-native-vector-icons/Feather";
import FAIcon from "react-native-vector-icons/FontAwesome5";
import MUIcon from "react-native-vector-icons/MaterialCommunityIcons";

//Import store actions and selectors
import * as processTypes from "../../Store/Shared/processTypes";
import * as orderStatus from "../../Store/Orders/orderStatus";
import { getTheme } from "../../Store/Configuration/selectors";

//Import local Components
import UnderlineHeader from "../../Components/Header/UnderlineHeader";
import Header from "../../Components/Header/Header";
import OrderSummary from "../../Components/Orders/OrderSummary";
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

//Define Local Styled Components
const Wrapper = styled.View`
  flex: 1;
`;

const Content = styled.ScrollView`
  padding-horizontal: 10;
`;

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

const Section = styled.View``;

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

class OrderDelivery extends Component {
  constructor(props) {
    super(props);
    this._openMaps = this._openMaps.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (
      prevProps.updateOrderStatusProcess.status !== processTypes.SUCCESS &&
      this.props.updateOrderStatusProcess.status === processTypes.SUCCESS
    ) {
      if (
        this.props.orderDetails.orderStatus === orderStatus.DELIVERY_IN_PROGRESS
      ) {
        // maintain the current page
        this.props.resetUpdateOrderStatus();
      } else {
        setTimeout(() => {
          this.props.resetUpdateOrderStatus();
          this.props.navigation.goBack();
        }, 100);
      }
    }
  }
  componentWillUnmount() {
    this.props.resetUpdateOrderStatus();
  }

  _openMaps = () => {
    let orderDetails = this.props.navigation.getParam("order");
    this.props.updateOrderStatus(
      orderDetails,
      orderStatus.DELIVERY_IN_PROGRESS
    );
    let coordinates = orderDetails.deliveryCoordinates;
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q="
    });
    const latLng = `${coordinates.split(",")[0]},${coordinates.split(",")[1]}`;
    const label = "Custom Label";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);
  };

  render() {
    let {
      theme,
      navigation,
      updateOrderStatusProcess,
      updateOrderStatus
    } = this.props;
    let orderDetails = navigation.getParam("order");
    let showUpdateStatusLoading =
      updateOrderStatusProcess.status === processTypes.PROCESSING;
    let showUpdateStatusSuccess =
      updateOrderStatusProcess.status === processTypes.SUCCESS;
    let showUpdateStatusIdle =
      updateOrderStatusProcess.status === processTypes.IDLE;
    let showUpdateStatusError =
      updateOrderStatusProcess.status === processTypes.ERROR;
    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          <Header
            title="Order Delivery"
            theme={theme}
            canGoBack={true}
            goBack={navigation.goBack}
          />
          <Content>
            <Section>
              <UnderlineHeader title="Start Delivery" />
              <OptionSection>
                <OptionField onPress={this._openMaps}>
                  <FAIcon name="map-marked-alt" size={20} color={"#3d3d3d"} />
                  <OptionLabel>Start delivery</OptionLabel>
                </OptionField>
              </OptionSection>
            </Section>
            <Section>
              <UnderlineHeader title="Order options" />
              <OptionsContainer>
                <OptionSection>
                  <OptionField onPress={this._callCustomer}>
                    <MUIcon name="phone" size={20} color={"#3d3d3d"} />
                    <OptionLabel>
                      Call {orderDetails.orderContactPerson}
                    </OptionLabel>
                  </OptionField>
                  <OptionField onPress={this._onPressWhatsAppCard}>
                    <FAIcon name="whatsapp" size={20} color={"#3d3d3d"} />
                    <OptionLabel>Text on whatsapp</OptionLabel>
                  </OptionField>
                  {showUpdateStatusIdle ? (
                    <OptionField
                      onPress={() => {
                        this.props.updateOrderStatus(
                          orderDetails,
                          orderStatus.IN_PROCESSING
                        );
                      }}
                    >
                      <FAIcon name="undo" size={15} color={"#3d3d3d"} />
                      <OptionLabel>Return to processing</OptionLabel>
                    </OptionField>
                  ) : (
                    <Fragment>
                      {showUpdateStatusLoading ? (
                        <OptionField disabled>
                          <ActivityIndicator
                            color={theme.PRIMARY_COLOR}
                            size="small"
                          />
                          <OptionLabel>Updating order</OptionLabel>
                        </OptionField>
                      ) : (
                        <Fragment>
                          {showUpdateStatusError ? (
                            <OptionField disabled>
                              <FeatherIcon
                                name="alert-circle"
                                size={15}
                                color={theme.PRIMARY_COLOR}
                              />
                              <OptionLabel>
                                An error occured while updating the order.
                              </OptionLabel>
                            </OptionField>
                          ) : (
                            <OptionField disabled>
                              <FeatherIcon
                                name="check"
                                size={15}
                                color={"green"}
                              />
                              <OptionLabel>
                                Successfully updated order
                              </OptionLabel>
                            </OptionField>
                          )}
                        </Fragment>
                      )}
                    </Fragment>
                  )}
                </OptionSection>
              </OptionsContainer>
            </Section>
            <Section>
              <UnderlineHeader title="Order details" />
              <OrderSummary orderItems={orderDetails.orderOrderItem} />
            </Section>
            <Section>
              <UnderlineHeader title="Complete Order" />
              {showUpdateStatusIdle ? (
                <ConfirmationFooter
                  onPress={() => {
                    updateOrderStatus(orderDetails, orderStatus.DELIVERED);
                  }}
                >
                  <ConfirmationPrimaryText>
                    Mark as delivered
                  </ConfirmationPrimaryText>
                </ConfirmationFooter>
              ) : (
                <Fragment>
                  {showUpdateStatusLoading ? (
                    <ConfirmationFooter>
                      <ActivityIndicator size="large" color="#ffffff" />
                      <ConfirmationSecondaryText>
                        Confirming
                      </ConfirmationSecondaryText>
                    </ConfirmationFooter>
                  ) : (
                    <Fragment>
                      {showUpdateStatusSuccess ? (
                        <ConfirmationFooter color={"green"}>
                          <ConfirmationPrimaryText>
                            Success
                          </ConfirmationPrimaryText>
                          <ConfirmationSecondaryText>
                            Success
                          </ConfirmationSecondaryText>
                        </ConfirmationFooter>
                      ) : (
                        // Show error
                        <ConfirmationFooter
                          color={"black"}
                          onPress={() => {
                            this.props.updateOrderStatus(
                              orderDetails,
                              orderStatus.DELIVERED
                            );
                          }}
                        >
                          <ConfirmationPrimaryText>
                            ERROR
                          </ConfirmationPrimaryText>
                          <ConfirmationSecondaryText>
                            An error has occurred while updating the order.
                            Please retry
                          </ConfirmationSecondaryText>
                        </ConfirmationFooter>
                      )}
                    </Fragment>
                  )}
                </Fragment>
              )}
            </Section>
          </Content>
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
)(OrderDelivery);
