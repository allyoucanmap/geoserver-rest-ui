import React from 'react';
import ReactDOM from 'react-dom';

import store from './app/store';
import { Provider }from 'react-redux';
import App from './app/App';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app'));

if (__DEVELOPMENT__) {
    module.hot.accept();
}
