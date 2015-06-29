'use strict';
var Evented = require('./Evented.js'),
    savoryConfig = require('./../config/savory.js'),
    request = require('nanoajax'),
    _ = require('./../plugins/utils.js');


/**
 * @module Loader
 * Load content of new pages and execute scripts if they are on loaded page
 *
 * @constructor
 */
var Loader = function(){
    this._url = document.createElement('a'); // overflow for url parsing
    this.scripts = [];
    this.currentFrameNode = null;
    this._scriptsProxy = document.createElement('div');
    Evented.on(this, 'page.load', this.onPageLoad.bind(this));
};

/**
 * Content loading method
 *
 * @param {string} path - Path of document to load
 * @param {object} loadParams - Loading params object
 * @param {boolean} loadParams.silent - Silent param that is proxed to page.load events
 *
 * @this Loader
 * @method
 */
Loader.prototype.load = function(/*string*/path, /*object*/loadParams){
    var parentContainer = document.querySelector('#'+savoryConfig.container),
        paramString = '';

    loadParams = _.merge({
        silent : false
    }, loadParams);

    // if no path specified - target page is current page
    if (!path) {
        Evented.global.fire('page.ready', {
            container : parentContainer,
            title : document.title
        });
        return false;
    }

    this._url.href = path;
     
    /* 
     * Url parser examples
     *
     *  this._url.protocol; // => "http:"
     *  this._url.hostname; // => "example.com"
     *  this._url.port;     // => "3000"
     *  this._url.pathname; // => "/pathname/"
     *  this._url.search;   // => "?search=test"
     *  this._url.hash;     // => "#hash"
     *  this._url.host;     // => "example.com:3000"
     */


    /*
     * Add query param properties to params object
     * They will be transformed to GET query string
     */
    if (savoryConfig.request.requiredParam) {
        for (var k in savoryConfig.request.params) {
            paramString = k + '=' + savoryConfig.request.params[k];
        }
    }

    /*
     * Generate timestamp to prevent caching
     */
    if (savoryConfig.request.noCache) {
        if (paramString.length > 0) {
            paramString += '&';
        }
        paramString += 'ts='+ (new Date()).getTime();
    }

    /*
     * Create GET param string
     */
    if (this._url.search !== '?' && paramString.length > 0) {
        if (this._url.search.length > 0) {
            paramString = '&' + paramString;
        } else {
            paramString = '?' + paramString;
        }
    }

    /*
     * Make XHR request with specified params
     * 
     * @param {number} code - Http code of response
     * @param {string} responseText - Loaded content
     */
    request.ajax(path + paramString, (function (/*number*/code, /*string*/responseText) {

        var responseData = {
            path : path,
            paramString : paramString,
            code : code,
            responseText : responseText,
            silent : loadParams.silent
        };

        // No errors
        if (code === 200) {
            Evented.global.fire('page.load.success', responseData);
            this.parse(responseText);
        } else {
            Evented.global.fire('page.load.error', responseData);
        }
    }).bind(this));
};

/**
 * Method of deep html content parsing via iframe
 *
 * @param {string} html - Raw html content of loaded page
 *
 * @this Loader
 * @method
 */
Loader.prototype.parse = function(/*string*/html){
    // Remove script tags from raw html string
    // Script will be moved to head for proper executing
    var normalizedHTML = this.normalizeHTML(html),
        frame = document.createElement('iframe');

    frame.style.display = 'none';
    document.body.appendChild(frame);

    // Set private property to iframe window object to prevent Savory.js initializing in iframe 
    frame.contentWindow._savory = true;
    
    frame.onload = (function(){
        this.onFrameLoad(frame, normalizedHTML.scripts);
    }).bind(this);

    frame.contentDocument.open();
    frame.contentDocument.write(normalizedHTML.html);
    frame.contentDocument.close();

    this.currentFrameNode = frame;

    Evented.one(this, 'frame.clear', function(){
        this.currentFrameNode = null;
        document.body.removeChild(frame);
    });
};

/**
 * Method of deep html content parsing via iframe
 *
 * @param {DOMnode} frame - Frame DOM element
 * @param {string} scripts - String of non-parsed html of script tags that will be appended to head
 *
 * @this Loader
 * @method
 */
Loader.prototype.onFrameLoad = function(/*DOMnode*/frame, /*string*/scripts){
    var fdocument = frame.contentDocument,
        container  = fdocument.querySelector('#'+savoryConfig.container),
        title = fdocument.title,
        comments = [],
        /*
         * Parse comments to get loaded document meta data (e.g. title)
         * @function
         */
        parseComment = function(comment){
            var value = comment.nodeValue;
            if (value.replace('<title>','').length !== value.length) {
                value = value.replace('<title>','');
                value = value.replace('</title>','');
                title = value;
            }
        };

    // find and parse each comment in loaded document
    if (!title) {
        comments = _.findComments(fdocument);
        for (var i = 0; i < comments.length; i++) {
            parseComment(comments[i]);
        }
    }

    // Trigger page.load event
    // Event data will pass to onPageLoad method
    Evented.fire(this, 'page.load', {
        container : container,
        title : title,
        scripts : scripts
    });
};

/**
 * Method of deep html content parsing via iframe
 *
 * @param {DOMnode} frame - Frame DOM element
 * @param {string} scripts - String of non-parsed html of script tags that will be appended to head
 *
 * @this Loader
 * @method
 */
Loader.prototype.onPageLoad = function(/*object*/data){
    var parentContainer = document.querySelector('#'+savoryConfig.container);

    // Replace current container html with loaded container html    
    parentContainer.outerHTML = data.container.outerHTML;

    // Delete all old scripts via classname
    // Remove their classnames from classnames storage called 'this.scripts'
    if (this.scripts.length > 0) {

        for (var i = 0; i < this.scripts.length; i++) {

            deleteScripts(this.scripts[i]);

            if (this.scripts.length > 1) {
                this.scripts.shift();
            }

        }
    }

    // Add new scripts
    if (data.scripts) {
        addScripts.call(this, data.scripts);
    }

    // Scroll to top of the window
    if (savoryConfig.updateScrollPosition) {
        window.scrollTo(0,0);
    }

    // Change title of document
    document.title = data.title;

    Evented.global.fire('page.ready', parentContainer);
    Evented.fire(this, 'frame.clear');

    /**
     * Delete script tag from head if specified classname match
     *
     * @param {string} classname - Classname of script tag to remove
     *
     * @function
     */
    function deleteScripts(/*string*/classname) {
        var scriptsEl = document.querySelectorAll('.savory_'+classname);

        if (scriptsEl && scriptsEl.length > 0) {
            for (var i = 0; i < scriptsEl.length; i++) {
                deleteScript(scriptsEl[i]);
            }
        }

        // Remove specified sript element
        function deleteScript(/*DOMnode*/scriptEl){
            scriptEl.parentNode.removeChild(scriptEl);
        }
    }


    /**
     * Create script nodes from passed raw html string which contain scripts
     * Execute scripts
     *
     * @this Loader
     * @function
     */
    function addScripts(/*string*/scriptsHTML){

        var nodes,
            scriptTags;

        // Parse script string as html
        this._scriptsProxy.innerHTML = scriptsHTML;

        // Find script nodes
        nodes = this._scriptsProxy.childNodes;

        // Append script nodes to head for cloning
        
        for(i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeType === 1) {
                document.head.appendChild(nodes[i]);
            }
        }

        // Find newly appended scripts
        scriptTags = document.head.querySelectorAll('.savory_'+this.scripts[0]);

        // Clone each new script tag
        for (var i = 0; i < scriptTags.length; i++) {
            cloneScript(scriptTags[i]);
        }

        /**
         * Clone script tag
         * Only script that created via document.createElement and inserted to head can be executed
         * Scripts will not run if you simply put their html to head 
         *
         * @function
         */
        function cloneScript(/*DOMnode*/scriptTag){
            var newScript = document.createElement('script'),
                exec;

            newScript.id = scriptTag.id || '';
            newScript.className = scriptTag.className || '';

            if (scriptTag.innerHTML.length > 0) {
                // If script is inline - eval it's content
                exec = new Function(scriptTag.innerHTML);
                exec.call(window);
            } else {
                newScript.src = scriptTag.src || '';
            }

            // Remove old script and append new
            document.head.appendChild(newScript);
            document.head.removeChild(scriptTag);
        }
    }    
};

/**
 * Remove scripts tags in specified container from passed html string
 *
 * @param {string} html - String containing raw html
 *
 * @this Loader
 * @method
 */
Loader.prototype.normalizeHTML = function(/*string*/html){

    var template = {
            start : '<div id="'+savoryConfig.scriptsContainer+'">',
            end : '<\/div>'   
        },
        scripts = html.match(new RegExp('('+template.start+'((.|\n|\r)*)'+template.end+')')),
        // Generate random string as script classname identificator
        generateID = function(){
            return Math.random().toString(36).substring(7);
        };

    // Remove scripts from html and save their classname ID in 'this.scripts'
    if (scripts) {
        var scriptsID = generateID();

        html = html.split(scripts[0]);
        html = html.join('');

        scripts = scripts[0];
        scripts = scripts.split(template.start);
        scripts = scripts.join('');
        scripts = scripts.split(template.end);
        scripts = scripts.join('');
        scripts = scripts.replace(/<( .*|)script/gi, '<script class="savory_'+scriptsID+'" ');

        this.scripts.push(scriptsID);
    }

    return {
        html : html,
        scripts : scripts
    };
};

/**
 * Remove all elements and events related to module
 *
 * @this Loader
 * @method
 */
Loader.prototype.destroy = function(){
    Evented.off(this, 'page.load');
    Evented.off(this, 'frame.clear');

    if (this.currentFrameNode && this.currentFrameNode.parentNode) {
        this.currentFrameNode.parentNode.removeChild(this.currentFrameNode);        
    }
};

module.exports = Loader;