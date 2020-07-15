import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

module.exports = {
    input: 'src/record/index.ts',
    output: {
        dir: './dist',
        // file: './dist/index.js',
        format: 'umd',
        name: 'godV',
        sourcemap: true
    },
    plugins: [
        resolve(),
        babel( {
            babelHelpers: 'runtime',
            exclude: 'node_modules/**', // 只编译我们的源代码
            extensions: ['js', 'ts']
        } ),
        // typescript(),
        commonjs()
    ]
};