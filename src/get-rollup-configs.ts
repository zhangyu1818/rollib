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
import { getPkg, defaultExtensions } from './utils'

import type { UserConfig, RollibInput, RollibOutput } from './interface'
import type { RollupOptions } from 'rollup'
import getPostcssConfig from './get-postcss-config'

export interface RollibConfigOptions extends Omit<UserConfig, 'entry'>, RollibOutput {
  input: RollibInput
}

const getRollupConfigs = (options: RollibConfigOptions[]): RollupOptions[] => {
  const pkg = getPkg()
  const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]
  return options.map((option) => {
    const {
      input,
      format,
      dir,
      extraPlugins = [],
      replace: replaceArgs,
      preserveModules = true,
      sourcemap = false,
      minimize = false,
      babel: enableBabel = true,
      postcss: enablePostcss = true,
    } = option
    return {
      input,
      output: {
        format,
        dir,
        sourcemap,
        // exports: 'default',
      },
      external,
      plugins: [
        url(),
        svgr(),
        json(),
        // plugin-postcss
        ...(enablePostcss ? [postcss(getPostcssConfig(option))] : []),
        nodeResolve({
          extensions: defaultExtensions,
        }),
        replace({
          preventAssignment: true,
          values: {
            'process.env.NODE_ENV': JSON.stringify('production'),
            ...replaceArgs,
          },
        }),
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
        ...(enableBabel ? [babel(getBabelConfig(option))] : []),
        // terser
        ...(minimize ? [terser({ format: { comments: false } })] : []),
      ],
      preserveModules,
    }
  })
}

export default getRollupConfigs
