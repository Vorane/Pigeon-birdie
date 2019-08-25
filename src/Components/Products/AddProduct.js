import {connect} from "react-redux"
import {bindActionCreators} from "redux"


//import local actions and selectors
import {addOrderItem , resetAddOrderItem} from "../../Store/Orders/actions"
import { getAddOrderItemProcess  } from "../../Store/Orders/selectors"

import SelectProduct from "./SelectProduct"


const mapStateToProps = (state) =>({
    selectOrderItemProcess: getAddOrderItemProcess(state)
})
const mapDispatchToProps = (dispatch) =>({
    selectOrderItems : bindActionCreators(addOrderItem, dispatch),
    resetSelectOrderItem : bindActionCreators(resetAddOrderItem, dispatch)
})
export default connect (mapStateToProps, mapDispatchToProps)(SelectProduct)