/* 
 * Hiboris Example
 *
 *   - Simple Strings "+"
 *   - Errors "-"
 *   - Integers ":"
 *   - Bulk Strings "$"
 *   - Arrays "*"
 *
 *  - produce some real replies to parse, using Spade client:
 *
 *    var s = require( 'spade' )().connect();
 *
 *    s.commands.set('a',1)        "+OK\r\n"
 *    s.commands.get('a',1)        "-ERR wrong number of arguments for 'get' command\r\n"
 *    s.commands.get('a')          "$1\r\n1\r\n"
 *    s.commands.lpush('l', 1)     ":1\r\n"
 *
 *    s.commands.lpush('list', ['alice','bob','ted'])  ":3\r\n"
 *
 *    s.commands.lrange('list', 0, 4)      "*3\r\n$3\r\nted\r\n$3\r\nbob\r\n$5\r\nalice\r\n"
 *
 *    var fn = function(k) { var i = 0; for ( ; i < 16 * 1024; ++i ) { s.lpush('list', i ); } }
 *
 *    s.commands.lrange( 'list', 0, 16000 );
 *    s.commands.lrange( 'list', 0, 16000 );
 *
 *    s.commands.slowlog.get(0);   "*2\r\n*4\r\n:1\r\n:1398634705\r\n:15137\r\n*4\r\n$6\r\nLRANGE\r\n$4\r\nlist\r\n$1\r\n0\r\n$5\r\n16000\r\n*4\r\n:0\r\n:1398634583\r\n:14186\r\n*4\r\n$6\r\nLRANGE\r\n$4\r\nlist\r\n$1\r\n0\r\n$5\r\n16000\r\n"
 *
 * - other test strings:
 *
 *    "*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel1\r\n:1\r\n*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel2\r\n:2\r\n*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel3\r\n:3\r\n*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel1\r\n:3\r\n"
 *	  "*4\r\n$8\r\npmessage\r\n$9\r\n*-channel\r\n$12\r\nfake-channel\r\n$12\r\nHello Fakes!\r\n"
 */

var log = console.log
    , util = require( 'util' )
    , Hiboris = require( '../' )
    // try to use hiredis native parser
    , hb = Hiboris( {
        hiredis : true
    } )
    , status = new Buffer( "+OK\r\n" )
    , error = new Buffer( "-ERR wrong number of arguments for 'get' command\r\n" )
    , bulk = new Buffer( "$1\r\n1\r\n" )
    , integer = new Buffer( ":1\r\n" )
    , multibulk = new Buffer( "*3\r\n$3\r\nted\r\n$3\r\nbob\r\n$5\r\nalice\r\n" )
    , smultibulk = new Buffer( "*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel1\r\n:1\r\n*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel2\r\n:2\r\n*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel3\r\n:3\r\n*3\r\n$9\r\nsubscribe\r\n$8\r\nchannel1\r\n:3\r\n" )
    , nmultibulk = new Buffer( "*2\r\n*4\r\n:1\r\n:1398634705\r\n:15137\r\n*4\r\n$6\r\nLRANGE\r\n$4\r\nlist\r\n$1\r\n0\r\n$5\r\n16000\r\n*4\r\n:0\r\n:1398634583\r\n:14186\r\n*4\r\n$6\r\nLRANGE\r\n$4\r\nlist\r\n$1\r\n0\r\n$5\r\n16000\r\n" )
    ;

log( hb.hreader ? '\n- ok, Hiboris is now using hiredis.' : '\n- hiredis was not found, now using/returning a Boris instance ( pure JS parser ).' );


hb.on( 'end', function () {
    log( '- ok, buffer ends' );
} );

hb.on( 'miss', function ( r, i ) {
    log( '- "%s" rule needs data, index: "%s"', r.cid, i );
} );

hb.on( 'match', function ( e, d, convert ) {
    log( '\n- data match%s: "', e ? ' (Redis error)' : '', util.inspect( convert( d ), false, 2, true ) );
} );

log( '\n- run all parser rules using a single chunk of data.' );

log( '\n- parse "+" status reply: %s', status );
hb.parse( status );

log( '\n- parse error "-" reply: %s', status );
hb.parse( error );

log( '\n- parse "$" bulk reply: %s', status );
hb.parse( bulk );

log( '\n- parse ":" integer reply: %s', status );
hb.parse( integer );

log( '\n- parse "*" multibulk reply: %s', status );
hb.parse( multibulk );

log( '\n- parse "*" (SUBSCRIBE) multibulk reply: %s', status );
hb.parse( smultibulk );

log( '\n- parse "*" (SLOWLOG) nested multibulk reply: %s', status );
hb.parse( nmultibulk );

log( '\n- run some parser rules using multiple chunks of data.' );

hb.parse( status.slice( 0, 3 ) );
hb.parse( Buffer.concat( [ status.slice( 3 ), error.slice( 0, 13 ) ] )  );
hb.parse( error.slice( 13 ) );

hb.parse( nmultibulk.slice( 0, 13 ) );
hb.parse( nmultibulk.slice( 13 ) );