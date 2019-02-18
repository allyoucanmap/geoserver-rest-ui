/* copyright 2019, stefano bovio @allyoucanmap. */

import React from 'react';

const Container = ({
    header,
    children,
    footer,
    background,
    className
}) => (
    <div
        className={`container${className && ` ${className}` || ''}`}>
        <div className="header">
            { header }
        </div>
        <div className="body">
            <div className="background">
                { background }
            </div>
            { children }
        </div>
        <div className="footer">
            { footer }
        </div>
    </div>
);

export default Container;
