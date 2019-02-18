/* copyright 2019, stefano bovio @allyoucanmap. */

const SET_LIST = 'STRUCTURE:SET_LIST';
const SET_PAGE = 'STRUCTURE:SET_PAGE';
const ADD_NODE = 'STRUCTURE:ADD_NODE';
const UPDATE_NODE = 'STRUCTURE:UPDATE_NODE';
const LOADING = 'STRUCTURE:LOADING';
const MESSAGE = 'STRUCTURE:MESSAGE';
const CLEAR = 'STRUCTURE:CLEAR';
const MOVE_STYLE = 'STRUCTURE:MOVE_STYLE';
const BACK = 'STRUCTURE:BACK';

const setList = (list) => ({
    type: SET_LIST,
    list
});

const setPage = (key, page, savePath) => ({
    type: SET_PAGE,
    key,
    page,
    savePath
});

const addNode = (key, node, options = {}) => ({
    type: ADD_NODE,
    key,
    node,
    options
});

const updateNode = (key, node, options = {}) => ({
    type: UPDATE_NODE,
    key,
    node,
    options
});

const loading = (status) => ({
    type: LOADING,
    status
});

const message = (status) => ({
    type: MESSAGE,
    status
});

const clear = () => ({
    type: CLEAR
});

const moveStyle = (style) => ({
    type: MOVE_STYLE,
    style
});

const back = () => ({
    type: BACK
});

export {
    SET_LIST,
    setList,
    SET_PAGE,
    setPage,
    ADD_NODE,
    addNode,
    UPDATE_NODE,
    updateNode,
    LOADING,
    loading,
    MESSAGE,
    message,
    CLEAR,
    clear,
    MOVE_STYLE,
    moveStyle,
    BACK,
    back
};
