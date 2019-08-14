import React, {Component, Fragment} from "react"
import {Text, ScrollView, ActivityIndicator} from "react-native"
import styled from "styled-components"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import GridView from "react-native-super-grid"




//import local store actions and selectors
import {colorOptions} from "../../Store/Configuration/theme"
import * as processTypes from "../../Store/Shared/processTypes"
import { searchOutletProducts } from "../../Store/Products/actions"
import {getSearchOutletProductsProcess, getOutletProductsSearchResults} from "../../Store/Products/selectors"


//import local Components
import SearchBox from "../../Components/Input/SearchBox"
import ImageMessage from "../../Components/Message/ImageMessage"
import ProductCard from "./ProductCard"

//Define local styled components

const Content = styled.View`
    flex:1;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 5;
    `
const IndicatorContainer = styled.View`
    flex:1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-vertical: 20;
    
`

const ProductsGrid = styled(GridView)`
    flex:1;
`





const SearchOutletProducts = ({searchOutletProductsProcess, outletProductsSearchResults, searchOutletProducts, close, order, onProductPress}) =>{
    let showIdle = searchOutletProductsProcess.status === processTypes.IDLE
    let showLoading = searchOutletProductsProcess.status === processTypes.PROCESSING
    let showSuccess = searchOutletProductsProcess.status === processTypes.SUCCESS
    let showError = searchOutletProductsProcess.status === processTypes.ERROR

    let _onSearchSubmit = (event) =>{
        
        searchOutletProducts(order.outlet.id, event.nativeEvent.text)
    }

    return (
        
            <Content>
                <SearchBox color="#d3d3d3"
                
                
                  placeholder='Search for any product'
                  onSubmit={_onSearchSubmit}
                  color={colorOptions.gray.PRIMARY_COLOR_LIGHT}
                  returnKeyType='search'
                />
                <Fragment>
                    {showIdle ?(
                        <ImageMessage
                            message={`search for any product`}
                            image={require("../../../assets/images/search.png")}
                            buttonText='Close search'
                            hasButton
                            buttonHandler={() => {
                                close();
                            }}
                        />
                    ):(
                        <Fragment>
                            {showLoading ?(
                                <IndicatorContainer>
                                    <ActivityIndicator color="#c32727" size="large"/>
                                </IndicatorContainer>
                            ):(
                                <Fragment>
                                    {showSuccess ?(
                                        <ScrollView>
                                            <ProductsGrid 
                                                itemDimension={130}
                                                items={outletProductsSearchResults}
                                                renderItem={({ item }) => (<ProductCard product={item} productPressHandler={onProductPress}/>)}
                                                />
                                        </ScrollView>
                                    ):(
                                        // Show error
                                        <Text>Error</Text>
                                    )}
                                </Fragment>
                            )}
                        </Fragment>
                    )}
                </Fragment>
            </Content>
    )
}

const mapStateToProps = state =>({
    searchOutletProductsProcess : getSearchOutletProductsProcess(state),
    outletProductsSearchResults: getOutletProductsSearchResults(state)
})

const mapDispatchToProps = dispatch =>({
    searchOutletProducts : bindActionCreators(searchOutletProducts, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchOutletProducts)