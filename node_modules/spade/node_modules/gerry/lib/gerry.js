/*
 * Gerry, a tiny module for collecting and logging events.
 *
 * Copyright(c) 2015 Guglielmo Ferri <44gatti@gmail.com>
 * MIT Licensed
 */

exports.version = require( '../package' ).version;
exports.Gerry = ( function () {
    var log = console.log
        , util = require( 'util' )
        , EventEmitter = require( 'events' ).EventEmitter
        , inspect = util.inspect
        , isArray = Array.isArray
        , aPush = Array.prototype.push
        , aSlice = Array.prototype.slice
        , simpleLog = function ( ename, args ) {
            log( '!%s: %s', ename, inspect( args, false, 10, true ) );
        }
        , addLogListener = function ( ename, collect ) {
            var me = this
                , emt = me.emt
                , listeners = me.listeners
                , lfn = me.lfn
                , collected = me.collected
                , logFn = function () {
                    var args = aSlice.call( arguments )
                        ;
                    if ( collect || me.collect ) {
                        collected.events.push( ename );
                        collected.args.push( args );
                    }
                    lfn( ename, args );
                };
            listeners.push( logFn );
            emt.on( ename, logFn );
        }
        // Gerry
        , Gerry = function ( emt, arr, lfn ) {
            var me = this
                , is = me instanceof Gerry
                , ok = emt instanceof EventEmitter
                ;
            if ( ! ok ) throw new Error( 'Gerry, error: the first argument should be an instance of EventEmitter!' );
            if ( ! is ) return new Gerry( emt, arr, lfn );
            // update default events returning a new array
            me.events = isArray( arr ) ? arr.concat() : [];
            me.emt = emt;
            me.listeners = [];
            me.lfn = typeof lfn === 'function' ? lfn : simpleLog;
            me.collect = false;
            me.collected = {
                events : [],
                args : []
            };
        }
        , gproto = null
        ;

    util.inherits( Gerry, EventEmitter );

    gproto = Gerry.prototype;

    gproto.disable = function () {
        var me = this
            , emt = me.emt
            , listeners = me.listeners
            , llen = listeners.length
            , events = me.events
            , i = 0
            ;
        if ( ! llen ) return;
        // remove all listeners for logging
        for ( ; i < llen; i++ ) emt.removeListener( events[ i ], listeners[ i ] );
        me.listeners = [];
        return me;
    };

    gproto.enable = function ( collect, lfn ) {
        var me = this
            , listeners = me.listeners
            , llen = listeners.length
            , events = me.events
            , elen = events.length
            , i = 0
            ;
        // check offset
        if ( llen && ( elen - ( i = llen ) > 0 ) ) return;
        if ( ! ( me.collect = collect ) ) me.collected = { events : [], args : [] };
        me.lfn = typeof lfn === 'function' ? lfn : typeof me.lfn === 'function' ? me.lfn : simpleLog;
        for ( ; i < elen; ++i ) addLogListener.call( me, events[ i ], collect );
        return me;
    };

    gproto.flush = function () {
        var me = this
            , emt = me.emt
            , listeners = me.listeners
            , llen = listeners.length
            , events = me.events
            , i = 0
            ;
        if ( llen ) for ( ; i < llen; i++ ) emt.removeListener( events[ i ], listeners[ i ] );
        me.events = [];
        me.listeners = [];
        me.collected = { events : [], args : [] };
        return me;
    };

    gproto.push = function ( collect, arr ) {
         var me = this
            , args = isArray( arr ) ? arr : []
            , alen = args.length
            , i = 0
            , evt = args[ 0 ]
            , evts = []
            ;
        for ( ; i < alen; evt = args[ ++i ] ) {
            if ( ~ me.events.indexOf( evt ) ) continue;
            evts.push( evt );
            addLogListener.call( me, evt, collect );
        }
        return evts.length ? aPush.apply( me.events, evts ) : 0;
    };

    gproto.size = function () {
        var me = this
            ;
        return me.events.length;
    };

    return Gerry;

} )();