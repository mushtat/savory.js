'use strict';
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(['savory'], factory);
    } else {
        factory();
    }
}(this, function () {
    // load main controller
    var Interface = require('./controllers/Interface.js');

    /**
     * Savory constructor
     * @constructor
     * @param {object} config - configuration object
     */
    function Savory(/*obj*/config){

        // prevent reinitializing
        if (window._savory) {
            return false;
        }

        var self = this;

        self.config = config || window.savoryConfig || {};
        self['interface'] = new Interface();

        // exec onReady callback
        window.savoryConfig.callbacks.onReady(self);
        // save itself data just in case
        window._savory = self;
        return self;
    }

    // Expose Savory constructor
    window.Savory = Savory.bind(Savory);
    
    // Autoinit
    if (window.savoryConfig.autoInit) {
        window.savory = new Savory();
    }

    return Savory;
}));

