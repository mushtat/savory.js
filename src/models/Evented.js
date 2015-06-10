'use strict';
var bean = require('bean');

/**
 * @module Evented
 * Include bean event lib public methods
 * Extend bean lib with global events via virtual dom node proxy
 */
var Evented = bean,
    proxy = document.createElement('div'),
    exposedMethods = ['on','one','off','fire'];

Evented.global = {};

for (var i = exposedMethods.length - 1; i >= 0; i--) {
    applyGlobalMethod(exposedMethods[i]);
}

/**
 * Expose specified bean method as global method of Evented module
 *
 * @param {string} methodName - Name of bean method needed to be exposed as global method
 *
 * @function
 */
function applyGlobalMethod(/*string*/methodName){
    Evented.global[methodName] = function(eventType, eventData){
        bean[methodName](proxy, eventType, eventData);
    };
}
module.exports = Evented;