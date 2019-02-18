/* copyright 2019, stefano bovio @allyoucanmap. */

import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import tinycolor from 'tinycolor2';
import { connect } from 'react-redux';
import { setBackground } from '../actions/map';
import { get } from 'lodash';

const Component = ({
    color = '#1f1230',
    setColor = () => {},
    visible
}) => {
    const [ show, onClick ] = useState(false);
    return visible ? (
        <div className="bg-color">
            {show && <ChromePicker
                color={{ hex: color }}
                onChangeComplete={(col) => setColor(col.hex)}/>}
            <button
                onClick={() => onClick(!show)}
                style={{
                    color: tinycolor.mostReadable(color, '#000000', {includeFallbackColors: true}).toHexString(),
                    backgroundColor: color
                }}>
                BACKGROUND COLOR
            </button>
        </div>
    ) : null;
};

const BackgroundColor = connect((state) => ({
    color: get(state, 'map.backgroundColor'),
    visible: !!get(state, 'structure.page')
}), {
    setColor: setBackground
})(Component);

export default BackgroundColor;
