/* copyright 2019, stefano bovio @allyoucanmap. */

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { put } from '../../api/rest';
import 'codemirror/mode/javascript/javascript';

const Editor = connect(() => ({}), {
    onPut: put
})(({
    href,
    data,
    onPut = () => {},
    onEdit = () => {}
}) => {
    const [ code, onChange ] = useState(false);
    return (
        <div className="tree">
            <div className="header">
                <button
                    onClick={() => onEdit(false)}>
                    CLOSE
                </button>
                <button
                    onClick={() => onPut(href, code)}>
                    PUT
                </button>
            </div>
            <CodeMirror
                key="style-editor"
                value={code || JSON.stringify(data, null, 2)}
                onBeforeChange={(_editor, _data, _code) => onChange(_code)}
                options={{
                    theme: 'cobalt',
                    mode: 'javascript',
                    lineNumbers: true,
                    styleSelectedText: true,
                    indentUnit: 2,
                    tabSize: 2,
                    lineWrapping: true
                }}/>
        </div>
    );
});

export default Editor;
