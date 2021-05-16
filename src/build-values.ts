const globalBuildValues = new Map()

export const setBuildValues = (values: [key: any, value: any][]) => {
  values.forEach(([key, value]) => {
    globalBuildValues.set(key, value)
  })
}

export const getBuildValues = (keys: any[]) => {
  return keys.reduce((p, c) => ((p[c] = globalBuildValues.get(c)), p), {})
}
