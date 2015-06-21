'use strict';
// Object with set of auxiliary methods
var utils = {
    // Merge two objects 
    merge : function(/*object*/obj1, /*object*/obj2) {
        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if ( obj2[p].constructor==Object ) {
                  obj1[p] = utils.merge(obj1[p], obj2[p]);
                } else {
                  obj1[p] = obj2[p];
                }
            } catch(e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    },
    // forEach method for arrays that execute callback to each array item
    forEach : function(/*array*/array, /*function*/callback, /*obj*/scope) {
        if (typeof callback !== 'function') {
            return false;
        }
        for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]);
        }
    },
    // Find comment tags in passed dom node
    findComments : function(/*DOMnode*/el){
        var arr = [];
        for(var i = 0; i < el.childNodes.length; i++) {
            var node = el.childNodes[i];
            if(node.nodeType === 8) {
                arr.push(node);
            } else {
                arr.push.apply(arr, this.findComments(node));
            }
        }
        return arr;
    }
};
module.exports = utils;