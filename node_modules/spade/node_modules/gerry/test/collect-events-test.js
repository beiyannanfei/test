#!/usr/bin/env node

var log = console.log
    , iopt = {
        showHidden : false
        , depth : 3
        , colors : true
        , customInspect : true 
    }
    , inspect = function ( arg, opt ) {
        return util.inspect( arg, iopt );
    }
    , assert = require( 'assert' )
    , events = require( 'events' )
    , util = require( 'util' )
    , Gerry = require( '../' )
    , evts = [ 'Given', 'enough', 'coffee', 'I', 'could', 'rule', 'the', 'world', '?!' ]
    , emt = new events.EventEmitter()
    , logger = Gerry( emt, evts )
    , elen = evts.length
    , i = 0
    , args = null
    , evt = evts[ 0 ]
    ;

log( '- build a Gerry instance passing a dummy emitter and its events:', inspect( evts ) );
assert.deepEqual( logger.events, evts );

log( '- enable logging and collecting for events and arguments.' );

logger.enable( true );

log( '- emit all events to test.' );

for ( ; i < elen; evt = evts[ ++i ] ) emt.emit.apply( emt, [ evt, i, evt.length ] );

log( '- check all events collected.' );
assert.deepEqual( logger.collected.events, evts );

log( '- check all arguments collected.' );
evt = evts[ 0 ];
i = 0;
for ( ; i < elen; evt = evts[ ++i ] ) {
    log( '> %s: %s', inspect( evt ), inspect( [ i, evt.length ] ) );
    assert.deepEqual( logger.collected.args[ i ], [ i, evt.length ] );
};