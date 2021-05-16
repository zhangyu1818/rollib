import { existsSync } from 'fs'
import { join } from 'path'

import type { UserConfig } from './interface'
import { getBuildValues } from './build-values'

export const CONFIG_FIES = ['rollib.config.js', 'rollib.config.ts']

const getUserConfig = () => {
  const { cwd } = getBuildValues(['cwd'])

  for (const file of CONFIG_FIES) {
    const filePath = join(cwd, file)
    if (existsSync(filePath)) {
      return require(filePath).default as UserConfig
    }
  }
}

export default getUserConfig
