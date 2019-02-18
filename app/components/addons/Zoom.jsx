/* copyright 2019, stefano bovio @allyoucanmap. */

import React from 'react';
import { connect } from 'react-redux';
import { zoomTo } from '../../actions/map';

const Zoom = connect(() => ({}), {
    onClick: zoomTo
})(
    ({
        bounds,
        onClick = () => {}
    }) => bounds
        ? (
            <button
                onClick={(event) => {
                    event.stopPropagation();
                    onClick({ ...bounds, _v: Date.now() });
                }}>
                ZOOM TO
            </button>
        )
        : null
);

export default Zoom;
