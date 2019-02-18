/* copyright 2019, stefano bovio @allyoucanmap. */

import { get } from 'lodash';

export const layersSelector = state => {
    const { url: layerUrl } = get(state, 'security', {}) || {};
    const layersObj = get(state, 'structure.layers', {});
    const layers = Object.keys(layersObj)
        .sort((a, b) => layersObj[a].zIndex > layersObj[b].zIndex ? 1 : -1)
        .map((id) => ({
            ...(layersObj[id] || {}),
            layerUrl,
            href: id
        }));
    return layers || [];
};

export const stylesSelector = state => {
    const stylesObj = get(state, 'structure.styles', {});
    const styles = Object.keys(stylesObj)
        .sort((a, b) => stylesObj[a].zIndex > stylesObj[b].zIndex ? 1 : -1)
        .map((id) => ({
            ...(stylesObj[id] || {}),
            href: id
        }));
    return styles || [];
};
