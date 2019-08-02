  import React from "react";
import { connect } from "react-redux"
import {View, Text} from "react-native"
import styled , {ThemeProvider  } from "styled-components"

//import store actions and selectors
import { getTheme } from "../../Store/Configuration/selectors"

import Header from "../../Components/Header/DrawerHeader"
import Section from "../../Components/Layout/Section"


const Wrapper = styled.View`

`

const Home = ({theme, screenProps}) =>{
    return(
        <ThemeProvider theme={theme}>

        <View full >
            <Header  theme={theme} 
            onMenuPress={() => {
              screenProps.drawerNavigation.openDrawer();
            }}
            />
            <Text>Home</Text>
        </View>
        </ThemeProvider>
    )
}

const mapStateToProps = (state) => ({theme : getTheme(state)})


export default connect(mapStateToProps)(Home)