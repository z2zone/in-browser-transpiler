//@ts-nocheck
import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const webDb = localForage.createInstance({ name: 'webDb' });

export const loadPlugin = (userInput: string) => {
    return {
        name: 'load-plugin',
        setup(build: esbuild.PluginBuild) {

            build.onLoad({ filter: /(^index\.tsx$)/ }, () => {
                return {
                    loader: 'jsx',
                    contents: userInput
                };
            });

            build.onLoad({ filter: /.*/ }, async(args) => {
                const cachedResult = await webDb.getItem<>(args.path);
                if(cachedResult) return cachedResult;
            });

            build.onLoad({ filter: /.css$/ }, async(args) => {

                const { data, request } = await axios.get(args.path);
                let escaped = data
                    .replace(/\n/g, '')
                    .replace(/"/g, '\\"')
                    .replace(/'/g, "\\'");
                let contents = 
                    `const style = document.createElement('style');
                    style.innerText = '${escaped}';
                    document.head.appendChild(style);`;
                let result = {
                    loader: 'jsx',
                    contents: contents,
                    resolveDir: new URL('./', request.responseURL).pathname
                };

                await webDb.setItem(args.path, result)
                return result;
            });

            build.onLoad({ filter: /.*/ }, async (args: any) => {
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