'use strict';
var bean = require('./../plugins/vendor/bean.min.js');

var Evented = bean,
    proxy = document.createElement('div'),
    exposedMethods = ['on','one','off','fire'];

Evented.global = {};

for (var i = exposedMethods.length - 1; i >= 0; i--) {
    applyGlobalMethod(exposedMethods[i]);
}

function applyGlobalMethod(methodName){
    Evented.global[methodName] = function(eventType, eventData){
        bean[methodName](proxy, eventType, eventData);
    };
}
module.exports = Evented;