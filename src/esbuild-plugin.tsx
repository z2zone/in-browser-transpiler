import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const webDb = localForage.createInstance({ name: 'webDb' });

export const unpkgPathPlugin = (userInput: string) => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {

      //resolve import / require logic -> replace with unpkg 
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);

        //first look at index
        if(args.path === 'index.tsx'){
          return { path: args.path, namespace: 'a' };
        }

        //resolve relative path for nested folder structure
        if(args.path.includes('./') || args.path.includes('../')){
          console.log(args.path);
          return {
            namespace: 'a',
            path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href
          }
        }

        //resolve main package
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`
        };
      });
 
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
    }, 
  };
};