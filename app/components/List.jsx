/* copyright 2019, stefano bovio @allyoucanmap. */

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { 
    selectPage
} from '../api/rest';

const Component = ({
    list = {},
    edit,
    onSelect = () => {}
}) => {
    const [selected, _onSelect] = useState('');
    return !edit
        ? (
            <div className="list">
                {Object.keys(list)
                    .map((key) => {
                        return (
                            <div key={key}>
                                <button
                                    className={`${selected === key ? 'selected' : ''}`}
                                    onClick={() => {
                                        onSelect(key, list[key], true);
                                        _onSelect(key);
                                    }}>
                                    {key}
                                </button>
                            </div>
                        );
                    })}
            </div>
        )
        : null;
};

const List = connect(
    state => ({
        list: get(state, 'structure.list', {}),
        edit: get(state, 'style.edit')
    }),
    {
        onSelect: selectPage
    }
)(Component);

export default List;
