import * as Types from '../action-types';

let initState = {
  modalShow: false
};

export default function home(state = initState, action) {
  switch (action.type) {
    case Types.SHOW_MODAL:
      return { ...state, modalShow: true }
    case Types.HIDE_MODAL:
      return { ...state, modalShow: false }
    default:
      break;
  }
  return state;
}