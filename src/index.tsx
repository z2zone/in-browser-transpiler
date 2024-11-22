import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';

const App = () => {
    const [userInput, setUserInput] = useState('');
    const [code, setCode] = useState('');
    const ref = useRef<any>();
    
    const esbuildService = async () => {
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: './esbuild.wasm'
        });
    }

    useEffect(() => {
        esbuildService();
    }, []);

    const handleOnClick = async () => {
        if(!ref.current) {
            return;
        }
        let result = await ref.current.transform(userInput, {
            loader: 'jsx',
            target: 'es2015'
        });
        setCode(result.code);
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