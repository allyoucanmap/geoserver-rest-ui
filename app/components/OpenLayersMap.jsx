/* copyright 2019, stefano bovio @allyoucanmap. */

import React, { useEffect, useRef } from 'react';
import { join, head } from 'lodash';
import url from 'url';

import View from 'ol/View';
import olMap from 'ol/Map';
import layerImage from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import { fromLonLat, transform } from 'ol/proj';
import Zoom from 'ol/control/Zoom';

const wms = ({
    layerUrl = '',
    format = 'image/png',
    layers = [],
    styles = [],
    wmsVersion = '1.1.1',
    antialias = 'antialias:full',
    _refresh
} = {}) => {

    const params = {
        SERVICE: 'WMS',
        VERSION: wmsVersion,
        REQUEST: 'GetMap',
        FORMAT: format,
        TRANSPARENT: true,
        LAYERS: join(layers, ','),
        exceptions: 'application/vnd.ogc.se_inimage',
        STYLES: join(styles, ','),
        FORMAT_OPTIONS: antialias,
        _refresh
    };

    return new layerImage({
        source: new ImageWMS({
            url: url.format(url.parse(`${layerUrl}/wms`)),
            params
        })
    });
};

const OpenLayersMap = ({
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
    const projection = options.projection || 'EPSG:3857';

    const getLayers = () => {
        const { layerUrl } = head(layers) || {};
        if (layerUrl && _map && _map.current) {
            _map.current.addLayer(
                wms({
                    layerUrl,
                    layers: layers.map(({ id }) => id),
                    styles: layers.map(({ style }) => style),
                    ...options,
                    projection,
                    _refresh
                })
            );
        }
    };

    useEffect(() => {
        getLayers();
        return () => {
            const _layers = _map.current.getLayers();
            if (_layers) {
                _layers.forEach((_layer) => {
                    _map.current.removeLayer(_layer);
                });
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
            const view = _map.current.getView();
            const code = view.getProjection().getCode();
            const fitOptions = {
                duration: 300
            };
            if (code === 'EPSG:4326') {
                view.fit([ minx, miny, maxx, maxy ], fitOptions);
            } else {
                view.fit([
                    ...transform([minx, miny], 'EPSG:4326', code),
                    ...transform([maxx, maxy], 'EPSG:4326', code)
                ], fitOptions);
            }
            
        }
    }, [ JSON.stringify(bounds) ]);

    useEffect(() => {
        let map = new olMap({
            target: id,
            view: new View({
                center: projection === 'EPSG:4326' ? center : fromLonLat(center),
                zoom,
                projection
            })
        });
        map.addControl(new Zoom());
        const moveEnd = function() {
            const view = map.getView();
            const code = view.getProjection().getCode();
            const _center = transform(view.getCenter(), code, 'EPSG:4326');
            const _zoom = view.getZoom();
            onUpdate(_center, _zoom);
        };
        map.on('moveend', moveEnd);

        _map.current = map;

        getLayers();

        return () => {
            const _layers = _map.current.getLayers();
            if (_layers) {
                _layers.forEach((_layer) => {
                    _map.current.removeLayer(_layer);
                });
            } 
            _map.current.setTarget(null);
            _map.current = null;
            map.setTarget(null);
            map = null;
        };
    }, [ id, options.projection ]);

    return <div id={id} style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor }}/>;
};

export default OpenLayersMap;
