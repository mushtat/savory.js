'use strict';
var Link = require('./Link.js'),
    Evented = require('./Evented.js'),
    _ = require('./../plugins/utils.js');

/**
 * @module Parser
 * Empty constructor of links parser
 *
 * @constructor
 */
var Parser = function(){};

/**
 * Check every link that match criterias cpecified in config
 *
 * @method
 * @see models/Link
 */
Parser.prototype.parse = function(){
    this.dom = {
        links : new Link()
    };

    Evented.global.off('links.check');

    _.forEach(document.links, function(i, link){
        this.dom.links.check(link);
    }, this);

    return this.dom;
};

/**
 * Remove all elements and events related to module
 *
 * @this Parser
 * @method
 */
Parser.prototype.destroy = function() {

    Evented.global.off('links.check');

    _.forEach(document.links, function(i, link){
        this.dom.links.destroy(link);
    }, this);
};

module.exports = Parser;