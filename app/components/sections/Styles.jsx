/* copyright 2019, stefano bovio @allyoucanmap. */

import React, { useState } from 'react';
import JSONTree from 'react-json-tree';
import Back from '../addons/Back';

const NewForm = ({
    name,
    selected,
    formats = [
        'css',
        'sld',
        'mbstyle'
    ],
    onChange,
    onSelect
}) => {
    
    return (
        <div className="new-form">
            <div className="new-form-id">
                <input
                    value={name}
                    onChange={event => onChange(event.target.value)}
                    placeholder="enter name"/>
            </div>
            <div className="new-form-tools">
            {formats.map((format) => {
                return (
                    <button
                        key={format}
                        className={`${selected === format ? 'selected' : ''}`}
                        onClick={() => onSelect(format)}>
                        {format.toUpperCase()}
                    </button>
                );
            })}
            </div>
        </div>
    );
};

const Styles = ({
    activeIds,
    data,
    selected,
    onSelect = () => { },
    onAdd = () => { },
    onDelete = () => { },
    onPostStyle = () => { },
    formats = [
        'css'/*,
        'sld',
        'mbstyle'*/
    ]
}) => {

    const [add, onNew] = useState(false);
    const [name, onChange] = useState('');
    const [format, onSelectFormat] = useState(formats[0]);

    return (
            <div className="tree">
                <div className="header">
                    <Back />
                    {!add && <button onClick={() => onNew(true)}>
                        NEW
                    </button>}
                    {!add && activeIds.length > 0 && <button onClick={() => onDelete(activeIds, 'styles')}>
                        {activeIds.length > 1 ? 'DELETE ALL' : 'DELETE'}
                    </button>}
                    {add && <button onClick={() => onNew(false)}>
                        CLOSE
                    </button>}
                    {add && <button
                        disabled={!name}
                        onClick={!name ? () => {} : () => onPostStyle(selected, name, format)}>
                        POST
                    </button>}
                </div>
                {add && <NewForm
                    selected={format}
                    name={name}
                    formats={formats}
                    onChange={onChange}
                    onSelect={onSelectFormat}/>}
                <JSONTree
                    data={data}
                    shouldExpandNode={() => true}
                    hideRoot
                    valueRenderer={(raw, value, key) => {
                        if (!add && key === 'href') {
                            return (
                                <span>
                                    <button onClick={() => onSelect(value, value, true)}>LINK</button>
                                    {' '}
                                    <button className={`${activeIds.indexOf(value) !== -1 ? 'selected' : ''}`} onClick={() => onAdd('styles', value)}>
                                        {activeIds.indexOf(value) !== -1 ? 'REMOVE' : 'SELECT'}
                                    </button>
                                </span>
                            );
                        }
                        return <span>{raw}</span>;
                    }} />
            </div>
        );
};

export default Styles;
