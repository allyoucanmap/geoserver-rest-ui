/* copyright 2019, stefano bovio @allyoucanmap. */

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { updateNode } from '../actions/structure';
import { layersSelector } from '../selectors';
import Zoom from './addons/Zoom';

const Component = ({
    layers = [],
    newStyle = '',
    onUpdate = () => {}
}) => {

    const [show, onClick] = useState(false);

    return layers.length
        ? (
            <div className="footer-list">
                {show && <div className="list-container">
                    {layers.map(({ id, style, latLonBoundingBox, href }) => {
                        return (
                            <div
                                className="item"
                                key={id}
                                onDragOver={(event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                }}
                                onDrop={() => onUpdate('layers', href, { style: newStyle })}>
                                <div><span>{id}</span></div>
                                <div>
                                    <Zoom bounds={latLonBoundingBox}/>
                                </div>
                                <div><small>{style}</small></div>
                            </div>
                        );
                    })}
                </div>}
                <button
                    className={`${show ? 'selected' : ''}`}
                    onClick={() => onClick(!show)}>
                    LAYERS
                </button>
            </div>
        )
        : null;
};

const LayersList = connect((state) => ({
    layers: layersSelector(state),
    newStyle: get(state, 'structure.movedStyle')
}), {
    onUpdate: updateNode
})(Component);

export default LayersList;
