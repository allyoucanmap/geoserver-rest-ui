/* copyright 2019, stefano bovio @allyoucanmap. */

import React, { useState } from 'react';
import JSONTree from 'react-json-tree';
import { addHelper } from '../addons/utils';
import Zoom from '../addons/Zoom';
import Editor from '../addons/Editor';
import Back from '../addons/Back';

const Base = ({
    selected,
    dataKey,
    data,
    onSelect = () => { }
}) => {

    const [edit, onEdit] = useState(false);

    return edit
        ? <Editor
            data={data}
            href={selected}
            onEdit={onEdit} />
        : (
            <div className="tree">
                <div className="header">
                    <Back />
                    <button
                        onClick={() => onEdit(true)}>
                        EDIT
                    </button>
                </div>
                <JSONTree
                    data={data}
                    shouldExpandNode={() => true}
                    hideRoot
                    getItemString={(type, data, itemType, itemString) => {
                        if (type === 'Object') {
                            const bbox = addHelper(
                                data,
                                ['minx', 'miny', 'maxx', 'maxy', 'crs'],
                                <span>{itemType} {itemString} <Zoom bounds={data} /></span>,
                                ({ crs }) => crs === 'EPSG:4326');
                            if (bbox) return bbox;

                            return <span>{itemType} {itemString}</span>;
                        }
                        return <span>{itemType} {itemString}</span>;
                    }}
                    valueRenderer={(raw, value, key) => {
                        if (key === 'href' || key === 'dataStores' || key === 'featureTypes') {
                            return <button onClick={() => onSelect(dataKey, value, true)}>LINK</button>;
                        }
                        return <span>{raw}</span>;
                    }} />
            </div>
        );
};

export default Base;
