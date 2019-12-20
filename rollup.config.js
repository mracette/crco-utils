import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";

export default {
    input: './src/crco-utils.js',
    output: [
        {
            file: 'build/crco-utils.js',
            format: 'cjs'
        },
        {
            file: 'build/crco-utils.module.js',
            format: 'es'
        },
        {
            file: 'build/crco-utils.min.js',
            format: 'iife',
            name: 'crco',
            plugins: [terser()]
        }
    ],
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**' // only transpile source code
        })
    ]
};