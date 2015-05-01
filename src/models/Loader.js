'use strict';
var Evented = require('./Evented.js'),
    savoryConfig = require('./../config/savory.js'),
    request = require('nanoajax'),
    _ = require('./../plugins/utils.js');

var Loader = function(){
    var self = this;
    this._url = document.createElement('a'); // overflow for url parsing
    this.scripts = [];
    this._scriptsProxy = document.createElement('div');
    Evented.on(this, 'page.load', function(data){
        var parentContainer = document.querySelector('#'+savoryConfig.container),
            scriptsContainer = document.querySelector('#'+savoryConfig.scriptsContainer);
        parentContainer.outerHTML = data.container.outerHTML;

        if (self.scripts.length > 0) {
            for (var i = 0; i < self.scripts.length; i++) {
                deleteScripts(self.scripts[i]);
                if (self.scripts.length > 1) {
                    self.scripts.shift();
                }
            }
        }

        if (data.scripts && scriptsContainer) {
            addScripts(data.scripts);
        }

        if (savoryConfig.updateScrollPosition) {
            window.scrollTo(0,0);
        }

        document.title = data.title;
        Evented.global.fire('page.ready', parentContainer);
        Evented.fire(self, 'frame.clear');
    });

    function deleteScripts(classname) {
        var scriptsEl = document.querySelectorAll('.savory_'+classname);
        if (scriptsEl && scriptsEl.length > 0) {
            for (var i = 0; i < scriptsEl.length; i++) {
                deleteScript(scriptsEl[i]);
            }
        }
        function deleteScript(scriptEl){
            scriptEl.parentNode.removeChild(scriptEl);
        }
    }

    function addScripts(scriptsString){
        self._scriptsProxy.innerHTML = scriptsString;
        var nodes = self._scriptsProxy.childNodes;
        for(i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeType === 1) {
                document.head.appendChild(nodes[i]);
            }
        }
        var scriptTags = document.querySelectorAll('.savory_'+self.scripts[0]);
        for (var i = 0; i < scriptTags.length; i++) {
            cloneScript(scriptTags[i]);
        }
        function cloneScript(scriptTag){
            var newScript = document.createElement('script');
            newScript.id = scriptTag.id || '';
            newScript.className = scriptTag.className || '';
            if (scriptTag.innerHTML.length > 0) {
                var F = new Function (scriptTag.innerHTML);
                F();
            } else {
                newScript.src = scriptTag.src || '';
            }
            document.head.appendChild(newScript);
            document.head.removeChild(scriptTag);
        }
    }
};

Loader.prototype.load = function(path, loadParams){
    var self = this,
        parentContainer = document.querySelector('#'+savoryConfig.container),
        paramString = '';

    loadParams = _.merge({
        silent : false
    },loadParams);

    if (!path) {
        Evented.global.fire('page.ready', {
            container : parentContainer,
            title : document.title
        });
        return false;
    }

    this._url.href = path;
     
    // this._url.protocol; // => "http:"
    // this._url.hostname; // => "example.com"
    // this._url.port;     // => "3000"
    // this._url.pathname; // => "/pathname/"
    // this._url.search;   // => "?search=test"
    // this._url.hash;     // => "#hash"
    // this._url.host;     // => "example.com:3000"

    if (savoryConfig.request.requiredParam) {
        for (var k in savoryConfig.request.params) {
            paramString = k + '=' + savoryConfig.request.params[k];
        }
    }

    if (savoryConfig.request.noCache) {
        if (paramString.length > 0) {
            paramString += '&';
        }
        paramString += 'ts='+ (new Date()).getTime();
    }

    if (this._url.search !== '?' && paramString.length > 0) {
        if (this._url.search.length > 0) {
            paramString = '&' + paramString;
        } else {
            paramString = '?' + paramString;
        }
    }

    request.ajax(path + paramString, function (code, responseText) {
        var responseData = {
            path : path,
            paramString : paramString,
            code : code,
            responseText : responseText,
            silent : loadParams.silent
        };
        if (code === 200) {
            Evented.global.fire('page.load.success', responseData);
            self.parse(responseText);
        } else {
            Evented.global.fire('page.load.error', responseData);
        }
    });
};

Loader.prototype.parse = function(html){
    var normalizedHTML = this.normalizeHTML(html),
        frame = document.createElement('iframe'),
        self = this;
    frame.style.display = 'none';
    document.body.appendChild(frame);
    frame.contentWindow._savory = true;
    frame.onload = function(){
        self.onFrameLoad(frame, normalizedHTML.scripts);
    };
    frame.contentDocument.open();
    frame.contentDocument.write(normalizedHTML.html);
    frame.contentDocument.close();
};

Loader.prototype.onFrameLoad = function(frame, scripts){
    var fdocument = frame.contentDocument,
        container  = fdocument.querySelector('#'+savoryConfig.container),
        title = fdocument.title,
        comments = [],
        parseComment = function(comment){
            var value = comment.nodeValue;
            if (value.replace('<title>','').length !== value.length) {
                value = value.replace('<title>','');
                value = value.replace('</title>','');
                title = value;
            }
        };

    if (!title) {
        comments = _.findComments(fdocument);
        for (var i = 0; i < comments.length; i++) {
            parseComment(comments[i]);
        }
    }

    Evented.fire(this, 'page.load', {
        container : container,
        title : title,
        scripts : scripts
    });
    Evented.on(this, 'frame.clear', function(){
        document.body.removeChild(frame);
    });
};

Loader.prototype.normalizeHTML = function(html){

    var template = {
            start : '<div id="'+savoryConfig.scriptsContainer+'">',
            end : '<\/div>'   
        },
        scripts = html.match(new RegExp('('+template.start+'((.|\n|\r)*)'+template.end+')')),
        getId = function(){
            return Math.random().toString(36).substring(7);
        };

    if (scripts) {
        var scriptsId = getId();
        html = html.split(scripts[0]);
        html = html.join('');
        scripts = scripts[0];
        scripts = scripts.split(template.start);
        scripts = scripts.join('');
        scripts = scripts.split(template.end);
        scripts = scripts.join('');
        scripts = scripts.replace(/<( .*|)script/gi, '<script class="savory_'+scriptsId+'" ');
        this.scripts.push(scriptsId);
    }

    return {
        html : html,
        scripts : scripts
    };
};

module.exports = Loader;