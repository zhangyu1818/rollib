import { rollup } from 'rollup'
import RegisterConfig from './register-config'
import getUserConfig from './get-user-config'
import { getRollibOutput } from './utils'
import getRollupConfigs from './get-rollup-configs'
import { setBuildValues } from './build-values'

import type { OutputOptions as RollupOutputOptions } from 'rollup'

interface BuildOptions {
  cwd: string
}

const build = async (options: BuildOptions) => {
  const { cwd } = options
  // save option value for other module
  setBuildValues([['cwd', cwd]])

  // @babel-register for config file
  RegisterConfig()

  const userConfig = getUserConfig()

  if (!userConfig) {
    // todo config not exist
    return
  }

  const { entry, output, ...configs } = userConfig

  const outputOptions = getRollibOutput(output)

  const rollupConfig = getRollupConfigs(
    outputOptions.map((outputOption) => ({
      input: entry,
      ...outputOption,
      ...configs,
    }))
  )

  for (const config of rollupConfig) {
    const { output, ...input } = config
    const bundle = await rollup({
      ...input,
    })
    await bundle.write(output as RollupOutputOptions)
  }
}

export default build
