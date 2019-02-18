/* copyright 2019, stefano bovio @allyoucanmap. */

import {
    LOGIN
} from '../actions/security';

const STORAGE_NAME = 'gru-security';

let initialState;
try {
    initialState = JSON.parse(localStorage.getItem(STORAGE_NAME));
} catch(e) {
    initialState = { };
}
const security = (state = initialState, action) => {
    localStorage.setItem(STORAGE_NAME, JSON.stringify(state));
    switch (action.type) {
        case LOGIN: {
            return {
                ...state,
                url: action.url,
                username: action.username,
                password: action.password
            };
        }
        default:
            return state;
    }
};

export default security;
