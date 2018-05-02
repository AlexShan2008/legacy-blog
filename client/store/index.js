import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import reduxThunk from 'redux-thunk';//发送异步请求
import reduxPromise from 'redux-promise';//返回promise
import reduxLogger from 'redux-logger';//打印日志

let store = createStore(reducer, applyMiddleware(reduxThunk, reduxPromise, reduxLogger)); //顺序无关

window._store = store;//用于本地开发调试

export default store;