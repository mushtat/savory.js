'use strict';
var Evented = require('./Evented.js'),
    savoryConfig = require('./../config/savory.js');
    
var Link = function(){};

Link.prototype.check = function(link){

    if (savoryConfig.links.nav.enabled) {
        Evented.global.on('links.check', function(data){
            if (link.classList.contains(savoryConfig.links.nav.activeClassName)) {
                link.classList.remove(savoryConfig.links.nav.activeClassName);
            }
        });
    }    

    if (link._savory) {
        return true;
    }
    
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
            var navClassName = '';

            if (savoryConfig.links.nav.enabled) {
                for (var i = 0; i < savoryConfig.links.nav.list.length; i++) {
                    
                    if (link.classList.contains(savoryConfig.links.nav.list[i])) {
                        navClassName = savoryConfig.links.nav.list[i];
                        
                        if (this.target === '' || !this.target) {
                            Evented.global.fire('links.check', {
                                navClassName : navClassName
                            });
                            link.classList.add(savoryConfig.links.nav.activeClassName);
                        }
                        break;
                    }
                }
            }

            Evented.global.fire('link.clicked', {
                href : link.href,
                navClassName : navClassName
            });


            if (event) {
                event.preventDefault();
            }
            return event;
        });
    }

    link._savory = true;
};

module.exports = Link;