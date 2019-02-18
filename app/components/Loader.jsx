/* copyright 2019, stefano bovio @allyoucanmap. */

import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

const Component = ({
    loading
}) => loading
    ? (
        <div className="loader">
            <div></div>
        </div>
    )
    : null;

const Loader = connect(
    state => ({
        loading: !!get(state, 'structure.loading')
    })
)(Component);

export default Loader;
