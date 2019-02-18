/* copyright 2019, stefano bovio @allyoucanmap. */

const ZOOM_TO = 'MAP:ZOOM_TO';
const REFRESH = 'MAP:REFRESH';
const SET_BACKGROUND = 'MAP:SET_BACKGROUND';
const UPDATE_VIEW = 'MAP:UPDATE_VIEW';
const UPDATE_OPTIONS = 'MAP:UPDATE_OPTIONS';

const zoomTo = (bounds) => ({
    type: ZOOM_TO,
    bounds
});

const refresh =  () => ({
    type: REFRESH
});

const setBackground =  (color) => ({
    type: SET_BACKGROUND,
    color
});

const updateView =  (center, zoom) => ({
    type: UPDATE_VIEW,
    center,
    zoom
});

const updateOptions = (key, value) => ({
    type: UPDATE_OPTIONS,
    key,
    value
});

export {
    ZOOM_TO,
    zoomTo,
    REFRESH,
    refresh,
    SET_BACKGROUND,
    setBackground,
    UPDATE_VIEW,
    updateView,
    UPDATE_OPTIONS,
    updateOptions
};
