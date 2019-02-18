/* copyright 2019, stefano bovio @allyoucanmap. */

import {
    ZOOM_TO,
    REFRESH,
    SET_BACKGROUND,
    UPDATE_VIEW,
    UPDATE_OPTIONS
} from '../actions/map';

let _refresh = 0;


const options = {
    wmsVersion: '1.1.1',
    format: 'image/png',
    antialias: 'antialias:full'
};

const STORAGE_NAME = 'gru-map';

let initialState;
try {
    initialState = JSON.parse(localStorage.getItem(STORAGE_NAME));
} catch(e) {
    initialState = { backgroundColor: '#1f1230' };
}

const map = (state = { options, ...initialState, _refresh }, action) => {
    localStorage.setItem(STORAGE_NAME, JSON.stringify(state));
    switch (action.type) {
        case ZOOM_TO: {
            return {
                ...state,
                bounds: action.bounds
            };
        }
        case REFRESH: {
            _refresh++;
            return {
                ...state,
                _refresh: _refresh
            };
        }
        case SET_BACKGROUND: {
            return {
                ...state,
                backgroundColor: action.color
            };
        }
        case UPDATE_VIEW: {
            return {
                ...state,
                center: action.center,
                zoom: action.zoom
            };
        }
        case UPDATE_OPTIONS: {
            return {
                ...state,
                options: { ...(state.options || {}), [action.key]: action.value }
            };
        }
        default:
            return state;
    }
};

export default map;
