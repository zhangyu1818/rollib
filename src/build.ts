import { rollup } from 'rollup'
import { basename } from 'path'
import RegisterConfig from './register-config'
import getUserConfig from './get-user-config'
import { getRollibOutput, cleanFolder, logger } from './utils'
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

  // clean folders
  const outputFolders = new Set(outputOptions.map((v) => v.dir))
  for (const cleanPath of outputFolders) {
    await logger(cleanFolder(cleanPath), `cleaning ${basename(cleanPath)} folder`)
  }

  // create rollup config
  const rollupConfig = getRollupConfigs(
    outputOptions.map((outputOption) => ({
      input: entry,
      ...outputOption,
      ...configs,
    }))
  )

  await logger(Promise.resolve(), 'creating rollup config')

  for (const config of rollupConfig) {
    const { output, ...input } = config
    const { format } = output
    const bundle = await logger(
      rollup({
        ...input,
      }),
      `creating ${format} build`
    )
    await logger(bundle.write(output as RollupOutputOptions), `writing ${format} build`)
  }

  await logger(Promise.resolve(), `build completed`)
}

export default build
