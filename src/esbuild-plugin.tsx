import * as esbuild from 'esbuild-wasm';
import axios from 'axios';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);

        //first looks at index
        if(args.path==='index.tsx'){
          return { path: args.path, namespace: 'a' };
        }
        //resolve relative path
        if(args.path.includes('./') || args.path.includes('../')){
          return {
            namespace: 'a',
            path: new URL(args.path, args.importer+'/').href
          }
        }
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
              import message from 'medium-test-pkg';
              console.log(message);
            `,
          };
        }
        const { data } = await axios.get(args.path);
        return {
          loader: 'jsx',
          contents: data
        }
      });
    }, 
  };
};