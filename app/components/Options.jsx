/* copyright 2019, stefano bovio @allyoucanmap. */

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { updateOptions } from '../actions/map';
import { get } from 'lodash';

const Component = ({
    form = [
        {
            id: 'projection',
            label: 'Projection',
            show: ({ renderer }) => renderer === 'openlayers',
            values: [
                {
                    label: 'EPSG:4326',
                    value: 'EPSG:4326'
                },
                {
                    label: 'EPSG:3857',
                    value: 'EPSG:3857'
                }
            ]
        },
        {
            id: 'wmsVersion',
            label: 'WMS Version',
            values: [
                {
                    label: '1.1.1',
                    value: '1.1.1'
                },
                {
                    label: '1.3.0',
                    value: '1.3.0'
                }
            ]
        },
        {
            id: 'format',
            label: 'Format',
            values: [
                {
                    label: 'GIF',
                    value: 'image/gif'
                },
                {
                    label: 'JPEG',
                    value: 'image/jpeg'
                },
                {
                    label: 'PNG',
                    value: 'image/png'
                },
                {
                    label: 'PNG8',
                    value: 'image/png8'
                },
                {
                    label: 'JPEG PNG',
                    value: 'image/vnd.jpeg-png'
                },
                {
                    label: 'JPEG PNG8',
                    value: 'image/vnd.jpeg-png8'
                }
            ]
        },
        {
            id: 'antialias',
            label: 'Antialias',
            values: [
                {
                    label: 'FULL',
                    value: 'antialias:full'
                },
                {
                    label: 'TEXT ONLY',
                    value: 'antialias:text'
                },
                {
                    label: 'DISABLED',
                    value: 'antialias:none'
                }
            ]
        },
        {
            id: 'renderer',
            label: 'Map Renderer',
            values: [
                {
                    label: 'Mapbox GL',
                    value: 'mapboxgl'
                },
                {
                    label: 'OpenLayers',
                    value: 'openlayers'
                }
            ]
        }
    ],
    options = {},
    onChange = () => {},
    visible
}) => {

    const [show, onClick] = useState(false);

    return visible ? (
        <div className="footer-list">
            {show && <div className="list-container">
                {form.filter(({ show = () => true}) => show(options))
                    .map((option) => {
                        return (
                            <div
                                key={option.id}
                                className="item">
                                <div>
                                    {option.label}
                                </div>
                                <div>
                                    {option.values
                                        .map(({ value, label }) => {
                                        return (
                                            <div key={value}>
                                                <button
                                                    className={`${options[option.id] === value ? 'selected' : ''}`}
                                                    onClick={() => onChange(option.id, value)}>
                                                    {label}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                }
            </div>}
            <button
                className={`${show ? 'selected' : ''}`}
                onClick={() => onClick(!show)}>
                OPTIONS
            </button>
        </div>
    )
    : null;
};

const Options = connect((state) => ({
    options: get(state, 'map.options', {}),
    visible: !!get(state, 'structure.page')
}), {
    onChange: updateOptions
})(Component);

export default Options;
