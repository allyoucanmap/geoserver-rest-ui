/* copyright 2019, stefano bovio @allyoucanmap. */

import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { layersSelector } from '../selectors';
import { updateView } from '../actions/map';
import mapboxgl from './MapboxGLMap';
import openlayers from './OpenLayersMap';

const maps = {
    mapboxgl,
    openlayers
};

const Branch = ({ visible, ...props }) => {
    const Component = maps[props.options && props.options.renderer];
    return visible && Component
        ? <Component {...props} />
        : null;
}

const MapCanvas = connect(
    (state) => ({
        layers: layersSelector(state),
        bounds: get(state, 'map.bounds', {}),
        visible: !!get(state, 'structure.page'),
        center: get(state, 'map.center', [ 0, 0 ]),
        zoom: get(state, 'map.zoom', 1),
        _refresh: get(state, 'map._refresh', 0),
        backgroundColor: get(state, 'map.backgroundColor'),
        options: get(state, 'map.options', {})
    }),
    {
        onUpdate: updateView
    }
)(Branch);

export default MapCanvas;
