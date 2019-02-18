/* copyright 2019, stefano bovio @allyoucanmap. */

const SET_STYLE = 'STYLE:SET_STYLE';
const UPDATE_CODE = 'STYLE:UPDATE_CODE';
const CLOSE_EDIT = 'STYLE:CLOSE_EDIT';

const setStyle = (style, code) => ({
    type: SET_STYLE,
    style,
    code
});

const updateCode = (code) => ({
    type: UPDATE_CODE,
    code
});

const closeEdit = () => ({
    type: CLOSE_EDIT
});

export {
    SET_STYLE,
    setStyle,
    UPDATE_CODE,
    updateCode,
    CLOSE_EDIT,
    closeEdit
};
