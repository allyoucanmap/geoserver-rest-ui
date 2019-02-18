/* copyright 2019, stefano bovio @allyoucanmap. */

import {
    SET_STYLE,
    UPDATE_CODE,
    CLOSE_EDIT
} from '../actions/style';

const style = (state = {}, action) => {
    switch (action.type) {
        case SET_STYLE: {
            return {
                ...state,
                edit: true,
                style: action.style,
                code: action.code
            };
        }
        case UPDATE_CODE: {
            return {
                ...state,
                code: action.code
            };
        }
        case CLOSE_EDIT: {
            return { };
        }
        default:
            return state;
    }
};

export default style;
