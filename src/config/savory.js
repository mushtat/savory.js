'use strict';
var _ = require('./../plugins/utils.js');

// Main Savory.js initializing config
var savoryConfig = {
    container : 'container', // selector of main container
    scriptsContainer : 'scripts', // id of scripts container
    autoInit : true, // autoinit enabled by default
    updateScrollPosition : true, // scroll to top of window on page change
    links : {
        external : false, // is all links are external by default?
        identificatorClassName : 'external', //classname to identificate ignored link nodes
        nav : {
            enabled : false, // enable navigation menu behaviour. IMPORTANT: experimental feature
            list : ['nav'], // list of classnames of links that should be recognized as part of one navigation menu
            activeClassName : 'active' // classname of active link. This classname will be removed from other links in border of one navigation menu
        }
    },
    error : {
        containerClassname : 'savory-error' // classname of error container dom node
    },
    request : {
        noCache : true, // disable request chaching by adding timestamp
        requiredParam : true, // enable passing specified params to server on all Savory.js requests
        params : { // list of params passed to server on each request
            savory : true
        }
    },
    callbacks : {} // container for Savory.js callbacks
},
callbacksTypes = ['onReady','onLoad']; // types of callbacks present in Savory.js

// Merge default config and user config and save it globally
if (window.savoryConfig) {
    window.savoryConfig = _.merge(savoryConfig, window.savoryConfig);
} else {
    window.savoryConfig = savoryConfig;
}

// Add callbacks mocks if there is no specified by user
for (var i = 0; i < callbacksTypes.length; i++) {
    if (!window.savoryConfig.callbacks[callbacksTypes[i]]) {
        window.savoryConfig.callbacks[callbacksTypes[i]] = function(){};
    }
}

module.exports = window.savoryConfig;