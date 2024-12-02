import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './esbuild-plugin';
import { loadPlugin } from './load-plugin';

const App = () => {
    const [userInput, setUserInput] = useState('');
    const [code, setCode] = useState('');
    const ref = useRef<any>();
    const refIframe = useRef<any>();

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
            plugins: [
                unpkgPathPlugin(),
                loadPlugin(userInput)
            ],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            }
        });
        refIframe.current.srcdoc = iframeHtml;
        refIframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
    };

    const iframeHtml = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body>
                <div id="root"></div>
                <script>
                    window.addEventListener('message', (event) => {
                        try{
                            eval(event.data);
                        }catch(err){
                            const root = document.querySelector('#root');
                            root.innerHTML = '<div style="color:red;">' + err + '</div>';
                            throw err;
                        };
                    });
                </script>
            </body>
        </html>
    `;

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
            <iframe title="code-bundle" ref={refIframe} sandbox="allow-scripts" srcDoc={iframeHtml}></iframe>
        </div>
    );
}

ReactDOM.render(
    <App/>, document.querySelector('#root')
)