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
    var Interface = require('./controllers/Interface.js'),
        _ = require('./plugins/utils.js');

    /**
     * Savory constructor
     * @constructor
     * @param {object} config - configuration object
     */
    function Savory(/*obj*/config){

        // prevent reinitializing
        if (window._savory) {
            return window._savory;
        }

        var config = config || {};

        if (window.savoryConfig) {
            config = _.merge(config, window.savoryConfig);
        }

        this.config = config;
        this['interface'] = new Interface();

        // Exposing savory public interface
        this.api = this['interface']['public'];

        // exec onReady callback
        window.savoryConfig.callbacks.onReady(this);
        // save itself data just in case
        window._savory = this;
    }

    /**
     * Remove all elements and events related to module
     *
     * @this Savory
     * @method
     */
    Savory.prototype.destroy = function(){

        this['interface'].destroy();

        window._savory = null;
        delete window._savory;
        if (window.savory) {
            window.savory = null;
            delete window.savory;
        }

        return null;
    };

    // Expose Savory constructor
    window.Savory = Savory.bind(Savory);
    
    // Autoinit
    if (window.savoryConfig.autoInit) {
        // if Savory script tag inserted in head
        if (!document.body) {
            window.onload = function(){
                if (window.onload && typeof window.onload === 'function') {
                    window.onload();                    
                }
                window.savory = new Savory();
            }
        } else { // or in bottom of body
            window.savory = new Savory();
        }
    }

    return Savory;
}));

