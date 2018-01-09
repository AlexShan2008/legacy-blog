import { createStore } from 'redux';
import allReducer from './reducer/index.js';

// let store = createStore(allReducer,window.STATE_FROM_SERVER);
let store = createStore(allReducer);


export default store;