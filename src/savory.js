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
    var Interface = require('./controllers/interface.js');

    function Savory(config){
        if (window._savory) {
            return false;
        }
        var self = this;

        self.base = self.getBase();
        self.config = config || window.savoryConfig || {};
        self['interface'] = new Interface();

        window.savoryConfig.callbacks.onReady(self);
        window._savory = self;
        return self;
    }

    Savory.prototype.getBase = function(){
        var baseTag = document.querySelector('base'),
            base = {
                document : ''
            };

        if (!baseTag) {
            base.document = document.location.origin;
        } else {
            base.document = baseTag.getAttribute('target');
        }

        return base;
    };

    window.Savory = Savory.bind(Savory);
    if (window.savoryConfig.autoInit) {
        window.savory = new Savory();
    }
    return Savory;
}));

