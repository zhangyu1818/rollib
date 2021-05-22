import type { OutputPlugin } from 'rollup'
import type { PostCSSPluginConf } from 'rollup-plugin-postcss'

export type UserConfigOutputType = 'cjs' | 'es'

export interface UserOutput {
  type?: UserConfigOutputType
  outDir?: string
  minimize?: boolean
}

export interface UserConfig {
  entry: string | string[]
  output?: UserOutput | UserOutput[]
  sourcemap?: boolean | 'inline' | 'hidden'
  replace?: { [key: string]: string | ((id: string) => string) }
  preserveModules?: boolean
  less?: any
  sass?: any
  stylus?: any
  babel?: boolean | BabelConfig
  postcss?: boolean | PostCssConfig
  external?:
    | (string | RegExp)[]
    | ((source: string, importer: string | undefined, isResolved: boolean) => boolean | null | undefined)
  extraPlugins?: (OutputPlugin | void)[]
  targets?: string | string[] | { [key: string]: string }
}

export interface PostCssConfig extends Omit<PostCSSPluginConf, 'use'> {}

export interface BabelConfig {
  runtimeHelpers?: boolean
  extensions?: string[]
  extraPlugins?: any[]
  extraPresets?: any[]
}

export type RollibInput = string | string[]

export type RollibOutput = {
  format: UserConfigOutputType
  dir: string
  minimize: boolean
}
