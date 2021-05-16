import { join } from 'path'
import { CONFIG_FIES } from './get-user-config'
import { getBuildValues } from './build-values'

const RegisterConfig = () => {
  const { cwd } = getBuildValues(['cwd'])
  require('@babel/register')({
    presets: [require.resolve('@babel/preset-typescript'), require.resolve('@babel/preset-env')],
    extensions: ['.js', '.ts'],
    only: CONFIG_FIES.map((file) => join(cwd, file)),
    babelrc: false,
    cache: false,
  })
}

export default RegisterConfig
