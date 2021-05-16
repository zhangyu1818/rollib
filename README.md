# Rollib

Zero-configuration build tool for build a library, base on Rollup.

**Features**

- support TypeScript, React.
- support Less, Sass, Stylus.
- multiple entry and output.
- zero-configuration.

## Installation

```sh
npm install -D rollib
```

**Set up build script**

```json
{
  "scripts": {
    "build": "rollib"
  }
}
```

## Configuration

```javascript
// rollib.config.js
export default {
  entry: "src/index.js"
}
```
