/* copyright 2019, stefano bovio @allyoucanmap. */

import {
    SET_LIST,
    SET_PAGE,
    ADD_NODE,
    LOADING,
    MESSAGE,
    CLEAR,
    MOVE_STYLE,
    UPDATE_NODE,
    BACK
} from '../actions/structure';

import { head } from 'lodash';

const defaultOptions = {
    layers: ({ count, ...options }) => ({
        zIndex: count,
        ...options
    }),
    styles: ({ count, ...options }) => ({
        zIndex: count,
        ...options
    })
}

const structure = (state = {}, action) => {
    switch (action.type) {
        case SET_LIST: {
            return {
                ...state,
                list: action.list
            };
        }
        case BACK: {
            return {
                ...state,
                path: (state.path || []).filter((pt, idx) => idx > 0)
            };
        }
        case SET_PAGE: {
            return {
                ...state,
                key: action.key,
                page: action.page,
                dataKey: head(Object.keys(action.page)),
                path: action.savePath
                    ? [ ...(state.key && [{ key: state.key, dataKey: state.dataKey }] || []), ...(state.path || []) ]
                    : [ ...(state.path || []) ]
            };
        }
        case ADD_NODE: {

            const section = state[action.key] || {};
            
            if (section[action.node]) {
                return {
                    ...state,
                    [action.key]: Object.keys(state[action.key] || {})
                        .reduce((newSection, node) => {
                            if (node === action.node) return { ...newSection }; 
                            return {
                                ...newSection,
                                [node]: state[action.key][node]
                            };
                        }, {})
                };
            }

            const options = defaultOptions[action.key] && defaultOptions[action.key]({ count: Object.keys(section).length, ...action.options });
            if (!options) return { ...state };
            
            return {
                ...state,
                [action.key]: { ...section,  [action.node]: options}
            };
        }
        case UPDATE_NODE: {

            const section = state[action.key] || {};

            if (section[action.node]) {
                return {
                    ...state,
                    [action.key]: Object.keys(state[action.key] || {})
                        .reduce((newSection, node) => {
                            if (node === action.node) return {
                                ...newSection,
                                [node]: {
                                    ...state[action.key][node],
                                    ...action.options
                                }
                            }; 
                            return {
                                ...newSection,
                                [node]: state[action.key][node]
                            };
                        }, {})
                };
            }

            return {
                ...state
            };
        }
        case LOADING: {
            return {
                ...state,
                loading: action.status
            };
        }
        case MESSAGE: {
            return {
                ...state,
                message: action.status
            };
        }
        case MOVE_STYLE: {
            return {
                ...state,
                movedStyle: action.style
            };
        }
        case CLEAR: {
            return { };
        }
        default:
            return state;
    }
};

export default structure;
