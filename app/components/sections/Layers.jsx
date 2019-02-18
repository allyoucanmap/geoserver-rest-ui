/* copyright 2019, stefano bovio @allyoucanmap. */

import React from 'react';
import JSONTree from 'react-json-tree';
import Back from '../addons/Back';

const Layers = ({
    activeIds,
    data,
    onSelect = () => { },
    onAdd = () => {}
}) => {
    return (
        <div className="tree">
            <div className="header">
                <Back />
            </div>
            <JSONTree
                data={data}
                shouldExpandNode={() => true}
                hideRoot
                valueRenderer={(raw, value, key) => {
                    if (key === 'href') {
                        return (
                            <span>
                                <button onClick={() => onSelect(value, value, true)}>LINK</button>
                                {' '}
                                <button className={`${activeIds.indexOf(value) !== -1 ? 'selected' : ''}`} onClick={() => onAdd('layers', value)}>
                                    {activeIds.indexOf(value) !== -1 ? 'REMOVE' : 'SELECT'}
                                </button>
                            </span>
                        );
                    }
                    return <span>{raw}</span>;
                }} />
        </div>
    );
};

export default Layers;
