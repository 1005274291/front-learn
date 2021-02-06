/*
Run Rollup in watch mode for development.

To specific the package to watch, simply pass its name and the desired build
formats to watch (defaults to "global"):

```
# name supports fuzzy match. will watch all packages with name containing "dom"
yarn dev dom

# specify the format to output
yarn dev core --formats cjs

# Can also drop all __DEV__ blocks with:
__DEV__=false yarn dev
```
*/

const execa = require('execa')
const { fuzzyMatchTarget } = require('./utils')
// 读命令行参数 转化为对象
const args = require('minimist')(process.argv.slice(2))
// 默认target是vue 将所有不是--开头的放到args._
const target = args._.length ? fuzzyMatchTarget(args._)[0] : 'vue'
// 格式化是-f
const formats = args.formats || args.f
// 资源映射是-s
const sourceMap = args.sourcemap || args.s
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)

execa(
  'rollup',
  [
    '-wc',
    '--environment',
    [
      `COMMIT:${commit}`,
      `TARGET:${target}`,
      `FORMATS:${formats || 'global'}`,
      sourceMap ? `SOURCE_MAP:true` : ``
    ]
      .filter(Boolean)
      .join(',')
  ],
  {
    stdio: 'inherit'
  }
)
