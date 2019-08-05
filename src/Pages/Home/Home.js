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

const Wrapper = styled.View``;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
    this._onRefresh = this._onRefresh.bind(this);
  }
  componentDidMount() {
    this.props.fetchTodaysOrders();
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.fetchTodaysOrders();
  };

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
          />
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={showOrdersLoading}
                onRefresh={this._onRefresh}
              />
            }
          >
            <SectionHeader title='Today' />
            <OrderList orders={orders.orders} />
          </ScrollView>
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
)(Home);
