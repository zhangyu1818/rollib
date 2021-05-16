import { join } from 'path'
import { existsSync } from 'fs'

import { getBuildValues } from './build-values'
import type { UserOutput, RollibOutput } from './interface'

export const defaultExtensions = ['.js', '.jsx', '.ts', '.tsx', '.es6', '.es', '.mjs']

export const getRollibOutput = (output?: UserOutput | UserOutput[]): RollibOutput[] => {
  const defaultFormat = 'es'
  const defaultDir = 'dist'
  const defaultMinimize = false

  if (!output) {
    return [
      {
        format: defaultFormat,
        dir: defaultDir,
        minimize: defaultMinimize,
      },
    ]
  }
  if (Array.isArray(output)) {
    return output.map((v) => ({
      format: v.type || defaultFormat,
      dir: v.outDir || defaultDir,
      minimize: v.minimize || defaultMinimize,
    }))
  }
  return [
    {
      format: output.type || defaultFormat,
      dir: output.outDir || defaultDir,
      minimize: output.minimize || defaultMinimize,
    },
  ]
}

export const getPkg = () => {
  const { cwd } = getBuildValues(['cwd'])
  const pkgPath = join(cwd, 'package.json')
  if (!existsSync(pkgPath)) {
    // todo project not exist package.json
    return
  }
  return require(pkgPath)
}
