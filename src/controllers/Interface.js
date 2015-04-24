'use strict';
var Parser = require('./../models/Parser.js'),
    Loader = require('./../models/Loader.js'),
    Evented = require('./../models/Evented.js'),
    SavoryError = require('./../models/Error.js'),
    savoryConfig = require('./../config/savory.js');
    require('html5-history-api');
    require('./../plugins/compat.js');

var Interface = function(){
    var self = this;

    this._error = new SavoryError();
    this._loader = new Loader();
    this._parser = new Parser();

    this.location = window.history.location || window.location;

    Evented.global.on('page.ready', this.onPageReady.bind(self));
    Evented.global.on('link.clicked', this.onLinkClick.bind(self));
    Evented.global.on('page.load.success', this.onLoad.bind(self));
    Evented.global.on('page.load.error', this.onError.bind(self));
    Evented.on(window, 'popstate', this.onLocationChange.bind(self));
    this._loader.load();
};

Interface.prototype.onPageReady = function(data){
    this._parser.parse(data.container);
    savoryConfig.callbacks.onLoad();
};

Interface.prototype.onLinkClick = function(href){
    this.onLocationChange(href);
};

Interface.prototype.onLoad = function(responseData){
    this._error.hide();
    if (!responseData.silent) {
        history.pushState(responseData.path, null, responseData.path);        
    }
};

Interface.prototype.onError = function(responseData){
    this._error.hide();
    this._error.show('Error loading ' + responseData.path + ' Error code: ' + responseData.code);
};

Interface.prototype.onLocationChange = function(href) {
    var silent = false;
    if (typeof href !== 'string') {
        href = window.history.location.href;
        silent = true;
    }
    this._loader.load(href, {
        silent : silent
    });
};

module.exports = Interface;