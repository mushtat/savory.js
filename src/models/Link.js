'use strict';
var Evented = require('./Evented.js'),
    savoryConfig = require('./../config/savory.js');

/**
 * @module Link
 * Empty constructor with single method 'check'
 * This class is used for links validation by special criterias listed in config
 *
 * @constructor
 */
var Link = function(){};

/**
 * Method for link checking
 * If link params fit to Savory.js config (@see config/savory.js), it's default action will be prevented
 * 
 *
 * @param {DOMnode} link - current checked link
 *
 * @method
 */
Link.prototype.check = function(/*DOMnode*/link){

    // Experimental feature. Please use carefully
    if (savoryConfig.links.nav.enabled) {

        Evented.global.on('links.check', function(){
            if (link.classList.contains(savoryConfig.links.nav.activeClassName)) {
                link.classList.remove(savoryConfig.links.nav.activeClassName);
            }
        });

    }    

    // Prevent link re-check
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

        Evented.on(link, 'click', onLinkClick);
    }

    link._savory = true;

    function onLinkClick(event) {
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
    }
};

/**
 * Remove all elements and events related to module
 *
 * @this Link
 * @method
 */
Link.prototype.destroy = function(link){
    delete link._savory;
    Evented.off(link, 'click');
    Evented.on(link, 'click', function(){
        return true;
    });
};

module.exports = Link;