import { getPkg, defaultExtensions } from './utils'

import type { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import type { RollibConfigOptions } from './get-rollup-configs'
import type { BabelConfig } from './interface'

const getBabelConfig = (options: RollibConfigOptions): RollupBabelInputPluginOptions => {
  const { format, targets: optionsTargets } = options
  let { babel: babelConfig = {} } = options

  // package.json browserslist field
  const pkg = getPkg()
  const { browserslist = 'last 2 versions' } = pkg

  const targets = format === 'es' ? { browsers: optionsTargets || browserslist } : { node: 6 }

  if (babelConfig === false) {
    // todo babelConfig should not to be false
    return {}
  } else if (babelConfig === true) {
    babelConfig = {}
  }

  const {
    runtimeHelpers: runtimeHelpersOpt,
    extensions = defaultExtensions,
    extraPlugins = [],
    extraPresets = [],
  } = babelConfig as BabelConfig

  const runtimeHelpers = format === 'cjs' ? false : runtimeHelpersOpt

  return {
    babelHelpers: runtimeHelpers ? 'runtime' : 'bundled',
    presets: [
      require.resolve('@babel/preset-typescript'),
      [require.resolve('@babel/preset-env'), { targets, modules: format === 'es' ? false : 'auto' }],
      require.resolve('@babel/preset-react'),
      ...extraPresets,
    ],
    plugins: [
      require.resolve('@babel/plugin-syntax-export-default-from'),
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      require.resolve('@babel/plugin-proposal-export-default-from'),
      require.resolve('@babel/plugin-proposal-class-properties'),
      runtimeHelpers && [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          useESModules: format === 'es',
          version: require('@babel/runtime/package.json').version,
        },
      ],
      ...extraPlugins,
    ].filter(Boolean),
    exclude: /\/node_modules\//,
    babelrc: false,
    compact: false,
    configFile: false,
    extensions,
  }
}

export default getBabelConfig
