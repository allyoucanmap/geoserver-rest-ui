/* copyright 2019, stefano bovio @allyoucanmap. */

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { stylesSelector } from '../selectors';
import { moveStyle } from '../actions/structure';
import { closeEdit } from '../actions/style';
import { getStyleCode } from '../api/rest';
import { get } from 'lodash';

const SUPPORTED_FORMATS = [
    'css',
    'sld'
];

const Component = ({
    onEdit = () => {},
    onClose = () => {},
    onDrag = () => {},
    styles = [],
    selected
}) => {

    const [show, onClick] = useState(false);

    return styles.length
        ? (
            <div className="footer-list">
                {show && <div className="list-container">
                    {styles.map((style) => {
                        return (
                            <div
                                key={style.id}
                                dataid={style.id}
                                className="item draggable"
                                onDragStart={() => onDrag(style.id)}
                                onDragEnd={() => onDrag('')}
                                draggable>
                                <div><small>{style.id}</small></div>
                                {SUPPORTED_FORMATS.indexOf(style.format) !== -1 && <div>
                                    <button
                                        className={`${style.id === selected ? 'selected' : ''}`}
                                        onClick={style.id === selected
                                            ? () => onClose()
                                            : () => onEdit(style.href, style)}>
                                            {style.id === selected ? 'CLOSE EDIT' : `EDIT -> ${style.format.toUpperCase()}` }
                                        </button>
                                </div>}
                            </div>
                        );
                    })}
                </div>}
                <button
                    className={`${show ? 'selected' : ''}`}
                    onClick={() => onClick(!show)}>
                    STYLES
                </button>
            </div>
        )
        : null;
};

const StylesList = connect((state) => ({
    styles: stylesSelector(state),
    selected: get(state, 'style.style.name')
}), {
    onEdit: getStyleCode,
    onClose: closeEdit,
    onDrag: moveStyle
})(Component);

export default StylesList;
