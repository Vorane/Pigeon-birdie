import {connect} from "react-redux"
import {bindActionCreators} from "redux"


//import local actions and selectors
import {substituteOrderItems , resetSubstituteOrderItem} from "../../Store/Orders/actions"
import { getSubstituteOrderItemProcess  } from "../../Store/Orders/selectors"

import SelectProduct from "./SelectProduct"


const mapStateToProps = (state) =>({
    selectOrderItemProcess: getSubstituteOrderItemProcess(state)
})
const mapDispatchToProps = (dispatch) =>({
    selectOrderItems : bindActionCreators(substituteOrderItems, dispatch),
    resetSelectOrderItem : bindActionCreators(resetSubstituteOrderItem, dispatch)
})
export default connect (mapStateToProps, mapDispatchToProps)(SelectProduct)