import * as Types from '../action-types';

let actions = {
  showModal(type) {
    return (dispatch) => {
      dispatch({
        type: Types.SHOW_MODAL
      })
    }
  },
  hideModal(type) {
    return (dispatch) => {
      dispatch({
      type: Types.HIDE_MODAL
      })
    }
  }
}

export default actions;