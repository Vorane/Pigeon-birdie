import React, { Component, Fragment } from "React";
import styled, { ThemeProvider } from "styled-components";

import { StackActions, NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import FeatherIcon from "react-native-vector-icons/Feather";

//import store actions and selectors
import { getTheme } from "../../Store/Configuration/selectors";

//Define local styled components
const Wrapper = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
`;

const IconsListContainer = styled.View`
  background-color: #fbfbfb;
  padding-top: 10;
  padding-horizontal: 5;
  elevation: 5;
`;

const IconContainer = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding-horizontal: 10;
  padding-vertical: 10;
  border-radius: 40;
  margin-vertical: 10;
  margin-horizontal: 5;
  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
`;
const SelectedIconContainer = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding-horizontal: 10;
  padding-vertical: 10;
  border-radius: 5;
  margin-vertical: 10;
  margin-horizontal: 5;
  background-color: ${props => props.theme.PRIMARY_COLOR};
`;

const ListContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.PRIMARY_BACKGROUND_COLOR};
`;

const ListHeader = styled.View`
  padding-horizontal: 10;
  padding-top: 20;
  border-bottom-width: 0.4;
  border-bottom-color: #dfdfdf;
`;
const ListHeaderTitle = styled.Text`
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.SECONDARY_FONT_FAMILY_BOLD};
  font-size: ${props => props.theme.FONT_SIZE_MASSIVE};
  padding-horizontal: 0;
`;

const ListContent = styled.View`
  padding-top: 10;
  padding-horizontal: 10;
`;

const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-vertical: 5;
  padding-horizontal: 0;
`;
const MenuItemIconContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-vertical: 5;
  padding-horizontal: 5;
`;

const MenuItemTitle = styled.Text`
  color: ${props => props.theme.PRIMARY_TEXT_COLOR};
  font-family: ${props => props.theme.SECONDARY_FONT_FAMILY_SEMI_BOLD};
  font-size: ${props => props.theme.FONT_SIZE_MEDIUM};
  padding-horizontal: 15;
`;

class Drawer extends Component {
  menu = [
    {
      selected: false,
      title: "Orders",
      icon: "tag",
      menus: [
        {
          title: "Pending",
          icon: "shopping-cart",
          route: "PendingOrders"
        },
        {
          title: "Deliveries",
          icon: "map-pin",
          route: "Deliveries"
        },
        {
          title: "Completed",
          icon: "check",
          route: "Completed"
        },
        {
          title: "All",
          icon: "clipboard",
          route: "AllOrders"
        },
        {
          title: "Require attention",
          icon: "alert-triangle",
          route: "Issues"
        },
        {
          title: "Archived",
          icon: "archive",
          route: "PendingOrders"
        }
      ]
    },
    {
      title: "Sales",
      icon: "clock",
      menus: [
        {
          title: "Pending orders",
          icon: "shopping-cart",
          route: "PendingOrders"
        },
        {
          title: "Pending orders",
          icon: "shopping-cart",
          route: "PendingOrders"
        },
        {
          title: "Pending orders",
          icon: "shopping-cart",
          route: "PendingOrders"
        },
        {
          title: "Pending orders",
          icon: "shopping-cart",
          route: "PendingOrders"
        },
        {
          title: "Pending orders",
          icon: "shopping-cart",
          route: "PendingOrders"
        }
      ]
    },
    {
      title: "Products",
      icon: "clock",
      menus: [
        {
          title: "Pending orders",
          icon: "shopping-cart",
          route: "PendingOrders"
        },
        {
          title: "Pending orders",
          icon: "shopping-cart",
          route: "PendingOrders"
        },
        {
          title: "Pending orders",
          icon: "shopping-cart",
          route: "PendingOrders"
        },
        {
          title: "Pending orders",
          icon: "shopping-cart",
          route: "PendingOrders"
        },
        {
          title: "Pending orders",
          icon: "shopping-cart",
          route: "PendingOrders"
        }
      ]
    }
  ];
  constructor(props) {
    super(props);

    this.state = {
      menu: this.menu[0],
      allMenus: this.menu
    };

    this.onMenuIconPress = this.onMenuIconPress.bind(this);
    this.onMenuListItemPress = this.onMenuListItemPress.bind(this);
  }

  onMenuIconPress(title) {
    this.setState({
      ...this.state,
      menu: this.menu.find(menuItem => menuItem.title === title)
    });
  }

  onMenuListItemPress(route) {
    //Navigate to the page
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    let { theme } = this.props;
    let { allMenus, menu: currentMenu } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          <IconsListContainer>
            <IconContainer onPress={()=>{this.onMenuListItemPress("Home");}}>
              <FeatherIcon
                color={theme.PRIMARY_TEXT_COLOR}
                size={20}
                name={"home"}
              />
            </IconContainer>
            {allMenus.map((menuItem, index) => (
              <Fragment key={index}>
                {menuItem.title === currentMenu.title ? (
                  <SelectedIconContainer
                    key={index}
                    onPress={() => {
                      this.onMenuIconPress(menuItem.title);
                    }}
                  >
                    <FeatherIcon
                      color={theme.PRIMARY_BACKGROUND_COLOR}
                      size={20}
                      name={menuItem.icon}
                    />
                  </SelectedIconContainer>
                ) : (
                  <IconContainer
                    key={index}
                    onPress={() => {
                      this.onMenuIconPress(menuItem.title);
                    }}
                  >
                    <FeatherIcon
                      color={theme.PRIMARY_TEXT_COLOR}
                      size={20}
                      name={menuItem.icon}
                    />
                  </IconContainer>
                )}
              </Fragment>
            ))}
          </IconsListContainer>
          <ListContainer>
            <ListHeader>
              <ListHeaderTitle>{currentMenu.title}</ListHeaderTitle>
            </ListHeader>
            <ListContent>
              {currentMenu.menus.map((menuListItem, index) => (
                <MenuItem
                  key={index}
                  onPress={() => {
                    this.onMenuListItemPress(menuListItem.route);
                  }}
                >
                  <MenuItemIconContainer>
                    <FeatherIcon
                      color={theme.PRIMARY_TEXT_COLOR_LIGHT}
                      size={18}
                      name={menuListItem.icon}
                    />
                  </MenuItemIconContainer>
                  <MenuItemTitle>{menuListItem.title}</MenuItemTitle>
                </MenuItem>
              ))}
            </ListContent>
          </ListContainer>
        </Wrapper>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  theme: getTheme(state)
});

export default connect(mapStateToProps)(Drawer);
