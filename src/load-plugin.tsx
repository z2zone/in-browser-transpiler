import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const webDb = localForage.createInstance({ name: 'webDb' });

export const loadPlugin = (userInput: string) => {
    return {
        name: 'load-plugin',
        setup(build: esbuild.PluginBuild) {
            build.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('onLoad', args);
                if (args.path === 'index.tsx') {
                    return {
                        loader: 'jsx',
                        contents: userInput,
                    };
                }

                const cachedResult = await webDb.getItem(args.path);
                if(cachedResult) return cachedResult;
        
                const { data, request } = await axios.get(args.path);
                const result = {
                    loader: 'jsx',
                    contents: data,
                    resolveDir: new URL('./', request.responseURL).pathname
                }
        
                await webDb.setItem(args.path, result);
                return result;
            });
        }
    };
}