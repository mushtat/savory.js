!function e(t,n,r){function o(a,s){if(!n[a]){if(!t[a]){var c="function"==typeof require&&require;if(!s&&c)return c(a,!0);if(i)return i(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var u=n[a]={exports:{}};t[a][0].call(u.exports,function(e){var n=t[a][1][e];return o(n?n:e)},u,u.exports,e,t,n,r)}return n[a].exports}for(var i="function"==typeof require&&require,a=0;a<r.length;a++)o(r[a]);return o}({1:[function(e,t,n){!function(e,n,r){"undefined"!=typeof t&&t.exports?t.exports=r():"function"==typeof define&&define.amd?define(r):n[e]=r()}("bean",this,function(e,t){e=e||"bean",t=t||this;var n,r=window,o=t[e],i=/[^\.]*(?=\..*)\.|.*/,a=/\..*/,s="addEventListener",c="removeEventListener",l=document||{},u=l.documentElement||{},f=u[s],p=f?s:"attachEvent",h={},d=Array.prototype.slice,g=function(e,t){return e.split(t||" ")},v=function(e){return"string"==typeof e},m=function(e){return"function"==typeof e},y="click dblclick mouseup mousedown contextmenu mousewheel mousemultiwheel DOMMouseScroll mouseover mouseout mousemove selectstart selectend keydown keypress keyup orientationchange focus blur change reset select submit load unload beforeunload resize move DOMContentLoaded readystatechange message error abort scroll ",w="show input invalid touchstart touchmove touchend touchcancel gesturestart gesturechange gestureend textinput readystatechange pageshow pagehide popstate hashchange offline online afterprint beforeprint dragstart dragenter dragover dragleave drag drop dragend loadstart progress suspend emptied stalled loadmetadata loadeddata canplay canplaythrough playing waiting seeking seeked ended durationchange timeupdate play pause ratechange volumechange cuechange checking noupdate downloading cached updateready obsolete ",b=function(e,t,n){for(n=0;n<t.length;n++)t[n]&&(e[t[n]]=1);return e}({},g(y+(f?w:""))),_=function(){var e="compareDocumentPosition"in u?function(e,t){return t.compareDocumentPosition&&16===(16&t.compareDocumentPosition(e))}:"contains"in u?function(e,t){return t=9===t.nodeType||t===window?u:t,t!==e&&t.contains(e)}:function(e,t){for(;e=e.parentNode;)if(e===t)return 1;return 0},t=function(t){var n=t.relatedTarget;return n?n!==this&&"xul"!==n.prefix&&!/document/.test(this.toString())&&!e(n,this):null==n};return{mouseenter:{base:"mouseover",condition:t},mouseleave:{base:"mouseout",condition:t},mousewheel:{base:/Firefox/.test(navigator.userAgent)?"DOMMouseScroll":"mousewheel"}}}(),E=function(){var e=g("altKey attrChange attrName bubbles cancelable ctrlKey currentTarget detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey srcElement target timeStamp type view which propertyName"),t=e.concat(g("button buttons clientX clientY dataTransfer fromElement offsetX offsetY pageX pageY screenX screenY toElement")),n=t.concat(g("wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ axis")),o=e.concat(g("char charCode key keyCode keyIdentifier keyLocation location")),i=e.concat(g("data")),a=e.concat(g("touches targetTouches changedTouches scale rotation")),s=e.concat(g("data origin source")),c=e.concat(g("state")),f=/over|out/,p=[{reg:/key/i,fix:function(e,t){return t.keyCode=e.keyCode||e.which,o}},{reg:/click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i,fix:function(e,n,r){return n.rightClick=3===e.which||2===e.button,n.pos={x:0,y:0},e.pageX||e.pageY?(n.clientX=e.pageX,n.clientY=e.pageY):(e.clientX||e.clientY)&&(n.clientX=e.clientX+l.body.scrollLeft+u.scrollLeft,n.clientY=e.clientY+l.body.scrollTop+u.scrollTop),f.test(r)&&(n.relatedTarget=e.relatedTarget||e[("mouseover"==r?"from":"to")+"Element"]),t}},{reg:/mouse.*(wheel|scroll)/i,fix:function(){return n}},{reg:/^text/i,fix:function(){return i}},{reg:/^touch|^gesture/i,fix:function(){return a}},{reg:/^message$/i,fix:function(){return s}},{reg:/^popstate$/i,fix:function(){return c}},{reg:/.*/,fix:function(){return e}}],h={},d=function(e,t,n){if(arguments.length&&(e=e||((t.ownerDocument||t.document||t).parentWindow||r).event,this.originalEvent=e,this.isNative=n,this.isBean=!0,e)){var o,i,a,s,c,l=e.type,u=e.target||e.srcElement;if(this.target=u&&3===u.nodeType?u.parentNode:u,n){if(c=h[l],!c)for(o=0,i=p.length;i>o;o++)if(p[o].reg.test(l)){h[l]=c=p[o].fix;break}for(s=c(e,this,l),o=s.length;o--;)!((a=s[o])in this)&&a in e&&(this[a]=e[a])}}};return d.prototype.preventDefault=function(){this.originalEvent.preventDefault?this.originalEvent.preventDefault():this.originalEvent.returnValue=!1},d.prototype.stopPropagation=function(){this.originalEvent.stopPropagation?this.originalEvent.stopPropagation():this.originalEvent.cancelBubble=!0},d.prototype.stop=function(){this.preventDefault(),this.stopPropagation(),this.stopped=!0},d.prototype.stopImmediatePropagation=function(){this.originalEvent.stopImmediatePropagation&&this.originalEvent.stopImmediatePropagation(),this.isImmediatePropagationStopped=function(){return!0}},d.prototype.isImmediatePropagationStopped=function(){return this.originalEvent.isImmediatePropagationStopped&&this.originalEvent.isImmediatePropagationStopped()},d.prototype.clone=function(e){var t=new d(this,this.element,this.isNative);return t.currentTarget=e,t},d}(),k=function(e,t){return f||t||e!==l&&e!==r?e:u},x=function(){var e=function(e,t,n,r){var o=function(n,o){return t.apply(e,r?d.call(o,n?0:1).concat(r):o)},i=function(n,r){return t.__beanDel?t.__beanDel.ft(n.target,e):r},a=n?function(e){var t=i(e,this);return n.apply(t,arguments)?(e&&(e.currentTarget=t),o(e,arguments)):void 0}:function(e){return t.__beanDel&&(e=e.clone(i(e))),o(e,arguments)};return a.__beanDel=t.__beanDel,a},t=function(t,n,r,o,i,a,s){var c,l=_[n];"unload"==n&&(r=N(S,t,n,r,o)),l&&(l.condition&&(r=e(t,r,l.condition,a)),n=l.base||n),this.isNative=c=b[n]&&!!t[p],this.customType=!f&&!c&&n,this.element=t,this.type=n,this.original=o,this.namespaces=i,this.eventType=f||c?n:"propertychange",this.target=k(t,c),this[p]=!!this.target[p],this.root=s,this.handler=e(t,r,null,a)};return t.prototype.inNamespaces=function(e){var t,n,r=0;if(!e)return!0;if(!this.namespaces)return!1;for(t=e.length;t--;)for(n=this.namespaces.length;n--;)e[t]==this.namespaces[n]&&r++;return e.length===r},t.prototype.matches=function(e,t,n){return!(this.element!==e||t&&this.original!==t||n&&this.handler!==n)},t}(),T=function(){var e={},t=function(n,r,o,i,a,s){var c=a?"r":"$";if(r&&"*"!=r){var l,u=0,f=e[c+r],p="*"==n;if(!f)return;for(l=f.length;l>u;u++)if((p||f[u].matches(n,o,i))&&!s(f[u],f,u,r))return}else for(var h in e)h.charAt(0)==c&&t(n,h.substr(1),o,i,a,s)},n=function(t,n,r,o){var i,a=e[(o?"r":"$")+n];if(a)for(i=a.length;i--;)if(!a[i].root&&a[i].matches(t,r,null))return!0;return!1},r=function(e,n,r,o){var i=[];return t(e,n,r,null,o,function(e){return i.push(e)}),i},o=function(t){var n=!t.root&&!this.has(t.element,t.type,null,!1),r=(t.root?"r":"$")+t.type;return(e[r]||(e[r]=[])).push(t),n},i=function(n){t(n.element,n.type,null,n.handler,n.root,function(t,n,r){return n.splice(r,1),t.removed=!0,0===n.length&&delete e[(t.root?"r":"$")+t.type],!1})},a=function(){var t,n=[];for(t in e)"$"==t.charAt(0)&&(n=n.concat(e[t]));return n};return{has:n,get:r,put:o,del:i,entries:a}}(),j=function(e){n=arguments.length?e:l.querySelectorAll?function(e,t){return t.querySelectorAll(e)}:function(){throw new Error("Bean: No selector engine installed")}},C=function(e,t){if(f||!t||!e||e.propertyName=="_on"+t){var n=T.get(this,t||e.type,null,!1),r=n.length,o=0;for(e=new E(e,this,!0),t&&(e.type=t);r>o&&!e.isImmediatePropagationStopped();o++)n[o].removed||n[o].handler.call(this,e)}},L=f?function(e,t,n){e[n?s:c](t,C,!1)}:function(e,t,n,r){var o;n?(T.put(o=new x(e,r||t,function(t){C.call(e,t,r)},C,null,null,!0)),r&&null==e["_on"+r]&&(e["_on"+r]=0),o.target.attachEvent("on"+o.eventType,o.handler)):(o=T.get(e,r||t,C,!0)[0],o&&(o.target.detachEvent("on"+o.eventType,o.handler),T.del(o)))},N=function(e,t,n,r,o){return function(){r.apply(this,arguments),e(t,n,o)}},S=function(e,t,n,r){var o,i,s=t&&t.replace(a,""),c=T.get(e,s,null,!1),l={};for(o=0,i=c.length;i>o;o++)n&&c[o].original!==n||!c[o].inNamespaces(r)||(T.del(c[o]),!l[c[o].eventType]&&c[o][p]&&(l[c[o].eventType]={t:c[o].eventType,c:c[o].type}));for(o in l)T.has(e,l[o].t,null,!1)||L(e,l[o].t,!1,l[o].c)},P=function(e,t){var r=function(t,r){for(var o,i=v(e)?n(e,r):e;t&&t!==r;t=t.parentNode)for(o=i.length;o--;)if(i[o]===t)return t},o=function(e){var n=r(e.target,this);n&&t.apply(n,arguments)};return o.__beanDel={ft:r,selector:e},o},D=f?function(e,t,n){var o=l.createEvent(e?"HTMLEvents":"UIEvents");o[e?"initEvent":"initUIEvent"](t,!0,!0,r,1),n.dispatchEvent(o)}:function(e,t,n){n=k(n,e),e?n.fireEvent("on"+t,l.createEventObject()):n["_on"+t]++},O=function(e,t,n){var r,o,s,c,l=v(t);if(l&&t.indexOf(" ")>0){for(t=g(t),c=t.length;c--;)O(e,t[c],n);return e}if(o=l&&t.replace(a,""),o&&_[o]&&(o=_[o].base),!t||l)(s=l&&t.replace(i,""))&&(s=g(s,".")),S(e,o,n,s);else if(m(t))S(e,null,t);else for(r in t)t.hasOwnProperty(r)&&O(e,r,t[r]);return e},q=function(e,t,r,o){var s,c,l,u,f,v,y;{if(void 0!==r||"object"!=typeof t){for(m(r)?(f=d.call(arguments,3),o=s=r):(s=o,f=d.call(arguments,4),o=P(r,s,n)),l=g(t),this===h&&(o=N(O,e,t,o,s)),u=l.length;u--;)y=T.put(v=new x(e,l[u].replace(a,""),o,s,g(l[u].replace(i,""),"."),f,!1)),v[p]&&y&&L(e,v.eventType,!0,v.customType);return e}for(c in t)t.hasOwnProperty(c)&&q.call(this,e,c,t[c])}},M=function(e,t,n,r){return q.apply(null,v(n)?[e,n,t,r].concat(arguments.length>3?d.call(arguments,5):[]):d.call(arguments))},A=function(){return q.apply(h,arguments)},I=function(e,t,n){var r,o,s,c,l,u=g(t);for(r=u.length;r--;)if(t=u[r].replace(a,""),(c=u[r].replace(i,""))&&(c=g(c,".")),c||n||!e[p])for(l=T.get(e,t,null,!1),n=[!1].concat(n),o=0,s=l.length;s>o;o++)l[o].inNamespaces(c)&&l[o].handler.apply(e,n);else D(b[t],t,e);return e},R=function(e,t,n){for(var r,o,i=T.get(t,n,null,!1),a=i.length,s=0;a>s;s++)i[s].original&&(r=[e,i[s].type],(o=i[s].handler.__beanDel)&&r.push(o.selector),r.push(i[s].original),q.apply(null,r));return e},X={on:q,add:M,one:A,off:O,remove:O,clone:R,fire:I,Event:E,setSelectorEngine:j,noConflict:function(){return t[e]=o,this}};if(r.attachEvent){var $=function(){var e,t=T.entries();for(e in t)t[e].type&&"unload"!==t[e].type&&O(t[e].element,t[e].type);r.detachEvent("onunload",$),r.CollectGarbage&&r.CollectGarbage()};r.attachEvent("onunload",$)}return j(),X})},{}],2:[function(e,t,n){!function(e){if("function"==typeof define&&define.amd){var t="[history"+(new Date).getTime()+"]",n=requirejs.onError;e.toString=function(){return t},requirejs.onError=function(e){-1===e.message.indexOf(t)&&n.call(requirejs,e)},define([],e)}e()}(function(){function e(){}function t(e,n,r){var o=/(?:(\w+\:))?(?:\/\/(?:[^@]*@)?([^\/:\?#]+)(?::([0-9]+))?)?([^\?#]*)(?:(\?[^#]+)|\?)?(?:(#.*))?/;if(null==e||""===e||n)e=n?e:E.href,(!C||r)&&(e=e.replace(/^[^#]*/,"")||"#",e=E.protocol.replace(/:.*$|$/,":")+"//"+E.host+R.basepath+e.replace(new RegExp("^#[/]?(?:"+R.type+")?"),""));else{var i=t(),a=y.getElementsByTagName("base")[0];!r&&a&&a.getAttribute("href")&&(a.href=a.href,i=t(a.href,null,!0));var s=i._pathname,c=i._protocol;e=""+e,e=/^(?:\w+\:)?\/\//.test(e)?0===e.indexOf("/")?c+e:e:c+"//"+i._host+(0===e.indexOf("/")?e:0===e.indexOf("?")?s+e:0===e.indexOf("#")?s+i._search+e:s.replace(/[^\/]+$/g,"")+e)}$.href=e;var l=o.exec($.href),u=l[2]+(l[3]?":"+l[3]:""),f=l[4]||"/",p=l[5]||"",h="#"===l[6]?"":l[6]||"",d=f+p+h,g=f.replace(new RegExp("^"+R.basepath,"i"),R.type)+p;return{_href:l[1]+"//"+u+d,_protocol:l[1],_host:u,_hostname:l[2],_port:l[3]||"",_pathname:f,_search:p,_hash:h,_relative:d,_nohash:g,_special:g+h}}function n(){var e;try{e=m.sessionStorage,e.setItem(X+"t","1"),e.removeItem(X+"t")}catch(t){e={getItem:function(e){var t=y.cookie.split(e+"=");return t.length>1&&t.pop().split(";").shift()||"null"},setItem:function(e,t){var n={};(n[E.href]=x.state)&&(y.cookie=e+"="+_.stringify(n))}}}try{U=_.parse(e.getItem(X))||{}}catch(t){U={}}M(P+"unload",function(){e.setItem(X,_.stringify(U))},!1)}function r(t,n,r,o){var i=0;r||(r={set:e},i=1);var a=!r.set,s=!r.get,c={configurable:!0,set:function(){a=1},get:function(){s=1}};try{N(t,n,c),t[n]=t[n],N(t,n,r)}catch(l){}if(!(a&&s||(t.__defineGetter__&&(t.__defineGetter__(n,c.get),t.__defineSetter__(n,c.set),t[n]=t[n],r.get&&t.__defineGetter__(n,r.get),r.set&&t.__defineSetter__(n,r.set)),a&&s))){if(i)return!1;if(t===m){try{var u=t[n];t[n]=null}catch(l){}if("execScript"in m)m.execScript("Public "+n,"VBScript"),m.execScript("var "+n+";","JavaScript");else try{N(t,n,{value:e})}catch(l){"onpopstate"===n&&(M("popstate",r=function(){A("popstate",r,!1);var e=t.onpopstate;t.onpopstate=null,setTimeout(function(){t.onpopstate=e},1)},!1),Y=0)}t[n]=u}else try{try{var f=b.create(t);N(b.getPrototypeOf(f)===t?f:t,n,r);for(var p in t)"function"==typeof t[p]&&(f[p]=t[p].bind(t));try{o.call(f,f,t)}catch(l){}t=f}catch(l){N(t.constructor.prototype,n,r)}}catch(l){return!1}}return t}function o(e,t,n){return n=n||{},e=e===Z?E:e,n.set=n.set||function(n){e[t]=n},n.get=n.get||function(){return e[t]},n}function i(e,t,n){e in V?V[e].push(t):arguments.length>3?M(e,t,n,arguments[3]):M(e,t,n)}function a(e,t,n){var r=V[e];if(r){for(var o=r.length;o--;)if(r[o]===t){r.splice(o,1);break}}else A(e,t,n)}function s(t,n){var o=(""+("string"==typeof t?t:t.type)).replace(/^on/,""),i=V[o];if(i){if(n="string"==typeof t?n:t,null==n.target)for(var a=["target","currentTarget","srcElement","type"];t=a.pop();)n=r(n,t,{get:"type"===t?function(){return o}:function(){return m}});Y&&(("popstate"===o?m.onpopstate:m.onhashchange)||e).call(m,n);for(var s=0,c=i.length;c>s;s++)i[s].call(m,n);return!0}return I(t,n)}function c(){var e=y.createEvent?y.createEvent("Event"):y.createEventObject();e.initEvent?e.initEvent("popstate",!1,!1):e.type="popstate",e.state=x.state,s(e)}function l(){B&&(B=!1,c())}function u(e,n,r,o){if(C)F=E.href;else{0===G&&(G=2);var i=t(n,2===G&&-1!==(""+n).indexOf("#"));i._relative!==t()._relative&&(F=o,r?E.replace("#"+i._special):E.hash=i._special)}!L&&e&&(U[E.href]=e),B=!1}function f(e){var n=F;if(F=E.href,n){H!==E.href&&c(),e=e||m.event;var r=t(n,!0),o=t();e.oldURL||(e.oldURL=r._href,e.newURL=o._href),r._hash!==o._hash&&s(e)}}function p(e){setTimeout(function(){M("popstate",function(e){H=E.href,L||(e=r(e,"state",{get:function(){return x.state}})),s(e)},!1)},0),!C&&e!==!0&&"location"in x&&(g(S.hash),l())}function h(e){for(;e;){if("A"===e.nodeName)return e;e=e.parentNode}}function d(e){var n=e||m.event,r=h(n.target||n.srcElement),o="defaultPrevented"in n?n.defaultPrevented:n.returnValue===!1;if(r&&"A"===r.nodeName&&!o){var i=t(),a=t(r.getAttribute("href",2)),s=i._href.split("#").shift()===a._href.split("#").shift();s&&a._hash&&(i._hash!==a._hash&&(S.hash=a._hash),g(a._hash),n.preventDefault?n.preventDefault():n.returnValue=!1)}}function g(e){var t=y.getElementById(e=(e||"").replace(/^#/,""));if(t&&t.id===e&&"A"===t.nodeName){var n=t.getBoundingClientRect();m.scrollTo(w.scrollLeft||0,n.top+(w.scrollTop||0)-(w.clientTop||0))}}function v(){var e=y.getElementsByTagName("script"),i=(e[e.length-1]||{}).src||"",a=-1!==i.indexOf("?")?i.split("?").pop():"";a.replace(/(\w+)(?:=([^&]*))?/g,function(e,t,n){R[t]=(n||"").replace(/^(0|false)$/,"")}),M(P+"hashchange",f,!1);var s=[Z,S,K,m,J,x];L&&delete J.state;for(var c=0;c<s.length;c+=2)for(var l in s[c])if(s[c].hasOwnProperty(l))if("function"==typeof s[c][l])s[c+1][l]=s[c][l];else{var u=o(s[c],l,s[c][l]);if(!r(s[c+1],l,u,function(e,t){t===x&&(m.history=x=s[c+1]=e)}))return A(P+"hashchange",f,!1),!1;s[c+1]===m&&(V[l]=V[l.substr(2)]=[])}return x.setup(),R.redirect&&x.redirect(),R.init&&(G=1),!L&&_&&n(),C||y[D](P+"click",d,!1),"complete"===y.readyState?p(!0):(C||t()._relative===R.basepath||(B=!0),M(P+"load",p,!1)),!0}var m=("object"==typeof window?window:this)||{};if(!m.history||"emulate"in m.history)return m.history;var y=m.document,w=y.documentElement,b=m.Object,_=m.JSON,E=m.location,k=m.history,x=k,T=k.pushState,j=k.replaceState,C=!!T,L="state"in k,N=b.defineProperty,S=r({},"t")?{}:y.createElement("a"),P="",D=m.addEventListener?"addEventListener":(P="on")&&"attachEvent",O=m.removeEventListener?"removeEventListener":"detachEvent",q=m.dispatchEvent?"dispatchEvent":"fireEvent",M=m[D],A=m[O],I=m[q],R={basepath:"/",redirect:0,type:"/",init:0},X="__historyAPI__",$=y.createElement("a"),F=E.href,H="",Y=1,B=!1,G=0,U={},V={},z=y.title,K={onhashchange:null,onpopstate:null},W=function(e,t){var n=m.history!==k;n&&(m.history=k),e.apply(k,t),n&&(m.history=x)},J={setup:function(e,t,n){R.basepath=(""+(null==e?R.basepath:e)).replace(/(?:^|\/)[^\/]*$/,"/"),R.type=null==t?R.type:t,R.redirect=null==n?R.redirect:!!n},redirect:function(e,n){if(x.setup(n,e),n=R.basepath,m.top==m.self){var r=t(null,!1,!0)._relative,o=E.pathname+E.search;C?(o=o.replace(/([^\/])$/,"$1/"),r!=n&&new RegExp("^"+n+"$","i").test(o)&&E.replace(r)):o!=n&&(o=o.replace(/([^\/])\?/,"$1/?"),new RegExp("^"+n,"i").test(o)&&E.replace(n+"#"+o.replace(new RegExp("^"+n,"i"),R.type)+E.hash))}},pushState:function(e,t,n){var r=y.title;null!=z&&(y.title=z),T&&W(T,arguments),u(e,n),y.title=r,z=t},replaceState:function(e,t,n){var r=y.title;null!=z&&(y.title=z),delete U[E.href],j&&W(j,arguments),u(e,n,!0),y.title=r,z=t},location:{set:function(e){0===G&&(G=1),m.location=e},get:function(){return 0===G&&(G=1),C?E:S}},state:{get:function(){return U[E.href]||null}}},Z={assign:function(e){0===(""+e).indexOf("#")?u(null,e):E.assign(e)},reload:function(){E.reload()},replace:function(e){0===(""+e).indexOf("#")?u(null,e,!0):E.replace(e)},toString:function(){return this.href},href:{get:function(){return t()._href}},protocol:null,host:null,hostname:null,port:null,pathname:{get:function(){return t()._pathname}},search:{get:function(){return t()._search}},hash:{set:function(e){u(null,(""+e).replace(/^(#|)/,"#"),!1,F)},get:function(){return t()._hash}}};return v()?(x.emulate=!C,m[D]=i,m[O]=a,m[q]=s,x):void 0})},{}],3:[function(e,t,n){(function(e){function t(){if(e.XMLHttpRequest)return new e.XMLHttpRequest;try{return new e.ActiveXObject("MSXML2.XMLHTTP.3.0")}catch(t){}throw new Error("no xmlhttp request able to be created")}function r(e,t,n){e[t]=e[t]||n}n.ajax=function(e,n){"string"==typeof e&&(e={url:e});var o=e.headers||{},i=e.body,a=e.method||(i?"POST":"GET"),s=e.withCredentials||!1,c=t();c.onreadystatechange=function(){4==c.readyState&&n(c.status,c.responseText,c)},i&&(r(o,"X-Requested-With","XMLHttpRequest"),r(o,"Content-Type","application/x-www-form-urlencoded")),c.open(a,e.url,!0),c.withCredentials=s;for(var l in o)c.setRequestHeader(l,o[l]);c.send(i)}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],4:[function(e,t,n){"use strict";var r=e("./../plugins/utils.js"),o={container:"container",scriptsContainer:"scripts",autoInit:!0,updateScrollPosition:!0,links:{external:!1,identificatorClassName:"external",nav:{enabled:!1,list:["nav"],activeClassName:"active"}},error:{containerClassname:"savory-error"},request:{noCache:!0,requiredParam:!0,params:{savory:!0}},callbacks:{}},i=["onReady","onLoad"];window.savoryConfig=window.savoryConfig?r.merge(o,window.savoryConfig):o;for(var a=0;a<i.length;a++)window.savoryConfig.callbacks[i[a]]||(window.savoryConfig.callbacks[i[a]]=function(){});t.exports=window.savoryConfig},{"./../plugins/utils.js":12}],5:[function(e,t,n){"use strict";var r=e("./../models/Parser.js"),o=e("./../models/Loader.js"),i=e("./../models/Evented.js"),a=e("./../models/Error.js"),s=e("./../config/savory.js"),c=e("./../plugins/utils.js");e("html5-history-api"),e("./../plugins/compat.js");var l=function(){function e(e,t){t&&"object"==typeof t||(t={}),t=c.merge({onSuccess:function(){},onError:function(){},preventDefault:!1},t),i.global.one("page.load.success",t.onSuccess),i.global.one("page.load.error",t.onError),n.load(e)}var t=new a,n=new o,s=new r;this._={error:t,loader:n,parser:s,location:window.history.location||window.location},i.global.on("page.ready",this.onPageReady.bind(this)),i.global.on("link.clicked",this.onLinkClick.bind(this)),i.global.on("page.load.success",this.onLoad.bind(this)),i.global.on("page.load.error",this.onError.bind(this)),i.on(window,"popstate",this.onLocationChange.bind(this)),this._.loader.load(),this["public"]={load:e.bind(this)}};l.prototype.onPageReady=function(e){this._.parser.parse(e.container),s.callbacks.onLoad()},l.prototype.onLinkClick=function(e){this.onLocationChange(e.href)},l.prototype.onLoad=function(e){this._.error.hide(),e.silent||history.pushState(e.path,null,e.path)},l.prototype.onError=function(e){this._.error.hide(),this._.error.show("Error loading "+e.path+" Error code: "+e.code)},l.prototype.onLocationChange=function(e){var t=!1;"string"!=typeof e&&(e=window.history.location.href,t=!0),this._.loader.load(e,{silent:t})},l.prototype.destroy=function(){i.global.off("page.ready"),i.global.off("link.clicked"),i.global.off("page.load.success"),i.global.off("page.load.error"),i.off(window,"popstate",this.onLocationChange.bind(this)),this._.error.destroy(),this._.loader.destroy(),this._.parser.destroy()},t.exports=l},{"./../config/savory.js":4,"./../models/Error.js":6,"./../models/Evented.js":7,"./../models/Loader.js":9,"./../models/Parser.js":10,"./../plugins/compat.js":11,"./../plugins/utils.js":12,"html5-history-api":2}],6:[function(e,t,n){"use strict";var r=e("./../config/savory.js"),o=function(){this.closeTimer=null,this.el=document.createElement("b"),this.el.classList.add(r.error.containerClassname),document.body.appendChild(this.el)};o.prototype.show=function(e){this.closeTimer&&clearTimeout(this.closeTimer),this.el.innerHTML=e||"Error occurred. ¯\\_(ツ)_/¯",this.el.setAttribute("style","position:fixed;z-index:999;left:0;top:0;padding:5px;background:#E44A4A;color:black;"),this.closeTimer=setTimeout(this.hide.bind(this),4e3)},o.prototype.hide=function(){this.el.innerHTML="",this.el.setAttribute("style","")},o.prototype.destroy=function(){this.closeTimer&&clearTimeout(this.closeTimer),delete this.closeTimer,this.el.parentNode.removeChild(this.el)},t.exports=o},{"./../config/savory.js":4}],7:[function(e,t,n){"use strict";function r(e){i.global[e]=function(t,n){o[e](a,t,n)}}var o=e("bean"),i=o,a=document.createElement("div"),s=["on","one","off","fire"];i.global={};for(var c=s.length-1;c>=0;c--)r(s[c]);t.exports=i},{bean:1}],8:[function(e,t,n){"use strict";var r=e("./Evented.js"),o=e("./../config/savory.js"),i=function(){};i.prototype.check=function(e){function t(t){var n="";if(o.links.nav.enabled)for(var i=0;i<o.links.nav.list.length;i++)if(e.classList.contains(o.links.nav.list[i])){n=o.links.nav.list[i],""!==this.target&&this.target||(r.global.fire("links.check",{navClassName:n}),e.classList.add(o.links.nav.activeClassName));break}return r.global.fire("link.clicked",{href:e.href,navClassName:n}),t&&t.preventDefault(),t}if(o.links.nav.enabled&&r.global.on("links.check",function(){e.classList.contains(o.links.nav.activeClassName)&&e.classList.remove(o.links.nav.activeClassName)}),e._savory)return!0;var n=!1,i=o.links.identificatorClassName;if((o.links.external&&e.classList.contains(i)||!o.links.external&&!e.classList.contains(i))&&(n=!0),n){if(0===e.getAttribute("href").length||"#"===e.getAttribute("href"))return!1;r.on(e,"click",t)}e._savory=!0},i.prototype.destroy=function(e){delete e._savory,r.off(e,"click"),r.on(e,"click",function(){return!0})},t.exports=i},{"./../config/savory.js":4,"./Evented.js":7}],9:[function(e,t,n){"use strict";var r=e("./Evented.js"),o=e("./../config/savory.js"),i=e("nanoajax"),a=e("./../plugins/utils.js"),s=function(){this._url=document.createElement("a"),this.scripts=[],this.currentFrameNode=null,this._scriptsProxy=document.createElement("div"),r.on(this,"page.load",this.onPageLoad.bind(this))};s.prototype.load=function(e,t){var n=document.querySelector("#"+o.container),s="";if(t=a.merge({silent:!1},t),!e)return r.global.fire("page.ready",{container:n,title:document.title}),!1;if(this._url.href=e,o.request.requiredParam)for(var c in o.request.params)s=c+"="+o.request.params[c];o.request.noCache&&(s.length>0&&(s+="&"),s+="ts="+(new Date).getTime()),"?"!==this._url.search&&s.length>0&&(s=this._url.search.length>0?"&"+s:"?"+s),i.ajax(e+s,function(n,o){var i={path:e,paramString:s,code:n,responseText:o,silent:t.silent};200===n?(r.global.fire("page.load.success",i),this.parse(o)):r.global.fire("page.load.error",i)}.bind(this))},s.prototype.parse=function(e){var t=this.normalizeHTML(e),n=document.createElement("iframe");n.style.display="none",document.body.appendChild(n),n.contentWindow._savory=!0,n.onload=function(){this.onFrameLoad(n,t.scripts)}.bind(this),n.contentDocument.open(),n.contentDocument.write(t.html),n.contentDocument.close(),this.currentFrameNode=n,r.one(this,"frame.clear",function(){this.currentFrameNode=null,document.body.removeChild(n)})},s.prototype.onFrameLoad=function(e,t){var n=e.contentDocument,i=n.querySelector("#"+o.container),s=n.title,c=[],l=function(e){var t=e.nodeValue;t.replace("<title>","").length!==t.length&&(t=t.replace("<title>",""),t=t.replace("</title>",""),s=t)};if(!s){c=a.findComments(n);for(var u=0;u<c.length;u++)l(c[u])}r.fire(this,"page.load",{container:i,title:s,scripts:t})},s.prototype.onPageLoad=function(e){function t(e){function t(e){e.parentNode.removeChild(e)}var n=document.querySelectorAll(".savory_"+e);if(n&&n.length>0)for(var r=0;r<n.length;r++)t(n[r])}function n(e){function t(e){var t,n=document.createElement("script");n.id=e.id||"",n.className=e.className||"",e.innerHTML.length>0?(t=new Function(e.innerHTML),t.call(window)):n.src=e.src||"",document.head.appendChild(n),document.head.removeChild(e)}var n,r;for(this._scriptsProxy.innerHTML=e,n=this._scriptsProxy.childNodes,o=0;o<n.length;o++)1===n[o].nodeType&&document.head.appendChild(n[o]);r=document.head.querySelectorAll(".savory_"+this.scripts[0]);for(var o=0;o<r.length;o++)t(r[o])}var i=document.querySelector("#"+o.container),a=document.querySelector("#"+o.scriptsContainer);if(i.outerHTML=e.container.outerHTML,this.scripts.length>0)for(var s=0;s<this.scripts.length;s++)t(this.scripts[s]),this.scripts.length>1&&this.scripts.shift();e.scripts&&a&&n.call(this,e.scripts),o.updateScrollPosition&&window.scrollTo(0,0),document.title=e.title,r.global.fire("page.ready",i),r.fire(this,"frame.clear")},s.prototype.normalizeHTML=function(e){var t={start:'<div id="'+o.scriptsContainer+'">',end:"</div>"},n=e.match(new RegExp("("+t.start+"((.|\n|\r)*)"+t.end+")")),r=function(){return Math.random().toString(36).substring(7)};if(n){var i=r();e=e.split(n[0]),e=e.join(""),n=n[0],n=n.split(t.start),n=n.join(""),n=n.split(t.end),n=n.join(""),n=n.replace(/<( .*|)script/gi,'<script class="savory_'+i+'" '),this.scripts.push(i)}return{html:e,scripts:n}},s.prototype.destroy=function(){r.off(this,"page.load"),r.off(this,"frame.clear"),this.currentFrameNode&&this.currentFrameNode.parentNode&&this.currentFrameNode.parentNode.removeChild(this.currentFrameNode)},t.exports=s},{"./../config/savory.js":4,"./../plugins/utils.js":12,"./Evented.js":7,nanoajax:3}],10:[function(e,t,n){"use strict";var r=e("./Link.js"),o=e("./Evented.js"),i=e("./../plugins/utils.js"),a=function(){};a.prototype.parse=function(){return this.dom={links:new r},o.global.off("links.check"),i.forEach(document.links,function(e,t){this.dom.links.check(t)},this),this.dom},a.prototype.destroy=function(){o.global.off("links.check"),i.forEach(document.links,function(e,t){this.dom.links.destroy(t)},this)},t.exports=a},{"./../plugins/utils.js":12,"./Evented.js":7,"./Link.js":8}],11:[function(e,t,n){"use strict";t.exports=function(){!function(){function e(e){this.el=e;for(var t=e.className.replace(/^\s+|\s+$/g,"").split(/\s+/),n=0;n<t.length;n++)r.call(this,t[n])}function t(e,t,n){Object.defineProperty?Object.defineProperty(e,t,{get:n}):e.__defineGetter__(t,n)}if(!("undefined"==typeof window.Element||"classList"in document.documentElement)){var n=Array.prototype,r=n.push,o=n.splice,i=n.join;e.prototype={add:function(e){this.contains(e)||(r.call(this,e),this.el.className=this.toString())},contains:function(e){return-1!=this.el.className.indexOf(e)},item:function(e){return this[e]||null},remove:function(e){if(this.contains(e)){for(var t=0;t<this.length&&this[t]!=e;t++);o.call(this,t,1),this.el.className=this.toString()}},toString:function(){return i.call(this," ")},toggle:function(e){return this.contains(e)?this.remove(e):this.add(e),this.contains(e)}},window.DOMTokenList=e,t(Element.prototype,"classList",function(){return new e(this)})}}(),Function.prototype.bind||(Function.prototype.bind=function(e){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var t=Array.prototype.slice.call(arguments,1),n=this,r=function(){},o=function(){return n.apply(this instanceof r?this:e,t.concat(Array.prototype.slice.call(arguments)))};return r.prototype=this.prototype,o.prototype=new r,o})}},{}],12:[function(e,t,n){"use strict";var r={merge:function(e,t){for(var n in t)try{e[n]=t[n].constructor==Object?r.merge(e[n],t[n]):t[n]}catch(o){e[n]=t[n]}return e},forEach:function(e,t,n){if("function"!=typeof t)return!1;for(var r=0;r<e.length;r++)t.call(n,r,e[r])},findComments:function(e){for(var t=[],n=0;n<e.childNodes.length;n++){var r=e.childNodes[n];8===r.nodeType?t.push(r):t.push.apply(t,this.findComments(r))}return t}};t.exports=r},{}],13:[function(e,t,n){"use strict";!function(e,r){"object"==typeof n?t.exports=r():"function"==typeof define&&define.amd?define(["savory"],r):r()}(this,function(){function t(e){if(window._savory)return window._savory;var e=e||{};window.savoryConfig&&(e=r.merge(e,window.savoryConfig)),this.config=e,this["interface"]=new n,this.api=this["interface"]["public"],window.savoryConfig.callbacks.onReady(this),window._savory=this}var n=e("./controllers/Interface.js"),r=e("./plugins/utils.js");return t.prototype.destroy=function(){return this["interface"].destroy(),window._savory=null,delete window._savory,window.savory&&(window.savory=null,delete window.savory),null},window.Savory=t.bind(t),window.savoryConfig.autoInit&&(document.body?window.savory=new t:window.onload=function(){window.onload&&"function"==typeof window.onload&&window.onload(),window.savory=new t}),t})},{"./controllers/Interface.js":5,"./plugins/utils.js":12}]},{},[13]);
//# sourceMappingURL=savory-0.0.1.js.map