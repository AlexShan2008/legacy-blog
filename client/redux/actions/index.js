import * as CONSTANTS from '../actionTypes.js';
// import {ajax} from '../../util/ajax.js';


export let toggle = (text) => {
    return {
        type: CONSTANTS.SHOW_LOGIN,
        show: true,
        text
    }
};

export default {
    toggle
}
