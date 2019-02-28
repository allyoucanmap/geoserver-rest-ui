/* copyright 2019, stefano bovio @allyoucanmap. */

import React, { useEffect, useRef } from 'react';
import { join, head } from 'lodash';
import mapboxgl from 'mapbox-gl';
import url from 'url';

const wms = ({
    layerUrl = '',
    tileSize = 256,
    id = '',
    format = 'image/png',
    layers = [],
    styles = [],
    wmsVersion = '1.1.1',
    antialias = 'antialias:full'
} = {}) => {

    const query = {
        SERVICE: 'WMS',
        VERSION: wmsVersion,
        REQUEST: 'GetMap',
        FORMAT: format,
        TRANSPARENT: true,
        LAYERS: join(layers, ','),
        exceptions: 'application/vnd.ogc.se_inimage',
        SRS: 'EPSG:3857',
        STYLES: join(styles, ','),
        WIDTH: tileSize,
        HEIGHT: tileSize,
        bbox: '{bbox-epsg-3857}',
        FORMAT_OPTIONS: antialias
    };
    return {
        id,
        type: 'raster',
        source: {
            type: 'raster',
            tiles: [ decodeURIComponent(url.format({ ...url.parse(`${layerUrl}/wms`), query })) ],
            tileSize
        },
        paint: { }
    };
};

const MapboxGLMap = ({
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
    const WMS_ID = 'WMS:GROUP';

    const getLayers = () => {
        const { layerUrl } = head(layers) || {};
        if (layerUrl && _map && _map.current) {
            _map.current.addLayer(
                wms({
                    layerUrl,
                    tileSize: 256,
                    id: WMS_ID,
                    layers: layers.map(({ id }) => id),
                    styles: layers.map(({ style }) => style),
                    ...options
                })
            );
        }
    };

    useEffect(() => {
        getLayers();
        return () => {
            const layer = _map.current.getLayer(WMS_ID);
            if (layer) {
                _map.current.removeLayer(layer.id);
                _map.current.removeSource(layer.id);
            }        
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

        _map.current = map;

        map.on('load', function() {
            map.addLayer({
                id: 'background',
                type: 'background',
                paint: { 'background-color': backgroundColor }
            });
            getLayers();
            map.addControl(new mapboxgl.NavigationControl());
        });

        map.on('moveend', () => {
            const { lng, lat } = map.getCenter();
            const _center = [lng, lat];
            const _zoom = map.getZoom();
            onUpdate(_center, _zoom);
        });

        return () => {
            map.remove();
        };
    }, [ id ]);

    return <div id={id} style={{ position: 'absolute', width: '100%', height: '100%' }}/>;
};

export default MapboxGLMap;
