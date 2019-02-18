/* copyright 2019, stefano bovio @allyoucanmap. */

import React from 'react';
import Back from '../addons/Back';

const Fonts = ({
    data = {}
}) => {
    return (
        <div className="tree">
                <div className="header">
                    <Back />
                </div>
                <div>
                    {(data.fonts || [])
                    .map((font) => {
                        return (
                            <div
                                className="font"
                                key={font}>
                                <div className="title">{font}</div>
                                <div className="preview">
                                    <small style={{ fontFamily: font }}>the quick brown fox jumps over the lazy dog</small>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
};

export default Fonts;
