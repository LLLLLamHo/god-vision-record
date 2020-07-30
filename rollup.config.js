import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import globals from 'rollup-plugin-node-globals';
import { uglify } from "rollup-plugin-uglify";

const {BUILD_ENV} = process.env;

const config = {
    input: 'src/record/index.ts',
    output: {
        dir: './dist',
        // file: './dist/index.js',
        format: 'umd',
        name: 'godV',
        sourcemap: true
    },
    plugins: [
        resolve( { mainFields: ["jsnext", "preferBuiltins", "browser"] } ),
        babel( {
            babelHelpers: 'runtime',
            exclude: 'node_modules/**', // 只编译我们的源代码
            extensions: ['js', 'ts']
        } ),
        typescript(),
        commonjs( {
            browser: true
        } ),
        globals(),
        json()
    ],

};

if (BUILD_ENV == 'production') {
    config.plugins.unshift(uglify());
}


module.exports = config;