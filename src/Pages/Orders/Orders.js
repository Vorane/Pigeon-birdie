import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { View, ScrollView, RefreshControl } from "react-native";
import styled, { ThemeProvider } from "styled-components";
import { bindActionCreators } from "redux";

//import store actions and selectors
import * as processTypes from "../../Store/Shared/processTypes";
import { getTheme } from "../../Store/Configuration/selectors";
import { getFetchOrdersProcess, getOrders } from "../../Store/Orders/selectors";
import { fetchTodaysOrders } from "../../Store/Orders/actions";

//Import local components
import Header from "../../Components/Header/DrawerHeader";
import SectionHeader from "../../Components/Header/SectionHeader";
import OrderList from "../../Components/Orders/OrderLists";

const Wrapper = styled.View`
flex:1;

`;
const ContentWrapper = styled.ScrollView`
`;

class Orders extends Component {
  constructor(props) {
    super(props);
    
    this._onRefresh = this._onRefresh.bind(this);
    this._onOrderPress = this._onOrderPress.bind(this);
    this._fetchOrders = this._fetchOrders.bind(this)
  }
  componentDidMount() {
    
    const { drawerNavigation } = this.props.screenProps;
    this.focusListener = drawerNavigation.addListener("didFocus", () => {
      // The screen is focused
      this._fetchOrders();
    });
  }
  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }
  
  _fetchOrders(){
    this.props.fetchTodaysOrders(this.props.screenProps.status);
    
  }
  
  _onRefresh = () => {
    
    this.props.fetchTodaysOrders(this.props.screenProps.status);
  };

  _onOrderPress = (order)=>{
    
    this.props.navigation.navigate("OrderDetailsPage",{order: order})
  }

  render() {
    let { theme, screenProps, orders, fetchOrdersProcess } = this.props;
    let showOrdersLoading =
      fetchOrdersProcess.status === processTypes.PROCESSING;
    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          <Header
            theme={theme}
            onMenuPress={() => {
              screenProps.drawerNavigation.openDrawer();
            }}
            title={screenProps.title}
          />
          <ContentWrapper
            refreshControl={
              <RefreshControl
                refreshing={showOrdersLoading}
                onRefresh={this._onRefresh}
              />
            }
          >
            <SectionHeader title='Today' />
            <OrderList orders={orders.orders} orderItemPress={this._onOrderPress} />
          </ContentWrapper>
        </Wrapper>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  theme: getTheme(state),
  orders: getOrders(state),
  fetchOrdersProcess: getFetchOrdersProcess(state)
});
const mapDispatchToProps = dispatch => ({
  fetchTodaysOrders: bindActionCreators(fetchTodaysOrders, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders);
