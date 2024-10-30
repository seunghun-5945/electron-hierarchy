// src/components/AceEditorComponent.jsx
import React, { useEffect, useRef } from 'react';
// ace-builds import 수정
import * as ace from 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-min-noconflict/theme-monokai';
import 'ace-builds/src-min-noconflict/mode-javascript';
import 'ace-builds/src-min-noconflict/mode-html';
import 'ace-builds/src-min-noconflict/mode-css';
import 'ace-builds/src-min-noconflict/mode-python';
import 'ace-builds/src-min-noconflict/mode-java';
import 'ace-builds/src-min-noconflict/mode-text';

function AceEditorComponent({ file, content }) {
    const editorRef = useRef(null);
    const aceEditorRef = useRef(null);

    const getEditorMode = (fileName) => {
        if (!fileName) return 'text';
        const extension = fileName.split('.').pop()?.toLowerCase();
        const modeMap = {
            'js': 'javascript',
            'jsx': 'javascript',
            'html': 'html',
            'css': 'css',
            'py': 'python',
            'java': 'java',
        };
        return modeMap[extension] || 'text';
    };

    useEffect(() => {
        if (!editorRef.current) return;

        if (!aceEditorRef.current) {
            try {
                const editor = ace.edit(editorRef.current);
                editor.setTheme('ace/theme/monokai');
                editor.setFontSize(14);
                editor.setShowPrintMargin(false);
                editor.setHighlightActiveLine(true);
                editor.setReadOnly(true);
                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                });
                aceEditorRef.current = editor;
            } catch (error) {
                console.error('Error initializing Ace Editor:', error);
            }
        }

        if (file && content) {
            const mode = getEditorMode(file.name);
            aceEditorRef.current.session.setMode(`ace/mode/${mode}`);
            aceEditorRef.current.setValue(content, -1);
            aceEditorRef.current.clearSelection();
        }

        return () => {
            if (aceEditorRef.current) {
                aceEditorRef.current.destroy();
                aceEditorRef.current = null;
            }
        };
    }, [file, content]);

    if (!file) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                파일을 선택해주세요
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">{file.name}</h2>
                <div className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                </div>
            </div>
            <div 
                ref={editorRef}
                style={{ 
                    width: '100%',
                    height: 'calc(100vh - 200px)',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                }}
            />
        </div>
    );
}

export default AceEditorComponent;