/* copyright 2019, stefano bovio @allyoucanmap. */

import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import * as sections from './sections/index';
import Editor from './Editor';

import { 
    selectPage,
    getNode,
    postStyleCode,
    del
} from '../api/rest';

const Component = ({ id, message, ...props }) => {
    const Section = sections[props.dataKey] || sections.base;
    return props.data ?
        props.edit
            ? <Editor key={id}/>
            : (
                <div
                    key={message}
                    className="panel">
                    <Section { ...props } />
                    <div className="message">
                        { message }
                    </div>
                </div>
            )
    : null
};

const idSelector = state => {
    const dataKey = get(state, 'structure.dataKey');
    const idObj = get(state, `structure.${dataKey}`, {});
    const ids = Object.keys(idObj).map((id) => id);
    return ids || [];
};

const Tree = connect(
    state => ({
        data: get(state, 'structure.page'),
        selected: get(state, 'structure.key'),
        message:  get(state, 'structure.message'),
        activeIds: idSelector(state),
        edit: get(state, 'style.edit'),
        dataKey: get(state, 'structure.dataKey'),
        id: get(state, 'style.style.name')
    }),
    {
        onSelect: selectPage,
        onAdd: getNode,
        onPostStyle: postStyleCode,
        onDelete: del
    }
)(Component);

export default Tree;
