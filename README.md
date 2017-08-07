# rollup-plugin-prettyuglify [![Travis Build Status][travis-img]][travis]

[travis-img]: https://api.travis-ci.org/lwiseman/rollup-plugin-prettyuglify.svg
[travis]: https://travis-ci.org/lwiseman/rollup-plugin-prettyuglify

[Rollup](https://github.com/rollup/rollup) plugin to minify generated bundle into the shape of an SVG's paths.

## Install

```sh
npm i rollup-plugin-prettyuglify -D
```

## Usage

```js
import { rollup } from 'rollup';
import prettyuglify from 'rollup-plugin-prettyuglify';

rollup({
    entry: 'main.js',
    plugins: [
        prettyuglify('image.svg')
    ]
});
```

## Options

```js
prettyuglify(file, options, minifier)
```

`file` - type: `string`. File with which to shape minified code.

`options` – default: `{}`, type: `object`. [UglifyJS API options](https://github.com/mishoo/UglifyJS2#api-reference)

`minifier` – default: `require('uglify-js').minify`, type: `function`. Module to use as a minifier. You can use other versions (or forks) of UglifyJS instead default one.

## Warning

[UglifyJS](https://github.com/mishoo/UglifyJS2), which this plugin is based on, does not support the ES2015 module syntax. Thus using this plugin with Rollup's default bundle format (`'es'`) will not work and error out.
To work around this you can tell `rollup-plugin-prettyuglify` to use the UglifyJS [unstable es version](https://github.com/mishoo/UglifyJS2) by passing its `minify` function to minify your code.
```js
import { rollup } from 'rollup';
import prettyuglify from 'rollup-plugin-prettyuglify';
import { minify } from 'uglify-es';

rollup({
    entry: 'main.js',
    plugins: [
        prettyuglify('image.svg', {}, minify)
    ]
});
```

To install the experimental version of UglifyJS:

```
npm i uglify-es -D
```

## Examples

### Comments

If you'd like to preserve comments (for licensing for example), then you can specify a function to do this like so:

```js
prettyuglify({
  output: {
    comments: function(node, comment) {
        var text = comment.value;
        var type = comment.type;
        if (type == "comment2") {
            // multiline comment
            return /@preserve|@license|@cc_on/i.test(text);
        }
    }
  }
});
```

See [UglifyJS documentation](https://github.com/mishoo/UglifyJS2#keeping-comments-in-the-output) for further reference.

### Output

![Codeaholic](https://raw.githubusercontent.com/lwiseman/rollup-plugin-prettyuglify/master/codeaholic.png)

# License

MIT © [Levi Wiseman](mailto:levi@codeaholic.com)
