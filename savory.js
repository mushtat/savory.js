(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * History API JavaScript Library v4.2.0
 *
 * Support: IE8+, FF3+, Opera 9+, Safari, Chrome and other
 *
 * Copyright 2011-2014, Dmitrii Pakhtinov ( spb.piksel@gmail.com )
 *
 * http://spb-piksel.ru/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Update: 2014-11-06 21:35
 */
(function(factory) {
    if (typeof define === 'function' && define['amd']) {
        // https://github.com/devote/HTML5-History-API/issues/57#issuecomment-43133600
        define(typeof document !== "object" || document.readyState !== "loading" ? [] : "html5-history-api", factory);
    } else {
        factory();
    }
})(function() {
    // Define global variable
    var global = (typeof window === 'object' ? window : this) || {};
    // Prevent the code from running if there is no window.history object or library already loaded
    if (!global.history || "emulate" in global.history) return global.history;
    // symlink to document
    var document = global.document;
    // HTML element
    var documentElement = document.documentElement;
    // symlink to constructor of Object
    var Object = global['Object'];
    // symlink to JSON Object
    var JSON = global['JSON'];
    // symlink to instance object of 'Location'
    var windowLocation = global.location;
    // symlink to instance object of 'History'
    var windowHistory = global.history;
    // new instance of 'History'. The default is a reference to the original object instance
    var historyObject = windowHistory;
    // symlink to method 'history.pushState'
    var historyPushState = windowHistory.pushState;
    // symlink to method 'history.replaceState'
    var historyReplaceState = windowHistory.replaceState;
    // if the browser supports HTML5-History-API
    var isSupportHistoryAPI = !!historyPushState;
    // verifies the presence of an object 'state' in interface 'History'
    var isSupportStateObjectInHistory = 'state' in windowHistory;
    // symlink to method 'Object.defineProperty'
    var defineProperty = Object.defineProperty;
    // new instance of 'Location', for IE8 will use the element HTMLAnchorElement, instead of pure object
    var locationObject = redefineProperty({}, 't') ? {} : document.createElement('a');
    // prefix for the names of events
    var eventNamePrefix = '';
    // String that will contain the name of the method
    var addEventListenerName = global.addEventListener ? 'addEventListener' : (eventNamePrefix = 'on') && 'attachEvent';
    // String that will contain the name of the method
    var removeEventListenerName = global.removeEventListener ? 'removeEventListener' : 'detachEvent';
    // String that will contain the name of the method
    var dispatchEventName = global.dispatchEvent ? 'dispatchEvent' : 'fireEvent';
    // reference native methods for the events
    var addEvent = global[addEventListenerName];
    var removeEvent = global[removeEventListenerName];
    var dispatch = global[dispatchEventName];
    // default settings
    var settings = {"basepath": '/', "redirect": 0, "type": '/', "init": 0};
    // key for the sessionStorage
    var sessionStorageKey = '__historyAPI__';
    // Anchor Element for parseURL function
    var anchorElement = document.createElement('a');
    // last URL before change to new URL
    var lastURL = windowLocation.href;
    // Control URL, need to fix the bug in Opera
    var checkUrlForPopState = '';
    // for fix on Safari 8
    var triggerEventsInWindowAttributes = 1;
    // trigger event 'onpopstate' on page load
    var isFireInitialState = false;
    // if used history.location of other code
    var isUsedHistoryLocationFlag = 0;
    // store a list of 'state' objects in the current session
    var stateStorage = {};
    // in this object will be stored custom handlers
    var eventsList = {};
    // stored last title
    var lastTitle = document.title;

    /**
     * Properties that will be replaced in the global
     * object 'window', to prevent conflicts
     *
     * @type {Object}
     */
    var eventsDescriptors = {
        "onhashchange": null,
        "onpopstate": null
    };

    /**
     * Fix for Chrome in iOS
     * See https://github.com/devote/HTML5-History-API/issues/29
     */
    var fastFixChrome = function(method, args) {
        var isNeedFix = global.history !== windowHistory;
        if (isNeedFix) {
            global.history = windowHistory;
        }
        method.apply(windowHistory, args);
        if (isNeedFix) {
            global.history = historyObject;
        }
    };

    /**
     * Properties that will be replaced/added to object
     * 'window.history', includes the object 'history.location',
     * for a complete the work with the URL address
     *
     * @type {Object}
     */
    var historyDescriptors = {
        /**
         * Setting library initialization
         *
         * @param {null|String} [basepath] The base path to the site; defaults to the root "/".
         * @param {null|String} [type] Substitute the string after the anchor; by default "/".
         * @param {null|Boolean} [redirect] Enable link translation.
         */
        "setup": function(basepath, type, redirect) {
            settings["basepath"] = ('' + (basepath == null ? settings["basepath"] : basepath))
                .replace(/(?:^|\/)[^\/]*$/, '/');
            settings["type"] = type == null ? settings["type"] : type;
            settings["redirect"] = redirect == null ? settings["redirect"] : !!redirect;
        },
        /**
         * @namespace history
         * @param {String} [type]
         * @param {String} [basepath]
         */
        "redirect": function(type, basepath) {
            historyObject['setup'](basepath, type);
            basepath = settings["basepath"];
            if (global.top == global.self) {
                var relative = parseURL(null, false, true)._relative;
                var path = windowLocation.pathname + windowLocation.search;
                if (isSupportHistoryAPI) {
                    path = path.replace(/([^\/])$/, '$1/');
                    if (relative != basepath && (new RegExp("^" + basepath + "$", "i")).test(path)) {
                        windowLocation.replace(relative);
                    }
                } else if (path != basepath) {
                    path = path.replace(/([^\/])\?/, '$1/?');
                    if ((new RegExp("^" + basepath, "i")).test(path)) {
                        windowLocation.replace(basepath + '#' + path.
                            replace(new RegExp("^" + basepath, "i"), settings["type"]) + windowLocation.hash);
                    }
                }
            }
        },
        /**
         * The method adds a state object entry
         * to the history.
         *
         * @namespace history
         * @param {Object} state
         * @param {string} title
         * @param {string} [url]
         */
        pushState: function(state, title, url) {
            var t = document.title;
            if (lastTitle != null) {
                document.title = lastTitle;
            }
            historyPushState && fastFixChrome(historyPushState, arguments);
            changeState(state, url);
            document.title = t;
            lastTitle = title;
        },
        /**
         * The method updates the state object,
         * title, and optionally the URL of the
         * current entry in the history.
         *
         * @namespace history
         * @param {Object} state
         * @param {string} title
         * @param {string} [url]
         */
        replaceState: function(state, title, url) {
            var t = document.title;
            if (lastTitle != null) {
                document.title = lastTitle;
            }
            delete stateStorage[windowLocation.href];
            historyReplaceState && fastFixChrome(historyReplaceState, arguments);
            changeState(state, url, true);
            document.title = t;
            lastTitle = title;
        },
        /**
         * Object 'history.location' is similar to the
         * object 'window.location', except that in
         * HTML4 browsers it will behave a bit differently
         *
         * @namespace history
         */
        "location": {
            set: function(value) {
                if (isUsedHistoryLocationFlag === 0) isUsedHistoryLocationFlag = 1;
                global.location = value;
            },
            get: function() {
                if (isUsedHistoryLocationFlag === 0) isUsedHistoryLocationFlag = 1;
                return isSupportHistoryAPI ? windowLocation : locationObject;
            }
        },
        /**
         * A state object is an object representing
         * a user interface state.
         *
         * @namespace history
         */
        "state": {
            get: function() {
                return stateStorage[windowLocation.href] || null;
            }
        }
    };

    /**
     * Properties for object 'history.location'.
     * Object 'history.location' is similar to the
     * object 'window.location', except that in
     * HTML4 browsers it will behave a bit differently
     *
     * @type {Object}
     */
    var locationDescriptors = {
        /**
         * Navigates to the given page.
         *
         * @namespace history.location
         */
        assign: function(url) {
            if (('' + url).indexOf('#') === 0) {
                changeState(null, url);
            } else {
                windowLocation.assign(url);
            }
        },
        /**
         * Reloads the current page.
         *
         * @namespace history.location
         */
        reload: function() {
            windowLocation.reload();
        },
        /**
         * Removes the current page from
         * the session history and navigates
         * to the given page.
         *
         * @namespace history.location
         */
        replace: function(url) {
            if (('' + url).indexOf('#') === 0) {
                changeState(null, url, true);
            } else {
                windowLocation.replace(url);
            }
        },
        /**
         * Returns the current page's location.
         *
         * @namespace history.location
         */
        toString: function() {
            return this.href;
        },
        /**
         * Returns the current page's location.
         * Can be set, to navigate to another page.
         *
         * @namespace history.location
         */
        "href": {
            get: function() {
                return parseURL()._href;
            }
        },
        /**
         * Returns the current page's protocol.
         *
         * @namespace history.location
         */
        "protocol": null,
        /**
         * Returns the current page's host and port number.
         *
         * @namespace history.location
         */
        "host": null,
        /**
         * Returns the current page's host.
         *
         * @namespace history.location
         */
        "hostname": null,
        /**
         * Returns the current page's port number.
         *
         * @namespace history.location
         */
        "port": null,
        /**
         * Returns the current page's path only.
         *
         * @namespace history.location
         */
        "pathname": {
            get: function() {
                return parseURL()._pathname;
            }
        },
        /**
         * Returns the current page's search
         * string, beginning with the character
         * '?' and to the symbol '#'
         *
         * @namespace history.location
         */
        "search": {
            get: function() {
                return parseURL()._search;
            }
        },
        /**
         * Returns the current page's hash
         * string, beginning with the character
         * '#' and to the end line
         *
         * @namespace history.location
         */
        "hash": {
            set: function(value) {
                changeState(null, ('' + value).replace(/^(#|)/, '#'), false, lastURL);
            },
            get: function() {
                return parseURL()._hash;
            }
        }
    };

    /**
     * Just empty function
     *
     * @return void
     */
    function emptyFunction() {
        // dummy
    }

    /**
     * Prepares a parts of the current or specified reference for later use in the library
     *
     * @param {string} [href]
     * @param {boolean} [isWindowLocation]
     * @param {boolean} [isNotAPI]
     * @return {Object}
     */
    function parseURL(href, isWindowLocation, isNotAPI) {
        var re = /(?:(\w+\:))?(?:\/\/(?:[^@]*@)?([^\/:\?#]+)(?::([0-9]+))?)?([^\?#]*)(?:(\?[^#]+)|\?)?(?:(#.*))?/;
        if (href != null && href !== '' && !isWindowLocation) {
            var current = parseURL(),
                base = document.getElementsByTagName('base')[0];
            if (!isNotAPI && base && base.getAttribute('href')) {
              // Fix for IE ignoring relative base tags.
              // See http://stackoverflow.com/questions/3926197/html-base-tag-and-local-folder-path-with-internet-explorer
              base.href = base.href;
              current = parseURL(base.href, null, true);
            }
            var _pathname = current._pathname, _protocol = current._protocol;
            // convert to type of string
            href = '' + href;
            // convert relative link to the absolute
            href = /^(?:\w+\:)?\/\//.test(href) ? href.indexOf("/") === 0
                ? _protocol + href : href : _protocol + "//" + current._host + (
                href.indexOf("/") === 0 ? href : href.indexOf("?") === 0
                    ? _pathname + href : href.indexOf("#") === 0
                    ? _pathname + current._search + href : _pathname.replace(/[^\/]+$/g, '') + href
                );
        } else {
            href = isWindowLocation ? href : windowLocation.href;
            // if current browser not support History-API
            if (!isSupportHistoryAPI || isNotAPI) {
                // get hash fragment
                href = href.replace(/^[^#]*/, '') || "#";
                // form the absolute link from the hash
                // https://github.com/devote/HTML5-History-API/issues/50
                href = windowLocation.protocol.replace(/:.*$|$/, ':') + '//' + windowLocation.host + settings['basepath']
                    + href.replace(new RegExp("^#[\/]?(?:" + settings["type"] + ")?"), "");
            }
        }
        // that would get rid of the links of the form: /../../
        anchorElement.href = href;
        // decompose the link in parts
        var result = re.exec(anchorElement.href);
        // host name with the port number
        var host = result[2] + (result[3] ? ':' + result[3] : '');
        // folder
        var pathname = result[4] || '/';
        // the query string
        var search = result[5] || '';
        // hash
        var hash = result[6] === '#' ? '' : (result[6] || '');
        // relative link, no protocol, no host
        var relative = pathname + search + hash;
        // special links for set to hash-link, if browser not support History API
        var nohash = pathname.replace(new RegExp("^" + settings["basepath"], "i"), settings["type"]) + search;
        // result
        return {
            _href: result[1] + '//' + host + relative,
            _protocol: result[1],
            _host: host,
            _hostname: result[2],
            _port: result[3] || '',
            _pathname: pathname,
            _search: search,
            _hash: hash,
            _relative: relative,
            _nohash: nohash,
            _special: nohash + hash
        }
    }

    /**
     * Initializing storage for the custom state's object
     */
    function storageInitialize() {
        var sessionStorage;
        /**
         * sessionStorage throws error when cookies are disabled
         * Chrome content settings when running the site in a Facebook IFrame.
         * see: https://github.com/devote/HTML5-History-API/issues/34
         * and: http://stackoverflow.com/a/12976988/669360
         */
        try {
            sessionStorage = global['sessionStorage'];
            sessionStorage.setItem(sessionStorageKey + 't', '1');
            sessionStorage.removeItem(sessionStorageKey + 't');
        } catch(_e_) {
            sessionStorage = {
                getItem: function(key) {
                    var cookie = document.cookie.split(key + "=");
                    return cookie.length > 1 && cookie.pop().split(";").shift() || 'null';
                },
                setItem: function(key, value) {
                    var state = {};
                    // insert one current element to cookie
                    if (state[windowLocation.href] = historyObject.state) {
                        document.cookie = key + '=' + JSON.stringify(state);
                    }
                }
            }
        }

        try {
            // get cache from the storage in browser
            stateStorage = JSON.parse(sessionStorage.getItem(sessionStorageKey)) || {};
        } catch(_e_) {
            stateStorage = {};
        }

        // hang up the event handler to event unload page
        addEvent(eventNamePrefix + 'unload', function() {
            // save current state's object
            sessionStorage.setItem(sessionStorageKey, JSON.stringify(stateStorage));
        }, false);
    }

    /**
     * This method is implemented to override the built-in(native)
     * properties in the browser, unfortunately some browsers are
     * not allowed to override all the properties and even add.
     * For this reason, this was written by a method that tries to
     * do everything necessary to get the desired result.
     *
     * @param {Object} object The object in which will be overridden/added property
     * @param {String} prop The property name to be overridden/added
     * @param {Object} [descriptor] An object containing properties set/get
     * @param {Function} [onWrapped] The function to be called when the wrapper is created
     * @return {Object|Boolean} Returns an object on success, otherwise returns false
     */
    function redefineProperty(object, prop, descriptor, onWrapped) {
        var testOnly = 0;
        // test only if descriptor is undefined
        if (!descriptor) {
            descriptor = {set: emptyFunction};
            testOnly = 1;
        }
        // variable will have a value of true the success of attempts to set descriptors
        var isDefinedSetter = !descriptor.set;
        var isDefinedGetter = !descriptor.get;
        // for tests of attempts to set descriptors
        var test = {configurable: true, set: function() {
            isDefinedSetter = 1;
        }, get: function() {
            isDefinedGetter = 1;
        }};

        try {
            // testing for the possibility of overriding/adding properties
            defineProperty(object, prop, test);
            // running the test
            object[prop] = object[prop];
            // attempt to override property using the standard method
            defineProperty(object, prop, descriptor);
        } catch(_e_) {
        }

        // If the variable 'isDefined' has a false value, it means that need to try other methods
        if (!isDefinedSetter || !isDefinedGetter) {
            // try to override/add the property, using deprecated functions
            if (object.__defineGetter__) {
                // testing for the possibility of overriding/adding properties
                object.__defineGetter__(prop, test.get);
                object.__defineSetter__(prop, test.set);
                // running the test
                object[prop] = object[prop];
                // attempt to override property using the deprecated functions
                descriptor.get && object.__defineGetter__(prop, descriptor.get);
                descriptor.set && object.__defineSetter__(prop, descriptor.set);
            }

            // Browser refused to override the property, using the standard and deprecated methods
            if (!isDefinedSetter || !isDefinedGetter) {
                if (testOnly) {
                    return false;
                } else if (object === global) {
                    // try override global properties
                    try {
                        // save original value from this property
                        var originalValue = object[prop];
                        // set null to built-in(native) property
                        object[prop] = null;
                    } catch(_e_) {
                    }
                    // This rule for Internet Explorer 8
                    if ('execScript' in global) {
                        /**
                         * to IE8 override the global properties using
                         * VBScript, declaring it in global scope with
                         * the same names.
                         */
                        global['execScript']('Public ' + prop, 'VBScript');
                        global['execScript']('var ' + prop + ';', 'JavaScript');
                    } else {
                        try {
                            /**
                             * This hack allows to override a property
                             * with the set 'configurable: false', working
                             * in the hack 'Safari' to 'Mac'
                             */
                            defineProperty(object, prop, {value: emptyFunction});
                        } catch(_e_) {
                            if (prop === 'onpopstate') {
                                /**
                                 * window.onpopstate fires twice in Safari 8.0.
                                 * Block initial event on window.onpopstate
                                 * See: https://github.com/devote/HTML5-History-API/issues/69
                                 */
                                addEvent('popstate', descriptor = function() {
                                    removeEvent('popstate', descriptor, false);
                                    var onpopstate = object.onpopstate;
                                    // cancel initial event on attribute handler
                                    object.onpopstate = null;
                                    setTimeout(function() {
                                      // restore attribute value after short time
                                      object.onpopstate = onpopstate;
                                    }, 1);
                                }, false);
                                // cancel trigger events on attributes in object the window
                                triggerEventsInWindowAttributes = 0;
                            }
                        }
                    }
                    // set old value to new variable
                    object[prop] = originalValue;

                } else {
                    // the last stage of trying to override the property
                    try {
                        try {
                            // wrap the object in a new empty object
                            var temp = Object.create(object);
                            defineProperty(Object.getPrototypeOf(temp) === object ? temp : object, prop, descriptor);
                            for(var key in object) {
                                // need to bind a function to the original object
                                if (typeof object[key] === 'function') {
                                    temp[key] = object[key].bind(object);
                                }
                            }
                            try {
                                // to run a function that will inform about what the object was to wrapped
                                onWrapped.call(temp, temp, object);
                            } catch(_e_) {
                            }
                            object = temp;
                        } catch(_e_) {
                            // sometimes works override simply by assigning the prototype property of the constructor
                            defineProperty(object.constructor.prototype, prop, descriptor);
                        }
                    } catch(_e_) {
                        // all methods have failed
                        return false;
                    }
                }
            }
        }

        return object;
    }

    /**
     * Adds the missing property in descriptor
     *
     * @param {Object} object An object that stores values
     * @param {String} prop Name of the property in the object
     * @param {Object|null} descriptor Descriptor
     * @return {Object} Returns the generated descriptor
     */
    function prepareDescriptorsForObject(object, prop, descriptor) {
        descriptor = descriptor || {};
        // the default for the object 'location' is the standard object 'window.location'
        object = object === locationDescriptors ? windowLocation : object;
        // setter for object properties
        descriptor.set = (descriptor.set || function(value) {
            object[prop] = value;
        });
        // getter for object properties
        descriptor.get = (descriptor.get || function() {
            return object[prop];
        });
        return descriptor;
    }

    /**
     * Wrapper for the methods 'addEventListener/attachEvent' in the context of the 'window'
     *
     * @param {String} event The event type for which the user is registering
     * @param {Function} listener The method to be called when the event occurs.
     * @param {Boolean} capture If true, capture indicates that the user wishes to initiate capture.
     * @return void
     */
    function addEventListener(event, listener, capture) {
        if (event in eventsList) {
            // here stored the event listeners 'popstate/hashchange'
            eventsList[event].push(listener);
        } else {
            // FireFox support non-standart four argument aWantsUntrusted
            // https://github.com/devote/HTML5-History-API/issues/13
            if (arguments.length > 3) {
                addEvent(event, listener, capture, arguments[3]);
            } else {
                addEvent(event, listener, capture);
            }
        }
    }

    /**
     * Wrapper for the methods 'removeEventListener/detachEvent' in the context of the 'window'
     *
     * @param {String} event The event type for which the user is registered
     * @param {Function} listener The parameter indicates the Listener to be removed.
     * @param {Boolean} capture Was registered as a capturing listener or not.
     * @return void
     */
    function removeEventListener(event, listener, capture) {
        var list = eventsList[event];
        if (list) {
            for(var i = list.length; i--;) {
                if (list[i] === listener) {
                    list.splice(i, 1);
                    break;
                }
            }
        } else {
            removeEvent(event, listener, capture);
        }
    }

    /**
     * Wrapper for the methods 'dispatchEvent/fireEvent' in the context of the 'window'
     *
     * @param {Event|String} event Instance of Event or event type string if 'eventObject' used
     * @param {*} [eventObject] For Internet Explorer 8 required event object on this argument
     * @return {Boolean} If 'preventDefault' was called the value is false, else the value is true.
     */
    function dispatchEvent(event, eventObject) {
        var eventType = ('' + (typeof event === "string" ? event : event.type)).replace(/^on/, '');
        var list = eventsList[eventType];
        if (list) {
            // need to understand that there is one object of Event
            eventObject = typeof event === "string" ? eventObject : event;
            if (eventObject.target == null) {
                // need to override some of the properties of the Event object
                for(var props = ['target', 'currentTarget', 'srcElement', 'type']; event = props.pop();) {
                    // use 'redefineProperty' to override the properties
                    eventObject = redefineProperty(eventObject, event, {
                        get: event === 'type' ? function() {
                            return eventType;
                        } : function() {
                            return global;
                        }
                    });
                }
            }
            if (triggerEventsInWindowAttributes) {
              // run function defined in the attributes 'onpopstate/onhashchange' in the 'window' context
              ((eventType === 'popstate' ? global.onpopstate : global.onhashchange)
                  || emptyFunction).call(global, eventObject);
            }
            // run other functions that are in the list of handlers
            for(var i = 0, len = list.length; i < len; i++) {
                list[i].call(global, eventObject);
            }
            return true;
        } else {
            return dispatch(event, eventObject);
        }
    }

    /**
     * dispatch current state event
     */
    function firePopState() {
        var o = document.createEvent ? document.createEvent('Event') : document.createEventObject();
        if (o.initEvent) {
            o.initEvent('popstate', false, false);
        } else {
            o.type = 'popstate';
        }
        o.state = historyObject.state;
        // send a newly created events to be processed
        dispatchEvent(o);
    }

    /**
     * fire initial state for non-HTML5 browsers
     */
    function fireInitialState() {
        if (isFireInitialState) {
            isFireInitialState = false;
            firePopState();
        }
    }

    /**
     * Change the data of the current history for HTML4 browsers
     *
     * @param {Object} state
     * @param {string} [url]
     * @param {Boolean} [replace]
     * @param {string} [lastURLValue]
     * @return void
     */
    function changeState(state, url, replace, lastURLValue) {
        if (!isSupportHistoryAPI) {
            // if not used implementation history.location
            if (isUsedHistoryLocationFlag === 0) isUsedHistoryLocationFlag = 2;
            // normalization url
            var urlObject = parseURL(url, isUsedHistoryLocationFlag === 2 && ('' + url).indexOf("#") !== -1);
            // if current url not equal new url
            if (urlObject._relative !== parseURL()._relative) {
                // if empty lastURLValue to skip hash change event
                lastURL = lastURLValue;
                if (replace) {
                    // only replace hash, not store to history
                    windowLocation.replace("#" + urlObject._special);
                } else {
                    // change hash and add new record to history
                    windowLocation.hash = urlObject._special;
                }
            }
        } else {
            lastURL = windowLocation.href;
        }
        if (!isSupportStateObjectInHistory && state) {
            stateStorage[windowLocation.href] = state;
        }
        isFireInitialState = false;
    }

    /**
     * Event handler function changes the hash in the address bar
     *
     * @param {Event} event
     * @return void
     */
    function onHashChange(event) {
        // https://github.com/devote/HTML5-History-API/issues/46
        var fireNow = lastURL;
        // new value to lastURL
        lastURL = windowLocation.href;
        // if not empty fireNow, otherwise skipped the current handler event
        if (fireNow) {
            // if checkUrlForPopState equal current url, this means that the event was raised popstate browser
            if (checkUrlForPopState !== windowLocation.href) {
                // otherwise,
                // the browser does not support popstate event or just does not run the event by changing the hash.
                firePopState();
            }
            // current event object
            event = event || global.event;

            var oldURLObject = parseURL(fireNow, true);
            var newURLObject = parseURL();
            // HTML4 browser not support properties oldURL/newURL
            if (!event.oldURL) {
                event.oldURL = oldURLObject._href;
                event.newURL = newURLObject._href;
            }
            if (oldURLObject._hash !== newURLObject._hash) {
                // if current hash not equal previous hash
                dispatchEvent(event);
            }
        }
    }

    /**
     * The event handler is fully loaded document
     *
     * @param {*} [noScroll]
     * @return void
     */
    function onLoad(noScroll) {
        // Get rid of the events popstate when the first loading a document in the webkit browsers
        setTimeout(function() {
            // hang up the event handler for the built-in popstate event in the browser
            addEvent('popstate', function(e) {
                // set the current url, that suppress the creation of the popstate event by changing the hash
                checkUrlForPopState = windowLocation.href;
                // for Safari browser in OS Windows not implemented 'state' object in 'History' interface
                // and not implemented in old HTML4 browsers
                if (!isSupportStateObjectInHistory) {
                    e = redefineProperty(e, 'state', {get: function() {
                        return historyObject.state;
                    }});
                }
                // send events to be processed
                dispatchEvent(e);
            }, false);
        }, 0);
        // for non-HTML5 browsers
        if (!isSupportHistoryAPI && noScroll !== true && "location" in historyObject) {
            // scroll window to anchor element
            scrollToAnchorId(locationObject.hash);
            // fire initial state for non-HTML5 browser after load page
            fireInitialState();
        }
    }

    /**
     * Finds the closest ancestor anchor element (including the target itself).
     *
     * @param {HTMLElement} target The element to start scanning from.
     * @return {HTMLElement} An element which is the closest ancestor anchor.
     */
    function anchorTarget(target) {
        while (target) {
            if (target.nodeName === 'A') return target;
            target = target.parentNode;
        }
    }

    /**
     * Handles anchor elements with a hash fragment for non-HTML5 browsers
     *
     * @param {Event} e
     */
    function onAnchorClick(e) {
        var event = e || global.event;
        var target = anchorTarget(event.target || event.srcElement);
        var defaultPrevented = "defaultPrevented" in event ? event['defaultPrevented'] : event.returnValue === false;
        if (target && target.nodeName === "A" && !defaultPrevented) {
            var current = parseURL();
            var expect = parseURL(target.getAttribute("href", 2));
            var isEqualBaseURL = current._href.split('#').shift() === expect._href.split('#').shift();
            if (isEqualBaseURL && expect._hash) {
                if (current._hash !== expect._hash) {
                    locationObject.hash = expect._hash;
                }
                scrollToAnchorId(expect._hash);
                if (event.preventDefault) {
                    event.preventDefault();
                } else {
                    event.returnValue = false;
                }
            }
        }
    }

    /**
     * Scroll page to current anchor in url-hash
     *
     * @param hash
     */
    function scrollToAnchorId(hash) {
        var target = document.getElementById(hash = (hash || '').replace(/^#/, ''));
        if (target && target.id === hash && target.nodeName === "A") {
            var rect = target.getBoundingClientRect();
            global.scrollTo((documentElement.scrollLeft || 0), rect.top + (documentElement.scrollTop || 0)
                - (documentElement.clientTop || 0));
        }
    }

    /**
     * Library initialization
     *
     * @return {Boolean} return true if all is well, otherwise return false value
     */
    function initialize() {
        /**
         * Get custom settings from the query string
         */
        var scripts = document.getElementsByTagName('script');
        var src = (scripts[scripts.length - 1] || {}).src || '';
        var arg = src.indexOf('?') !== -1 ? src.split('?').pop() : '';
        arg.replace(/(\w+)(?:=([^&]*))?/g, function(a, key, value) {
            settings[key] = (value || '').replace(/^(0|false)$/, '');
        });

        /**
         * hang up the event handler to listen to the events hashchange
         */
        addEvent(eventNamePrefix + 'hashchange', onHashChange, false);

        // a list of objects with pairs of descriptors/object
        var data = [locationDescriptors, locationObject, eventsDescriptors, global, historyDescriptors, historyObject];

        // if browser support object 'state' in interface 'History'
        if (isSupportStateObjectInHistory) {
            // remove state property from descriptor
            delete historyDescriptors['state'];
        }

        // initializing descriptors
        for(var i = 0; i < data.length; i += 2) {
            for(var prop in data[i]) {
                if (data[i].hasOwnProperty(prop)) {
                    if (typeof data[i][prop] === 'function') {
                        // If the descriptor is a simple function, simply just assign it an object
                        data[i + 1][prop] = data[i][prop];
                    } else {
                        // prepare the descriptor the required format
                        var descriptor = prepareDescriptorsForObject(data[i], prop, data[i][prop]);
                        // try to set the descriptor object
                        if (!redefineProperty(data[i + 1], prop, descriptor, function(n, o) {
                            // is satisfied if the failed override property
                            if (o === historyObject) {
                                // the problem occurs in Safari on the Mac
                                global.history = historyObject = data[i + 1] = n;
                            }
                        })) {
                            // if there is no possibility override.
                            // This browser does not support descriptors, such as IE7

                            // remove previously hung event handlers
                            removeEvent(eventNamePrefix + 'hashchange', onHashChange, false);

                            // fail to initialize :(
                            return false;
                        }

                        // create a repository for custom handlers onpopstate/onhashchange
                        if (data[i + 1] === global) {
                            eventsList[prop] = eventsList[prop.substr(2)] = [];
                        }
                    }
                }
            }
        }

        // check settings
        historyObject['setup']();

        // redirect if necessary
        if (settings['redirect']) {
            historyObject['redirect']();
        }

        // initialize
        if (settings["init"]) {
            // You agree that you will use window.history.location instead window.location
            isUsedHistoryLocationFlag = 1;
        }

        // If browser does not support object 'state' in interface 'History'
        if (!isSupportStateObjectInHistory && JSON) {
            storageInitialize();
        }

        // track clicks on anchors
        if (!isSupportHistoryAPI) {
            document[addEventListenerName](eventNamePrefix + "click", onAnchorClick, false);
        }

        if (document.readyState === 'complete') {
            onLoad(true);
        } else {
            if (!isSupportHistoryAPI && parseURL()._relative !== settings["basepath"]) {
                isFireInitialState = true;
            }
            /**
             * Need to avoid triggering events popstate the initial page load.
             * Hang handler popstate as will be fully loaded document that
             * would prevent triggering event onpopstate
             */
            addEvent(eventNamePrefix + 'load', onLoad, false);
        }

        // everything went well
        return true;
    }

    /**
     * Starting the library
     */
    if (!initialize()) {
        // if unable to initialize descriptors
        // therefore quite old browser and there
        // is no sense to continue to perform
        return;
    }

    /**
     * If the property history.emulate will be true,
     * this will be talking about what's going on
     * emulation capabilities HTML5-History-API.
     * Otherwise there is no emulation, ie the
     * built-in browser capabilities.
     *
     * @type {boolean}
     * @const
     */
    historyObject['emulate'] = !isSupportHistoryAPI;

    /**
     * Replace the original methods on the wrapper
     */
    global[addEventListenerName] = addEventListener;
    global[removeEventListenerName] = removeEventListener;
    global[dispatchEventName] = dispatchEvent;

    return historyObject;
});

},{}],2:[function(require,module,exports){
(function (global){
exports.ajax = function (params, callback) {
  if (typeof params == 'string') params = {url: params}
  var headers = params.headers || {}
    , body = params.body
    , method = params.method || (body ? 'POST' : 'GET')
    , withCredentials = params.withCredentials || false

  var req = getRequest()

  // has no effect in IE
  // has no effect for same-origin requests
  // has no effect in CORS if user has disabled 3rd party cookies
  req.withCredentials = withCredentials

  req.onreadystatechange = function () {
    if (req.readyState == 4)
      callback(req.status, req.responseText, req)
  }

  if (body) {
    setDefault(headers, 'X-Requested-With', 'XMLHttpRequest')
    setDefault(headers, 'Content-Type', 'application/x-www-form-urlencoded')
  }

  req.open(method, params.url, true)

  for (var field in headers)
    req.setRequestHeader(field, headers[field])

  req.send(body)
}

function getRequest() {
  if (global.XMLHttpRequest)
    return new global.XMLHttpRequest;
  else
    try { return new global.ActiveXObject("MSXML2.XMLHTTP.3.0"); } catch(e) {}
  throw new Error('no xmlhttp request able to be created')
}

function setDefault(obj, key, value) {
  obj[key] = obj[key] || value
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
'use strict';
var _ = require('./../plugins/utils.js');

var savoryConfig = {
    container : 'container', // selector of main container
    scriptsContainer : 'scripts', // id of scripts container
    autoInit : true,
    updateScrollPosition : true,
    links : {
        external : false,
        identificatorClassName : 'external', //classname to identificate ignored link nodes
        nav : {
            enabled : false,
            list : ['nav'],
            activeClassName : 'active'
        }
    },
    error : {
        containerClassname : 'savory-error'
    },
    request : {
        noCache : true,
        requiredParam : true,
        params : {
            savory : true
        }
    },
    callbacks : {}
},
callbacksTypes = ['onReady','onLoad'];
if (window.savoryConfig) {
    window.savoryConfig = _.merge(savoryConfig, window.savoryConfig);
} else {
    window.savoryConfig = savoryConfig;
}
for (var i = 0; i < callbacksTypes.length; i++) {
    if (!window.savoryConfig.callbacks[callbacksTypes[i]]) {
        window.savoryConfig.callbacks[callbacksTypes[i]] = function(){};
    }
}
module.exports = window.savoryConfig;
},{"./../plugins/utils.js":11}],4:[function(require,module,exports){
'use strict';
var Parser = require('./../models/Parser.js'),
    Loader = require('./../models/Loader.js'),
    Evented = require('./../models/Evented.js'),
    SavoryError = require('./../models/Error.js'),
    savoryConfig = require('./../config/savory.js');
    require('html5-history-api');
    require('./../plugins/compat.js');

var Interface = function(){
    var self = this;

    this._error = new SavoryError();
    this._loader = new Loader();
    this._parser = new Parser();

    this.location = window.history.location || window.location;

    Evented.global.on('page.ready', this.onPageReady.bind(self));
    Evented.global.on('link.clicked', this.onLinkClick.bind(self));
    Evented.global.on('page.load.success', this.onLoad.bind(self));
    Evented.global.on('page.load.error', this.onError.bind(self));
    Evented.on(window, 'popstate', this.onLocationChange.bind(self));
    this._loader.load();
};

Interface.prototype.onPageReady = function(data){
    this._parser.parse(data.container);
    savoryConfig.callbacks.onLoad();
};

Interface.prototype.onLinkClick = function(data){
    this.onLocationChange(data.href);
};

Interface.prototype.onLoad = function(responseData){
    this._error.hide();
    if (!responseData.silent) {
        history.pushState(responseData.path, null, responseData.path);        
    }
};

Interface.prototype.onError = function(responseData){
    this._error.hide();
    this._error.show('Error loading ' + responseData.path + ' Error code: ' + responseData.code);
};

Interface.prototype.onLocationChange = function(href) {
    var silent = false;
    if (typeof href !== 'string') {
        href = window.history.location.href;
        silent = true;
    }
    this._loader.load(href, {
        silent : silent
    });
};

module.exports = Interface;
},{"./../config/savory.js":3,"./../models/Error.js":5,"./../models/Evented.js":6,"./../models/Loader.js":8,"./../models/Parser.js":9,"./../plugins/compat.js":10,"html5-history-api":1}],5:[function(require,module,exports){
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
},{"./../config/savory.js":3}],6:[function(require,module,exports){
'use strict';
var bean = require('./../plugins/vendor/bean.min.js');

var Evented = bean,
    proxy = document.createElement('div'),
    exposedMethods = ['on','one','off','fire'];

Evented.global = {};

for (var i = exposedMethods.length - 1; i >= 0; i--) {
    applyGlobalMethod(exposedMethods[i]);
}

function applyGlobalMethod(methodName){
    Evented.global[methodName] = function(eventType, eventData){
        bean[methodName](proxy, eventType, eventData);
    };
}
module.exports = Evented;
},{"./../plugins/vendor/bean.min.js":12}],7:[function(require,module,exports){
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
},{"./../config/savory.js":3,"./Evented.js":6}],8:[function(require,module,exports){
'use strict';
var Evented = require('./Evented.js'),
    savoryConfig = require('./../config/savory.js'),
    request = require('nanoajax'),
    _ = require('./../plugins/utils.js');

var Loader = function(){
    this._url = document.createElement('a'); // overflow for url parsing
    this.scripts = [];
    this._scriptsProxy = document.createElement('div');
    Evented.on(this, 'page.load', this.onPageLoad.bind(this));
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

    Evented.one(this, 'frame.clear', function(){
        document.body.removeChild(frame);
    });
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
};

Loader.prototype.onPageLoad = function(data){
    var self = this,
        parentContainer = document.querySelector('#'+savoryConfig.container),
        scriptsContainer = document.querySelector('#'+savoryConfig.scriptsContainer);
    parentContainer.outerHTML = data.container.outerHTML;

    if (this.scripts.length > 0) {
        for (var i = 0; i < this.scripts.length; i++) {
            deleteScripts(this.scripts[i]);
            if (this.scripts.length > 1) {
                this.scripts.shift();
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
    Evented.fire(this, 'frame.clear');

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
},{"./../config/savory.js":3,"./../plugins/utils.js":11,"./Evented.js":6,"nanoajax":2}],9:[function(require,module,exports){
'use strict';
var Link = require('./Link.js'),
    Evented = require('./Evented.js'),
    _ = require('./../plugins/utils.js');

var Parser = function(){};

Parser.prototype.parse = function(/*container*/){
    var dom = {
        links : new Link()
    };
    Evented.global.off('links.check');
    _.forEach(document.links, function(i, link){
        dom.links.check(link);
    });
    return dom;
};

module.exports = Parser;
},{"./../plugins/utils.js":11,"./Evented.js":6,"./Link.js":7}],10:[function(require,module,exports){
'use strict';
module.exports = function() {
    //https://github.com/remy/polyfills/blob/master/classList.js
    (function () {
        if (typeof window.Element === 'undefined' || 'classList' in document.documentElement) return;

        var prototype = Array.prototype,
            push = prototype.push,
            splice = prototype.splice,
            join = prototype.join;

        function DOMTokenList(el) {
          this.el = el;
          // The className needs to be trimmed and split on whitespace
          // to retrieve a list of classes.
          var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
          for (var i = 0; i < classes.length; i++) {
            push.call(this, classes[i]);
          }
        }

        DOMTokenList.prototype = {
          add: function(token) {
            if(this.contains(token)) return;
            push.call(this, token);
            this.el.className = this.toString();
          },
          contains: function(token) {
            return this.el.className.indexOf(token) != -1;
          },
          item: function(index) {
            return this[index] || null;
          },
          remove: function(token) {
            if (!this.contains(token)) return;
            for (var i = 0; i < this.length; i++) {
              if (this[i] == token) break;
            }
            splice.call(this, i, 1);
            this.el.className = this.toString();
          },
          toString: function() {
            return join.call(this, ' ');
          },
          toggle: function(token) {
            if (!this.contains(token)) {
              this.add(token);
            } else {
              this.remove(token);
            }

            return this.contains(token);
          }
        };

        window.DOMTokenList = DOMTokenList;

        function defineElementGetter (obj, prop, getter) {
            if (Object.defineProperty) {
                Object.defineProperty(obj, prop,{
                    get : getter
                });
            } else {
                obj.__defineGetter__(prop, getter);
            }
        }

        defineElementGetter(Element.prototype, 'classList', function () {
          return new DOMTokenList(this);
        });
    })();

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    if (!Function.prototype.bind) {
      Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
          // closest thing possible to the ECMAScript 5
          // internal IsCallable function
          throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            FNOP    = function() {},
            fBound  = function() {
              return fToBind.apply(this instanceof FNOP ? this : oThis,
                     aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        FNOP.prototype = this.prototype;
        fBound.prototype = new FNOP();

        return fBound;
      };
    }
};
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
/*!
  * Bean - copyright (c) Jacob Thornton 2011-2012
  * https://github.com/fat/bean
  * MIT license
  */
(function(e,t,n){typeof module!="undefined"&&module.exports?module.exports=n():typeof define=="function"&&define.amd?define(n):t[e]=n()})("bean",this,function(e,t){e=e||"bean",t=t||this;var n=window,r=t[e],i=/[^\.]*(?=\..*)\.|.*/,s=/\..*/,o="addEventListener",u="removeEventListener",a=document||{},f=a.documentElement||{},l=f[o],c=l?o:"attachEvent",h={},p=Array.prototype.slice,d=function(e,t){return e.split(t||" ")},v=function(e){return typeof e=="string"},m=function(e){return typeof e=="function"},g="click dblclick mouseup mousedown contextmenu mousewheel mousemultiwheel DOMMouseScroll mouseover mouseout mousemove selectstart selectend keydown keypress keyup orientationchange focus blur change reset select submit load unload beforeunload resize move DOMContentLoaded readystatechange message error abort scroll ",y="show input invalid touchstart touchmove touchend touchcancel gesturestart gesturechange gestureend textinput readystatechange pageshow pagehide popstate hashchange offline online afterprint beforeprint dragstart dragenter dragover dragleave drag drop dragend loadstart progress suspend emptied stalled loadmetadata loadeddata canplay canplaythrough playing waiting seeking seeked ended durationchange timeupdate play pause ratechange volumechange cuechange checking noupdate downloading cached updateready obsolete ",b=function(e,t,n){for(n=0;n<t.length;n++)t[n]&&(e[t[n]]=1);return e}({},d(g+(l?y:""))),w=function(){var e="compareDocumentPosition"in f?function(e,t){return t.compareDocumentPosition&&(t.compareDocumentPosition(e)&16)===16}:"contains"in f?function(e,t){return t=t.nodeType===9||t===window?f:t,t!==e&&t.contains(e)}:function(e,t){while(e=e.parentNode)if(e===t)return 1;return 0},t=function(t){var n=t.relatedTarget;return n?n!==this&&n.prefix!=="xul"&&!/document/.test(this.toString())&&!e(n,this):n==null};return{mouseenter:{base:"mouseover",condition:t},mouseleave:{base:"mouseout",condition:t},mousewheel:{base:/Firefox/.test(navigator.userAgent)?"DOMMouseScroll":"mousewheel"}}}(),E=function(){var e=d("altKey attrChange attrName bubbles cancelable ctrlKey currentTarget detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey srcElement target timeStamp type view which propertyName"),t=e.concat(d("button buttons clientX clientY dataTransfer fromElement offsetX offsetY pageX pageY screenX screenY toElement")),r=t.concat(d("wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ axis")),i=e.concat(d("char charCode key keyCode keyIdentifier keyLocation location")),s=e.concat(d("data")),o=e.concat(d("touches targetTouches changedTouches scale rotation")),u=e.concat(d("data origin source")),l=e.concat(d("state")),c=/over|out/,h=[{reg:/key/i,fix:function(e,t){return t.keyCode=e.keyCode||e.which,i}},{reg:/click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i,fix:function(e,n,r){n.rightClick=e.which===3||e.button===2,n.pos={x:0,y:0};if(e.pageX||e.pageY)n.clientX=e.pageX,n.clientY=e.pageY;else if(e.clientX||e.clientY)n.clientX=e.clientX+a.body.scrollLeft+f.scrollLeft,n.clientY=e.clientY+a.body.scrollTop+f.scrollTop;return c.test(r)&&(n.relatedTarget=e.relatedTarget||e[(r=="mouseover"?"from":"to")+"Element"]),t}},{reg:/mouse.*(wheel|scroll)/i,fix:function(){return r}},{reg:/^text/i,fix:function(){return s}},{reg:/^touch|^gesture/i,fix:function(){return o}},{reg:/^message$/i,fix:function(){return u}},{reg:/^popstate$/i,fix:function(){return l}},{reg:/.*/,fix:function(){return e}}],p={},v=function(e,t,r){if(!arguments.length)return;e=e||((t.ownerDocument||t.document||t).parentWindow||n).event,this.originalEvent=e,this.isNative=r,this.isBean=!0;if(!e)return;var i=e.type,s=e.target||e.srcElement,o,u,a,f,l;this.target=s&&s.nodeType===3?s.parentNode:s;if(r){l=p[i];if(!l)for(o=0,u=h.length;o<u;o++)if(h[o].reg.test(i)){p[i]=l=h[o].fix;break}f=l(e,this,i);for(o=f.length;o--;)!((a=f[o])in this)&&a in e&&(this[a]=e[a])}};return v.prototype.preventDefault=function(){this.originalEvent.preventDefault?this.originalEvent.preventDefault():this.originalEvent.returnValue=!1},v.prototype.stopPropagation=function(){this.originalEvent.stopPropagation?this.originalEvent.stopPropagation():this.originalEvent.cancelBubble=!0},v.prototype.stop=function(){this.preventDefault(),this.stopPropagation(),this.stopped=!0},v.prototype.stopImmediatePropagation=function(){this.originalEvent.stopImmediatePropagation&&this.originalEvent.stopImmediatePropagation(),this.isImmediatePropagationStopped=function(){return!0}},v.prototype.isImmediatePropagationStopped=function(){return this.originalEvent.isImmediatePropagationStopped&&this.originalEvent.isImmediatePropagationStopped()},v.prototype.clone=function(e){var t=new v(this,this.element,this.isNative);return t.currentTarget=e,t},v}(),S=function(e,t){return!l&&!t&&(e===a||e===n)?f:e},x=function(){var e=function(e,t,n,r){var i=function(n,i){return t.apply(e,r?p.call(i,n?0:1).concat(r):i)},s=function(n,r){return t.__beanDel?t.__beanDel.ft(n.target,e):r},o=n?function(e){var t=s(e,this);if(n.apply(t,arguments))return e&&(e.currentTarget=t),i(e,arguments)}:function(e){return t.__beanDel&&(e=e.clone(s(e))),i(e,arguments)};return o.__beanDel=t.__beanDel,o},t=function(t,n,r,i,s,o,u){var a=w[n],f;n=="unload"&&(r=A(O,t,n,r,i)),a&&(a.condition&&(r=e(t,r,a.condition,o)),n=a.base||n),this.isNative=f=b[n]&&!!t[c],this.customType=!l&&!f&&n,this.element=t,this.type=n,this.original=i,this.namespaces=s,this.eventType=l||f?n:"propertychange",this.target=S(t,f),this[c]=!!this.target[c],this.root=u,this.handler=e(t,r,null,o)};return t.prototype.inNamespaces=function(e){var t,n,r=0;if(!e)return!0;if(!this.namespaces)return!1;for(t=e.length;t--;)for(n=this.namespaces.length;n--;)e[t]==this.namespaces[n]&&r++;return e.length===r},t.prototype.matches=function(e,t,n){return this.element===e&&(!t||this.original===t)&&(!n||this.handler===n)},t}(),T=function(){var e={},t=function(n,r,i,s,o,u){var a=o?"r":"$";if(!r||r=="*")for(var f in e)f.charAt(0)==a&&t(n,f.substr(1),i,s,o,u);else{var l=0,c,h=e[a+r],p=n=="*";if(!h)return;for(c=h.length;l<c;l++)if((p||h[l].matches(n,i,s))&&!u(h[l],h,l,r))return}},n=function(t,n,r,i){var s,o=e[(i?"r":"$")+n];if(o)for(s=o.length;s--;)if(!o[s].root&&o[s].matches(t,r,null))return!0;return!1},r=function(e,n,r,i){var s=[];return t(e,n,r,null,i,function(e){return s.push(e)}),s},i=function(t){var n=!t.root&&!this.has(t.element,t.type,null,!1),r=(t.root?"r":"$")+t.type;return(e[r]||(e[r]=[])).push(t),n},s=function(n){t(n.element,n.type,null,n.handler,n.root,function(t,n,r){return n.splice(r,1),t.removed=!0,n.length===0&&delete e[(t.root?"r":"$")+t.type],!1})},o=function(){var t,n=[];for(t in e)t.charAt(0)=="$"&&(n=n.concat(e[t]));return n};return{has:n,get:r,put:i,del:s,entries:o}}(),N,C=function(e){arguments.length?N=e:N=a.querySelectorAll?function(e,t){return t.querySelectorAll(e)}:function(){throw new Error("Bean: No selector engine installed")}},k=function(e,t){if(!l&&t&&e&&e.propertyName!="_on"+t)return;var n=T.get(this,t||e.type,null,!1),r=n.length,i=0;e=new E(e,this,!0),t&&(e.type=t);for(;i<r&&!e.isImmediatePropagationStopped();i++)n[i].removed||n[i].handler.call(this,e)},L=l?function(e,t,n){e[n?o:u](t,k,!1)}:function(e,t,n,r){var i;n?(T.put(i=new x(e,r||t,function(t){k.call(e,t,r)},k,null,null,!0)),r&&e["_on"+r]==null&&(e["_on"+r]=0),i.target.attachEvent("on"+i.eventType,i.handler)):(i=T.get(e,r||t,k,!0)[0],i&&(i.target.detachEvent("on"+i.eventType,i.handler),T.del(i)))},A=function(e,t,n,r,i){return function(){r.apply(this,arguments),e(t,n,i)}},O=function(e,t,n,r){var i=t&&t.replace(s,""),o=T.get(e,i,null,!1),u={},a,f;for(a=0,f=o.length;a<f;a++)(!n||o[a].original===n)&&o[a].inNamespaces(r)&&(T.del(o[a]),!u[o[a].eventType]&&o[a][c]&&(u[o[a].eventType]={t:o[a].eventType,c:o[a].type}));for(a in u)T.has(e,u[a].t,null,!1)||L(e,u[a].t,!1,u[a].c)},M=function(e,t){var n=function(t,n){var r,i=v(e)?N(e,n):e;for(;t&&t!==n;t=t.parentNode)for(r=i.length;r--;)if(i[r]===t)return t},r=function(e){var r=n(e.target,this);r&&t.apply(r,arguments)};return r.__beanDel={ft:n,selector:e},r},_=l?function(e,t,r){var i=a.createEvent(e?"HTMLEvents":"UIEvents");i[e?"initEvent":"initUIEvent"](t,!0,!0,n,1),r.dispatchEvent(i)}:function(e,t,n){n=S(n,e),e?n.fireEvent("on"+t,a.createEventObject()):n["_on"+t]++},D=function(e,t,n){var r=v(t),o,u,a,f;if(r&&t.indexOf(" ")>0){t=d(t);for(f=t.length;f--;)D(e,t[f],n);return e}u=r&&t.replace(s,""),u&&w[u]&&(u=w[u].base);if(!t||r){if(a=r&&t.replace(i,""))a=d(a,".");O(e,u,n,a)}else if(m(t))O(e,null,t);else for(o in t)t.hasOwnProperty(o)&&D(e,o,t[o]);return e},P=function(e,t,n,r){var o,u,a,f,l,v,g;if(n===undefined&&typeof t=="object"){for(u in t)t.hasOwnProperty(u)&&P.call(this,e,u,t[u]);return}m(n)?(l=p.call(arguments,3),r=o=n):(o=r,l=p.call(arguments,4),r=M(n,o,N)),a=d(t),this===h&&(r=A(D,e,t,r,o));for(f=a.length;f--;)g=T.put(v=new x(e,a[f].replace(s,""),r,o,d(a[f].replace(i,""),"."),l,!1)),v[c]&&g&&L(e,v.eventType,!0,v.customType);return e},H=function(e,t,n,r){return P.apply(null,v(n)?[e,n,t,r].concat(arguments.length>3?p.call(arguments,5):[]):p.call(arguments))},B=function(){return P.apply(h,arguments)},j=function(e,t,n){var r=d(t),o,u,a,f,l;for(o=r.length;o--;){t=r[o].replace(s,"");if(f=r[o].replace(i,""))f=d(f,".");if(!f&&!n&&e[c])_(b[t],t,e);else{l=T.get(e,t,null,!1),n=[!1].concat(n);for(u=0,a=l.length;u<a;u++)l[u].inNamespaces(f)&&l[u].handler.apply(e,n)}}return e},F=function(e,t,n){var r=T.get(t,n,null,!1),i=r.length,s=0,o,u;for(;s<i;s++)r[s].original&&(o=[e,r[s].type],(u=r[s].handler.__beanDel)&&o.push(u.selector),o.push(r[s].original),P.apply(null,o));return e},I={on:P,add:H,one:B,off:D,remove:D,clone:F,fire:j,Event:E,setSelectorEngine:C,noConflict:function(){return t[e]=r,this}};if(n.attachEvent){var q=function(){var e,t=T.entries();for(e in t)t[e].type&&t[e].type!=="unload"&&D(t[e].element,t[e].type);n.detachEvent("onunload",q),n.CollectGarbage&&n.CollectGarbage()};n.attachEvent("onunload",q)}return C(),I})
},{}],13:[function(require,module,exports){
'use strict';
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(['savory'], factory);
    } else {
        factory();
    }
}(this, function () {
    var Interface = require('./controllers/interface.js');

    function Savory(config){
        if (window._savory) {
            return false;
        }
        var self = this;

        self.base = self.getBase();
        self.config = config || window.savoryConfig || {};
        self['interface'] = new Interface();

        window.savoryConfig.callbacks.onReady(self);
        window._savory = self;
        return self;
    }

    Savory.prototype.getBase = function(){
        var baseTag = document.querySelector('base'),
            base = {
                document : ''
            };

        if (!baseTag) {
            base.document = document.location.origin;
        } else {
            base.document = baseTag.getAttribute('target');
        }

        return base;
    };

    window.Savory = Savory.bind(Savory);
    if (window.savoryConfig.autoInit) {
        window.savory = new Savory();
    }
    return Savory;
}));


},{"./controllers/interface.js":4}]},{},[13]);
