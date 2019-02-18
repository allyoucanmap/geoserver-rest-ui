/* copyright 2019, stefano bovio @allyoucanmap. */

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { 
    connect as restConnect,
    disconnect
} from '../api/rest';
import { get } from 'lodash';

const Component = ({
    onSubmit = () => {},
    ...props
}) => {

    const [ url, setUrl ] = useState(props.url);
    const [ username, setUsername ] = useState(props.username);
    const [ password, setPassword ] = useState(props.password);

    return (
        <div className="auth-form">
            <input
                type="text"
                placeholder="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}/>
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}/>
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
            <button
                onClick={() => onSubmit({ url, username, password })}>
                CONNECT
            </button>
        </div>
    );
};

const Branch = ({ loading, connected, onDisconnect = () => {}, ...props }) => !connected
    ? <Component { ...props }/>
    : <div className="auth-form">
        <div className={`logo${loading ? ' loading' : ''}`}>
            <img src="static/img/logo.svg"/>
            <a href={props.url}>
                {props.url}
            </a>
        </div>
        <button
            onClick={() => onDisconnect()}>
            DISCONNECT
        </button>
    </div>;

const Auth = connect(
    state => ({
        url: get(state, 'security.url', ''),
        username: get(state, 'security.username', ''),
        password: get(state, 'security.password', ''),
        connected: !!get(state, 'structure.list'),
        loading: get(state, 'structure.loading')
    }),
    {
        onSubmit: restConnect,
        onDisconnect: disconnect
    }
)(Branch);

export default Auth;
