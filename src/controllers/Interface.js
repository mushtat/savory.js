'use strict';
var Parser = require('./../models/Parser.js'),
    Loader = require('./../models/Loader.js'),
    Evented = require('./../models/Evented.js'),
    SavoryError = require('./../models/Error.js'),
    savoryConfig = require('./../config/savory.js'),
    _ = require('./../plugins/utils.js');
    require('html5-history-api');
    require('./../plugins/compat.js');

/**
 * Main Savory.js controller
 * Initialize inner modules and create main event listeners
 *
 * @constructor
 */
var Interface = function(){

        // Error module. Handle errors
        // @see models/Error.js
    var error = new SavoryError(),
        // Loader module. Load data with specified options
        // @see models/Loader.js
        loader = new Loader(),
        // Parser module. Parse loaded content
        // @see models/Parser.js
        parser = new Parser();

    this._ = {
        error : error,
        loader : loader,
        parser : parser,
        location : window.history.location || window.location
    };


    Evented.global.on('page.ready', this.onPageReady.bind(this));
    Evented.global.on('link.clicked', this.onLinkClick.bind(this));
    Evented.global.on('page.load.success', this.onLoad.bind(this));
    Evented.global.on('page.load.error', this.onError.bind(this));

    Evented.on(window, 'popstate', this.onLocationChange.bind(this));

    this._.loader.load();

    /**
     * Load content from specified path
     * Part of the Savory.js public interface
     *
     * @param {string} path - Path of document to load
     * @param {object} options - Load method options
     * @param {function} options.onSuccess - Function called when content is loaded and displayed but not parsed
     * @param {function} options.onError - Load method options
     *
     * @this Interface
     * @method
     */
    function load(/*string*/path, /*object*/options) {

        if (!options || typeof options !== 'object') {
            options = {};
        }

        options = _.merge({
            onSuccess : function(){},
            onError : function(){},
            preventDefault : false
        }, options);

        Evented.global.one('page.load.success', options.onSuccess);
        Evented.global.one('page.load.error', options.onError);

        loader.load(path);
    }

    // Public interface
    this['public'] = {
        load : load.bind(this)
    };
};

/**
 * Method called when new page is loaded and it's content is inserted into dom
 * Call parser to parse new html content and fires onLoad callback
 *
 * @param {object} data - page data
 * @param {string} data.title - title of loaded page
 * @param {DOMnode} data.container - DOM node of container for parsing
 *
 * @this Interface
 * @method
 */
Interface.prototype.onPageReady = function(/*obj*/data){

    this._.parser.parse(data.container);
    savoryConfig.callbacks.onLoad();
};

/**
 * Method called when user click on link
 * Path link href to onLocationChange method
 *
 * @param {object} data - page data
 * @param {string} data.href - path for content loading
 * @param {string} data.navClassName - if link node contain one of the classnames listed in config.links.nav.list, it will be here
 *
 * @this Interface
 * @method
 */
Interface.prototype.onLinkClick = function(/*obj*/data){

    this.onLocationChange(data.href);
};

/**
 * Method called when new page content is loaded
 * Hide error and push current state to History in case when this method is called not by window.popstate 
 *
 * @param {object} responseData - object with response data
 * @param {number} data.code - response code
 * @param {string} data.paramString - string of GET params passed to server
 * @param {string} data.path - path where content was loaded from
 * @param {string} data.responseText - content of loaded page
 * @param {bool} data.silent - flag telling to push or not current state to History 
 *
 * @this Interface
 * @method
 */
Interface.prototype.onLoad = function(/*obj*/responseData){

    this._.error.hide();

    // responseData.silent is 'true' when user press "back" button in browser. We do not need to push this state again
    if (!responseData.silent) {
        history.pushState(responseData.path, null, responseData.path);        
    }
};

/**
 * Method called when page loading error occurred
 * Hide existing error box, set new error message and show this error box.
 *
 * @param {object} responseData - object with response data
 * @param {number} data.code - response code
 * @param {string} data.paramString - string of GET params passed to server
 * @param {string} data.path - path where content was loaded from
 * @param {string} data.responseText - content of loaded page
 * @param {bool} data.silent - flag telling to push or not current state to History 
 *
 * @this Interface
 * @method
 */
Interface.prototype.onError = function(/*obj*/responseData){

    this._.error.hide();
    this._.error.show('Error loading ' + responseData.path + ' Error code: ' + responseData.code);
};

/**
 * Method called when location is changed before page loading
 * This method called by window.popstate event and by links clicks
 * Tells loader to load page data from specified path 
 *
 * @param {string || event} href - new location href (in case when trigerred by link) or window.popstate event data
 *
 * @this Interface
 * @method
 */
Interface.prototype.onLocationChange = function(/*string || event*/href) {

    var silent = false;

    // href is not string when window.popstate event is called
    // in this case we need to pass silent:true param to loader 
    if (typeof href !== 'string') {
        href = window.history.location.href;
        silent = true;
    }

    this._.loader.load(href, {
        silent : silent
    });
};

/**
 * Remove all elements and events related to module
 *
 * @this Interface
 * @method
 */
Interface.prototype.destroy = function() {
    Evented.global.off('page.ready');
    Evented.global.off('link.clicked');
    Evented.global.off('page.load.success');
    Evented.global.off('page.load.error');

    Evented.off(window, 'popstate');

    this._.error.destroy();
    this._.loader.destroy();
    this._.parser.destroy();
};

module.exports = Interface;