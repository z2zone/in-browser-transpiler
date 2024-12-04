import { useState } from 'react';

import bundler from '../bundler/bundler';
import CodeEditor from './code-editor';
import CodePreview from './code-preview';

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
            <CodeEditor 
                initialValues='const a = 1;'
                onChange={(value) => {setUserInput(value)}}
            />
            <div>
                <button onClick={handleOnClick}>Submit</button>
            </div>
            <CodePreview code={code} />
        </div>
    );
}

export default CodeModule;