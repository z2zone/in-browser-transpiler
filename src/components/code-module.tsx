import { useState } from 'react';

import bundler from '../bundler/bundler';
import CodeEditor from './code-editor';
import CodePreview from './code-preview';
import Resizable from './resizable';

import './code-module.css';

const CodeModule = () => {
    const [userInput, setUserInput] = useState('');
    const [code, setCode] = useState('');

    const handleOnClick = async () => {
        // fetch and resolve data using plug-ins
        let bundledCode = await bundler(userInput);
        // when bundling is complete, update piece of state to re-render
        // then pass the updated state to preview
        setCode(bundledCode);
    };

    return (
        <div>
            <Resizable direction='vertical'>
                <div className='code-module-wrapper'>
                    <CodeEditor 
                        initialValues='const a = 1;'
                        onChange={(value) => {setUserInput(value)}}
                    />
                    <CodePreview code={code} />
                </div>
            </Resizable>
        </div>
    );
}

export default CodeModule;