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
    var dom = {
        links : new Link()
    };

    Evented.global.off('links.check');

    _.forEach(document.links, function(i, link){
        dom.links.check(link);
    });

    return dom;
};

module.exports = Parser;