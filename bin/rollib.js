#!/usr/bin/env node

const yParser = require('yargs-parser')
const slash = require('slash2')

const args = yParser(process.argv.slice(2))

if (args.v || args.version) {
  console.log(require('../package').version)
  process.exit(0)
}

const cwd = slash(process.cwd())
require('../lib/build').default({ cwd })
