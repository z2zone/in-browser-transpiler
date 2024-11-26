import * as esbuild from 'esbuild-wasm';
import axios from 'axios';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {

      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);

        //first looks at index
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
            contents: `
              import message from 'nested-test-pkg';
              console.log(message);
            `,
          };
        }
        const { data, request } = await axios.get(args.path);
        
        return {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname
        }
      });
    }, 
  };
};