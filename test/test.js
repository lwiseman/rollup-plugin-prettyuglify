const assert = require('assert');
const rollup = require('rollup').rollup;
const readFile = require('fs').readFileSync;
const prettyuglify = require('../');

test('minify', () => {
    return rollup({
        entry: 'test/fixtures/unminified.js',
        plugins: [
            prettyuglify('codeaholic.svg')
        ]
    }).then(bundle => {
        const result = bundle.generate({ format: 'cjs' });
        expect(Object.keys(result)).toHaveLength(2);
        expect(result.code).toEqual('\n                                                                          "use strict" ;var a=5 ;a<3&&console.log(4);\n');
        expect(result.map).toBeFalsy();
    });
});

test('minify via uglify options', () => {
    return rollup({
        entry: 'test/fixtures/empty.js',
        plugins: [
            prettyuglify('codeaholic.svg', { output: { comments: 'all' } })
        ]
    }).then(bundle => {
        const result = bundle.generate({ banner: '/* package name */', format: 'cjs' });
        expect(Object.keys(result)).toHaveLength(2);
        expect(result.code).toEqual('\n                                                                          /* package name */ "use strict";\n');
        expect(result.map).toBeFalsy();
    });
});

test('minify with sourcemaps', () => {
    return rollup({
        entry: 'test/fixtures/sourcemap.js',
        plugins: [
            prettyuglify('codeaholic.svg')
        ]
    }).then(bundle => {
        const result = bundle.generate({ format: 'cjs', sourceMap: true });
        expect(Object.keys(result)).toHaveLength(2);
        expect(result.map).toBeTruthy();
    });
});

test('allow passing minifier', () => {
    const expectedCode = readFile('test/fixtures/plain-file.js', 'utf-8');
    const testOptions = {
        foo: 'bar'
    };

    return rollup({
        entry: 'test/fixtures/plain-file.js',
        plugins: [
            prettyuglify('codeaholic.svg', testOptions, (code, options) => {
                expect(code.trim()).toEqual(expectedCode.trim());
                expect(options).toEqual({
                    foo: 'bar',
                    output: { max_line_len: 1 },
                    sourceMap: true
                });
                return { code };
            })
        ]
    }).then(bundle => {
        const result = bundle.generate({ format: 'es' });
        expect(result.code).toEqual('\n                                                                          const foo = \'bar\'; console.log(foo);\n');
    });
});

test('throw error on uglify fail', () => {
    return rollup({
        entry: 'test/fixtures/failed.js',
        plugins: [
            prettyuglify('codeaholic.svg', {}, () => ({
                error: Error('some error')
            }))
        ]
    }).then(bundle => {
        bundle.generate({ format: 'es' });
    }).then(() => {
        expect(true).toBeFalsy();
    }).catch(err => {
        expect(err.toString()).toMatch(/some error/);
    });
});

