import { combineReducers, createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import * as reducers from './reducers'

const store = createStore(
    combineReducers(reducers),
    applyMiddleware(...(__DEVELOPMENT__ ? [ thunk, logger ] : [ thunk ]))
);

export default store;
