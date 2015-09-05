'use strict';
var savoryConfig = require('./../config/savory.js');

/**
 * @module Error
 * Main Savory.js errors class
 * Create error DOM node and add classnames from config
 * Append error container node to body
 *
 * @constructor
 */
var SError = function(){
    this.closeTimer = null;

    this.el = document.createElement('b');
    this.el.classList.add(savoryConfig.error.containerClassname);
    document.body.appendChild(this.el);
};

/**
 * Method for error showing
 * Called when there is no page at specified path
 * Closed automatically for 4 sec
 *
 * @param {string} message - Error message to show
 *
 * @this SError
 * @method
 */
SError.prototype.show = function(/*string*/message){

    if (this.closeTimer) {
        clearTimeout(this.closeTimer);
    }

    this.el.innerHTML = message || 'Error occurred. ¯\\_(ツ)_/¯';
    this.el.setAttribute('style', 'position:fixed;z-index:999;left:0;top:0;padding:5px;background:#E44A4A;color:black;');
    
    this.closeTimer = setTimeout(this.hide.bind(this), 4000);
};

/**
 * Method for error hiding
 * Erase error container content and styles
 *
 * @this SError
 * @method
 */
SError.prototype.hide = function(){
    this.el.innerHTML = '';
    this.el.setAttribute('style', '');
};

/**
 * Remove all elements and events related to module
 *
 * @this SError
 * @method
 */
SError.prototype.destroy = function(){
    if (this.closeTimer) {
        clearTimeout(this.closeTimer);
    }
    delete this.closeTimer;
    
    if (this.el.parentNode) {
        this.el.parentNode.removeChild(this.el);        
    }
};

module.exports = SError;