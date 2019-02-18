/* copyright 2019, stefano bovio @allyoucanmap. */

import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { get, join } from 'lodash';
import mapboxgl from 'mapbox-gl';
import url from 'url';
import { layersSelector } from '../selectors';
import { updateView } from '../actions/map';

const wms = ({
    layerUrl = '',
    tileSize = 256,
    id = '',
    format = 'image/png',
    href,
    style = '',
    wmsVersion = '1.1.1',
    antialias = 'antialias:full'
} = {}) => {

    const query = {
        SERVICE: 'WMS',
        VERSION: wmsVersion,
        REQUEST: 'GetMap',
        FORMAT: format,
        TRANSPARENT: true,
        LAYERS: id,
        exceptions: 'application/vnd.ogc.se_inimage',
        SRS: 'EPSG:3857',
        STYLES: style,
        WIDTH: tileSize,
        HEIGHT: tileSize,
        bbox: '{bbox-epsg-3857}',
        FORMAT_OPTIONS: antialias
    };
    return {
        id: href,
        type: 'raster',
        source: {
            type: 'raster',
            tiles: [ decodeURIComponent(url.format({ ...url.parse(`${layerUrl}/wms`), query })) ],
            tileSize
        },
        paint: { }
    };
};

const Component = ({
    id = 'map',
    layers = [],
    center = [ 0, 0 ],
    zoom = 1,
    bounds = {},
    backgroundColor = '#1f1230',
    onUpdate = () => {},
    options = {},
    _refresh
}) => {

    const _map = useRef(null);

    useEffect(() => {
        layers.forEach(layer => {
            if (_map && _map.current) {
                _map.current.addLayer(wms({ ...layer, ...options }));
            }
        });
        return () => {
            layers.forEach(({ href }) => {
                if (_map && _map.current) {
                    _map.current.removeLayer(href);
                    _map.current.removeSource(href);
                }
            });
            
        };
    }, [
        join(layers.map((layer) => layer.href), ','),
        join(layers.map((layer) => layer.style), ','),
        JSON.stringify(options),
        _refresh
    ]);

    useEffect(() => {
        const { minx, miny, maxx, maxy } = bounds;
        if (_map && _map.current
        && minx && miny && maxx && maxy) {
            _map.current.fitBounds([ minx, miny, maxx, maxy ]);
        }
    }, [ JSON.stringify(bounds) ]);

    useEffect(() => {
        if (_map && _map.current) {
            const bg = _map.current.getLayer('background');
            if (bg) {
                _map.current.setPaintProperty('background', 'background-color', backgroundColor);
            }
        }
    }, [ backgroundColor ]);

    useEffect(() => {
        mapboxgl.accessToken = '';
        const map = new mapboxgl.Map({
            container: id,
            center,
            zoom,
            style: {
                version: 8,
                sources: {},
                layers: []
            }
        });

        map.on('load', function() {
            map.addLayer({
                id: 'background',
                type: 'background',
                paint: { 'background-color': backgroundColor }
            });
            map.addControl(new mapboxgl.NavigationControl());
        });

        map.on('moveend', () => {
            const { lng, lat } = map.getCenter();
            const _center = [lng, lat];
            const _zoom = map.getZoom();
            onUpdate(_center, _zoom);
        });

        _map.current = map;

        return () => {
            map.remove();
        };
    }, [ id ]);

    return <div id={id} style={{ position: 'absolute', width: '100%', height: '100%' }}/>;
};

const Branch = ({ visible, ...props }) => visible
    ? <Component {...props} />
    : null;

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
