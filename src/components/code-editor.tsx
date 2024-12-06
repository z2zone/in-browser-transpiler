import { useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import './code-editor.css';

type Props = {
    initialValues: string;
    onChange(value: string): void;
}

const CodeEditor: React.FC<Props> = ({initialValues, onChange}) => {
    const editorRef = useRef<any>();
    const onEditorDidMount = (getValue: () => string, monacoEditor: any) => {
        editorRef.current = monacoEditor;
        monacoEditor.onDidChangeModelContent(() => {
            onChange(getValue());
        });
    };

    const handleOnClick = () =>{
        const editorContent = editorRef.current.getModel().getValue();
        const formattedContent = prettier.format(editorContent, {
            parser: 'babel',
            plugins: [parser],
            semi: true,
            singleQuote: true
        });
        editorRef.current.setValue(formattedContent.replace(/\n$/, ''));
    };

    return (
        <div className="editor-wrapper">
            <button 
                onClick={handleOnClick}
                className="button format-button is-primary is-small"
            >
                Format Code
            </button>
            <MonacoEditor
                editorDidMount={onEditorDidMount}
                value = {initialValues}
                theme = "dark" 
                language = "javascript" 
                height = "100%" 
                options = {{
                    wordWrap: "on",
                    minimap: {enabled: false},
                    folding: false,
                    fontSize: 16,
                    automaticLayout: true,
                    showUnused: false
                }}
            />
        </div>
    );
}

export default CodeEditor;