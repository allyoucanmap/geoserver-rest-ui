/* copyright 2019, stefano bovio @allyoucanmap. */

import axios from 'axios';
import xml2js from 'xml2js';
import { get, head, startsWith } from 'lodash';
import {
    login
} from '../actions/security';
import {
    setList,
    setPage,
    loading,
    message,
    addNode,
    clear
} from '../actions/structure';
import {
    refresh
} from '../actions/map';
import { updateCode, setStyle, closeEdit } from '../actions/style';

const EXCLUDE_ITEMS = [ 'index', 'resource', 'security/self/password' ];

const connect = ({ url: _url, username, password }) => {
    const splitUrl = (_url || '').split('/geoserver');
    const url = `${head(splitUrl)}/geoserver`
    return (dispatch) => {
        dispatch(loading(true));
        dispatch(message(''));
        axios.get(`${url}/rest`, { auth: { username, password } })
            .then(({ data }) => {
                xml2js.parseString(data, (err, json) => {
                    if (err) {
                        dispatch(message(`ERROR ${err}`));
                        return dispatch(loading(false));
                    }
                    const list = get(json, 'html.body[0].ul[0].li', [])
                        .reduce((newList, item) => {
                            const key = get(item, 'a[0]._');
                            const href = get(item, 'a[0].$.href');
                            if (!key || EXCLUDE_ITEMS.indexOf(key) !== -1) {
                                return { ...newList };
                            }
                            return {
                                ...newList,
                                [key]: href
                            };
                        }, {});
                    dispatch(setList(list));
                    dispatch(login({ url, username, password }));
                    return dispatch(loading(false));
                });
            })
            .catch(({ response: err }) => {
                dispatch(message(`ERROR ${err && err.status} - ${err && err.statusText}`));
                return dispatch(loading(false));
            });
    };
};

const selectPage = (key, href, savePath) => {
    return (dispatch, getState) => {
        const state = getState();
        const { username, password } = get(state, 'security', {});
        dispatch(loading(true));
        dispatch(message(''));
        axios.get(href, { auth: { username, password } })
            .then(({ data }) => {
                try {
                    const jsonString = JSON.stringify(data);
                    if (startsWith(jsonString, '{') || startsWith(jsonString, '[')) {
                        dispatch(setPage(href, data, savePath));
                    } else {
                        dispatch(setPage(href, {
                            key,
                            message: 'Missing JSON Response'
                        }, savePath));
                        dispatch(message('Missing JSON Response'));
                    }          
                } catch(e) {
                    dispatch(setPage(href, {
                        key,
                        message: 'Missing JSON Response'
                    }, savePath));
                    dispatch(message('Missing JSON Response'));
                }
                return dispatch(loading(false));
            })
            .catch(({ response: err }) => {
                dispatch(message(`ERROR ${err && err.status} - ${err && err.statusText}`));
                return dispatch(loading(false));
            });
    }
};

const put = (href, body) => {
    return (dispatch, getState) => {
        const state = getState();
        const { username, password } = get(state, 'security', {});
        dispatch(loading(true));
        dispatch(message(''));
        axios.put(href, body, { auth: { username, password }, headers: { 'Content-Type': 'application/json' } })
            .then(() => {
                dispatch(refresh());
                dispatch(setPage(href, JSON.parse(body)));
                dispatch(message('SAVED'));
                return dispatch(loading(false));
            })
            .catch(({ response: err }) => {
                dispatch(message(`ERROR ${err && err.status} - ${err && err.statusText}`));
                return dispatch(loading(false));
            });
    }
};

const del = (hrefs, key) => {
    return (dispatch, getState) => {
        const state = getState();
        const { username, password } = get(state, 'security', {});
        dispatch(loading('global'));
        dispatch(message(''));
        axios.all(hrefs.map((href) => axios.delete(href, { auth: { username, password } }).then(() => href)))
            .then((nodes) => {
                nodes.forEach((node) => {
                    dispatch(addNode(key, node, {}));
                });
                const selected = get(state, 'structure.key');
                if (selected) dispatch(selectPage('', selected));
                dispatch(refresh());
                return dispatch(loading(false));
            })
            .catch(({ response: err }) => {
                dispatch(message(`ERROR ${err && err.status} - ${err && err.statusText}`));
                return dispatch(loading(false));
            });

    };
};

const contentTypes = {
    css: 'application/vnd.geoserver.geocss+css',
    sld: 'application/vnd.ogc.sld+xml',
    zip: 'application/zip'
};

const getStyleCode = (href, style) => {
    const splitHref = href.split(/\./g);
    const codeHref = `${splitHref[0]}.${style.format}`;
    return (dispatch, getState) => {
        const state = getState();
        const { username, password } = get(state, 'security', {});
        dispatch(loading('global'));
        dispatch(message(''));
        axios.get(codeHref, { auth: { username, password }, headers: { 'Content-Type': contentTypes[style.format] } })
            .then(({ data: code }) => {
                dispatch(setStyle(style, code));
                return dispatch(loading(false));
            })
            .catch(({ response: err }) => {
                dispatch(message(`ERROR ${err && err.status} - ${err && err.statusText}`));
                return dispatch(loading(false));
            });
    }
};

const putStyleCode = (href, body, format) => {
    const splitHref = href.split(/\./g);
    const codeHref = `${splitHref[0]}.${format}`;
    return (dispatch, getState) => {
        const state = getState();
        const { username, password } = get(state, 'security', {});
        dispatch(loading('global'));
        dispatch(message(''));
        axios.put(codeHref, body, { auth: { username, password }, headers: { 'Content-Type': contentTypes[format] } })
            .then(() => {
                dispatch(refresh());
                dispatch(updateCode(body));
                dispatch(message('SAVED'));
                return dispatch(loading(false));
            })
            .catch(({ response: err }) => {
                dispatch(message(`ERROR ${err && err.status} - ${err && err.statusText}`));
                return dispatch(loading(false));
            });
    }
};
const styleBody = {
    css: '@mode \'Flat\';\n\n* {\n\tstroke: #333333;\n}',
    sld: '',
    mbstyle: ''
};

const postStyleCode = (href, name, format) => {
    return (dispatch, getState) => {
        const state = getState();
        const { username, password } = get(state, 'security', {});
        dispatch(loading('global'));
        dispatch(message(''));
        axios.post(href, styleBody[format], { params: { name }, auth: { username, password }, headers: { 'Content-Type': contentTypes[format] } })
            .then(() => {
                dispatch(message('SAVED'));
                dispatch(selectPage('', href));
                return dispatch(loading(false));
            })
            .catch(({ response: err }) => {
                dispatch(message(`ERROR ${err && err.status} - ${err && err.statusText}`));
                return dispatch(loading(false));
            });
    }
};

const parseOptions = {
    layer: ({ layer }, { featureType, coverage } = {}) => featureType || coverage
        ? {
            style: get(layer, 'defaultStyle.name'),
            id: `${get(featureType || coverage, 'namespace.name') ? `${get(featureType || coverage, 'namespace.name')}:` : ''}${layer.name}`,
            dataType: layer.type,
            resource: get(layer, 'resource.href'),
            ...(featureType || coverage)
        }
        : {
            style: get(layer, 'defaultStyle.name'),
            name: layer.name,
            dataType: layer.type,
            resource: get(layer, 'resource.href')
        },
    style: ({ style }) => ({
        id: style.name,
        ...style
    })
};

const getNode = (key, href) => {
    return (dispatch, getState) => {
        const state = getState();
        const { username, password } = get(state, 'security', {});
        dispatch(loading('global'));
        axios.get(href, { auth: { username, password } })
            .then(({ data }) => {
                const dataKey = head(Object.keys(data));
                let options = parseOptions[dataKey] && parseOptions[dataKey](data) || {};
                if (options.resource) {
                    return axios.get(options.resource, { auth: { username, password } })
                        .then(({ data: resource}) => {
                            let options = parseOptions[dataKey] && parseOptions[dataKey](data, resource) || {};
                            dispatch(addNode(key, href, options));
                            return dispatch(loading(false));
                        })
                        .catch(() => {
                            return dispatch(loading(false));
                        });
                }
                dispatch(addNode(key, href, options));
                return dispatch(loading(false));
            })
            .catch(() => {
                return dispatch(loading(false));
            });
    };
};

const disconnect = () => {
    return (dispatch) => {
        dispatch(closeEdit());
        dispatch(clear())
    };
};

export {
    connect,
    selectPage,
    del,
    put,
    getNode,
    getStyleCode,
    putStyleCode,
    postStyleCode,
    disconnect
};
