'use strict';
var utils = {
    merge : function(obj1, obj2) {
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
    forEach : function(array, callback) {
        if (typeof callback !== 'function') {
            return false;
        }
        for (var i = 0; i < array.length; i++) {
            callback(i, array[i]);
        }
    },
    findComments : function(el){
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