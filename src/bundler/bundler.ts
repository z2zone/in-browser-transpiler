import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/esbuild-plugin';
import { loadPlugin } from './plugins/load-plugin';

let esbuildWasm: esbuild.Service;
const bundler = async (rawCode: string) => {
    if(!esbuildWasm){
        esbuildWasm = await esbuild.startService({
            worker: true,
            wasmURL: './esbuild.wasm'
        });
    }
    let output = await esbuildWasm.build({
        entryPoints: ['index.tsx'],
        bundle: true,
        write: false,
        plugins: [
            unpkgPathPlugin(),
            loadPlugin(rawCode)
        ],
        define: {
            'process.env.NODE_ENV': '"production"',
            global: 'window'
        }
    });
    
    return output.outputFiles[0].text;
}

export default bundler;