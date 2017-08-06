const minify = require('uglify-js').minify;
const fs = require('fs');
const cheerio = require('cheerio');
const pointInSvgPolygon = require('point-in-svg-polygon');

function prettyUglify(file, userOptions, minifier) {
    userOptions = userOptions || {};
    userOptions.output = userOptions.output || {};
    Object.assign(userOptions.output, { max_line_len: 1 });
    const options = Object.assign({ sourceMap: true }, userOptions);
    minifier = minifier || minify;
    const GLYPH_WIDTH = .4;
    const GLYPH_HEIGHT = .6;
    const contents = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(contents, { xmlMode: true });
    const width = $('svg').attr('width');
    const height = $('svg').attr('height');
    const paths = $('path').map(function () {
      return $(this).attr('d');
    }).get().map(function(path) {
      return pointInSvgPolygon.segments(path);
    });
    let lines = [];
    let line = [];
    let currentWidth = 0;
    let currentHeight = 0;
    let currentFragment = 0;
    return {
        name: 'prettyUglify',

        transformBundle(code) {
            let result = minifier(code, options);
            if (result.error) {
              throw result.error;
            }
            let fragments = result.code.split(/\n/g).filter(function(d) {
              return d.length > 0;
            });
            while(true) {
              if(currentFragment >= fragments.length) {
                lines.push(line);
                break;
              }
              if(paths.every(function(path) {
                return !pointInSvgPolygon.isInside([currentWidth, currentHeight], path);
              })) {
                currentWidth += GLYPH_WIDTH;
                if(currentWidth >= width) {
                  currentWidth = 0;
                  currentHeight += GLYPH_HEIGHT;
                  if(currentHeight >= height) currentHeight = 0;
                  lines.push(line);
                  line = [];
                }
                else line.push(' ');
                continue;
              }
              let fragment = fragments[currentFragment];
              currentWidth += GLYPH_WIDTH * (fragment.length + 1);
              line.push(fragment);
              line.push(' ');
              ++currentFragment;
            }
            result.code = lines.map(function(line) {
              return line.join('').replace(/\s+$/, '');
            }).join('\n');
            return result;
        }
    };
}

module.exports = prettyUglify;
