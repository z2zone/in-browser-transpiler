import MonacoEditor from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

type Props = {
    initialValues: string;
    onChange(value: string): void;
}

const CodeEditor: React.FC<Props> = ({initialValues, onChange}) => {
    const onEditorDidMount = (getValue: () => string, monacoEditor: any) =>{
        monacoEditor.onDidChangeModelContent(() => {
            onChange(getValue());
        });
    };
    return (
        <MonacoEditor
            editorDidMount={onEditorDidMount}
            value = {initialValues}
            theme = "dark" 
            language = "javascript" 
            height = "400px" 
            options = {{
                wordWrap: "on",
                minimap: {enabled: false},
                folding: false,
                fontSize: 16,
                automaticLayout: true,
                showUnused: false
            }}
        />
    );
}

export default CodeEditor;