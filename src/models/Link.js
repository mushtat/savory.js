'use strict';
var Evented = require('./Evented.js'),
    savoryConfig = require('./../config/savory.js');
    
var Link = function(){};

Link.prototype.check = function(link){
    if (!link._savory) {
        var preventDefault = false,
            identificatorClassName = savoryConfig.links.identificatorClassName;


        if (savoryConfig.links.external && link.classList.contains(identificatorClassName) ||
            !savoryConfig.links.external && !link.classList.contains(identificatorClassName)) {
            preventDefault = true;
        }

        if (preventDefault) {
            if (link.getAttribute('href').length === 0 || link.getAttribute('href') === '#') {
                return false;
            }
            Evented.on(link, 'click', function(event){
                Evented.global.fire('link.clicked', link.href);
                if (event) {
                    event.preventDefault();
                }
                return event;
            });
        }
        link._savory = true;
    }
};

module.exports = Link;