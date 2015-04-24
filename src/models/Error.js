'use strict';
// define(['config/savory'],function(savoryConfig){
var savoryConfig = require('./../config/savory.js');

var SError = function(){
    this.closeTimer = false;

    this.el = document.createElement('b');
    this.el.classList.add(savoryConfig.error.containerClassname);
    document.body.appendChild(this.el);
};

SError.prototype.show = function(message){
    var self = this;
    if (self.closeTimer) {
        clearTimeout(self.closeTimer);
    }
    this.el.innerHTML = message || 'Error ocured. ¯\\_(ツ)_/¯';
    this.el.setAttribute('style', 'position:fixed;z-index:999;left:0;top:0;padding:5px;background:#E44A4A;color:black;');
    self.closeTimer = setTimeout(function(){
        self.hide();
    },4000);
};

SError.prototype.hide = function(){
    this.el.innerHTML = '';
    this.el.setAttribute('style', '');
};
module.exports = SError;