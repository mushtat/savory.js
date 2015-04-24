'use strict';
var _ = require('./../plugins/utils.js');

var savoryConfig = {
    container : 'container', // selector of main container
    scriptsContainer : 'scripts', // id of scripts container
    autoInit : true,
    updateScrollPosition : true,
    links : {
        external : false,
        identificatorClassName : 'external' //classname to identificate ignored link nodes
    },
    error : {
        containerClassname : 'savory-error'
    },
    request : {
        noCache : true,
        requiredParam : true,
        params : {
            savory : true
        }
    },
    callbacks : {}
},
callbacksTypes = ['onReady','onLoad'];
if (window.savoryConfig) {
    window.savoryConfig = _.merge(savoryConfig, window.savoryConfig);
} else {
    window.savoryConfig = savoryConfig;
}
for (var i = 0; i < callbacksTypes.length; i++) {
    if (!window.savoryConfig.callbacks[callbacksTypes[i]]) {
        window.savoryConfig.callbacks[callbacksTypes[i]] = function(){};
    }
}
module.exports = window.savoryConfig;