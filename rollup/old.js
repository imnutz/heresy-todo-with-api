import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
export default {
  input: '../application.js',
  plugins: [
    resolve({module: true}),
    commonjs({
      namedExports: {
        "sam-pattern": ["createInstance", "api", "doNotRender", "addInitialState", "addComponent", "setRender", "SAM"]
      }
    }),

    babel({presets: ["@babel/preset-env"]}),
    terser()
  ],
  context: 'null',
  moduleContext: 'null',
  output: {
    exports: 'named',
    file: '../js/old.js',
    format: 'iife',
    name: 'TodoMVC'
  }
};
