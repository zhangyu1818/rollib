import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

import type { PostCSSPluginConf } from 'rollup-plugin-postcss'
import type { RollibConfigOptions } from './get-rollup-configs'

const getPostcssConfig = (option: RollibConfigOptions): PostCSSPluginConf => {
  const { sass = true, less = true, stylus = true } = option
  let { postcss = {} } = option
  if (postcss === false) {
    // todo
    return {}
  } else if (postcss === true) {
    postcss = {}
  }

  const { inject, extract = true, plugins = [], minimize, ...configs } = postcss

  return {
    inject,
    extract,
    use: {
      sass,
      less,
      stylus,
    },
    plugins: [
      autoprefixer({
        remove: false,
      }),
      minimize &&
        cssnano({
          preset: 'default',
        }),
      ...plugins,
    ].filter(Boolean),
    ...configs,
  }
}

export default getPostcssConfig
