/*
 * Hiboris Test, choosing a parser, Boris for JS or hiredis for native
 */

var log = console.log
    , assert = require( 'assert' )
    , Boris = require( 'boris' )
    , Hiboris = require( '../' )
    , hiredis = require( 'hiredis' )
    // try to use hiredis native parser ( NOTE: install devDependencies )
    , hb = Hiboris( {
        hiredis : true
    } )
    // it returns a Boris instance
    , b = Hiboris( {
        hiredis : false
    } )
    ;

log( '- created 2 parser instances, one using hiredis native parser, the other using Boris JS parser.' );

log( '- check if instances are of the correct type.' );

assert.ok( b instanceof Boris );
log( '- ok for Boris instance.' );

assert.ok( hb instanceof Hiboris );
log( '- ok for Hiboris instance.' );

log( '- check if Hiboris has loaded hiredis parser.' );
assert.ok( hb.hreader instanceof hiredis.Reader );