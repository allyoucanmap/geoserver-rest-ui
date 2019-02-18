/* copyright 2019, stefano bovio @allyoucanmap. */

import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Controlled as Codemirror } from 'react-codemirror2';
import { debounce, endsWith, get, startsWith, head, trim } from 'lodash';
import tinycolor from 'tinycolor2';
import CM from 'codemirror/lib/codemirror';

import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/selection/mark-selection';
import 'codemirror/addon/hint/show-hint';

import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';

import geoCssMode from './mode/geocss';
import geoCssHint from './hint/geocss';

import { closeEdit } from '../actions/style';
import { putStyleCode } from '../api/rest';

geoCssMode(CM);
geoCssHint(CM);

const highlights = [
    {
        marker: ({ lineNo, token, onClick = () => {} }) => {
            const string = token && token.string && trim(token.string, /'|"/) || '';
            const type = token && token.type;
            if ((type === 'string' || type === 'atom')
            && string && string.length === 7 && startsWith(string, '#') && tinycolor(string).isValid()) {
                const qt = (token.string[0] === '\'' || token.string[0] === '"') && token.string[0] || '';
                const replacedWith = document.createElement('div');
                replacedWith.style.display = 'inline-block';
                replacedWith.style.color = tinycolor.mostReadable(string, '#000000', {includeFallbackColors: true}).toHexString();
                replacedWith.style.backgroundColor = string;
                replacedWith.innerHTML = `${qt}${string}${qt}`;
                replacedWith.onclick = () => onClick({ token, lineNo });
                return replacedWith;
            }
            return null;
        }
    }
];

const Component = ({
    id,
    theme = 'cobalt',
    mode = 'geocss',
    code,
    waitTime = 1000,
    message,
    href,
    onChange = () => {},
    onClose = () => {},
    format
}) => {

    const markers = useRef([]);

    const onRenderToken = editor => {

        if (markers.current) {
            markers.current.forEach(marker => {
                marker.clear();
            });
        }

        markers.current = [];

        const lineCount = editor.lineCount();

        editor.doc.iter(0, lineCount, line => {
            const lineNo = line.lineNo();
            const lineTokens = editor.getLineTokens(lineNo);
            lineTokens.forEach(token => {
                const replacedWith = head(highlights.map(({ marker }) =>
                    marker({
                        token,
                        lineNo,
                        onClick: () => {}
                    })
                ));
                if (replacedWith) {
                    markers.current.push(
                        editor.doc.markText(
                            { line: lineNo, ch: token.start },
                            { line: lineNo, ch: token.end },
                            {
                                replacedWith
                            }
                        )
                    );
                }
            });
        });
    };

    const [_code, _onCode] = useState(code);
    const editor = useRef(null);
    const update = useRef(null);

    const onAutocomplete = instance => {
        if (instance && instance.state && instance.state.completionActive) return;
        const cur = instance.getCursor();
        const token = instance.getTokenAt(cur);
        if (token.string && (endsWith(token.string, '-') || token.string.match(/^[.`\w@]\w*$/)) && token.string.length > 0) {
            const wrapperElement = editor.current && editor.current.getWrapperElement && editor.current.getWrapperElement() || null;
            CM.commands.autocomplete(instance, null, { completeSingle: false, container: wrapperElement });
        }
    };

    useEffect(() => {
        if (update.current) {
            update.current.cancel();
            update.current(_code);
        }
    }, [ _code ]);

    return (
        <div key={id} className="panel">
            <div className="tree">
                <div className="header">
                    <button
                        onClick={() => onClose()}>
                        CLOSE
                    </button>
                </div>
                <Codemirror
                    key={id}
                    value={_code}
                    editorDidMount={editor => {
                        onRenderToken(editor);
                        editor.current = editor;
                        editor.on('inputRead', onAutocomplete);
                        update.current = debounce((code_) => {
                            onChange(href, code_, format);
                        }, waitTime);
                    }}
                    editorWillUnmount={editor => editor.off('inputRead', onAutocomplete)}
                    onBeforeChange={(editor, data, code_) => _onCode(code_)}
                    onChange={editor => onRenderToken(editor)}
                    options={{
                        theme,
                        mode,
                        lineNumbers: true,
                        styleSelectedText: true,
                        indentUnit: 2,
                        tabSize: 2
                    }} />
            </div>
            <div className="message">
                { message }
            </div>
        </div>
    );
}

const getMode = (state) => {
    const modes = {
        sld: 'xml',
        css: 'geocss',
        mbstyle: 'javascript'
    };
    const format = get(state, 'style.style.format');
    return modes[format];
};

const Editor = connect((state) => ({
    code: get(state, 'style.code'),
    mode: getMode(state),
    href: get(state, 'style.style.href'),
    format: get(state, 'style.style.format'),
    message: get(state, 'structure.message')
}), {
    onClose: closeEdit,
    onChange: putStyleCode
})(Component);

export default Editor;
