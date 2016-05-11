###Hiboris

[![NPM VERSION](http://img.shields.io/npm/v/hiboris.svg?style=flat)](https://www.npmjs.org/package/hiboris)
[![CODACY BADGE](https://img.shields.io/codacy/b18ed7d95b0a4707a0ff7b88b30d3def.svg?style=flat)](https://www.codacy.com/public/44gatti/hiboris)
[![CODECLIMATE](http://img.shields.io/codeclimate/github/rootslab/hiboris.svg?style=flat)](https://codeclimate.com/github/rootslab/hiboris)
[![CODECLIMATE-TEST-COVERAGE](https://img.shields.io/codeclimate/coverage/github/rootslab/hiboris.svg?style=flat)](https://codeclimate.com/github/rootslab/hiboris)
[![LICENSE](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/rootslab/hiboris#mit-license)

[![TRAVIS CI BUILD](http://img.shields.io/travis/rootslab/hiboris.svg?style=flat)](http://travis-ci.org/rootslab/hiboris)
[![BUILD STATUS](http://img.shields.io/david/rootslab/hiboris.svg?style=flat)](https://david-dm.org/rootslab/hiboris)
[![DEVDEPENDENCY STATUS](http://img.shields.io/david/dev/rootslab/hiboris.svg?style=flat)](https://david-dm.org/rootslab/hiboris#info=devDependencies)
[![NPM DOWNLOADS](http://img.shields.io/npm/dm/hiboris.svg?style=flat)](http://npm-stat.com/charts.html?package=hiboris)

[![NPM GRAPH1](https://nodei.co/npm-dl/hiboris.png)](https://nodei.co/npm/hiboris/)

[![NPM GRAPH2](https://nodei.co/npm/hiboris.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/hiboris/)

[![status](https://sourcegraph.com/api/repos/github.com/rootslab/hiboris/.badges/status.png)](https://sourcegraph.com/github.com/rootslab/hiboris)
[![views](https://sourcegraph.com/api/repos/github.com/rootslab/hiboris/.counters/views.png)](https://sourcegraph.com/github.com/rootslab/hiboris)
[![views 24h](https://sourcegraph.com/api/repos/github.com/rootslab/hiboris/.counters/views-24h.png)](https://sourcegraph.com/github.com/rootslab/hiboris)

> **_Hiboris_**, a utility module to load __[hiredis](https://github.com/redis/hiredis-node)__ _native parser_, or to fall back to __[Boris](https://github.com/rootslab/boris)__, _a pure JS parser_.

> __NOTE__: This module was developed for and used by __[♠ Spade](https://github.com/rootslab/spade)__, a __full-featured__ modular client for __Redis__.

###Install

```bash
$ npm install hiboris [-g]
// clone repo
$ git clone git@github.com:rootslab/hiboris.git
```
__install and update devDependencies (hiredis)__:

```bash
 $ cd hiboris/
 $ npm install
 # update
 $ npm update
```
> __require__:

```javascript
var Hiboris  = require( 'hiboris' );
```

###Run Tests

> __NOTE__: Install _devDependencies_ before running tests, see above.

```bash
$ cd hiboris/
$ npm test
```

###Constructor

> Create an instance, the argument within [ ] is optional.

```javascript
/*
 * NOTE: if hiredis module is not available, it falls back
 * to use pure JS parser, and returns an instance of Boris.
 */
Hiboris( [ Object opt ] ) : Hiboris | Boris
// or
new Hiboris( [ Object opt ] ) : Hiboris | Boris
```
####Options

> Default options are listed.

```javascript
opt = {
    /*
     * For default the hiredis native parser is disabled.
    */
    hiredis : false

    /*
     * For default, the parser returns strings instead of buffers,
     * returning buffers will slowdown hiredis parsing of about ~60%. 
     */
    , return_buffers : false
}
```

###Sample Usage

> See [examples](example/).

###Methods

> Arguments within [ ] are optional.

```javascript
/*
 * parse a chunk of data.
 */
Hiboris#parse( Buffer data ) : undefined

/*
 * reset parser state.
 */
Hiboris#reset() : undefined

```

###Events

```javascript
/*
 * Parser has found some data.
 * 
 * NOTE: The 'convert' function argument is a shortcut to Bolgia#reveal
 * utility, it scans an array and turns all Buffers into Strings or Numbers.
 *
 * NOTE: the boolean 'isError' signals a Redis error reply, not a runtime Error.
 */
'match' : function ( Boolean isError, Array result, Function convert ) : undefined

/*
 * A parsing error has occurred.
 *
 * NOTE: on error, parser state will be reset.
 */
'error' : function ( Error err ) : undefined
```

------------------------------------------------------------------------


### MIT License

> Copyright (c) 2015 &lt; Guglielmo Ferri : 44gatti@gmail.com &gt;

> Permission is hereby granted, free of charge, to any person obtaining
> a copy of this software and associated documentation files (the
> 'Software'), to deal in the Software without restriction, including
> without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to
> permit persons to whom the Software is furnished to do so, subject to
> the following conditions:

> __The above copyright notice and this permission notice shall be
> included in all copies or substantial portions of the Software.__

> THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
> IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
> CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
> TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
> SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[![GA](https://ga-beacon.appspot.com/UA-53998692-1/hiboris/Readme?pixel)](https://github.com/igrigorik/ga-beacon)