import { useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

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
        editorRef.current.setValue(formattedContent);
    };

    return (
        <>
            <button onClick={handleOnClick}>Format Code</button>
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
        </>
    );
}

export default CodeEditor;