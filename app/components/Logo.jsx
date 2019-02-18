/* copyright 2019, stefano bovio @allyoucanmap. */

import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

const Component = ({
    show
}) => show
    ? (
        <div className="background-logo">
            <div>
                <img src="static/img/logo.svg"/>
            </div>
        </div>
    )
    : null;

const Logo = connect(
    state => ({
        show: !get(state, 'structure.list')
    })
)(Component);

export default Logo;
