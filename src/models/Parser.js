'use strict';
var Link = require('./Link.js'),
    Evented = require('./Evented.js'),
    _ = require('./../plugins/utils.js');

var Parser = function(){};

Parser.prototype.parse = function(/*container*/){
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