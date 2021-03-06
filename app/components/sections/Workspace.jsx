/* copyright 2019, stefano bovio @allyoucanmap. */

import React, { useState } from 'react';
import JSONTree from 'react-json-tree';
import { get, trimEnd } from 'lodash';
import { addHelper } from '../addons/utils';
import Zoom from '../addons/Zoom';
import Editor from '../addons/Editor';
import Back from '../addons/Back';

const Workspace = ({
    selected,
    data,
    onSelect = () => { }
}) => {

    const [edit, onEdit] = useState(false);
    
    const hrefWorkspace = trimEnd(get(data, 'workspace.dataStores', ''), 'dataStore.json');

    let fields = [
        'styles',
        'layers',
        'layergroups'
    ];

    const newData = fields.reduce((res, key) => {
        return {
            ...res,
            [key]: `${hrefWorkspace}${key}.json`
        };
    }, {});

    fields = [
        ...fields,
        'dataStores',
        'featureTypes',
        'coverageStores',
        'wmsStores',
        'wmtsStores',
        'href'
    ];

    const { workspace } = data;

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
                    data={{ workspace: { ...workspace, ...newData } }}
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
                        if (fields.indexOf(key) !== -1) {
                            return <button onClick={() => onSelect(value, value, true)}>LINK</button>;
                        }
                        return <span>{raw}</span>;
                    }} />
            </div>
        );
};

export default Workspace;
