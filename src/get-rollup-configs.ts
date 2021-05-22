import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import replace from '@rollup/plugin-replace'
import postcss from 'rollup-plugin-postcss'
import json from '@rollup/plugin-json'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'

import getBabelConfig from './get-babel-config'
import { getPkg } from './utils'
import getPostcssConfig from './get-postcss-config'

import type { UserConfig, RollibInput, RollibOutput } from './interface'
import type { RollupOptions as BasicRollupOptions, OutputOptions } from 'rollup'

export interface RollibConfigOptions extends Omit<UserConfig, 'entry'>, RollibOutput {
  input: RollibInput
}

type RollupOptions = Omit<BasicRollupOptions, 'output'> & { output: OutputOptions }

const getRollupConfigs = (options: RollibConfigOptions[]): RollupOptions[] => {
  const pkg = getPkg()
  return options.map((option) => {
    const {
      input,
      format,
      dir,
      extraPlugins = [],
      replace: replaceArgs,
      preserveModules,
      sourcemap,
      minimize,
      external: extraExternal,
      babel: enableBabel = true,
      postcss: enablePostcss = true,
    } = option

    const external: (string | RegExp)[] = [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]

    if (Array.isArray(extraExternal)) {
      external.push(...extraExternal)
    }

    return {
      input,
      output: {
        format,
        dir,
        sourcemap,
        exports: 'auto',
      },
      external,
      plugins: [
        url(),
        svgr(),
        json(),
        // plugin-postcss
        enablePostcss && postcss(getPostcssConfig(option)),
        nodeResolve({
          extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
          browser: format === 'es',
          preferBuiltins: format === 'cjs',
        }),
        replace({
          preventAssignment: true,
          values: {
            'process.env.NODE_ENV': JSON.stringify('production'),
            ...replaceArgs,
          },
        }),
        // why other bundler use typescript2 ?
        typescript({
          module: 'esnext',
          declaration: true,
          declarationDir: dir,
          include: ['**/*.ts+(|x)', '**/*.js+(|x)'],
          exclude: ['**/__tests__', '**/__mocks__', '**/__snapshots__', '**/*.test.*', '**/*.spec.*', '**/*.mock.*'],
        }),
        ...extraPlugins,
        commonjs(),
        // plugin-babel
        enableBabel && babel(getBabelConfig(option)),
        // terser
        minimize && terser({ format: { comments: false } }),
      ].filter(Boolean),
      preserveModules,
    }
  })
}

export default getRollupConfigs
