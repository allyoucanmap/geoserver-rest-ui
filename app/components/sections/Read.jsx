/* copyright 2019, stefano bovio @allyoucanmap. */

import React from 'react';
import JSONTree from 'react-json-tree';
import Back from '../addons/Back';

const Read = ({
    data
}) => {
    return (
        <div className="tree">
                <div className="header">
                    <Back />
                </div>
                <JSONTree
                    data={data}
                    shouldExpandNode={() => true}
                    hideRoot />
            </div>
        );
};

export default Read;
