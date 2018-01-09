import * as CONSTANTS from '../actionTypes.js';
import {combineReducers} from 'redux';
// import { routerReducer } from 'react-router-redux';
// import {toggle} from '../actions/index';

const initialState = {
    show: true,
    hide: true
};

let toggleLogin = (state = initialState, action) => {
    switch (action.type) {
        case CONSTANTS.SHOW_LOGIN:
            return Object.assign({}, state, {
                type: action.type,
                show: state.show
            });
        case CONSTANTS.HIDE_LOGIN:
            return Object.assign({}, state, {
                type: action.type,
                hide: state.hide
            });
        default:
            return state
    }
};

export default combineReducers({
    toggleLogin,
    // routing: routerReducer
})
