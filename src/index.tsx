import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './esbuild-plugin';

const App = () => {
    const [userInput, setUserInput] = useState('');
    const [code, setCode] = useState('');
    const ref = useRef<any>();

    const esbuildService = async () => {
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: './esbuild.wasm'
        });
    };

    useEffect(() => {
        esbuildService();
    }, []);

    const handleOnClick = async () => {
        if(!ref.current) {
            return;
        }
        let result = await ref.current.build({
            entryPoints: ['index.tsx'],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin(userInput)],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            }
        });
        setCode(result.outputFiles[0].text);
    };

    return (
        <div>
            <textarea 
                value={userInput}
                onChange={(e) => {setUserInput(e.target.value)}}
            >
            </textarea>
            <div>
                <button onClick={handleOnClick}>Submit</button>
            </div>
            <pre>{code}</pre>
        </div>
    );
}

ReactDOM.render(
    <App/>, document.querySelector('#root')
)