/* copyright 2019, stefano bovio @allyoucanmap. */

export const addHelper = (props, items = [], Component = () => null, filter = () => true) => {
    if (!filter(props)) return null; 
    const keys = Object.keys(props);
    const matched = items.filter(key => keys.indexOf(key) !== -1);
    const isMatch = matched.length === items.length;
    return isMatch
        ? Component
        : null;
};
