/* copyright 2019, stefano bovio @allyoucanmap. */

import React from 'react';
import { connect } from 'react-redux';
import { get, head } from 'lodash';
import { back } from '../../actions/structure';
import { selectPage } from '../../api/rest';

const Back = connect((state) => ({
    active: head(get(state, 'structure.path'))
}), {
    onBack: back,
    onSelect: selectPage
})(
    ({
        active,
        onBack = () => {},
        onSelect = () => {}
    }) => (
            <button
                disabled={!active}
                onClick={active ? (event) => {
                    event.stopPropagation();
                    onBack();
                    onSelect(active.dataKey, active.key);
                } : () => {}}>
                { '<-' }
            </button>
        )
);

export default Back;
