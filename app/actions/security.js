/* copyright 2019, stefano bovio @allyoucanmap. */

const LOGIN = 'SECURITY:LOGIN';

const login = ({ url, username, password }) => ({
    type: LOGIN,
    url,
    username,
    password
});

export {
    LOGIN,
    login
};
