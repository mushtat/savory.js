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
            return window._savory;
        }

        this.config = config || window.savoryConfig || {};
        this['interface'] = new Interface();

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

        delete window.savoryConfig;
        delete window._savory;
        if (window.savory) {
            delete window.savory;
        }
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

