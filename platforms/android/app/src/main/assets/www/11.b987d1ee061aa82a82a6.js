(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[11],{

/***/ "../../node_modules/angular-resize-event/fesm5/angular-resize-event.js":
/*!*************************************************************************************************************************!*\
  !*** /Users/nishagupta/Projects/Giddh-New-Angular4-App/node_modules/angular-resize-event/fesm5/angular-resize-event.js ***!
  \*************************************************************************************************************************/
/*! exports provided: AngularResizedEventModule, ResizedEvent, ResizedDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AngularResizedEventModule", function() { return AngularResizedEventModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResizedEvent", function() { return ResizedEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResizedDirective", function() { return ResizedDirective; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var css_element_queries__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! css-element-queries */ "../../node_modules/css-element-queries/index.js");
/* harmony import */ var css_element_queries__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(css_element_queries__WEBPACK_IMPORTED_MODULE_2__);




/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ResizedEvent = /** @class */ (function () {
    function ResizedEvent(element, newWidth, newHeight, oldWidth, oldHeight) {
        this.element = element;
        this.newWidth = newWidth;
        this.newHeight = newHeight;
        this.oldWidth = oldWidth;
        this.oldHeight = oldHeight;
    }
    return ResizedEvent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ResizedDirective = /** @class */ (function () {
    function ResizedDirective(element) {
        this.element = element;
        this.resized = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
    }
    /**
     * @return {?}
     */
    ResizedDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.resizeSensor = new css_element_queries__WEBPACK_IMPORTED_MODULE_2__["ResizeSensor"](this.element.nativeElement, function () { return _this.onResized(); });
    };
    /**
     * @return {?}
     */
    ResizedDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.resizeSensor) {
            this.resizeSensor.detach();
        }
    };
    /**
     * @private
     * @return {?}
     */
    ResizedDirective.prototype.onResized = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var newWidth = this.element.nativeElement.clientWidth;
        /** @type {?} */
        var newHeight = this.element.nativeElement.clientHeight;
        if (newWidth === this.oldWidth && newHeight === this.oldHeight) {
            return;
        }
        /** @type {?} */
        var event = new ResizedEvent(this.element, newWidth, newHeight, this.oldWidth, this.oldHeight);
        this.oldWidth = this.element.nativeElement.clientWidth;
        this.oldHeight = this.element.nativeElement.clientHeight;
        this.resized.emit(event);
    };
    ResizedDirective.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Directive"], args: [{
                    selector: '[resized]'
                },] }
    ];
    /** @nocollapse */
    ResizedDirective.ctorParameters = function () { return [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"] }
    ]; };
    ResizedDirective.propDecorators = {
        resized: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"] }]
    };
    return ResizedDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AngularResizedEventModule = /** @class */ (function () {
    function AngularResizedEventModule() {
    }
    AngularResizedEventModule.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"], args: [{
                    declarations: [ResizedDirective],
                    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"]],
                    exports: [ResizedDirective]
                },] }
    ];
    return AngularResizedEventModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */



//# sourceMappingURL=angular-resize-event.js.map

/***/ }),

/***/ "../../node_modules/css-element-queries/index.js":
/*!***************************************************************************************************!*\
  !*** /Users/nishagupta/Projects/Giddh-New-Angular4-App/node_modules/css-element-queries/index.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    ResizeSensor: __webpack_require__(/*! ./src/ResizeSensor */ "../../node_modules/css-element-queries/src/ResizeSensor.js"),
    ElementQueries: __webpack_require__(/*! ./src/ElementQueries */ "../../node_modules/css-element-queries/src/ElementQueries.js")
};


/***/ }),

/***/ "../../node_modules/css-element-queries/src/ElementQueries.js":
/*!****************************************************************************************************************!*\
  !*** /Users/nishagupta/Projects/Giddh-New-Angular4-App/node_modules/css-element-queries/src/ElementQueries.js ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
(function (root, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./ResizeSensor.js */ "../../node_modules/css-element-queries/src/ResizeSensor.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(typeof window !== 'undefined' ? window : this, function (ResizeSensor) {

    /**
     *
     * @type {Function}
     * @constructor
     */
    var ElementQueries = function () {
        //<style> element with our dynamically created styles
        var cssStyleElement;

        //all rules found for element queries
        var allQueries = {};

        //association map to identify which selector belongs to a element from the animationstart event.
        var idToSelectorMapping = [];

        /**
         *
         * @param element
         * @returns {Number}
         */
        function getEmSize(element) {
            if (!element) {
                element = document.documentElement;
            }
            var fontSize = window.getComputedStyle(element, null).fontSize;
            return parseFloat(fontSize) || 16;
        }

        /**
         * Get element size
         * @param {HTMLElement} element
         * @returns {Object} {width, height}
         */
        function getElementSize(element) {
            if (!element.getBoundingClientRect) {
                return {
                    width: element.offsetWidth,
                    height: element.offsetHeight
                }
            }

            var rect = element.getBoundingClientRect();
            return {
                width: Math.round(rect.width),
                height: Math.round(rect.height)
            }
        }

        /**
         *
         * @copyright https://github.com/Mr0grog/element-query/blob/master/LICENSE
         *
         * @param {HTMLElement} element
         * @param {*} value
         * @returns {*}
         */
        function convertToPx(element, value) {
            var numbers = value.split(/\d/);
            var units = numbers[numbers.length - 1];
            value = parseFloat(value);
            switch (units) {
                case "px":
                    return value;
                case "em":
                    return value * getEmSize(element);
                case "rem":
                    return value * getEmSize();
                // Viewport units!
                // According to http://quirksmode.org/mobile/tableViewport.html
                // documentElement.clientWidth/Height gets us the most reliable info
                case "vw":
                    return value * document.documentElement.clientWidth / 100;
                case "vh":
                    return value * document.documentElement.clientHeight / 100;
                case "vmin":
                case "vmax":
                    var vw = document.documentElement.clientWidth / 100;
                    var vh = document.documentElement.clientHeight / 100;
                    var chooser = Math[units === "vmin" ? "min" : "max"];
                    return value * chooser(vw, vh);
                default:
                    return value;
                // for now, not supporting physical units (since they are just a set number of px)
                // or ex/ch (getting accurate measurements is hard)
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @param {String} id
         * @constructor
         */
        function SetupInformation(element, id) {
            this.element = element;
            var key, option, elementSize, value, actualValue, attrValues, attrValue, attrName;

            var attributes = ['min-width', 'min-height', 'max-width', 'max-height'];

            /**
             * Extracts the computed width/height and sets to min/max- attribute.
             */
            this.call = function () {
                // extract current dimensions
                elementSize = getElementSize(this.element);

                attrValues = {};

                for (key in allQueries[id]) {
                    if (!allQueries[id].hasOwnProperty(key)) {
                        continue;
                    }
                    option = allQueries[id][key];

                    value = convertToPx(this.element, option.value);

                    actualValue = option.property === 'width' ? elementSize.width : elementSize.height;
                    attrName = option.mode + '-' + option.property;
                    attrValue = '';

                    if (option.mode === 'min' && actualValue >= value) {
                        attrValue += option.value;
                    }

                    if (option.mode === 'max' && actualValue <= value) {
                        attrValue += option.value;
                    }

                    if (!attrValues[attrName]) attrValues[attrName] = '';
                    if (attrValue && -1 === (' ' + attrValues[attrName] + ' ').indexOf(' ' + attrValue + ' ')) {
                        attrValues[attrName] += ' ' + attrValue;
                    }
                }

                for (var k in attributes) {
                    if (!attributes.hasOwnProperty(k)) continue;

                    if (attrValues[attributes[k]]) {
                        this.element.setAttribute(attributes[k], attrValues[attributes[k]].substr(1));
                    } else {
                        this.element.removeAttribute(attributes[k]);
                    }
                }
            };
        }

        /**
         * @param {HTMLElement} element
         * @param {Object}      id
         */
        function setupElement(element, id) {
            if (!element.elementQueriesSetupInformation) {
                element.elementQueriesSetupInformation = new SetupInformation(element, id);
            }

            if (!element.elementQueriesSensor) {
                element.elementQueriesSensor = new ResizeSensor(element, function () {
                    element.elementQueriesSetupInformation.call();
                });
            }
        }

        /**
         * Stores rules to the selector that should be applied once resized.
         *
         * @param {String} selector
         * @param {String} mode min|max
         * @param {String} property width|height
         * @param {String} value
         */
        function queueQuery(selector, mode, property, value) {
            if (typeof(allQueries[selector]) === 'undefined') {
                allQueries[selector] = [];
                // add animation to trigger animationstart event, so we know exactly when a element appears in the DOM

                var id = idToSelectorMapping.length;
                cssStyleElement.innerHTML += '\n' + selector + ' {animation: 0.1s element-queries;}';
                cssStyleElement.innerHTML += '\n' + selector + ' > .resize-sensor {min-width: '+id+'px;}';
                idToSelectorMapping.push(selector);
            }

            allQueries[selector].push({
                mode: mode,
                property: property,
                value: value
            });
        }

        function getQuery(container) {
            var query;
            if (document.querySelectorAll) query = (container) ? container.querySelectorAll.bind(container) : document.querySelectorAll.bind(document);
            if (!query && 'undefined' !== typeof $$) query = $$;
            if (!query && 'undefined' !== typeof jQuery) query = jQuery;

            if (!query) {
                throw 'No document.querySelectorAll, jQuery or Mootools\'s $$ found.';
            }

            return query;
        }

        /**
         * If animationStart didn't catch a new element in the DOM, we can manually search for it
         */
        function findElementQueriesElements(container) {
            var query = getQuery(container);

            for (var selector in allQueries) if (allQueries.hasOwnProperty(selector)) {
                // find all elements based on the extract query selector from the element query rule
                var elements = query(selector, container);

                for (var i = 0, j = elements.length; i < j; i++) {
                    setupElement(elements[i], selector);
                }
            }
        }

        /**
         *
         * @param {HTMLElement} element
         */
        function attachResponsiveImage(element) {
            var children = [];
            var rules = [];
            var sources = [];
            var defaultImageId = 0;
            var lastActiveImage = -1;
            var loadedImages = [];

            for (var i in element.children) {
                if (!element.children.hasOwnProperty(i)) continue;

                if (element.children[i].tagName && element.children[i].tagName.toLowerCase() === 'img') {
                    children.push(element.children[i]);

                    var minWidth = element.children[i].getAttribute('min-width') || element.children[i].getAttribute('data-min-width');
                    //var minHeight = element.children[i].getAttribute('min-height') || element.children[i].getAttribute('data-min-height');
                    var src = element.children[i].getAttribute('data-src') || element.children[i].getAttribute('url');

                    sources.push(src);

                    var rule = {
                        minWidth: minWidth
                    };

                    rules.push(rule);

                    if (!minWidth) {
                        defaultImageId = children.length - 1;
                        element.children[i].style.display = 'block';
                    } else {
                        element.children[i].style.display = 'none';
                    }
                }
            }

            lastActiveImage = defaultImageId;

            function check() {
                var imageToDisplay = false, i;

                for (i in children) {
                    if (!children.hasOwnProperty(i)) continue;

                    if (rules[i].minWidth) {
                        if (element.offsetWidth > rules[i].minWidth) {
                            imageToDisplay = i;
                        }
                    }
                }

                if (!imageToDisplay) {
                    //no rule matched, show default
                    imageToDisplay = defaultImageId;
                }

                if (lastActiveImage !== imageToDisplay) {
                    //image change

                    if (!loadedImages[imageToDisplay]) {
                        //image has not been loaded yet, we need to load the image first in memory to prevent flash of
                        //no content

                        var image = new Image();
                        image.onload = function () {
                            children[imageToDisplay].src = sources[imageToDisplay];

                            children[lastActiveImage].style.display = 'none';
                            children[imageToDisplay].style.display = 'block';

                            loadedImages[imageToDisplay] = true;

                            lastActiveImage = imageToDisplay;
                        };

                        image.src = sources[imageToDisplay];
                    } else {
                        children[lastActiveImage].style.display = 'none';
                        children[imageToDisplay].style.display = 'block';
                        lastActiveImage = imageToDisplay;
                    }
                } else {
                    //make sure for initial check call the .src is set correctly
                    children[imageToDisplay].src = sources[imageToDisplay];
                }
            }

            element.resizeSensorInstance = new ResizeSensor(element, check);
            check();
        }

        function findResponsiveImages() {
            var query = getQuery();

            var elements = query('[data-responsive-image],[responsive-image]');
            for (var i = 0, j = elements.length; i < j; i++) {
                attachResponsiveImage(elements[i]);
            }
        }

        var regex = /,?[\s\t]*([^,\n]*?)((?:\[[\s\t]*?(?:min|max)-(?:width|height)[\s\t]*?[~$\^]?=[\s\t]*?"[^"]*?"[\s\t]*?])+)([^,\n\s\{]*)/mgi;
        var attrRegex = /\[[\s\t]*?(min|max)-(width|height)[\s\t]*?[~$\^]?=[\s\t]*?"([^"]*?)"[\s\t]*?]/mgi;

        /**
         * @param {String} css
         */
        function extractQuery(css) {
            var match, smatch, attrs, attrMatch;

            css = css.replace(/'/g, '"');
            while (null !== (match = regex.exec(css))) {
                smatch = match[1] + match[3];
                attrs = match[2];

                while (null !== (attrMatch = attrRegex.exec(attrs))) {
                    queueQuery(smatch, attrMatch[1], attrMatch[2], attrMatch[3]);
                }
            }
        }

        /**
         * @param {CssRule[]|String} rules
         */
        function readRules(rules) {
            var selector = '';

            if (!rules) {
                return;
            }

            if ('string' === typeof rules) {
                rules = rules.toLowerCase();
                if (-1 !== rules.indexOf('min-width') || -1 !== rules.indexOf('max-width')) {
                    extractQuery(rules);
                }
            } else {
                for (var i = 0, j = rules.length; i < j; i++) {
                    if (1 === rules[i].type) {
                        selector = rules[i].selectorText || rules[i].cssText;
                        if (-1 !== selector.indexOf('min-height') || -1 !== selector.indexOf('max-height')) {
                            extractQuery(selector);
                        } else if (-1 !== selector.indexOf('min-width') || -1 !== selector.indexOf('max-width')) {
                            extractQuery(selector);
                        }
                    } else if (4 === rules[i].type) {
                        readRules(rules[i].cssRules || rules[i].rules);
                    } else if (3 === rules[i].type) {
                        if(rules[i].styleSheet.hasOwnProperty("cssRules")) {
                            readRules(rules[i].styleSheet.cssRules);
                        }
                    }
                }
            }
        }

        var defaultCssInjected = false;

        /**
         * Searches all css rules and setups the event listener to all elements with element query rules..
         */
        this.init = function () {
            var animationStart = 'animationstart';
            if (typeof document.documentElement.style['webkitAnimationName'] !== 'undefined') {
                animationStart = 'webkitAnimationStart';
            } else if (typeof document.documentElement.style['MozAnimationName'] !== 'undefined') {
                animationStart = 'mozanimationstart';
            } else if (typeof document.documentElement.style['OAnimationName'] !== 'undefined') {
                animationStart = 'oanimationstart';
            }

            document.body.addEventListener(animationStart, function (e) {
                var element = e.target;
                var styles = element && window.getComputedStyle(element, null);
                var animationName = styles && styles.getPropertyValue('animation-name');
                var requiresSetup = animationName && (-1 !== animationName.indexOf('element-queries'));

                if (requiresSetup) {
                    element.elementQueriesSensor = new ResizeSensor(element, function () {
                        if (element.elementQueriesSetupInformation) {
                            element.elementQueriesSetupInformation.call();
                        }
                    });

                    var sensorStyles = window.getComputedStyle(element.resizeSensor, null);
                    var id = sensorStyles.getPropertyValue('min-width');
                    id = parseInt(id.replace('px', ''));
                    setupElement(e.target, idToSelectorMapping[id]);
                }
            });

            if (!defaultCssInjected) {
                cssStyleElement = document.createElement('style');
                cssStyleElement.type = 'text/css';
                cssStyleElement.innerHTML = '[responsive-image] > img, [data-responsive-image] {overflow: hidden; padding: 0; } [responsive-image] > img, [data-responsive-image] > img {width: 100%;}';

                //safari wants at least one rule in keyframes to start working
                cssStyleElement.innerHTML += '\n@keyframes element-queries { 0% { visibility: inherit; } }';
                document.getElementsByTagName('head')[0].appendChild(cssStyleElement);
                defaultCssInjected = true;
            }

            for (var i = 0, j = document.styleSheets.length; i < j; i++) {
                try {
                    if (document.styleSheets[i].href && 0 === document.styleSheets[i].href.indexOf('file://')) {
                        console.warn("CssElementQueries: unable to parse local css files, " + document.styleSheets[i].href);
                    }

                    readRules(document.styleSheets[i].cssRules || document.styleSheets[i].rules || document.styleSheets[i].cssText);
                } catch (e) {
                }
            }

            findResponsiveImages();
        };

        /**
         * Go through all collected rules (readRules()) and attach the resize-listener.
         * Not necessary to call it manually, since we detect automatically when new elements
         * are available in the DOM. However, sometimes handy for dirty DOM modifications.
         *
         * @param {HTMLElement} container only elements of the container are considered (document.body if not set)
         */
        this.findElementQueriesElements = function (container) {
            findElementQueriesElements(container);
        };

        this.update = function () {
            this.init();
        };
    };

    ElementQueries.update = function () {
        ElementQueries.instance.update();
    };

    /**
     * Removes all sensor and elementquery information from the element.
     *
     * @param {HTMLElement} element
     */
    ElementQueries.detach = function (element) {
        if (element.elementQueriesSetupInformation) {
            //element queries
            element.elementQueriesSensor.detach();
            delete element.elementQueriesSetupInformation;
            delete element.elementQueriesSensor;

        } else if (element.resizeSensorInstance) {
            //responsive image

            element.resizeSensorInstance.detach();
            delete element.resizeSensorInstance;
        }
    };

    ElementQueries.init = function () {
        if (!ElementQueries.instance) {
            ElementQueries.instance = new ElementQueries();
        }

        ElementQueries.instance.init();
    };

    var domLoaded = function (callback) {
        /* Mozilla, Chrome, Opera */
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', callback, false);
        }
        /* Safari, iCab, Konqueror */
        else if (/KHTML|WebKit|iCab/i.test(navigator.userAgent)) {
            var DOMLoadTimer = setInterval(function () {
                if (/loaded|complete/i.test(document.readyState)) {
                    callback();
                    clearInterval(DOMLoadTimer);
                }
            }, 10);
        }
        /* Other web browsers */
        else window.onload = callback;
    };

    ElementQueries.findElementQueriesElements = function (container) {
        ElementQueries.instance.findElementQueriesElements(container);
    };

    ElementQueries.listen = function () {
        domLoaded(ElementQueries.init);
    };

    return ElementQueries;

}));


/***/ }),

/***/ "../../node_modules/css-element-queries/src/ResizeSensor.js":
/*!**************************************************************************************************************!*\
  !*** /Users/nishagupta/Projects/Giddh-New-Angular4-App/node_modules/css-element-queries/src/ResizeSensor.js ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
(function (root, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(typeof window !== 'undefined' ? window : this, function () {

    // Make sure it does not throw in a SSR (Server Side Rendering) situation
    if (typeof window === "undefined") {
        return null;
    }
    // https://github.com/Semantic-Org/Semantic-UI/issues/3855
    // https://github.com/marcj/css-element-queries/issues/257
    var globalWindow = typeof window != 'undefined' && window.Math == Math
        ? window
        : typeof self != 'undefined' && self.Math == Math
            ? self
            : Function('return this')();
    // Only used for the dirty checking, so the event callback count is limited to max 1 call per fps per sensor.
    // In combination with the event based resize sensor this saves cpu time, because the sensor is too fast and
    // would generate too many unnecessary events.
    var requestAnimationFrame = globalWindow.requestAnimationFrame ||
        globalWindow.mozRequestAnimationFrame ||
        globalWindow.webkitRequestAnimationFrame ||
        function (fn) {
            return globalWindow.setTimeout(fn, 20);
        };

    /**
     * Iterate over each of the provided element(s).
     *
     * @param {HTMLElement|HTMLElement[]} elements
     * @param {Function}                  callback
     */
    function forEachElement(elements, callback){
        var elementsType = Object.prototype.toString.call(elements);
        var isCollectionTyped = ('[object Array]' === elementsType
            || ('[object NodeList]' === elementsType)
            || ('[object HTMLCollection]' === elementsType)
            || ('[object Object]' === elementsType)
            || ('undefined' !== typeof jQuery && elements instanceof jQuery) //jquery
            || ('undefined' !== typeof Elements && elements instanceof Elements) //mootools
        );
        var i = 0, j = elements.length;
        if (isCollectionTyped) {
            for (; i < j; i++) {
                callback(elements[i]);
            }
        } else {
            callback(elements);
        }
    }

    /**
    * Get element size
    * @param {HTMLElement} element
    * @returns {Object} {width, height}
    */
    function getElementSize(element) {
        if (!element.getBoundingClientRect) {
            return {
                width: element.offsetWidth,
                height: element.offsetHeight
            }
        }

        var rect = element.getBoundingClientRect();
        return {
            width: Math.round(rect.width),
            height: Math.round(rect.height)
        }
    }

    /**
     * Apply CSS styles to element.
     *
     * @param {HTMLElement} element
     * @param {Object} style
     */
    function setStyle(element, style) {
        Object.keys(style).forEach(function(key) {
            element.style[key] = style[key];
        });
    }

    /**
     * Class for dimension change detection.
     *
     * @param {Element|Element[]|Elements|jQuery} element
     * @param {Function} callback
     *
     * @constructor
     */
    var ResizeSensor = function(element, callback) {
        /**
         *
         * @constructor
         */
        function EventQueue() {
            var q = [];
            this.add = function(ev) {
                q.push(ev);
            };

            var i, j;
            this.call = function(sizeInfo) {
                for (i = 0, j = q.length; i < j; i++) {
                    q[i].call(this, sizeInfo);
                }
            };

            this.remove = function(ev) {
                var newQueue = [];
                for(i = 0, j = q.length; i < j; i++) {
                    if(q[i] !== ev) newQueue.push(q[i]);
                }
                q = newQueue;
            };

            this.length = function() {
                return q.length;
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @param {Function}    resized
         */
        function attachResizeEvent(element, resized) {
            if (!element) return;
            if (element.resizedAttached) {
                element.resizedAttached.add(resized);
                return;
            }

            element.resizedAttached = new EventQueue();
            element.resizedAttached.add(resized);

            element.resizeSensor = document.createElement('div');
            element.resizeSensor.dir = 'ltr';
            element.resizeSensor.className = 'resize-sensor';

            var style = {
                pointerEvents: 'none',
                position: 'absolute',
                left: '0px',
                top: '0px',
                right: '0px',
                bottom: '0px',
                overflow: 'hidden',
                zIndex: '-1',
                visibility: 'hidden',
                maxWidth: '100%'
            };
            var styleChild = {
                position: 'absolute',
                left: '0px',
                top: '0px',
                transition: '0s',
            };

            setStyle(element.resizeSensor, style);

            var expand = document.createElement('div');
            expand.className = 'resize-sensor-expand';
            setStyle(expand, style);

            var expandChild = document.createElement('div');
            setStyle(expandChild, styleChild);
            expand.appendChild(expandChild);

            var shrink = document.createElement('div');
            shrink.className = 'resize-sensor-shrink';
            setStyle(shrink, style);

            var shrinkChild = document.createElement('div');
            setStyle(shrinkChild, styleChild);
            setStyle(shrinkChild, { width: '200%', height: '200%' });
            shrink.appendChild(shrinkChild);

            element.resizeSensor.appendChild(expand);
            element.resizeSensor.appendChild(shrink);
            element.appendChild(element.resizeSensor);

            var computedStyle = window.getComputedStyle(element);
            var position = computedStyle ? computedStyle.getPropertyValue('position') : null;
            if ('absolute' !== position && 'relative' !== position && 'fixed' !== position) {
                element.style.position = 'relative';
            }

            var dirty, rafId;
            var size = getElementSize(element);
            var lastWidth = 0;
            var lastHeight = 0;
            var initialHiddenCheck = true;
            var lastAnimationFrame = 0;

            var resetExpandShrink = function () {
                var width = element.offsetWidth;
                var height = element.offsetHeight;

                expandChild.style.width = (width + 10) + 'px';
                expandChild.style.height = (height + 10) + 'px';

                expand.scrollLeft = width + 10;
                expand.scrollTop = height + 10;

                shrink.scrollLeft = width + 10;
                shrink.scrollTop = height + 10;
            };

            var reset = function() {
                // Check if element is hidden
                if (initialHiddenCheck) {
                    var invisible = element.offsetWidth === 0 && element.offsetHeight === 0;
                    if (invisible) {
                        // Check in next frame
                        if (!lastAnimationFrame){
                            lastAnimationFrame = requestAnimationFrame(function(){
                                lastAnimationFrame = 0;

                                reset();
                            });
                        }

                        return;
                    } else {
                        // Stop checking
                        initialHiddenCheck = false;
                    }
                }

                resetExpandShrink();
            };
            element.resizeSensor.resetSensor = reset;

            var onResized = function() {
                rafId = 0;

                if (!dirty) return;

                lastWidth = size.width;
                lastHeight = size.height;

                if (element.resizedAttached) {
                    element.resizedAttached.call(size);
                }
            };

            var onScroll = function() {
                size = getElementSize(element);
                dirty = size.width !== lastWidth || size.height !== lastHeight;

                if (dirty && !rafId) {
                    rafId = requestAnimationFrame(onResized);
                }

                reset();
            };

            var addEvent = function(el, name, cb) {
                if (el.attachEvent) {
                    el.attachEvent('on' + name, cb);
                } else {
                    el.addEventListener(name, cb);
                }
            };

            addEvent(expand, 'scroll', onScroll);
            addEvent(shrink, 'scroll', onScroll);

            // Fix for custom Elements
            requestAnimationFrame(reset);
        }

        forEachElement(element, function(elem){
            attachResizeEvent(elem, callback);
        });

        this.detach = function(ev) {
            ResizeSensor.detach(element, ev);
        };

        this.reset = function() {
            element.resizeSensor.resetSensor();
        };
    };

    ResizeSensor.reset = function(element) {
        forEachElement(element, function(elem){
            elem.resizeSensor.resetSensor();
        });
    };

    ResizeSensor.detach = function(element, ev) {
        forEachElement(element, function(elem){
            if (!elem) return;
            if(elem.resizedAttached && typeof ev === "function"){
                elem.resizedAttached.remove(ev);
                if(elem.resizedAttached.length()) return;
            }
            if (elem.resizeSensor) {
                if (elem.contains(elem.resizeSensor)) {
                    elem.removeChild(elem.resizeSensor);
                }
                delete elem.resizeSensor;
                delete elem.resizedAttached;
            }
        });
    };

    if (typeof MutationObserver !== "undefined") {
        var observer = new MutationObserver(function (mutations) {
            for (var i in mutations) {
                if (mutations.hasOwnProperty(i)) {
                    var items = mutations[i].addedNodes;
                    for (var j = 0; j < items.length; j++) {
                        if (items[j].resizeSensor) {
                            ResizeSensor.reset(items[j]);
                        }
                    }
                }
            }
        });

        document.addEventListener("DOMContentLoaded", function (event) {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        });
    }

    return ResizeSensor;

}));


/***/ }),

/***/ "../../node_modules/ngx-clipboard/fesm5/ngx-clipboard.js":
/*!***********************************************************************************************************!*\
  !*** /Users/nishagupta/Projects/Giddh-New-Angular4-App/node_modules/ngx-clipboard/fesm5/ngx-clipboard.js ***!
  \***********************************************************************************************************/
/*! exports provided: CLIPBOARD_SERVICE_PROVIDER_FACTORY, ClipboardService, CLIPBOARD_SERVICE_PROVIDER, ClipboardDirective, ClipboardModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CLIPBOARD_SERVICE_PROVIDER_FACTORY", function() { return CLIPBOARD_SERVICE_PROVIDER_FACTORY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClipboardService", function() { return ClipboardService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CLIPBOARD_SERVICE_PROVIDER", function() { return CLIPBOARD_SERVICE_PROVIDER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClipboardDirective", function() { return ClipboardDirective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClipboardModule", function() { return ClipboardModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "../../node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var ngx_window_token__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-window-token */ "../../node_modules/ngx-window-token/fesm5/ngx-window-token.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");





/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ClipboardService = /** @class */ (function () {
    function ClipboardService(document, window) {
        this.document = document;
        this.window = window;
    }
    Object.defineProperty(ClipboardService.prototype, "isSupported", {
        get: /**
         * @return {?}
         */
        function () {
            return !!this.document.queryCommandSupported && !!this.document.queryCommandSupported('copy');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} element
     * @return {?}
     */
    ClipboardService.prototype.isTargetValid = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            if (element.hasAttribute('disabled')) {
                throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
            }
            return true;
        }
        throw new Error('Target should be input or textarea');
    };
    /**
     * copyFromInputElement
     * @param {?} targetElm
     * @return {?}
     */
    ClipboardService.prototype.copyFromInputElement = /**
     * copyFromInputElement
     * @param {?} targetElm
     * @return {?}
     */
    function (targetElm) {
        try {
            this.selectTarget(targetElm);
            /** @type {?} */
            var re = this.copyText();
            this.clearSelection(targetElm, this.window);
            return re && this.isCopySuccessInIE11();
        }
        catch (error) {
            return false;
        }
    };
    // this is for IE11 return true even if copy fail
    /**
     * @return {?}
     */
    ClipboardService.prototype.isCopySuccessInIE11 = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var clipboardData = this.window['clipboardData'];
        if (clipboardData && clipboardData.getData) {
            if (!clipboardData.getData('Text')) {
                return false;
            }
        }
        return true;
    };
    /**
     * Creates a fake textarea element, sets its value from `text` property,
     * and makes a selection on it.
     * @param {?} content
     * @param {?=} container
     * @return {?}
     */
    ClipboardService.prototype.copyFromContent = /**
     * Creates a fake textarea element, sets its value from `text` property,
     * and makes a selection on it.
     * @param {?} content
     * @param {?=} container
     * @return {?}
     */
    function (content, container) {
        if (container === void 0) { container = this.window.document.body; }
        // check if the temp textarea is still belong the current container.
        // In case we have multiple places using ngx-clipboard, one is in a modal using container but the other one is not.
        if (this.tempTextArea && !container.contains(this.tempTextArea)) {
            this.destroy(this.tempTextArea.parentElement);
        }
        if (!this.tempTextArea) {
            this.tempTextArea = this.createTempTextArea(this.document, this.window);
            try {
                container.appendChild(this.tempTextArea);
            }
            catch (error) {
                throw new Error('Container should be a Dom element');
            }
        }
        this.tempTextArea.value = content;
        return this.copyFromInputElement(this.tempTextArea);
    };
    /**
     * @param {?=} container
     * @return {?}
     */
    ClipboardService.prototype.destroy = /**
     * @param {?=} container
     * @return {?}
     */
    function (container) {
        if (container === void 0) { container = this.window.document.body; }
        if (this.tempTextArea) {
            container.removeChild(this.tempTextArea);
            // removeChild doesn't remove the reference from memory
            this.tempTextArea = undefined;
        }
    };
    /**
     * @param {?} inputElement
     * @return {?}
     */
    ClipboardService.prototype.selectTarget = /**
     * @param {?} inputElement
     * @return {?}
     */
    function (inputElement) {
        inputElement.select();
        inputElement.setSelectionRange(0, inputElement.value.length);
        return inputElement.value.length;
    };
    /**
     * @return {?}
     */
    ClipboardService.prototype.copyText = /**
     * @return {?}
     */
    function () {
        return this.document.execCommand('copy');
    };
    /**
     * @param {?} inputElement
     * @param {?} window
     * @return {?}
     */
    ClipboardService.prototype.clearSelection = /**
     * @param {?} inputElement
     * @param {?} window
     * @return {?}
     */
    function (inputElement, window) {
        // tslint:disable-next-line:no-unused-expression
        inputElement && inputElement.blur();
        window.getSelection().removeAllRanges();
    };
    /**
     * @param {?} doc
     * @param {?} window
     * @return {?}
     */
    ClipboardService.prototype.createTempTextArea = /**
     * @param {?} doc
     * @param {?} window
     * @return {?}
     */
    function (doc, window) {
        /** @type {?} */
        var isRTL = doc.documentElement.getAttribute('dir') === 'rtl';
        /** @type {?} */
        var ta;
        ta = doc.createElement('textarea');
        // Prevent zooming on iOS
        ta.style.fontSize = '12pt';
        // Reset box model
        ta.style.border = '0';
        ta.style.padding = '0';
        ta.style.margin = '0';
        // Move element out of screen horizontally
        ta.style.position = 'absolute';
        ta.style[isRTL ? 'right' : 'left'] = '-9999px';
        /** @type {?} */
        var yPosition = window.pageYOffset || doc.documentElement.scrollTop;
        ta.style.top = yPosition + 'px';
        ta.setAttribute('readonly', '');
        return ta;
    };
    ClipboardService.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"] },
    ];
    /** @nocollapse */
    ClipboardService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"], args: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["DOCUMENT"],] }] },
        { type: undefined, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"], args: [ngx_window_token__WEBPACK_IMPORTED_MODULE_2__["WINDOW"],] }] }
    ]; };
    return ClipboardService;
}());
/**
 * @param {?} doc
 * @param {?} win
 * @param {?} parentDispatcher
 * @return {?}
 */
function CLIPBOARD_SERVICE_PROVIDER_FACTORY(doc, win, parentDispatcher) {
    return parentDispatcher || new ClipboardService(doc, win);
}
/** @type {?} */
var CLIPBOARD_SERVICE_PROVIDER = {
    deps: [/** @type {?} */ (_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["DOCUMENT"]), /** @type {?} */ (ngx_window_token__WEBPACK_IMPORTED_MODULE_2__["WINDOW"]), [new _angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"](), new _angular_core__WEBPACK_IMPORTED_MODULE_0__["SkipSelf"](), ClipboardService]],
    provide: ClipboardService,
    useFactory: CLIPBOARD_SERVICE_PROVIDER_FACTORY
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ClipboardDirective = /** @class */ (function () {
    function ClipboardDirective(clipboardSrv) {
        this.clipboardSrv = clipboardSrv;
        this.cbOnSuccess = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.cbOnError = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    /**
     * @return {?}
     */
    ClipboardDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () { };
    /**
     * @return {?}
     */
    ClipboardDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.clipboardSrv.destroy(this.container);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    ClipboardDirective.prototype.onClick = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (!this.clipboardSrv.isSupported) {
            this.handleResult(false, undefined, event);
        }
        else if (this.targetElm && this.clipboardSrv.isTargetValid(this.targetElm)) {
            this.handleResult(this.clipboardSrv.copyFromInputElement(this.targetElm), this.targetElm.value, event);
        }
        else if (this.cbContent) {
            this.handleResult(this.clipboardSrv.copyFromContent(this.cbContent, this.container), this.cbContent, event);
        }
    };
    /**
     * Fires an event based on the copy operation result.
     * @param {?} succeeded
     * @param {?} copiedContent
     * @param {?} event
     * @return {?}
     */
    ClipboardDirective.prototype.handleResult = /**
     * Fires an event based on the copy operation result.
     * @param {?} succeeded
     * @param {?} copiedContent
     * @param {?} event
     * @return {?}
     */
    function (succeeded, copiedContent, event) {
        if (succeeded) {
            this.cbOnSuccess.emit({ isSuccess: true, content: copiedContent, event: event });
        }
        else {
            this.cbOnError.emit({ isSuccess: false, event: event });
        }
    };
    ClipboardDirective.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"], args: [{
                    // tslint:disable-next-line:directive-selector
                    selector: '[ngxClipboard]'
                },] },
    ];
    /** @nocollapse */
    ClipboardDirective.ctorParameters = function () { return [
        { type: ClipboardService }
    ]; };
    ClipboardDirective.propDecorators = {
        targetElm: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"], args: ['ngxClipboard',] }],
        container: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }],
        cbContent: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }],
        cbOnSuccess: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"] }],
        cbOnError: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"] }],
        onClick: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"], args: ['click', ['$event.target'],] }]
    };
    return ClipboardDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ClipboardModule = /** @class */ (function () {
    function ClipboardModule() {
    }
    ClipboardModule.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"], args: [{
                    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"], ngx_window_token__WEBPACK_IMPORTED_MODULE_2__["NgxWindowTokenModule"]],
                    // tslint:disable-next-line:object-literal-sort-keys
                    declarations: [ClipboardDirective],
                    exports: [ClipboardDirective],
                    providers: [CLIPBOARD_SERVICE_PROVIDER]
                },] },
    ];
    return ClipboardModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */



//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWNsaXBib2FyZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmd4LWNsaXBib2FyZC9saWIvbmd4LWNsaXBib2FyZC5zZXJ2aWNlLnRzIiwibmc6Ly9uZ3gtY2xpcGJvYXJkL2xpYi9uZ3gtY2xpcGJvYXJkLmRpcmVjdGl2ZS50cyIsIm5nOi8vbmd4LWNsaXBib2FyZC9saWIvbmd4LWNsaXBib2FyZC5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT3B0aW9uYWwsIFNraXBTZWxmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IFdJTkRPVyB9IGZyb20gJ25neC13aW5kb3ctdG9rZW4nO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ2xpcGJvYXJkU2VydmljZSB7XHJcbiAgICBwcml2YXRlIHRlbXBUZXh0QXJlYTogSFRNTFRleHRBcmVhRWxlbWVudCB8IHVuZGVmaW5lZDtcclxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHB1YmxpYyBkb2N1bWVudDogYW55LCBASW5qZWN0KFdJTkRPVykgcHJpdmF0ZSB3aW5kb3c6IGFueSkge31cclxuICAgIHB1YmxpYyBnZXQgaXNTdXBwb3J0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICEhdGhpcy5kb2N1bWVudC5xdWVyeUNvbW1hbmRTdXBwb3J0ZWQgJiYgISF0aGlzLmRvY3VtZW50LnF1ZXJ5Q29tbWFuZFN1cHBvcnRlZCgnY29weScpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc1RhcmdldFZhbGlkKGVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50IHx8IGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MVGV4dEFyZWFFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFwidGFyZ2V0XCIgYXR0cmlidXRlLiBQbGVhc2UgdXNlIFwicmVhZG9ubHlcIiBpbnN0ZWFkIG9mIFwiZGlzYWJsZWRcIiBhdHRyaWJ1dGUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUYXJnZXQgc2hvdWxkIGJlIGlucHV0IG9yIHRleHRhcmVhJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjb3B5RnJvbUlucHV0RWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29weUZyb21JbnB1dEVsZW1lbnQodGFyZ2V0RWxtOiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0VGFyZ2V0KHRhcmdldEVsbSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlID0gdGhpcy5jb3B5VGV4dCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKHRhcmdldEVsbSwgdGhpcy53aW5kb3cpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmUgJiYgdGhpcy5pc0NvcHlTdWNjZXNzSW5JRTExKCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB0aGlzIGlzIGZvciBJRTExIHJldHVybiB0cnVlIGV2ZW4gaWYgY29weSBmYWlsXHJcbiAgICBpc0NvcHlTdWNjZXNzSW5JRTExKCkge1xyXG4gICAgICAgIGNvbnN0IGNsaXBib2FyZERhdGEgPSB0aGlzLndpbmRvd1snY2xpcGJvYXJkRGF0YSddO1xyXG4gICAgICAgIGlmIChjbGlwYm9hcmREYXRhICYmIGNsaXBib2FyZERhdGEuZ2V0RGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoIWNsaXBib2FyZERhdGEuZ2V0RGF0YSgnVGV4dCcpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgZmFrZSB0ZXh0YXJlYSBlbGVtZW50LCBzZXRzIGl0cyB2YWx1ZSBmcm9tIGB0ZXh0YCBwcm9wZXJ0eSxcclxuICAgICAqIGFuZCBtYWtlcyBhIHNlbGVjdGlvbiBvbiBpdC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvcHlGcm9tQ29udGVudChjb250ZW50OiBzdHJpbmcsIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgPSB0aGlzLndpbmRvdy5kb2N1bWVudC5ib2R5KSB7XHJcbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlIHRlbXAgdGV4dGFyZWEgaXMgc3RpbGwgYmVsb25nIHRoZSBjdXJyZW50IGNvbnRhaW5lci5cclxuICAgICAgICAvLyBJbiBjYXNlIHdlIGhhdmUgbXVsdGlwbGUgcGxhY2VzIHVzaW5nIG5neC1jbGlwYm9hcmQsIG9uZSBpcyBpbiBhIG1vZGFsIHVzaW5nIGNvbnRhaW5lciBidXQgdGhlIG90aGVyIG9uZSBpcyBub3QuXHJcbiAgICAgICAgaWYgKHRoaXMudGVtcFRleHRBcmVhICYmICFjb250YWluZXIuY29udGFpbnModGhpcy50ZW1wVGV4dEFyZWEpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSh0aGlzLnRlbXBUZXh0QXJlYS5wYXJlbnRFbGVtZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy50ZW1wVGV4dEFyZWEpIHtcclxuICAgICAgICAgICAgdGhpcy50ZW1wVGV4dEFyZWEgPSB0aGlzLmNyZWF0ZVRlbXBUZXh0QXJlYSh0aGlzLmRvY3VtZW50LCB0aGlzLndpbmRvdyk7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy50ZW1wVGV4dEFyZWEpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb250YWluZXIgc2hvdWxkIGJlIGEgRG9tIGVsZW1lbnQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRlbXBUZXh0QXJlYS52YWx1ZSA9IGNvbnRlbnQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29weUZyb21JbnB1dEVsZW1lbnQodGhpcy50ZW1wVGV4dEFyZWEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJlbW92ZSB0ZW1wb3JhcnkgdGV4dGFyZWEgaWYgYW55XHJcbiAgICBwdWJsaWMgZGVzdHJveShjb250YWluZXI6IEhUTUxFbGVtZW50ID0gdGhpcy53aW5kb3cuZG9jdW1lbnQuYm9keSkge1xyXG4gICAgICAgIGlmICh0aGlzLnRlbXBUZXh0QXJlYSkge1xyXG4gICAgICAgICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy50ZW1wVGV4dEFyZWEpO1xyXG4gICAgICAgICAgICAvLyByZW1vdmVDaGlsZCBkb2Vzbid0IHJlbW92ZSB0aGUgcmVmZXJlbmNlIGZyb20gbWVtb3J5XHJcbiAgICAgICAgICAgIHRoaXMudGVtcFRleHRBcmVhID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBzZWxlY3QgdGhlIHRhcmdldCBodG1sIGlucHV0IGVsZW1lbnRcclxuICAgIHByaXZhdGUgc2VsZWN0VGFyZ2V0KGlucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQpOiBudW1iZXIgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGlucHV0RWxlbWVudC5zZWxlY3QoKTtcclxuICAgICAgICBpbnB1dEVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2UoMCwgaW5wdXRFbGVtZW50LnZhbHVlLmxlbmd0aCk7XHJcbiAgICAgICAgcmV0dXJuIGlucHV0RWxlbWVudC52YWx1ZS5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb3B5VGV4dCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xyXG4gICAgfVxyXG4gICAgLy8gUmVtb3ZlcyBjdXJyZW50IHNlbGVjdGlvbiBhbmQgZm9jdXMgZnJvbSBgdGFyZ2V0YCBlbGVtZW50LlxyXG4gICAgcHJpdmF0ZSBjbGVhclNlbGVjdGlvbihpbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50LCB3aW5kb3c6IFdpbmRvdykge1xyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnVzZWQtZXhwcmVzc2lvblxyXG4gICAgICAgIGlucHV0RWxlbWVudCAmJiBpbnB1dEVsZW1lbnQuYmx1cigpO1xyXG4gICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjcmVhdGUgYSBmYWtlIHRleHRhcmVhIGZvciBjb3B5IGNvbW1hbmRcclxuICAgIHByaXZhdGUgY3JlYXRlVGVtcFRleHRBcmVhKGRvYzogRG9jdW1lbnQsIHdpbmRvdzogV2luZG93KTogSFRNTFRleHRBcmVhRWxlbWVudCB7XHJcbiAgICAgICAgY29uc3QgaXNSVEwgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGlyJykgPT09ICdydGwnO1xyXG4gICAgICAgIGxldCB0YTogSFRNTFRleHRBcmVhRWxlbWVudDtcclxuICAgICAgICB0YSA9IGRvYy5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xyXG4gICAgICAgIC8vIFByZXZlbnQgem9vbWluZyBvbiBpT1NcclxuICAgICAgICB0YS5zdHlsZS5mb250U2l6ZSA9ICcxMnB0JztcclxuICAgICAgICAvLyBSZXNldCBib3ggbW9kZWxcclxuICAgICAgICB0YS5zdHlsZS5ib3JkZXIgPSAnMCc7XHJcbiAgICAgICAgdGEuc3R5bGUucGFkZGluZyA9ICcwJztcclxuICAgICAgICB0YS5zdHlsZS5tYXJnaW4gPSAnMCc7XHJcbiAgICAgICAgLy8gTW92ZSBlbGVtZW50IG91dCBvZiBzY3JlZW4gaG9yaXpvbnRhbGx5XHJcbiAgICAgICAgdGEuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgICAgIHRhLnN0eWxlW2lzUlRMID8gJ3JpZ2h0JyA6ICdsZWZ0J10gPSAnLTk5OTlweCc7XHJcbiAgICAgICAgLy8gTW92ZSBlbGVtZW50IHRvIHRoZSBzYW1lIHBvc2l0aW9uIHZlcnRpY2FsbHlcclxuICAgICAgICBjb25zdCB5UG9zaXRpb24gPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jLmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgICAgICAgdGEuc3R5bGUudG9wID0geVBvc2l0aW9uICsgJ3B4JztcclxuICAgICAgICB0YS5zZXRBdHRyaWJ1dGUoJ3JlYWRvbmx5JywgJycpO1xyXG4gICAgICAgIHJldHVybiB0YTtcclxuICAgIH1cclxufVxyXG4vLyB0aGlzIHBhdHRlcm4gaXMgbWVudGlvbmVkIGluIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzEzODU0IGluICM0M1xyXG5leHBvcnQgZnVuY3Rpb24gQ0xJUEJPQVJEX1NFUlZJQ0VfUFJPVklERVJfRkFDVE9SWShkb2M6IERvY3VtZW50LCB3aW46IFdpbmRvdywgcGFyZW50RGlzcGF0Y2hlcjogQ2xpcGJvYXJkU2VydmljZSkge1xyXG4gICAgcmV0dXJuIHBhcmVudERpc3BhdGNoZXIgfHwgbmV3IENsaXBib2FyZFNlcnZpY2UoZG9jLCB3aW4pO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgQ0xJUEJPQVJEX1NFUlZJQ0VfUFJPVklERVIgPSB7XHJcbiAgICBkZXBzOiBbRE9DVU1FTlQgYXMgSW5qZWN0aW9uVG9rZW48RG9jdW1lbnQ+LCBXSU5ET1cgYXMgSW5qZWN0aW9uVG9rZW48V2luZG93PiwgW25ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKSwgQ2xpcGJvYXJkU2VydmljZV1dLFxyXG4gICAgcHJvdmlkZTogQ2xpcGJvYXJkU2VydmljZSxcclxuICAgIHVzZUZhY3Rvcnk6IENMSVBCT0FSRF9TRVJWSUNFX1BST1ZJREVSX0ZBQ1RPUllcclxufTtcclxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IENsaXBib2FyZFNlcnZpY2UgfSBmcm9tICcuL25neC1jbGlwYm9hcmQuc2VydmljZSc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpkaXJlY3RpdmUtc2VsZWN0b3JcclxuICAgIHNlbGVjdG9yOiAnW25neENsaXBib2FyZF0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDbGlwYm9hcmREaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW5wdXQtcmVuYW1lXHJcbiAgICBASW5wdXQoJ25neENsaXBib2FyZCcpXHJcbiAgICBwdWJsaWMgdGFyZ2V0RWxtOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBjb250YWluZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBjYkNvbnRlbnQ6IHN0cmluZztcclxuXHJcbiAgICBAT3V0cHV0KClcclxuICAgIHB1YmxpYyBjYk9uU3VjY2VzczogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgICBAT3V0cHV0KClcclxuICAgIHB1YmxpYyBjYk9uRXJyb3I6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNsaXBib2FyZFNydjogQ2xpcGJvYXJkU2VydmljZSkge31cclxuXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tZW1wdHlcclxuICAgIHB1YmxpYyBuZ09uSW5pdCgpIHt9XHJcblxyXG4gICAgcHVibGljIG5nT25EZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMuY2xpcGJvYXJkU3J2LmRlc3Ryb3kodGhpcy5jb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQudGFyZ2V0J10pXHJcbiAgICBwdWJsaWMgb25DbGljayhldmVudDogRXZlbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2xpcGJvYXJkU3J2LmlzU3VwcG9ydGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUmVzdWx0KGZhbHNlLCB1bmRlZmluZWQsIGV2ZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudGFyZ2V0RWxtICYmIHRoaXMuY2xpcGJvYXJkU3J2LmlzVGFyZ2V0VmFsaWQodGhpcy50YXJnZXRFbG0pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUmVzdWx0KHRoaXMuY2xpcGJvYXJkU3J2LmNvcHlGcm9tSW5wdXRFbGVtZW50KHRoaXMudGFyZ2V0RWxtKSwgdGhpcy50YXJnZXRFbG0udmFsdWUsIGV2ZW50KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2JDb250ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUmVzdWx0KHRoaXMuY2xpcGJvYXJkU3J2LmNvcHlGcm9tQ29udGVudCh0aGlzLmNiQ29udGVudCwgdGhpcy5jb250YWluZXIpLCB0aGlzLmNiQ29udGVudCwgZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpcmVzIGFuIGV2ZW50IGJhc2VkIG9uIHRoZSBjb3B5IG9wZXJhdGlvbiByZXN1bHQuXHJcbiAgICAgKiBAcGFyYW0gc3VjY2VlZGVkXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaGFuZGxlUmVzdWx0KHN1Y2NlZWRlZDogYm9vbGVhbiwgY29waWVkQ29udGVudDogc3RyaW5nIHwgdW5kZWZpbmVkLCBldmVudDogRXZlbnQpIHtcclxuICAgICAgICBpZiAoc3VjY2VlZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2JPblN1Y2Nlc3MuZW1pdCh7IGlzU3VjY2VzczogdHJ1ZSwgY29udGVudDogY29waWVkQ29udGVudCwgZXZlbnQ6IGV2ZW50IH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2JPbkVycm9yLmVtaXQoeyBpc1N1Y2Nlc3M6IGZhbHNlLCBldmVudDogZXZlbnQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IENsaXBib2FyZERpcmVjdGl2ZSB9IGZyb20gJy4vbmd4LWNsaXBib2FyZC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ0xJUEJPQVJEX1NFUlZJQ0VfUFJPVklERVIgfSBmcm9tICcuL25neC1jbGlwYm9hcmQuc2VydmljZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5neFdpbmRvd1Rva2VuTW9kdWxlIH0gZnJvbSAnbmd4LXdpbmRvdy10b2tlbic7XG5leHBvcnQgKiBmcm9tICcuL25neC1jbGlwYm9hcmQuZGlyZWN0aXZlJztcbmV4cG9ydCAqIGZyb20gJy4vbmd4LWNsaXBib2FyZC5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgTmd4V2luZG93VG9rZW5Nb2R1bGVdLFxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6b2JqZWN0LWxpdGVyYWwtc29ydC1rZXlzXG4gIGRlY2xhcmF0aW9uczogW0NsaXBib2FyZERpcmVjdGl2ZV0sXG4gIGV4cG9ydHM6IFtDbGlwYm9hcmREaXJlY3RpdmVdLFxuICBwcm92aWRlcnM6IFtDTElQQk9BUkRfU0VSVklDRV9QUk9WSURFUl1cbn0pXG5leHBvcnQgY2xhc3MgQ2xpcGJvYXJkTW9kdWxlIHt9XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7SUFPSSwwQkFBcUMsUUFBYSxFQUEwQixNQUFXO1FBQWxELGFBQVEsR0FBUixRQUFRLENBQUs7UUFBMEIsV0FBTSxHQUFOLE1BQU0sQ0FBSztLQUFJOzBCQUNoRix5Q0FBVzs7Ozs7WUFDbEIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Ozs7Ozs7O0lBRzNGLHdDQUFhOzs7O2NBQUMsT0FBK0M7UUFDaEUsSUFBSSxPQUFPLFlBQVksZ0JBQWdCLElBQUksT0FBTyxZQUFZLG1CQUFtQixFQUFFO1lBQy9FLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxtRkFBbUYsQ0FBQyxDQUFDO2FBQ3hHO1lBQ0QsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQzs7Ozs7OztJQU1uRCwrQ0FBb0I7Ozs7O2NBQUMsU0FBaUQ7UUFDekUsSUFBSTtZQUNBLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7O1lBQzdCLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUMsT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7U0FDM0M7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNaLE9BQU8sS0FBSyxDQUFDO1NBQ2hCOzs7Ozs7SUFJTCw4Q0FBbUI7OztJQUFuQjs7UUFDSSxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ25ELElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxPQUFPLEVBQUU7WUFDeEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ2hDLE9BQU8sS0FBSyxDQUFDO2FBQ2hCO1NBQ0o7UUFDRCxPQUFPLElBQUksQ0FBQztLQUNmOzs7Ozs7OztJQU1NLDBDQUFlOzs7Ozs7O2NBQUMsT0FBZSxFQUFFLFNBQWtEO1FBQWxELDBCQUFBLEVBQUEsWUFBeUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSTs7O1FBR3RGLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQzdELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNqRDtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hFLElBQUk7Z0JBQ0EsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDNUM7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDWixNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7YUFDeEQ7U0FDSjtRQUNELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztRQUNsQyxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7Ozs7OztJQUlqRCxrQ0FBTzs7OztjQUFDLFNBQWtEO1FBQWxELDBCQUFBLEVBQUEsWUFBeUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSTtRQUM3RCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDbkIsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7O1lBRXpDLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO1NBQ2pDOzs7Ozs7SUFJRyx1Q0FBWTs7OztjQUFDLFlBQW9EO1FBQ3JFLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN0QixZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0QsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQzs7Ozs7SUFHN0IsbUNBQVE7Ozs7UUFDWixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7Ozs7O0lBR3JDLHlDQUFjOzs7OztjQUFDLFlBQW9ELEVBQUUsTUFBYzs7UUFFdkYsWUFBWSxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUM7Ozs7Ozs7SUFJcEMsNkNBQWtCOzs7OztjQUFDLEdBQWEsRUFBRSxNQUFjOztRQUNwRCxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLENBQUM7O1FBQ2hFLElBQUksRUFBRSxDQUFzQjtRQUM1QixFQUFFLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7UUFFbkMsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDOztRQUUzQixFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDdEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ3ZCLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQzs7UUFFdEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBQy9CLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxTQUFTLENBQUM7O1FBRS9DLElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxXQUFXLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUM7UUFDdEUsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQztRQUNoQyxFQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNoQyxPQUFPLEVBQUUsQ0FBQzs7O2dCQTlHakIsVUFBVTs7OztnREFHTSxNQUFNLFNBQUMsUUFBUTtnREFBeUIsTUFBTSxTQUFDLE1BQU07OzJCQVB0RTs7Ozs7Ozs7QUFzSEEsNENBQW1ELEdBQWEsRUFBRSxHQUFXLEVBQUUsZ0JBQWtDO0lBQzdHLE9BQU8sZ0JBQWdCLElBQUksSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7Q0FDN0Q7O0FBRUQsSUFBYSwwQkFBMEIsR0FBRztJQUN0QyxJQUFJLEVBQUUsbUJBQUMsUUFBb0MscUJBQUUsTUFBZ0MsR0FBRSxDQUFDLElBQUksUUFBUSxFQUFFLEVBQUUsSUFBSSxRQUFRLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2xJLE9BQU8sRUFBRSxnQkFBZ0I7SUFDekIsVUFBVSxFQUFFLGtDQUFrQztDQUNqRDs7Ozs7O0FDOUhEO0lBdUJJLDRCQUFvQixZQUE4QjtRQUE5QixpQkFBWSxHQUFaLFlBQVksQ0FBa0I7MkJBSlYsSUFBSSxZQUFZLEVBQU87eUJBR3pCLElBQUksWUFBWSxFQUFPO0tBQ1A7Ozs7SUFHL0MscUNBQVE7Ozs7Ozs7SUFFUix3Q0FBVzs7OztRQUNkLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7Ozs7O0lBSXZDLG9DQUFPOzs7O0lBRGQsVUFDZSxLQUFZO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRTtZQUNoQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDOUM7YUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDMUc7YUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQy9HO0tBQ0o7Ozs7Ozs7O0lBTU8seUNBQVk7Ozs7Ozs7Y0FBQyxTQUFrQixFQUFFLGFBQWlDLEVBQUUsS0FBWTtRQUNwRixJQUFJLFNBQVMsRUFBRTtZQUNYLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQ3BGO2FBQU07WUFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDM0Q7OztnQkFoRFIsU0FBUyxTQUFDOztvQkFFUCxRQUFRLEVBQUUsZ0JBQWdCO2lCQUM3Qjs7OztnQkFMUSxnQkFBZ0I7Ozs0QkFRcEIsS0FBSyxTQUFDLGNBQWM7NEJBRXBCLEtBQUs7NEJBR0wsS0FBSzs4QkFHTCxNQUFNOzRCQUdOLE1BQU07MEJBV04sWUFBWSxTQUFDLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQzs7NkJBaEM1Qzs7Ozs7OztBQ0FBOzs7O2dCQVFDLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsb0JBQW9CLENBQUM7O29CQUU3QyxZQUFZLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztvQkFDbEMsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUM7b0JBQzdCLFNBQVMsRUFBRSxDQUFDLDBCQUEwQixDQUFDO2lCQUN4Qzs7MEJBZEQ7Ozs7Ozs7Ozs7Ozs7OzsifQ==

/***/ }),

/***/ "../../node_modules/ngx-window-token/fesm5/ngx-window-token.js":
/*!*****************************************************************************************************************!*\
  !*** /Users/nishagupta/Projects/Giddh-New-Angular4-App/node_modules/ngx-window-token/fesm5/ngx-window-token.js ***!
  \*****************************************************************************************************************/
/*! exports provided: WINDOW, _window, NgxWindowTokenModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WINDOW", function() { return WINDOW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_window", function() { return _window; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NgxWindowTokenModule", function() { return NgxWindowTokenModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var /** @type {?} */ WINDOW = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["InjectionToken"]('WindowToken');
/**
 * @return {?}
 */
function _window() {
    return window;
}
var NgxWindowTokenModule = /** @class */ (function () {
    function NgxWindowTokenModule() {
    }
    NgxWindowTokenModule.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"], args: [{
                    providers: [{
                            provide: WINDOW,
                            useFactory: _window
                        }]
                },] },
    ];
    return NgxWindowTokenModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */



//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXdpbmRvdy10b2tlbi5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmd4LXdpbmRvdy10b2tlbi9saWIvbmd4LXdpbmRvdy10b2tlbi5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBjb25zdCBXSU5ET1cgPSBuZXcgSW5qZWN0aW9uVG9rZW48V2luZG93PignV2luZG93VG9rZW4nKTtcblxuZXhwb3J0IGZ1bmN0aW9uIF93aW5kb3coKTogV2luZG93IHtcbiAgICByZXR1cm4gd2luZG93O1xufVxuXG5ATmdNb2R1bGUoe1xuICAgIHByb3ZpZGVyczogW3tcbiAgICAgICAgcHJvdmlkZTogV0lORE9XLFxuICAgICAgICB1c2VGYWN0b3J5OiBfd2luZG93XG4gICAgfV1cbn0pXG5leHBvcnQgY2xhc3MgTmd4V2luZG93VG9rZW5Nb2R1bGUgeyB9XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscUJBR2EsTUFBTSxHQUFHLElBQUksY0FBYyxDQUFTLGFBQWEsQ0FBQyxDQUFDOzs7O0FBRWhFO0lBQ0ksT0FBTyxNQUFNLENBQUM7Q0FDakI7Ozs7O2dCQUVBLFFBQVEsU0FBQztvQkFDTixTQUFTLEVBQUUsQ0FBQzs0QkFDUixPQUFPLEVBQUUsTUFBTTs0QkFDZixVQUFVLEVBQUUsT0FBTzt5QkFDdEIsQ0FBQztpQkFDTDs7K0JBZEQ7Ozs7Ozs7Ozs7Ozs7OzsifQ==

/***/ }),

/***/ "./src/app/ledger/components/advance-search/advance-search.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/ledger/components/advance-search/advance-search.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"\" class=\"Advance-Search\">\n    <div class=\"modal-header themeBg clearfix\">\n        <h3 class=\"modal-title bg\" id=\"modal-title\">Advance Search</h3>\n        <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"onCancel()\">×</span>\n        <!-- <i class=\"fa fa-times text-right close_modal\" aria-hidden=\"true\" (click)=\"onCancel()\"></i> -->\n    </div>\n    <div class=\"modal-body clearfix\" id=\"export-body\">\n        <form action=\"\" [formGroup]=\"advanceSearchForm\">\n            <div class=\"clearfix\">\n                <div class=\"row mb-2\">\n                    <div class=\"col-sm-5\">\n                        <label for=\"\">Date Range</label>\n                    </div>\n                    <div class=\"col-sm-7\">\n                        <div class=\"input-group\">\n                            <input autocomplete=\"off\" #dp=\"bsDaterangepicker\" placeholder=\"Select range\" type=\"text\" class=\"form-control\" (bsValueChange)=\"onDateRangeSelected($event)\" bsDaterangepicker required formControlName=\"bsRangeValue\" [bsConfig]=\"bsConfig\">\n                            <span class=\"input-group-addon cursor-pointer\" (click)=\"dp.toggle()\">\n                  <i class=\"fa fa-calendar\" aria-hidden=\"true\"></i>\n                </span>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"row mb-2\">\n                    <div class=\"col-sm-5\">\n                        <label for=\"\">Merge Accounts</label>\n                        <p>\n                            <small>you can merge multiple accounts; further filters will depend on this.</small>\n                        </p>\n                    </div>\n                    <div class=\"col-sm-7\">\n                        <div class=\"form-group\">\n                            <sh-select [options]=\"accounts$ | async\" name=\"particulars\" (onClear)=\"onDDClear('accountUniqueNames')\" (selected)=\"onDDElementSelect('accountUniqueNames', $event)\" [isFilterEnabled]=\"true\" [multiple]=\"true\" [placeholder]=\"'Select Accounts'\"></sh-select>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"row\">\n                    <div class=\"col-sm-5\">\n                        <label for=\"\">Merge Group</label>\n                        <p>\n                            <small>you can merge multiple groups; further filters will depend on this.</small>\n                        </p>\n                    </div>\n                    <div class=\"col-sm-7\">\n                        <div class=\"form-group\">\n                            <sh-select [options]=\"groups$ | async\" name=\"groups\" (onClear)=\"onDDClear('groupUniqueNames')\" (selected)=\"onDDElementSelect('groupUniqueNames', $event)\" [isFilterEnabled]=\"true\" [multiple]=\"true\" [placeholder]=\"'Select Groups'\"></sh-select>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"clearfix mrT2 pdT2 bdrT mb-1\">\n                <div class=\"row\">\n                    <div class=\"col-md-5\">\n                        <label for=\"\">Particulars</label>\n                        <p>\n                            <small>By default all accounts are selected</small>\n                        </p>\n                    </div>\n                    <div class=\"col-md-7\">\n                        <div class=\"row\">\n                            <div class=\"xs-pr-0 col-sm-3 col-xs-4\">\n                                <div class=\"checkbox square-switch\">\n                                    <input type=\"checkbox\" id=\"includeParticulars\" formControlName=\"includeParticulars\" />\n                                    <label for=\"includeParticulars\">\n                      <span class=\"pull-left\" *ngIf=\"advanceSearchForm.get('includeParticulars').value\">Include</span>\n                      <span class=\"pull-right\" *ngIf=\"!advanceSearchForm.get('includeParticulars').value\">Exclude</span>\n                    </label>\n                                </div>\n                            </div>\n                            <div class=\"col-sm-9 col-xs-8 col-xs-9\">\n                                <div class=\"form-group\">\n                                    <sh-select [options]=\"accounts$ | async\" name=\"particulars\" (onClear)=\"onDDClear('particulars')\" (selected)=\"onDDElementSelect('particulars', $event)\" [isFilterEnabled]=\"true\" [multiple]=\"true\" [placeholder]=\"'Select Accounts'\"></sh-select>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"clearfix mb-1\">\n                <div class=\"row\">\n                    <div class=\"col-md-5\">\n                        <label for=\"\">Voucher Type</label>\n                        <p>\n                            <small>By default all vouchers are selected</small>\n                        </p>\n                    </div>\n                    <div class=\"col-md-7\">\n                        <div class=\"row\">\n                            <div class=\"xs-pr-0 col-sm-3 col-xs-4\">\n                                <div class=\"checkbox square-switch\">\n                                    <input type=\"checkbox\" id=\"includeVouchers\" formControlName=\"includeVouchers\" />\n                                    <label for=\"includeVouchers\">\n                      <span class=\"pull-left\" *ngIf=\"advanceSearchForm.get('includeVouchers').value\">Include</span>\n                      <span class=\"pull-right\" *ngIf=\"!advanceSearchForm.get('includeVouchers').value\">Exclude</span>\n                    </label>\n                                </div>\n                            </div>\n                            <div class=\"col-sm-9 col-xs-8 col-xs-9\">\n                                <div class=\"form-group\">\n                                    <sh-select [options]=\"voucherTypeList | async\" name=\"particulars\" (onClear)=\"onDDClear('vouchers')\" (selected)=\"onDDElementSelect('vouchers', $event)\" [isFilterEnabled]=\"true\" [multiple]=\"true\" [placeholder]=\"'Select Accounts'\"></sh-select>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"clearfix mb-1\">\n                <div class=\"row\">\n                    <div class=\"col-sm-5\">\n                        <label for=\"\">Amount</label>\n                    </div>\n                    <div class=\"col-sm-7\">\n                        <div class=\"row\">\n                            <div class=\"col-xs-6\">\n                                <div class=\"form-group\">\n                                    <sh-select [showClear]=\"false\" [width]=\"'100%'\" (selected)=\"onRangeSelect('amount', $event)\" [options]=\"comparisonFilterDropDown$ | async\" name=\"particulars\" [placeholder]=\"'Select Range'\"></sh-select>\n                                </div>\n                            </div>\n                            <div class=\"col-xs-6\">\n                                <div class=\"form-group\">\n                                    <input type=\"text\" decimalDigitsDirective [DecimalPlaces]=\"2\" formControlName=\"amount\" class=\"form-control\" aria-label=\"Text input with dropdown button\">\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"clearfix mb-1\">\n                <div class=\"row\">\n                    <div class=\"col-sm-5\">\n                        <label for=\"\">Show cancelled entries</label>\n                    </div>\n                    <div class=\"col-sm-7\">\n                        <div class=\"row\">\n                            <div class=\"col-xs-6\">\n                                <div class=\"form-group\">\n                                    <input type=\"checkbox\" formControlName=\"cancelledEntries\">\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"clearfix mb-1\">\n                <div class=\"form-group toggle-btn mrB\">\n                    <label class=\"cp\" (click)=\"toggleOtherDetails()\">\n              <i class=\"fa cp\" aria-hidden=\"true\"\n                 [ngClass]=\"{'fa-minus-square-o': showOtherDetails, 'fa-plus-square-o': !showOtherDetails}\"></i>Other\n              Details\n            </label>\n                </div>\n            </div>\n\n            <!-- other details container -->\n            <ng-container *ngIf=\"advanceSearchForm.get('includeDescription').value\">\n                <div class=\"clearfix mrT2\">\n                    <div class=\"row\">\n                        <div class=\"mrB1 clearfix\">\n                            <div class=\"col-sm-5\">\n                                <label for=\"\">Inventory</label>\n                            </div>\n                            <div class=\"col-sm-7\" formGroupName=\"inventory\">\n                                <div class=\"row\">\n                                    <div class=\"xs-pr-0 col-sm-3 col-xs-4\">\n\n                                        <div class=\"checkbox square-switch\">\n                                            <input type=\"checkbox\" id=\"includeInventory\" formControlName=\"includeInventory\" />\n                                            <label for=\"includeInventory\">\n                          <span class=\"pull-left\" *ngIf=\"advanceSearchForm.get('inventory.includeInventory').value\">Include</span>\n                          <span class=\"pull-right\" *ngIf=\"!advanceSearchForm.get('inventory.includeInventory').value\">Exclude</span>\n                        </label>\n                                        </div>\n                                    </div>\n                                    <div class=\"col-sm-9 col-xs-8\">\n                                        <div class=\"form-group\">\n                                            <sh-select [options]=\"stockListDropDown$ | async\" name=\"inventory\" (onClear)=\"onDDClear('inventory')\" (selected)=\"onDDElementSelect('inventory', $event)\" [isFilterEnabled]=\"true\" [multiple]=\"true\" [placeholder]=\"'Select Accounts'\"></sh-select>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class=\"row\">\n                                    <div class=\"col-xs-6\">\n                                        <div class=\"form-group\">\n                                            <sh-select [showClear]=\"false\" [width]=\"'100%'\" (selected)=\"onRangeSelect('inventoryQty', $event)\" [options]=\"comparisonFilterDropDown$ | async\" name=\"particulars\" [placeholder]=\"'Select Range'\"></sh-select>\n                                        </div>\n                                    </div>\n                                    <div class=\"col-xs-6\">\n                                        <div class=\"form-group\">\n                                            <input type=\"text\" class=\"form-control\" decimalDigitsDirective [DecimalPlaces]=\"4\" formControlName=\"quantity\" placeholder=\"Quantity\">\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class=\"row\">\n                                    <div class=\"col-xs-6\">\n                                        <div class=\"form-group\">\n                                            <sh-select [showClear]=\"false\" [width]=\"'100%'\" (selected)=\"onRangeSelect('inventoryVal', $event)\" [options]=\"comparisonFilterDropDown$ | async\" name=\"particulars\" [placeholder]=\"'Select Range'\"></sh-select>\n                                        </div>\n                                    </div>\n                                    <div class=\"col-xs-6\">\n                                        <div class=\"form-group\">\n                                            <input type=\"text\" decimalDigitsDirective [DecimalPlaces]=\"3\" class=\"form-control\" formControlName=\"itemValue\" placeholder=\"Value\">\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"row\">\n                        <div class=\"col-sm-5\">\n                            <label for=\"\">Cheque Details</label>\n                        </div>\n                        <div class=\"col-sm-7\">\n                            <div class=\"row\">\n                                <div class=\"col-xs-6\">\n                                    <div class=\"form-group\">\n                                        <input type=\"text\" placeholder=\"Cheque Number\" formControlName=\"chequeNumber\" class=\"form-control\">\n                                    </div>\n                                </div>\n                                <div class=\"col-xs-6\">\n                                    <div class=\"form-group\">\n                                        <input type=\"text\" placeholder=\"Clearance Date\" name=\"from\" formControlName=\"dateOnCheque\" bsDatepicker class=\"form-control\" [bsConfig]=\"bsConfig\" />\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"row\">\n                        <div class=\"col-sm-5\">\n                            <label for=\"\">Description</label>\n                        </div>\n                        <div class=\"col-sm-7\">\n                            <div class=\"form-group\">\n                                <input type=\"text\" formControlName=\"description\" placeholder=\"Description\" class=\"form-control\">\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </ng-container>\n            <div class=\"text-right mb-3 mt-2\">\n                <button class=\"btn btn-success m0\" type=\"button\" (click)=\"onSearch()\">Search</button>\n                <!-- <button class=\"btn btn-update\" type=\"button\" (click)=\"onSearch()\">Search & Export</button> -->\n            </div>\n        </form>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/ledger/components/advance-search/advance-search.component.scss":
/*!********************************************************************************!*\
  !*** ./src/app/ledger/components/advance-search/advance-search.component.scss ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@media (min-width: 1200px) {\n  .container {\n    width: 100%;\n    max-width: 1280px; } }\n\n@media only screen and (max-width: 1024px) {\n  .container {\n    width: 100%; } }\n\n@media only screen and (max-width: 767px) {\n  .ledger-state-box {\n    margin-bottom: 20px; }\n  .amount-total {\n    background: #efefef; }\n  .pageCount {\n    width: 100%;\n    left: 0;\n    bottom: 0;\n    position: relative; }\n  .ledger-stat {\n    margin: 0px 0 0; }\n  .ledger_book {\n    margin-bottom: 100px; }\n  .ledger-head thead tr th.active {\n    display: block !important;\n    width: 100%; }\n  .ledger_book .h-table tbody .ledger-row td {\n    position: relative;\n    padding-left: 80px !important; } }\n"

/***/ }),

/***/ "./src/app/ledger/components/advance-search/advance-search.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/ledger/components/advance-search/advance-search.component.ts ***!
  \******************************************************************************/
/*! exports provided: AdvanceSearchModelComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdvanceSearchModelComponent", function() { return AdvanceSearchModelComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var apps_web_giddh_src_app_theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.component */ "./src/app/theme/ng-virtual-select/sh-select.component.ts");
/* harmony import */ var _services_group_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../services/group.service */ "./src/app/services/group.service.ts");
/* harmony import */ var _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../actions/inventory/inventory.actions */ "./src/app/actions/inventory/inventory.actions.ts");
/* harmony import */ var _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../actions/ledger/ledger.actions */ "./src/app/actions/ledger/ledger.actions.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _models_interfaces_AdvanceSearchRequest__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../models/interfaces/AdvanceSearchRequest */ "./src/app/models/interfaces/AdvanceSearchRequest.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
















var COMPARISON_FILTER = [
    { label: 'Greater Than', value: 'greaterThan' },
    { label: 'Less Than', value: 'lessThan' },
    { label: 'Greater Than or Equals', value: 'greaterThanOrEquals' },
    { label: 'Less Than or Equals', value: 'lessThanOrEquals' },
    { label: 'Equals', value: 'equals' },
    { label: 'Exclude', value: 'exclude' }
];
var AdvanceSearchModelComponent = /** @class */ (function () {
    function AdvanceSearchModelComponent(_groupService, inventoryAction, store, fb, _ledgerActions, _accountService) {
        this._groupService = _groupService;
        this.inventoryAction = inventoryAction;
        this.store = store;
        this.fb = fb;
        this._ledgerActions = _ledgerActions;
        this._accountService = _accountService;
        this.closeModelEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_11__["EventEmitter"](null);
        this.advanceSearchObject = null;
        this.showOtherDetails = false;
        this.showChequeDatePicker = false;
        this.bsConfig = { showWeekNumbers: false, dateInputFormat: 'DD-MM-YYYY', rangeInputFormat: 'DD-MM-YYYY' };
        this.moment = moment__WEBPACK_IMPORTED_MODULE_12__;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.comparisonFilterDropDown$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(COMPARISON_FILTER);
        this.store.dispatch(this.inventoryAction.GetManufacturingStock());
        this.flattenAccountListStream$ = this.store.select(function (p) { return p.general.flattenAccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
    }
    AdvanceSearchModelComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.store.dispatch(this.inventoryAction.GetStock());
        // this.store.dispatch(this.groupWithAccountsAction.getFlattenGroupsWithAccounts());
        this.flattenAccountListStream$.subscribe(function (data) {
            if (data) {
                var accounts_1 = [];
                data.map(function (d) {
                    accounts_1.push({ label: d.name + " (" + d.uniqueName + ")", value: d.uniqueName });
                });
                _this.accounts$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(accounts_1);
            }
        });
        this.stockListDropDown$ = this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_13__["createSelector"])([function (state) { return state.inventory.stocksList; }], function (allStocks) {
            var data = _.cloneDeep(allStocks);
            if (data && data.results) {
                var units = data.results;
                return units.map(function (unit) {
                    return { label: unit.name + " (" + unit.uniqueName + ")", value: unit.uniqueName };
                });
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        // Get groups with accounts
        this._groupService.GetFlattenGroupsAccounts().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (data) {
            if (data.status === 'success') {
                var groups_1 = [];
                data.body.results.map(function (d) {
                    groups_1.push({ label: d.groupName + " (" + d.groupUniqueName + ")", value: d.groupUniqueName });
                });
                _this.groups$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(groups_1);
            }
        });
        this.setAdvanceSearchForm();
        this.setVoucherTypes();
    };
    AdvanceSearchModelComponent.prototype.ngOnChanges = function (s) {
        if ('advanceSearchRequest' in s && s.advanceSearchRequest.currentValue && s.advanceSearchRequest.currentValue !== s.advanceSearchRequest.previousValue && s.advanceSearchRequest.currentValue.dataToSend.bsRangeValue) {
            var f = moment__WEBPACK_IMPORTED_MODULE_12__(s.advanceSearchRequest.currentValue.dataToSend.bsRangeValue[0], _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]).toDate();
            var t = moment__WEBPACK_IMPORTED_MODULE_12__(s.advanceSearchRequest.currentValue.dataToSend.bsRangeValue[1], _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]).toDate();
            if (this.advanceSearchForm) {
                var bsDaterangepicker = this.advanceSearchForm.get('bsRangeValue');
                bsDaterangepicker.patchValue([f, t]);
            }
        }
    };
    AdvanceSearchModelComponent.prototype.resetAdvanceSearchModal = function () {
        this.advanceSearchRequest.dataToSend.bsRangeValue = [moment__WEBPACK_IMPORTED_MODULE_12__().toDate(), moment__WEBPACK_IMPORTED_MODULE_12__().subtract(30, 'days').toDate()];
        if (this.dropDowns) {
            this.dropDowns.forEach(function (el) {
                el.clear();
            });
        }
        var f = moment__WEBPACK_IMPORTED_MODULE_12__(this.advanceSearchRequest.dataToSend.bsRangeValue[0], _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]);
        var t = moment__WEBPACK_IMPORTED_MODULE_12__(this.advanceSearchRequest.dataToSend.bsRangeValue[1], _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_3__["GIDDH_DATE_FORMAT"]);
        this.bsRangeValue = [];
        this.bsRangeValue.push(f._d);
        this.bsRangeValue.push(t._d);
        this.advanceSearchRequest.dataToSend = new _models_interfaces_AdvanceSearchRequest__WEBPACK_IMPORTED_MODULE_14__["AdvanceSearchModel"]();
        this.setAdvanceSearchForm();
    };
    AdvanceSearchModelComponent.prototype.setAdvanceSearchForm = function () {
        // this.advanceSearchForm.
        this.advanceSearchForm = this.fb.group({
            bsRangeValue: [[]],
            uniqueNames: [[]],
            isInvoiceGenerated: [null],
            accountUniqueNames: [[]],
            groupUniqueNames: [[]],
            amountLessThan: [false],
            includeAmount: [false],
            amountEqualTo: [false],
            amountGreaterThan: [false],
            amount: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_8__["Validators"].required],
            includeDescription: [false, _angular_forms__WEBPACK_IMPORTED_MODULE_8__["Validators"].required],
            description: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_8__["Validators"].required],
            includeTag: [false, _angular_forms__WEBPACK_IMPORTED_MODULE_8__["Validators"].required],
            includeParticulars: [true, _angular_forms__WEBPACK_IMPORTED_MODULE_8__["Validators"].required],
            includeVouchers: [true, _angular_forms__WEBPACK_IMPORTED_MODULE_8__["Validators"].required],
            chequeNumber: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_8__["Validators"].required],
            dateOnCheque: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_8__["Validators"].required],
            tags: this.fb.array([]),
            particulars: [[]],
            vouchers: [[]],
            cancelledEntries: [false],
            inventory: this.fb.group({
                includeInventory: true,
                inventories: [[]],
                quantity: null,
                includeQuantity: false,
                quantityLessThan: false,
                quantityEqualTo: false,
                quantityGreaterThan: false,
                includeItemValue: false,
                itemValue: null,
                includeItemLessThan: false,
                includeItemEqualTo: false,
                includeItemGreaterThan: false
            }),
        });
        this.advanceSearchForm.patchValue(this.advanceSearchRequest.dataToSend);
    };
    AdvanceSearchModelComponent.prototype.setVoucherTypes = function () {
        this.voucherTypeList = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])([{
                label: 'Sales',
                value: 'sales'
            }, {
                label: 'Purchases',
                value: 'purchase'
            }, {
                label: 'Receipt',
                value: 'receipt'
            }, {
                label: 'Payment',
                value: 'payment'
            }, {
                label: 'Journal',
                value: 'journal'
            }, {
                label: 'Contra',
                value: 'contra'
            }, {
                label: 'Debit Note',
                value: 'debit note'
            }, {
                label: 'Credit Note',
                value: 'credit note'
            }]);
    };
    AdvanceSearchModelComponent.prototype.onCancel = function () {
        this.closeModelEvent.emit(true);
        // this.closeModelEvent.emit(_.cloneDeep(this.advanceSearchRequest));
    };
    /**
     * onDateRangeSelected
     */
    AdvanceSearchModelComponent.prototype.onDateRangeSelected = function (data) {
        if (data && data.length) {
            // this.advanceSearchRequest.from = moment(data[0]).format('DD-MM-YYYY');
            // this.advanceSearchRequest.to = moment(data[1]).format('DD-MM-YYYY');
        }
        // this.closeModelEvent.emit(_.cloneDeep(this.advanceSearchRequest));
    };
    /**
     * onSearch
     */
    AdvanceSearchModelComponent.prototype.onSearch = function () {
        this.advanceSearchRequest.dataToSend = this.advanceSearchForm.value;
        this.closeModelEvent.emit(false);
        // const dataToSend = this.prepareRequest();
        // this.store.dispatch(this._ledgerActions.doAdvanceSearch(dataToSend, this.accountUniqueName, this.fromDate, this.toDate, 1, 15));
        // this.closeModelEvent.emit({
        //   dataToSend, accountUniqueName: this.accountUniqueName,
        //   fromDate: this.fromDate, toDate: this.toDate
        // });
        // this.advanceSearchForm.reset();
    };
    AdvanceSearchModelComponent.prototype.resetAndSearch = function () {
        this.resetAdvanceSearchModal();
    };
    AdvanceSearchModelComponent.prototype.prepareRequest = function () {
        var dataToSend = _.cloneDeep(this.advanceSearchForm.value);
        if (dataToSend.dateOnCheque) {
            dataToSend.dateOnCheque = moment__WEBPACK_IMPORTED_MODULE_12__(dataToSend.dateOnCheque).format('DD-MM-YYYY');
        }
        return dataToSend;
    };
    /**
     * onDDElementSelect
     */
    AdvanceSearchModelComponent.prototype.onDDElementSelect = function (type, data) {
        var values = [];
        data.forEach(function (element) {
            values.push(element.value);
        });
        switch (type) {
            case 'particulars':
                this.advanceSearchForm.get('particulars').patchValue(values);
                break;
            case 'accountUniqueNames':
                this.advanceSearchForm.get('accountUniqueNames').patchValue(values);
                break;
            case 'vouchers':
                this.advanceSearchForm.get('vouchers').patchValue(values);
                break;
            case 'inventory':
                this.advanceSearchForm.get('inventory.inventories').patchValue(values);
                break;
            case 'groupUniqueNames':
                this.advanceSearchForm.get('groupUniqueNames').patchValue(values);
                break;
        }
    };
    /**
     * onDDClear
     */
    AdvanceSearchModelComponent.prototype.onDDClear = function (type) {
        this.onDDElementSelect(type, []);
    };
    /**
     * onRangeSelect
     */
    AdvanceSearchModelComponent.prototype.onRangeSelect = function (type, data) {
        switch (type + '-' + data.value) {
            case 'amount-greaterThan':
                this.advanceSearchForm.get('includeAmount').patchValue(true);
                this.advanceSearchForm.get('amountGreaterThan').patchValue(true);
                this.advanceSearchForm.get('amountLessThan').patchValue(false);
                this.advanceSearchForm.get('amountEqualTo').patchValue(false);
                break;
            case 'amount-lessThan':
                this.advanceSearchForm.get('includeAmount').patchValue(true);
                this.advanceSearchForm.get('amountGreaterThan').patchValue(false);
                this.advanceSearchForm.get('amountLessThan').patchValue(true);
                this.advanceSearchForm.get('amountEqualTo').patchValue(false);
                break;
            case 'amount-greaterThanOrEquals':
                this.advanceSearchForm.get('includeAmount').patchValue(true);
                this.advanceSearchForm.get('amountGreaterThan').patchValue(true);
                this.advanceSearchForm.get('amountLessThan').patchValue(false);
                this.advanceSearchForm.get('amountEqualTo').patchValue(true);
                break;
            case 'amount-lessThanOrEquals':
                this.advanceSearchForm.get('includeAmount').patchValue(true);
                this.advanceSearchForm.get('amountGreaterThan').patchValue(false);
                this.advanceSearchForm.get('amountLessThan').patchValue(true);
                this.advanceSearchForm.get('amountEqualTo').patchValue(true);
                break;
            case 'amount-equals':
                this.advanceSearchForm.get('includeAmount').patchValue(true);
                this.advanceSearchForm.get('amountGreaterThan').patchValue(false);
                this.advanceSearchForm.get('amountLessThan').patchValue(false);
                this.advanceSearchForm.get('amountEqualTo').patchValue(true);
                break;
            case 'amount-exclude':
                this.advanceSearchForm.get('includeAmount').patchValue(false);
                this.advanceSearchForm.get('amountGreaterThan').patchValue(false);
                this.advanceSearchForm.get('amountLessThan').patchValue(false);
                this.advanceSearchForm.get('amountEqualTo').patchValue(false);
                break;
            case 'inventoryQty-greaterThan':
                this.advanceSearchForm.get('inventory.includeQuantity').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityGreaterThan').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityEqualTo').patchValue(false);
                break;
            case 'inventoryQty-lessThan':
                this.advanceSearchForm.get('inventory.includeQuantity').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityLessThan').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityEqualTo').patchValue(false);
                break;
            case 'inventoryQty-greaterThanOrEquals':
                this.advanceSearchForm.get('inventory.includeQuantity').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityGreaterThan').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityEqualTo').patchValue(true);
                break;
            case 'inventoryQty-lessThanOrEquals':
                this.advanceSearchForm.get('inventory.includeQuantity').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityLessThan').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityEqualTo').patchValue(true);
                break;
            case 'inventoryQty-equals':
                this.advanceSearchForm.get('inventory.includeQuantity').patchValue(true);
                this.advanceSearchForm.get('inventory.quantityGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityEqualTo').patchValue(true);
                break;
            case 'inventoryQty-exclude':
                this.advanceSearchForm.get('inventory.includeQuantity').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.quantityEqualTo').patchValue(false);
                break;
            case 'inventoryVal-greaterThan':
                this.advanceSearchForm.get('inventory.includeItemValue').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemEqualTo').patchValue(false);
                break;
            case 'inventoryVal-lessThan':
                this.advanceSearchForm.get('inventory.includeItemValue').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemLessThan').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemEqualTo').patchValue(false);
                break;
            case 'inventoryVal-greaterThanOrEquals':
                this.advanceSearchForm.get('inventory.includeItemValue').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemEqualTo').patchValue(true);
                break;
            case 'inventoryVal-lessThanOrEquals':
                this.advanceSearchForm.get('inventory.includeItemValue').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemLessThan').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemEqualTo').patchValue(true);
                break;
            case 'inventoryVal-equals':
                this.advanceSearchForm.get('inventory.includeItemValue').patchValue(true);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemEqualTo').patchValue(true);
                break;
            case 'inventoryVal-exclude':
                this.advanceSearchForm.get('inventory.includeItemValue').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemGreaterThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemLessThan').patchValue(false);
                this.advanceSearchForm.get('inventory.includeItemEqualTo').patchValue(false);
                break;
        }
    };
    /**
     * toggleOtherDetails
     */
    AdvanceSearchModelComponent.prototype.toggleOtherDetails = function () {
        this.showOtherDetails = !this.showOtherDetails;
        var val = !this.advanceSearchForm.get('includeDescription').value;
        this.advanceSearchForm.get('includeDescription').patchValue(val);
        if (!val) {
            this.advanceSearchForm.get('description').patchValue(null);
        }
    };
    AdvanceSearchModelComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ViewChildren"])(apps_web_giddh_src_app_theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_4__["ShSelectComponent"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_11__["QueryList"])
    ], AdvanceSearchModelComponent.prototype, "dropDowns", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ViewChild"])('dp'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_15__["BsDaterangepickerDirective"])
    ], AdvanceSearchModelComponent.prototype, "dateRangePicker", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _models_interfaces_AdvanceSearchRequest__WEBPACK_IMPORTED_MODULE_14__["AdvanceSearchRequest"])
    ], AdvanceSearchModelComponent.prototype, "advanceSearchRequest", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_11__["EventEmitter"])
    ], AdvanceSearchModelComponent.prototype, "closeModelEvent", void 0);
    AdvanceSearchModelComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["Component"])({
            selector: 'advance-search-model',
            template: __webpack_require__(/*! ./advance-search.component.html */ "./src/app/ledger/components/advance-search/advance-search.component.html"),
            styles: [__webpack_require__(/*! ./advance-search.component.scss */ "./src/app/ledger/components/advance-search/advance-search.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_group_service__WEBPACK_IMPORTED_MODULE_5__["GroupService"], _actions_inventory_inventory_actions__WEBPACK_IMPORTED_MODULE_6__["InventoryAction"], _ngrx_store__WEBPACK_IMPORTED_MODULE_9__["Store"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormBuilder"], _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_7__["LedgerActions"], _services_account_service__WEBPACK_IMPORTED_MODULE_10__["AccountService"]])
    ], AdvanceSearchModelComponent);
    return AdvanceSearchModelComponent;
}());



/***/ }),

/***/ "./src/app/ledger/components/baseAccountModal/baseAccountModal.component.html":
/*!************************************************************************************!*\
  !*** ./src/app/ledger/components/baseAccountModal/baseAccountModal.component.html ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"shareModal\">\n    <div id=\"share-modal\" class=\"\" ng-if=\"ledgerCtrl.toggleShare\">\n        <div class=\"pd2 bg_grey\">\n            <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"closeBaseAccountModal.emit()\" aria-label=\"Close\">×</span>\n            <h3>Are you sure you want to change the base account?</h3>\n        </div>\n\n        <div class=\"modal-body\" id=\"SharePop\">\n            <div class=\"modal_wrap\">\n                <p>Note: Please update if any changes made in the ledger before changing base account, unsaved changes will be removed.</p>\n                <div class=\"mrT2\">\n                    <sh-select [disabled]=\"false\" placeholder=\"Select Account\" filterPlaceholder=\"Search Account\" name=\"accountUniqueName\" [(ngModel)]=\"accountUniqueName\" [options]=\"flattenAccountList\" class=\"\" [useInBuiltFilterForFlattenAc]=\"true\">\n                        <ng-template #optionTemplate let-option=\"option\">\n                            <a href=\"javascript:void(0)\" class=\"\" (click)=\"changeBaseAccount(option)\" style=\"border-bottom: 1px solid #ccc;\">\n                                <div class=\"item fs14\">{{option?.label}}</div>\n                                <div class=\"item_unq fs14\">{{option.additional?.uniqueName}}</div>\n                            </a>\n                        </ng-template>\n                    </sh-select>\n                    <button class=\"btn btn-success btn-block mrT1\" (click)=\"saveBaseAccount()\" [disabled]=\"!accountUniqueName\">Change Base Account</button>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/ledger/components/baseAccountModal/baseAccountModal.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/ledger/components/baseAccountModal/baseAccountModal.component.ts ***!
  \**********************************************************************************/
/*! exports provided: BaseAccountComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseAccountComponent", function() { return BaseAccountComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../actions/accounts.actions */ "./src/app/actions/accounts.actions.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_ledger_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../services/ledger.service */ "./src/app/services/ledger.service.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../actions/ledger/ledger.actions */ "./src/app/actions/ledger/ledger.actions.ts");








var BaseAccountComponent = /** @class */ (function () {
    function BaseAccountComponent(_ledgerService, _accountService, store, _ledgerActions, accountActions) {
        this._ledgerService = _ledgerService;
        this._accountService = _accountService;
        this.store = store;
        this._ledgerActions = _ledgerActions;
        this.accountActions = accountActions;
        this.accountUniqueName = '';
        // @Input() public from: string = '';
        // @Input() public to: string = '';
        this.closeBaseAccountModal = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        this.updateBaseAccount = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        this.changedAccountUniq = '';
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__["ReplaySubject"](1);
    }
    BaseAccountComponent.prototype.ngOnInit = function () {
        //
    };
    BaseAccountComponent.prototype.changeBaseAccount = function (item) {
        if (item) {
            this.changedAccountUniq = item.value;
        }
        // this.updateBaseAccount.emit(this.accountUniqueName);
    };
    BaseAccountComponent.prototype.saveBaseAccount = function () {
        this.updateBaseAccount.emit(this.changedAccountUniq);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], BaseAccountComponent.prototype, "accountUniqueName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], BaseAccountComponent.prototype, "closeBaseAccountModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], BaseAccountComponent.prototype, "updateBaseAccount", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], BaseAccountComponent.prototype, "flattenAccountList", void 0);
    BaseAccountComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'base-account',
            template: __webpack_require__(/*! ./baseAccountModal.component.html */ "./src/app/ledger/components/baseAccountModal/baseAccountModal.component.html"),
            styles: ["\n    .bg_grey {\n        background: #eaebed;\n    }\n    "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_ledger_service__WEBPACK_IMPORTED_MODULE_3__["LedgerService"], _services_account_service__WEBPACK_IMPORTED_MODULE_4__["AccountService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_6__["Store"], _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_7__["LedgerActions"], _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_1__["AccountsAction"]])
    ], BaseAccountComponent);
    return BaseAccountComponent;
}());



/***/ }),

/***/ "./src/app/ledger/components/exportLedger/exportLedger.component.html":
/*!****************************************************************************!*\
  !*** ./src/app/ledger/components/exportLedger/exportLedger.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"exportModal\" class=\"\" ng-if=\"ledgerCtrl.LedgerExport\">\n  <div class=\"modal-header\">\n    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"closeExportLedgerModal.emit()\"\n          aria-label=\"Close\">×</span>\n    <h3>Export Ledger</h3>\n  </div>\n  <div class=\"modal-body mrB4\" id=\"export-body\">\n    <form name=\"addShareEmailForm\" novalidate class=\"\" autocomplete=\"off\">\n      <div class=\"pdB1 clearfix\">\n        <label class=\"w100\">Type:</label>\n        <label class=\"radio-inline pd0\">\n          <input type=\"radio\" name=\"emailTypeSelected\" [(ngModel)]=\"emailTypeSelected\" [value]=\"emailTypeMini\"\n                 class=\"radio_theme cp\">Mini\n        </label>\n        <label class=\"radio-inline pd0\">\n          <input type=\"radio\" name=\"emailTypeSelected\" [(ngModel)]=\"emailTypeSelected\" [value]=\"emailTypeDetail\"\n                 class=\"radio_theme cp\">Detailed\n        </label>\n      </div>\n      <div class=\"pdB1 clearfix\">\n        <label class=\"w100\">Export As:</label>\n        <label class=\"radio-inline pd0\">\n          <input type=\"radio\" name=\"exportAs\" [(ngModel)]=\"exportAs\" [value]=\"'pdf'\" class=\"radio_theme cp\">PDF\n        </label>\n        <label class=\"radio-inline pd0\">\n          <input type=\"radio\" name=\"exportAs\" [(ngModel)]=\"exportAs\" [value]=\"'xlsx'\" class=\"radio_theme cp\">Excel\n        </label>\n      </div>\n      <div class=\"pdB1 clearfix\">\n        <label class=\"w100\">Order:</label>\n        <label class=\"radio-inline pd0\">\n          <input type=\"radio\" name=\"order\" [(ngModel)]=\"order\" [value]=\"'asc'\" class=\"radio_theme cp\">Ascending\n        </label>\n        <label class=\"radio-inline pd0\">\n          <input type=\"radio\" name=\"order\" [(ngModel)]=\"order\" [value]=\"'desc'\" class=\"radio_theme cp\">Descending\n        </label>\n      </div>\n      <div class=\"pdB1 clearfix\" [hidden]=\"emailTypeSelected === 'admin-condensed'\">\n        <label class=\"w100\">Invoice no.:</label>\n        <label class=\"radio-inline pd0\" style=\"margin-left: 6px;\">\n          <input type=\"checkbox\" name=\"withInvoiceNumber\" [(ngModel)]=\"withInvoiceNumber\">\n        </label>\n      </div>\n      <button class=\"btn-success btn\" (click)=\"exportLedger()\">Download</button>\n      <div class=\"modal_wrap\">\n        <div class=\"clearfix\"></div>\n        <h3 class=\"pdT1 pdB1\">Or</h3>\n        <div>\n          <h3 class=\"l8grey pdB size-xs\">You can add multiple id's separated comma</h3>\n          <textarea [(ngModel)]=\"emailData\" required name=\"email\" class=\"form-control\"\n                    placeholder=\"Recipents Email Id's\"></textarea>\n          <button ng-disabled=\"ledgerEmailSendForm.$invalid\" class=\"btn btn-success mrT1\" (click)=\"sendLedgEmail()\">Send\n            email\n          </button>\n        </div>\n        <!-- add mailer -->\n      </div>\n    </form>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/ledger/components/exportLedger/exportLedger.component.ts":
/*!**************************************************************************!*\
  !*** ./src/app/ledger/components/exportLedger/exportLedger.component.ts ***!
  \**************************************************************************/
/*! exports provided: ExportLedgerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExportLedgerComponent", function() { return ExportLedgerComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_ledger_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../services/ledger.service */ "./src/app/services/ledger.service.ts");
/* harmony import */ var _models_api_models_Ledger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../models/api-models/Ledger */ "./src/app/models/api-models/Ledger.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! file-saver */ "../../node_modules/file-saver/FileSaver.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var apps_web_giddh_src_app_permissions_permission_data_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! apps/web-giddh/src/app/permissions/permission-data.service */ "./src/app/permissions/permission-data.service.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");














var ExportLedgerComponent = /** @class */ (function () {
    function ExportLedgerComponent(_ledgerService, _toaster, _permissionDataService, store) {
        this._ledgerService = _ledgerService;
        this._toaster = _toaster;
        this._permissionDataService = _permissionDataService;
        this.store = store;
        this.accountUniqueName = '';
        this.closeExportLedgerModal = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        this.emailTypeSelected = '';
        this.exportAs = 'xlsx';
        this.order = 'asc';
        this.emailTypeMini = '';
        this.emailData = '';
        this.withInvoiceNumber = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_11__["ReplaySubject"](1);
        this.universalDate$ = this.store.select(function (p) { return p.session.applicationDate; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_13__["takeUntil"])(this.destroyed$));
    }
    ExportLedgerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._permissionDataService.getData.forEach(function (f) {
            if (f.name === 'LEDGER') {
                var isAdmin = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_9__["some"])(f.permissions, function (prm) { return prm.code === 'UPDT'; });
                _this.emailTypeSelected = isAdmin ? 'admin-detailed' : 'view-detailed';
                _this.emailTypeMini = isAdmin ? 'admin-condensed' : 'view-condensed';
                _this.emailTypeDetail = isAdmin ? 'admin-detailed' : 'view-detailed';
            }
        });
    };
    ExportLedgerComponent.prototype.exportLedger = function () {
        var _this = this;
        var exportByInvoiceNumber = this.emailTypeSelected === 'admin-condensed' ? false : this.withInvoiceNumber;
        var exportRequest = new _models_api_models_Ledger__WEBPACK_IMPORTED_MODULE_4__["ExportLedgerRequest"]();
        exportRequest.type = this.emailTypeSelected;
        exportRequest.sort = this.order;
        exportRequest.format = this.exportAs;
        var body = _.cloneDeep(this.advanceSearchRequest);
        if (!body.dataToSend.bsRangeValue) {
            this.universalDate$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_13__["take"])(1)).subscribe(function (a) {
                if (a) {
                    body.dataToSend.bsRangeValue = [moment_moment__WEBPACK_IMPORTED_MODULE_10__(a[0], 'DD-MM-YYYY').toDate(), moment_moment__WEBPACK_IMPORTED_MODULE_10__(a[1], 'DD-MM-YYYY').toDate()];
                }
            });
        }
        exportRequest.from = moment_moment__WEBPACK_IMPORTED_MODULE_10__(body.dataToSend.bsRangeValue[0]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]) ? moment_moment__WEBPACK_IMPORTED_MODULE_10__(body.dataToSend.bsRangeValue[0]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]) : moment_moment__WEBPACK_IMPORTED_MODULE_10__().add(-1, 'month').format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]);
        exportRequest.to = moment_moment__WEBPACK_IMPORTED_MODULE_10__(body.dataToSend.bsRangeValue[1]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]) ? moment_moment__WEBPACK_IMPORTED_MODULE_10__(body.dataToSend.bsRangeValue[1]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]) : moment_moment__WEBPACK_IMPORTED_MODULE_10__().format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]);
        //delete body.dataToSend;
        this._ledgerService.ExportLedger(exportRequest, this.accountUniqueName, body.dataToSend, exportByInvoiceNumber).subscribe(function (a) {
            if (a.status === 'success') {
                if (a.queryString.fileType === 'xlsx') {
                    var blob = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_5__["base64ToBlob"])(a.body, 'application/vnd.ms-excel', 512);
                    return Object(file_saver__WEBPACK_IMPORTED_MODULE_6__["saveAs"])(blob, _this.accountUniqueName + ".xls");
                }
                else if (a.queryString.fileType === 'pdf') {
                    var blob = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_5__["base64ToBlob"])(a.body, 'application/pdf', 512);
                    return Object(file_saver__WEBPACK_IMPORTED_MODULE_6__["saveAs"])(blob, _this.accountUniqueName + ".pdf");
                }
            }
            else {
                _this._toaster.errorToast(a.message, a.code);
            }
        });
    };
    ExportLedgerComponent.prototype.sendLedgEmail = function () {
        var _this = this;
        this._toaster.clearAllToaster();
        var data = this.emailData;
        var sendData = new _models_api_models_Ledger__WEBPACK_IMPORTED_MODULE_4__["MailLedgerRequest"]();
        data = data.replace(RegExp(' ', 'g'), '');
        var cdata = data.split(',');
        // tslint:disable-next-line:prefer-for-of
        for (var i = 0; i < cdata.length; i++) {
            if (Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_5__["validateEmail"])(cdata[i])) {
                sendData.recipients.push(cdata[i]);
            }
            else {
                // this._toaster.clearAllToaster();
                this._toaster.warningToast('Enter valid Email ID', 'Warning');
                data = '';
                sendData.recipients = [];
                break;
            }
        }
        if (sendData.recipients.length > 0) {
            var body_1 = _.cloneDeep(this.advanceSearchRequest);
            if (!body_1.dataToSend.bsRangeValue) {
                this.universalDate$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_13__["take"])(1)).subscribe(function (a) {
                    if (a) {
                        body_1.dataToSend.bsRangeValue = [moment_moment__WEBPACK_IMPORTED_MODULE_10__(a[0], 'DD-MM-YYYY').toDate(), moment_moment__WEBPACK_IMPORTED_MODULE_10__(a[1], 'DD-MM-YYYY').toDate()];
                    }
                });
            }
            var from = moment_moment__WEBPACK_IMPORTED_MODULE_10__(body_1.dataToSend.bsRangeValue[0]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]) ? moment_moment__WEBPACK_IMPORTED_MODULE_10__(body_1.dataToSend.bsRangeValue[0]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]) : moment_moment__WEBPACK_IMPORTED_MODULE_10__().add(-1, 'month').format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]);
            var to = moment_moment__WEBPACK_IMPORTED_MODULE_10__(body_1.dataToSend.bsRangeValue[1]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]) ? moment_moment__WEBPACK_IMPORTED_MODULE_10__(body_1.dataToSend.bsRangeValue[1]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]) : moment_moment__WEBPACK_IMPORTED_MODULE_10__().format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]);
            this._ledgerService.MailLedger(sendData, this.accountUniqueName, from, to, this.exportAs, this.emailTypeSelected, this.order).subscribe(function (sent) {
                if (sent.status === 'success') {
                    _this._toaster.successToast(sent.body, sent.status);
                    _this.emailData = '';
                }
                else {
                    _this._toaster.errorToast(sent.message, sent.status);
                }
            });
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], ExportLedgerComponent.prototype, "accountUniqueName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], ExportLedgerComponent.prototype, "advanceSearchRequest", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], ExportLedgerComponent.prototype, "closeExportLedgerModal", void 0);
    ExportLedgerComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'export-ledger',
            template: __webpack_require__(/*! ./exportLedger.component.html */ "./src/app/ledger/components/exportLedger/exportLedger.component.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_ledger_service__WEBPACK_IMPORTED_MODULE_3__["LedgerService"], _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__["ToasterService"], apps_web_giddh_src_app_permissions_permission_data_service__WEBPACK_IMPORTED_MODULE_8__["PermissionDataService"], _ngrx_store__WEBPACK_IMPORTED_MODULE_12__["Store"]])
    ], ExportLedgerComponent);
    return ExportLedgerComponent;
}());



/***/ }),

/***/ "./src/app/ledger/components/ledgerAsidePane/component/ledger-aside-pane-account/ledger-aside.pane.account.component.html":
/*!********************************************************************************************************************************!*\
  !*** ./src/app/ledger/components/ledgerAsidePane/component/ledger-aside-pane-account/ledger-aside.pane.account.component.html ***!
  \********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane($event)\">X</button>\n  <div class=\"aside-header\">\n    <h3 class=\"aside-title\">Create Account</h3>\n  </div>\n  <div class=\"aside-body\">\n    <div class=\"form-group pdT2\">\n      <label class=\"mrB1\">Select Group</label>\n      <div class=\"ng-select-wrap liq\">\n        <ng-select placeholder=\"Select Group\" filterPlaceholder=\"Type to search...\" name=\"activeGroupUniqueName\"\n                   [(ngModel)]=\"activeGroupUniqueName\" [options]=\"flattenGroupsArray\" style=\"width:100%\"\n                   (selected)=\"checkSelectedGroup($event)\">\n          <ng-template #optionTemplate let-option=\"option\">\n            <div class=\"account-list-item\">{{option?.label}}</div>\n            <div class=\"account-list-item fs12\">{{option?.value}}</div>\n          </ng-template>\n        </ng-select>\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <account-add-new *ngIf=\"activeGroupUniqueName\" [activeGroupUniqueName]=\"activeGroupUniqueName\"\n                       [fetchingAccUniqueName$]=\"fetchingAccUniqueName$\"\n                       [isAccountNameAvailable$]=\"isAccountNameAvailable$\"\n                       [createAccountInProcess$]=\"createAccountInProcess$\" (submitClicked)=\"addNewAcSubmit($event)\"\n                       [isGstEnabledAcc]=\"isGstEnabledAcc\" [isHsnSacEnabledAcc]=\"isHsnSacEnabledAcc\">\n      </account-add-new>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/ledger/components/ledgerAsidePane/component/ledger-aside-pane-account/ledger-aside.pane.account.component.ts":
/*!******************************************************************************************************************************!*\
  !*** ./src/app/ledger/components/ledgerAsidePane/component/ledger-aside-pane-account/ledger-aside.pane.account.component.ts ***!
  \******************************************************************************************************************************/
/*! exports provided: LedgerAsidePaneAccountComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LedgerAsidePaneAccountComponent", function() { return LedgerAsidePaneAccountComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _services_group_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../services/group.service */ "./src/app/services/group.service.ts");
/* harmony import */ var _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../actions/accounts.actions */ "./src/app/actions/accounts.actions.ts");







var GROUP = ['revenuefromoperations', 'otherincome', 'operatingcost', 'indirectexpenses'];
var LedgerAsidePaneAccountComponent = /** @class */ (function () {
    function LedgerAsidePaneAccountComponent(store, groupService, accountsAction, _groupService) {
        this.store = store;
        this.groupService = groupService;
        this.accountsAction = accountsAction;
        this._groupService = _groupService;
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"](true);
        this.select2Options = {
            multiple: false,
            width: '100%',
            placeholder: 'Select Group',
            allowClear: true
        };
        this.isGstEnabledAcc = false;
        this.isHsnSacEnabledAcc = false;
        this.flattenGroupsArray = [];
        // private below
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["ReplaySubject"](1);
        this.groupsArrayStream$ = this.store.select(function (p) { return p.general.groupswithaccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        // account-add component's property
        this.fetchingAccUniqueName$ = this.store.select(function (state) { return state.groupwithaccounts.fetchingAccUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isAccountNameAvailable$ = this.store.select(function (state) { return state.groupwithaccounts.isAccountNameAvailable; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.createAccountInProcess$ = this.store.select(function (state) { return state.groupwithaccounts.createAccountInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    LedgerAsidePaneAccountComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._groupService.GetFlattenGroupsAccounts('', 1, 5000, 'true').subscribe(function (result) {
            if (result.status === 'success') {
                // this.groupsArrayStream$ = Observable.of(result.body.results);
                var groupsListArray_1 = [];
                result.body.results = _this.removeFixedGroupsFromArr(result.body.results);
                result.body.results.forEach(function (a) {
                    groupsListArray_1.push({ label: a.groupName, value: a.groupUniqueName });
                });
                _this.flattenGroupsArray = groupsListArray_1;
            }
        });
    };
    LedgerAsidePaneAccountComponent.prototype.addNewAcSubmit = function (accRequestObject) {
        this.store.dispatch(this.accountsAction.createAccountV2(accRequestObject.activeGroupUniqueName, accRequestObject.accountRequest));
    };
    LedgerAsidePaneAccountComponent.prototype.closeAsidePane = function (event) {
        this.closeAsideEvent.emit(event);
    };
    LedgerAsidePaneAccountComponent.prototype.checkSelectedGroup = function (options) {
        var _this = this;
        this.groupsArrayStream$.subscribe(function (data) {
            if (data.length) {
                var accountCategory = _this.flattenGroup(data, options.value, null);
                _this.isGstEnabledAcc = accountCategory === 'assets' || accountCategory === 'liabilities';
                _this.isHsnSacEnabledAcc = !_this.isGstEnabledAcc;
            }
        });
    };
    LedgerAsidePaneAccountComponent.prototype.removeFixedGroupsFromArr = function (data) {
        var fixedArr = ['currentassets', 'fixedassets', 'noncurrentassets', 'indirectexpenses', 'operatingcost',
            'otherincome', 'revenuefromoperations', 'shareholdersfunds', 'currentliabilities', 'noncurrentliabilities'];
        return data.filter(function (da) {
            return !(fixedArr.indexOf(da.groupUniqueName) > -1);
        });
    };
    LedgerAsidePaneAccountComponent.prototype.flattenGroup = function (rawList, groupUniqueName, category) {
        for (var _i = 0, rawList_1 = rawList; _i < rawList_1.length; _i++) {
            var raw = rawList_1[_i];
            if (raw.uniqueName === groupUniqueName) {
                return raw.category;
            }
            if (raw.groups) {
                var AccountOfCategory = this.flattenGroup(raw.groups, groupUniqueName, raw);
                if (AccountOfCategory) {
                    return AccountOfCategory;
                }
            }
        }
    };
    LedgerAsidePaneAccountComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], LedgerAsidePaneAccountComponent.prototype, "activeGroupUniqueName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], LedgerAsidePaneAccountComponent.prototype, "closeAsideEvent", void 0);
    LedgerAsidePaneAccountComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'ledger-aside-pane-account',
            template: __webpack_require__(/*! ./ledger-aside.pane.account.component.html */ "./src/app/ledger/components/ledgerAsidePane/component/ledger-aside-pane-account/ledger-aside.pane.account.component.html"),
            styles: ["\n    :host {\n      position: fixed;\n      left: auto;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      width: 100%;\n      max-width:580px;\n      z-index: 1045;\n    }\n\n    #close {\n      display: none;\n    }\n\n    :host.in #close {\n      display: block;\n      position: fixed;\n      left: -41px;\n      top: 0;\n      z-index: 5;\n      border: 0;\n      border-radius: 0;\n    }\n\n    :host .container-fluid {\n      padding-left: 0;\n      padding-right: 0;\n    }\n\n    :host .aside-pane {\n      width: 100%;\n    max-width:580px;\n    }\n\n    .aside-pane {\n      width: 100%;\n    }\n\n    .flexy-child {\n      flex-grow: 1;\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n    }\n\n    .flexy-child-1 {\n      flex-grow: 1;\n    }\n\n    .vmiddle {\n      position: absolute;\n      top: 50%;\n      bottom: 0;\n      left: 0;\n      display: table;\n      width: 100%;\n      right: 0;\n      transform: translateY(-50%);\n      text-align: center;\n      margin: 0 auto;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"],
            _services_group_service__WEBPACK_IMPORTED_MODULE_5__["GroupService"],
            _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_6__["AccountsAction"],
            _services_group_service__WEBPACK_IMPORTED_MODULE_5__["GroupService"]])
    ], LedgerAsidePaneAccountComponent);
    return LedgerAsidePaneAccountComponent;
}());



/***/ }),

/***/ "./src/app/ledger/components/ledgerAsidePane/ledgerAsidePane.component.html":
/*!**********************************************************************************!*\
  !*** ./src/app/ledger/components/ledgerAsidePane/ledgerAsidePane.component.html ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane()\" *ngIf=\"!hideFirstScreen\">X</button>\n  <button id=\"back\" class=\"btn btn-primary\" (click)=\"backButtonPressed()\" *ngIf=\"hideFirstScreen\"><i\n    class=\"fa fa-arrow-left\"></i></button>\n\n  <div class=\"aside-body flexy-child vmiddle\" *ngIf=\"!hideFirstScreen\" vr-item>\n    <div class=\"pd1 alC\">\n      <button class=\"btn btn-lg btn-primary\" (click)=\"toggleAccountPane()\">Add Account</button>\n    </div>\n    <div class=\"pd1 alC\">\n      <button class=\"btn btn-lg btn-primary\" (click)=\"toggleStockPane()\">Add Stock</button>\n    </div>\n  </div>\n\n  <div class=\"aside-body flexy-child-1 row\" *ngIf=\"isAddAccountOpen\">\n    <ledger-aside-pane-account></ledger-aside-pane-account>\n  </div>\n  <div class=\"aside-body flexy-child-1 row\" *ngIf=\"isAddStockOpen\">\n    <inventory-add-stock [addStock]=\"true\" (closeAsideEvent)=\"closeAsidePane()\"></inventory-add-stock>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/ledger/components/ledgerAsidePane/ledgerAsidePane.component.ts":
/*!********************************************************************************!*\
  !*** ./src/app/ledger/components/ledgerAsidePane/ledgerAsidePane.component.ts ***!
  \********************************************************************************/
/*! exports provided: LedgerAsidePaneComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LedgerAsidePaneComponent", function() { return LedgerAsidePaneComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../actions/inventory/sidebar.actions */ "./src/app/actions/inventory/sidebar.actions.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");






var LedgerAsidePaneComponent = /** @class */ (function () {
    function LedgerAsidePaneComponent(store, _inventorySidebarAction) {
        this.store = store;
        this._inventorySidebarAction = _inventorySidebarAction;
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"](true);
        this.isAddStockOpen = false;
        this.isAddAccountOpen = false;
        this.hideFirstScreen = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__["ReplaySubject"](1);
        this.createStockSuccess$ = this.store.select(function (s) { return s.inventory.createStockSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.select(function (s) { return s.groupwithaccounts.createAccountIsSuccess; });
    }
    LedgerAsidePaneComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.store.dispatch(this._inventorySidebarAction.GetGroupsWithStocksHierarchyMin());
        // subscribe createStockSuccess for resting form
        this.createStockSuccess$.subscribe(function (s) {
            if (s) {
                _this.backButtonPressed();
            }
        });
        this.createAccountIsSuccess$.subscribe(function (s) {
            if (s) {
                _this.backButtonPressed();
            }
        });
    };
    LedgerAsidePaneComponent.prototype.toggleStockPane = function () {
        this.hideFirstScreen = true;
        this.isAddAccountOpen = false;
        this.isAddStockOpen = !this.isAddStockOpen;
    };
    LedgerAsidePaneComponent.prototype.toggleAccountPane = function () {
        this.hideFirstScreen = true;
        this.isAddStockOpen = false;
        this.isAddAccountOpen = !this.isAddAccountOpen;
    };
    LedgerAsidePaneComponent.prototype.backButtonPressed = function () {
        this.hideFirstScreen = false;
        this.isAddStockOpen = false;
        this.isAddAccountOpen = false;
    };
    LedgerAsidePaneComponent.prototype.closeAsidePane = function (e) {
        this.hideFirstScreen = false;
        this.isAddStockOpen = false;
        this.isAddAccountOpen = false;
        if (e) {
            //
        }
        else {
            this.closeAsideEvent.emit();
        }
    };
    LedgerAsidePaneComponent.prototype.ngOnDestroy = function () {
        // this.store.dispatch(this.inventoryAction.resetActiveStock());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], LedgerAsidePaneComponent.prototype, "closeAsideEvent", void 0);
    LedgerAsidePaneComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'ledger-aside-pane',
            template: __webpack_require__(/*! ./ledgerAsidePane.component.html */ "./src/app/ledger/components/ledgerAsidePane/ledgerAsidePane.component.html"),
            styles: ["\n    :host {\n      position: fixed;\n      left: auto;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      width: 100%;\n      max-width:580px;\n      z-index: 1045;\n    }\n\n    #close {\n      display: none;\n    }\n\n    :host.in #close {\n      display: block;\n      position: fixed;\n      left: -41px;\n      top: 0;\n      z-index: 5;\n      border: 0;\n      border-radius: 0;\n    }\n\n    :host .container-fluid {\n      padding-left: 0;\n      padding-right: 0;\n    }\n\n    :host .aside-pane {\n      width: 100%;\n      max-width:580px;\n      background: #fff;\n    }\n\n    .aside-pane {\n      width: 100%;\n    }\n\n    .flexy-child {\n      flex-grow: 1;\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n    }\n\n    .flexy-child-1 {\n      flex-grow: 1;\n    }\n\n    .vmiddle {\n      position: absolute;\n      top: 50%;\n      bottom: 0;\n      left: 0;\n      display: table;\n      width: 100%;\n      right: 0;\n      transform: translateY(-50%);\n      text-align: center;\n      margin: 0 auto;\n    }\n\n    #back {\n      display: none;\n    }\n\n    :host.in #back {\n      display: block;\n      position: fixed;\n      left: -44px;\n      top: 0;\n      z-index: 5;\n      border: 0;\n      border-radius: 0;\n    }\n\n    .btn-lg {\n      min-width: 130px;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"], _actions_inventory_sidebar_actions__WEBPACK_IMPORTED_MODULE_4__["SidebarAction"]])
    ], LedgerAsidePaneComponent);
    return LedgerAsidePaneComponent;
}());



/***/ }),

/***/ "./src/app/ledger/components/newLedgerEntryPanel/newLedgerEntryPanel.component.css":
/*!*****************************************************************************************!*\
  !*** ./src/app/ledger/components/newLedgerEntryPanel/newLedgerEntryPanel.component.css ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".primary_color {\n  color: #d35f29 !important;\n}\n.ledger-panel {\n  overflow: visible;\n}\n.ledger-panel table tbody tr td a {\n  color: #333;\n}\n.pItem {\n  padding: 0 4px;\n}\n.dropdown-menu-2 {\n  max-height: 190px;\n  overflow-y: scroll;\n}\n@media only screen and (max-width: 767px) {\n  .ledger-panel .btn {\n    margin-bottom: 13px;\n  }\n  .xs-d-block {\n    display: block;\n    float: none;\n    width: 100%;\n  }\n\n  .qty-unit {\n    width: 90%;\n  }\n  .table-plus {\n    width: 10%;\n    text-align: center;\n  }\n  .price {\n    width: 40%;\n  }\n  .equal-2, .table-minus {\n    width: 10%;\n    text-align: center;\n  }\n  .amount {\n    width: 40%;\n  }\n  .equal-2, .table-minus {\n    width: 10%;\n    text-align: center;\n  }\n  .total-amn {\n    width: 100%;\n  }\n  .total-detail-table > tbody > tr {\n    display: -webkit-box;\n    display: flex;\n    flex-wrap: wrap;\n  }\n  .qty-unit table tr td.text-right {\n    padding-right: 10px;\n  }\n  .xs-mb-1 {\n    margin-bottom: 1px;\n  }\n}"

/***/ }),

/***/ "./src/app/ledger/components/newLedgerEntryPanel/newLedgerEntryPanel.component.html":
/*!******************************************************************************************!*\
  !*** ./src/app/ledger/components/newLedgerEntryPanel/newLedgerEntryPanel.component.html ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"ledger-panel\" (click)=\"hideDiscountTax()\" #entryContent (keyup)=\"saveCtrlEnter($event)\">\n  <div class=\"wrapper\">\n    <div class=\"basic_detail mrB1\" *ngIf=\"showTaxationDiscountBox\">\n      <table class=\"width100 total-detail-table\">\n        <tbody class=\"\">\n          <tr *ngIf=\"currentTxn.selectedAccount\">\n            <td class=\"pItem qty-unit\" *ngIf=\"currentTxn.selectedAccount.stock\">\n              <table>\n                <tbody>\n                  <tr>\n                    <td class=\"text-right\" ng-class=\"{width55: ledgerCtrl.selectedTxn.panel.unit != undefined}\"\n                      style=\"width:100% !important;\">\n                      <label style=\" margin-right: 6px;\">Qty</label>\n                      <input type=\"text\" name=\"\" class=\"form-control text-right\"\n                        (change)=\"changeQuantity($event.target.value)\" [(ngModel)]=\"currentTxn.inventory.quantity\"\n                        decimalDigitsDirective [DecimalPlaces]=\"4\" />\n                    </td>\n                    <td *ngIf=\"currentTxn.unitRate\">\n                      <label>Unit</label>\n                      <select class=\"form-control\" style=\"width: 78px;\" (change)=\"unitChanged($event.target.value)\"\n                        [value]=\"currentTxn.inventory.unit.code\">\n                        <option *ngFor=\"let item of currentTxn.unitRate\" [value]=\"item.code\">{{item.stockUnitCode}}\n                        </option>\n                      </select>\n                    </td>\n                  </tr>\n                </tbody>\n              </table>\n            </td>\n            <td class=\"text-center table-plus\" *ngIf=\"currentTxn.selectedAccount.stock\">\n              <label class=\"d-block\">&nbsp;</label>\n              <label class=\"fs20\">x</label>\n            </td>\n            <td class=\"pItem text-right price\" *ngIf=\"currentTxn.selectedAccount.stock\">\n              <label>Price</label>\n              <input type=\"text\" [value]=\"currentTxn?.inventory?.unit?.rate\" decimalDigitsDirective [DecimalPlaces]=\"4\"\n                (keyup)=\"changePrice($event.target.value)\" name=\"\" class=\"form-control text-right\" />\n            </td>\n            <td class=\"text-center equal-2\" *ngIf=\"currentTxn.selectedAccount.stock\">\n              <label class=\"d-block\">&nbsp;</label>\n              <label class=\"fs20\">=</label>\n            </td>\n            <td class=\"pItem text-right amount\">\n              <label class=\"primary_clr\">Amount</label>\n              <input type=\"text\" decimalDigitsDirective name=\"\" [DecimalPlaces]=\"2\" class=\"form-control text-right\"\n                [(ngModel)]=\"currentTxn.amount\" (focus)=\"hideDiscountTax()\"\n                (keyup)=\"amountChanged();calculateTotal()\" />\n            </td>\n            <td class=\"text-center table-minus\" *ngIf=\"(discountAccountsList$ | async)?.length\">\n              <label class=\"d-block\">&nbsp;</label>\n              <label class=\"fs20\">-</label>\n            </td>\n            <!--discount-->\n            <td class=\"pItem text-right price\" (click)=\"$event.stopPropagation()\">\n              <ledger-discount #discount [discountAccountsDetails]=\"currentTxn.discounts\"\n                [ledgerAmount]=\"currentTxn.amount\" (hideOtherPopups)=\"hideTax()\"\n                (discountTotalUpdated)=\"currentTxn.discount = $event;calculateTotal();\">\n              </ledger-discount>\n            </td>\n            <td class=\"text-center equal-2\"\n              *ngIf=\"(companyTaxesList$ | async)?.length && (discountAccountsList$ | async)?.length\">\n              <label class=\"d-block\">&nbsp;</label>\n              <label class=\"fs20\">+</label>\n            </td>\n            <td *ngIf=\"(companyTaxesList$ | async)?.length\"\n              class=\"pItem amount pos-rel dropdown-container text-right dropdown-width\" (clickOutside)=\"hideTax()\"\n              (click)=\"$event.stopPropagation()\">\n              <!--tax control component-->\n              <!-- Login Changes by Sagar  -->\n              <!-- [applicableTaxes]=\"currentAccountApplicableTaxes.length ? currentAccountApplicableTaxes : currentTxn.selectedAccount?.applicableTaxes\" -->\n              <tax-control #tax [taxes]=\"companyTaxesList$ | async\" [date]=\"blankLedger?.entryDate\"\n                [taxRenderData]=\"currentTxn.taxesVm\" [totalForTax]=\"totalForTax\"\n                [exceptTaxTypes]=\"['tdsrc', 'tdspay','tcspay', 'tcsrc']\"\n                [applicableTaxes]=\"taxListForStock.length ? taxListForStock : currentTxn.selectedAccount?.applicableTaxes ? currentTxn.selectedAccount?.applicableTaxes : currentAccountApplicableTaxes.length ? currentAccountApplicableTaxes : []\"\n                (taxAmountSumEvent)=\"calculateTax()\" (hideOtherPopups)=\"hideDiscount()\"\n                (isApplicableTaxesEvent)=\"currentTxn.applyApplicableTaxes = $event\">\n              </tax-control>\n            </td>\n            <td class=\"text-center equal-2\">\n              <label class=\"d-block\">&nbsp;</label>\n              <label class=\"fs20\">=</label>\n            </td>\n\n            <td class=\"pItem text-right total-amn\" id=\"totalTd\" (resized)=\"onResized($event)\">\n              <label class=\"primary_clr\">Total</label>\n              <input type=\"text\" decimalDigitsDirective [DecimalPlaces]=\"2\" name=\"\" class=\"form-control text-right\"\n                [(ngModel)]=\"currentTxn.total\" (blur)=\"calculateAmount()\" />\n            </td>\n\n          </tr>\n        </tbody>\n      </table>\n    </div>\n\n    <div class=\"text-right mrB1\" style=\"display: flex;justify-content: flex-end;\"\n      *ngIf=\"currentTxn.selectedAccount && showTaxationDiscountBox\">\n      <input type=\"checkbox\" [(ngModel)]=\"blankLedger.isOtherTaxesApplicable\"\n        *ngIf=\"!blankLedger.isOtherTaxesApplicable\"\n        (ngModelChange)=\"toggleOtherTaxesAsidePane(blankLedger.isOtherTaxesApplicable)\" />\n      <p *ngIf=\"!blankLedger.isOtherTaxesApplicable\">Other Tax ?</p>\n\n      <div *ngIf=\"blankLedger.isOtherTaxesApplicable\" class=\"mrT1\"\n        style=\"margin-right:6px;display: flex;flex-direction: column\"\n        [ngStyle]=\"{ 'width': totalTdElementWidth + 'px'}\">\n        <label>Other Tax</label>\n        <span style=\"display: flex;align-items: center;\">\n          <span>\n            <a href=\"javascript: void 0\" (click)=\"toggleOtherTaxesAsidePane(true)\">\n              <img src=\"assets/images/edit-pencilicon.svg\">\n            </a>\n          </span>\n          <input class=\"text-right form-control mrL1\" disabled=\"disabled\" [(ngModel)]=\"blankLedger.otherTaxesSum\"\n            name=\"entry.otherTaxesSum\" />\n        </span>\n\n      </div>\n    </div>\n\n    <div class=\"pdB1 inWords\" *ngIf=\"currentTxn.total\">\n      {{ currentTxn.total | myNumberToWordsPipe | lowercase }}\n    </div>\n    <div class=\"clearfix\">\n      <textarea rows=\"3\" cols=\"\" name=\"des\" class=\"form-control\" placeholder=\"Description\"\n        [(ngModel)]=\"blankLedger.description\"></textarea>\n    </div>\n\n    <table class=\"width100 mrT\">\n      <tbody>\n        <tr>\n          <td class=\"primary_clr\" (click)=\"getInvoiveLists(); showAdvanced = !showAdvanced\">\n            <i class=\"fa cp\" [ngClass]=\"{'fa-minus-square-o':showAdvanced, 'fa-plus-square-o': !showAdvanced}\"></i>\n            <button class=\"no-btn pdL0\">&nbsp;More Details</button>\n          </td>\n          <td class=\"text-right\">\n            <span class=\"primary_clr\">Compound Total: {{ blankLedger.compoundTotal | giddhCurrency }}</span>\n            <!-- Total in USD: -->\n          </td>\n        </tr>\n      </tbody>\n    </table>\n\n    <div class=\"pd1 mrB mrT\" style=\"background: #fff;\" *ngIf=\"showAdvanced\">\n      <div class=\"\">\n        <div class=\"cheq pdT clearfix\">\n          <table>\n            <tr>\n              <td class=\"select2-parent pdR1\">\n                <div class=\"form-group\">\n                  <label class=\"default_clr\">Voucher Type</label>\n                  <sh-select #sh [options]=\"voucherTypeList | async\" [isFilterEnabled]=\"true\"\n                    (selected)=\"getInvoiveListsData($event)\" [notFoundLink]=\"true\" [placeholder]=\"'Select Vouchers'\"\n                    [(ngModel)]=\"blankLedger.voucherType\" [ItemHeight]=\"'auto'\" [style.width.px]=\"161\"></sh-select>\n                </div>\n              </td>\n              <!-- <td class=\"pdL1\">\n    <span>{{\"\"}}</span>\n</td> -->\n              <td class=\"pdR1\"\n                *ngIf=\"(blankLedger.voucherType === 'sal' || blankLedger.voucherType === 'pur' || blankLedger.voucherType == 'debit note' || blankLedger.voucherType == 'credit note' || blankLedger.voucherType == 'pay')\">\n                <label class=\"default_clr\">Invoice No.</label>\n                <input type=\"text\" placeholder=\"Invoice no.\" class=\"form-control\"\n                  [(ngModel)]=\"blankLedger.invoiceNumberAgainstVoucher\" />\n              </td>\n              <td class=\"pdR1\" *ngIf=\"blankLedger.voucherType == 'rcpt'\">\n                <div class=\"form-group\">\n                  <label class=\"default_clr\">Invoice No.</label>\n                  <div class=\"btn-group btn-block invoice-btn\" dropdown>\n                    <button dropdownToggle type=\"button\" class=\"form-control text-left btn-block dropdown-toggle\">\n                      Select Invoices <span class=\"select_drop pull-right mrT1\"><i class=\"fa fa-caret-down\"></i></span>\n                    </button>\n                    <ul class=\"dropdown-menu dropdown-menu-2 width100\" role=\"menu\">\n                      <li *ngIf=\"invoiceList.length==0\">No results found</li>\n                      <li *ngFor=\"let invoice of invoiceList\">\n\n                        <input type=\"checkbox\" (click)=\"selectInvoice(invoice, $event)\"\n                          [checked]=\"invoice.isSelected\" /> {{invoice.label}}\n                      </li>\n                    </ul>\n                  </div>\n                </div>\n\n\n                <!-- <sh-select [options]=\"invoiceList\" [placeholder]=\"'Select Invoice'\" [multiple]=\"false\" [ItemHeight]=\"33\"\n    [useInBuiltFilterForFlattenAc]=\"true\">\n    <ng-template #optionTemplate let-option=\"option\">\n            <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                <div class=\"item\">{{ option.label }}</div>\n            </a>\n    </ng-template>\n</sh-select> -->\n                <!--\n                <sh-select [options]=\"invoiceList\" [isFilterEnabled]=\"true\"\n                [placeholder]=\"'Select Invoice'\" [ItemHeight]=\"'auto'\"\n                [style.width.px]=\"161\"></sh-select> -->\n              </td>\n            </tr>\n          </table>\n\n          <table class=\"mrT1\">\n            <tbody>\n              <tr>\n                <td class=\"pdR1\">\n                  <label class=\"default_clr\">Cheque Number</label>\n                  <input type=\"text\" placeholder=\"XXXX2619\" class=\"form-control\"\n                    [(ngModel)]=\"blankLedger.chequeNumber\" />\n                </td>\n                <td>\n                  <label class=\"default_clr\">Cheque Clearance Date</label>\n                  <input type=\"text\" autocomplete=\"off\" class=\"form-control\" id=\"chequeClearanceDate\"\n                    [(ngModel)]=\"blankLedger.chequeClearanceDate\" bsDatepicker #chbs='bsDatepicker'\n                    [outsideClick]=\"true\"\n                    [bsConfig]=\"{ dateInputFormat: giddhDateFormat, containerClass: 'chkclrbsdp theme-green' }\" />\n                </td>\n              </tr>\n            </tbody>\n          </table>\n          <table class=\"mrT1\">\n            <tbody>\n              <tr>\n                <td class=\"\">\n                  <label class=\"default_clr\">Assign Tag</label>\n                  <sh-select style= \"margin-top:1px;\" [options]=\"tags$ | async\" [multiple]=\"true\" [isFilterEnabled]=\"true\"\n                    [placeholder]=\"'Select Tag'\" [(ngModel)]=\"blankLedger.tagNames\" [ItemHeight]=\"'auto'\"></sh-select>\n                </td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    </div>\n    <!--map bank transactions-->\n    <div class=\"row\">\n      <div class=\"col-xs-7 form-group pr\" *ngIf=\"isBankTransaction\">\n        <a href=\"javascript:void(0)\" (click)=\"getReconciledEntries()\">Map Transaction\n          <span *ngIf=\"showMatchingEntries\">with</span>\n        </a>\n        <ul class=\"list-unstyled map-txn-container\" *ngIf=\"showMatchingEntries\">\n          <li class=\"cp\" *ngFor=\"let entry of matchingEntriesData;\" (click)=\"confirmBankTransactionMap(entry)\">\n            <table class=\"table table-bordered mr0\">\n              <tbody>\n                <tr *ngFor=\"let txn of entry.transactions;\">\n                  <td>{{entry.entryDate}}</td>\n                  <td>{{txn.particular.name}}</td>\n                  <td>{{txn.amount | giddhCurrency}}</td>\n                  <td>{{entry.chequeNumber}}</td>\n                </tr>\n              </tbody>\n            </table>\n          </li>\n        </ul>\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <div class=\"col-xs-12 pdT1 form-inline text-right\"\n        *ngIf=\"companyIsMultiCurrency && currentTxn.selectedAccount && currentTxn.selectedAccount?.currency !== this.accountBaseCurrency\">\n        <input type=\"text\" class=\"form-control max100 text-right\" name=\"multicurrency\"\n          [(ngModel)]=\"currentTxn.convertedAmount\" [placeholder]=\"''\" decimalDigitsDirective [DecimalPlaces]=\"2\" />\n        <label>\n          ({{currentTxn.selectedAccount?.currency}})</label>\n      </div>\n\n      <div class=\"col-xs-12 clearfix mrT1\">\n        <div class=\"mrR1 form-group pull-left cp\">\n          <label class=\"pull-left cp fs16\">\n            <input class=\"pull-left\" type=\"checkbox\" name=\"generateInvoice\" [(ngModel)]=\"blankLedger.generateInvoice\">\n            Generate Invoice\n          </label>\n        </div>\n\n        <div class=\"pull-right\">\n          <div class=\"file_attached clearfix text-right\" *ngIf=\"blankLedger.attachedFile.length > 0\">\n            <div class=\"\">\n              <span>{{ blankLedger.attachedFileName }}</span>\n              <label class=\"remove cp primary_clr\" (click)=\"showDeleteAttachedFileModal()\">(remove)</label>\n            </div>\n          </div>\n\n          <div class=\"clearfix\">\n            <p class=\"primary_clr\" *ngIf=\"totalPrice\">Total in INR: <i class=\"icon-rupees font-12\"></i> 32564.97</p>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"clearfix\">\n        <div class=\"pull-left pl-15\" *ngIf=\"totalPrice\">\n          <ul class=\"list-inline font-14\">\n            <li>1 USD</li>\n            <li>\n              <a class=\"text-light\" href=\"javascript:void(0)\"><i class=\"icon-switch-icon font-16\"></i></a>\n            </li>\n            <li><input class=\"price-input\" value=\"71.9034\" type=\"text\"> INR</li>\n          </ul>\n        </div>\n\n        <label class=\"upload_div pr-15\" [ngClass]=\"{hide:blankLedger?.generateInvoice || blankLedger?.attachedFile}\">\n          <input type=\"file\" name=\"invoiceFile\" id=\"invoiceFile\" [options]=\"fileUploadOptions\" ngFileSelect\n            [uploadInput]=\"uploadInput\" (uploadOutput)=\"onUploadOutput($event)\">\n          <label for=\"invoiceFile\" class=\"cp fs16\">\n            <i class=\"glyphicon glyphicon-paperclip\"></i> Attach file</label>\n        </label>\n      </div>\n\n\n      <div class=\"col-xs-12 pdT1\">\n        <button [hidden]=\"isBankTransaction\" class=\"btn btn-danger pull-left btn-sm\" (click)=\"resetPanel()\">\n          Reset\n        </button>\n        <div class=\"pull-right xs-d-block\">\n          <button [hidden]=\"isBankTransaction\" class=\"btn btn-default btn-sm\" (click)=\"addToDrOrCr('DEBIT',$event)\">Add\n            to DR\n          </button>\n          <button [hidden]=\"isBankTransaction\" class=\"btn btn-default btn-sm\" (click)=\"addToDrOrCr('CREDIT',$event)\">Add\n            to CR\n          </button>\n          <button id=\"saveLedger\" class=\"btn btn-success btn-sm\" [disabled]=\"isFileUploading\"\n            [ladda]=\"isLedgerCreateInProcess$ | async\" (click)=\"saveLedger()\">Save\n          </button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<!--deleteAttachedFile  -->\n<div bsModal #deleteAttachedFileModal=\"bs-modal\" class=\"modal fade\" role=\"dialog\">\n  <div class=\"modal-dialog modal-lg\">\n    <div class=\"modal-content\">\n      <confirm-modal [title]=\"'Delete'\" [body]=\"'Are you sure you want to delete the attached file?'\"\n        (cancelCallBack)=\"hideDeleteAttachedFileModal()\" (successCallBack)=\"deleteAttachedFile()\">\n      </confirm-modal>\n    </div>\n  </div>\n</div>\n\n\n<!--confirm map transaction with bank transaction -->\n<div bsModal #confirmBankTxnMapModal=\"bs-modal\" class=\"modal fade\" role=\"dialog\">\n  <div class=\"modal-dialog modal-lg\">\n    <div class=\"modal-content\">\n      <confirm-modal [title]=\"'Map Bank Entry'\" [body]=\"mapBodyContent\" (cancelCallBack)=\"hideConfirmBankTxnMapModal()\"\n        (successCallBack)=\"mapBankTransaction()\">\n      </confirm-modal>\n    </div>\n  </div>\n</div>\n\n<!-- aside menu section -->\n<div class=\"aside-overlay\" *ngIf=\"asideMenuStateForOtherTaxes === 'in'\"></div>\n<!--<ng-template #otherTaxSidePane let-entry>-->\n<app-aside-menu-sales-other-taxes *ngIf=\"asideMenuStateForOtherTaxes === 'in'\" [class]=\"asideMenuStateForOtherTaxes\"\n  [otherTaxesModal]=\"blankLedger.otherTaxModal\" [@slideInOut]=\"asideMenuStateForOtherTaxes\" [taxes]=\"companyTaxesList\"\n  (closeModal)=\"toggleOtherTaxesAsidePane(true)\"\n  (applyTaxes)=\"calculateOtherTaxes($event);toggleOtherTaxesAsidePane(true);\">\n</app-aside-menu-sales-other-taxes>\n<!--</ng-template>-->\n"

/***/ }),

/***/ "./src/app/ledger/components/newLedgerEntryPanel/newLedgerEntryPanel.component.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/ledger/components/newLedgerEntryPanel/newLedgerEntryPanel.component.ts ***!
  \****************************************************************************************/
/*! exports provided: NewLedgerEntryPanelComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewLedgerEntryPanelComponent", function() { return NewLedgerEntryPanelComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../actions/ledger/ledger.actions */ "./src/app/actions/ledger/ledger.actions.ts");
/* harmony import */ var _ledger_vm__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../ledger.vm */ "./src/app/ledger/ledger.vm.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _services_apiurls_ledger_api__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../services/apiurls/ledger.api */ "./src/app/services/apiurls/ledger.api.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _ledgerDiscount_ledgerDiscount_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../ledgerDiscount/ledgerDiscount.component */ "./src/app/ledger/components/ledgerDiscount/ledgerDiscount.component.ts");
/* harmony import */ var _theme_tax_control_tax_control_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../theme/tax-control/tax-control.component */ "./src/app/theme/tax-control/tax-control.component.ts");
/* harmony import */ var _services_ledger_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../services/ledger.service */ "./src/app/services/ledger.service.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../theme/ng-virtual-select/sh-select.component */ "./src/app/theme/ng-virtual-select/sh-select.component.ts");
/* harmony import */ var _loader_loader_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../loader/loader.service */ "./src/app/loader/loader.service.ts");
/* harmony import */ var apps_web_giddh_src_app_app_constant__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! apps/web-giddh/src/app/app.constant */ "./src/app/app.constant.ts");
/* harmony import */ var _actions_settings_tag_settings_tag_actions__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../actions/settings/tag/settings.tag.actions */ "./src/app/actions/settings/tag/settings.tag.actions.ts");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var _models_interfaces_AdvanceSearchRequest__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../models/interfaces/AdvanceSearchRequest */ "./src/app/models/interfaces/AdvanceSearchRequest.ts");
/* harmony import */ var _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../actions/settings/profile/settings.profile.action */ "./src/app/actions/settings/profile/settings.profile.action.ts");
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../../models/api-models/Sales */ "./src/app/models/api-models/Sales.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../../../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");


























var NewLedgerEntryPanelComponent = /** @class */ (function () {
    function NewLedgerEntryPanelComponent(store, _ledgerService, _ledgerActions, _companyActions, cdRef, _toasty, _loaderService, _settingsTagActions, _settingsProfileActions) {
        this.store = store;
        this._ledgerService = _ledgerService;
        this._ledgerActions = _ledgerActions;
        this._companyActions = _companyActions;
        this.cdRef = cdRef;
        this._toasty = _toasty;
        this._loaderService = _loaderService;
        this._settingsTagActions = _settingsTagActions;
        this._settingsProfileActions = _settingsProfileActions;
        this.currentTxn = null;
        this.showTaxationDiscountBox = true;
        this.isBankTransaction = false;
        this.tcsOrTds = 'tcs';
        this.isAmountFirst = false;
        this.isTotalFirts = false;
        this.selectedInvoices = [];
        this.changeTransactionType = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.resetBlankLedger = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.saveBlankLedger = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.clickedOutsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.clickUnpaidInvoiceList = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.totalPrice = false;
        this.dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        this.isFileUploading = false;
        this.matchingEntriesData = [];
        this.showMatchingEntries = false;
        this.currentAccountApplicableTaxes = [];
        //variable added for storing the selected taxes after the tax component is destroyed for resolution of G0-295 by shehbaz
        this.currentAccountSavedApplicableTaxes = [];
        this.totalForTax = 0;
        this.taxListForStock = []; // New
        this.giddhDateFormat = _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_22__["GIDDH_DATE_FORMAT"];
        this.asideMenuStateForOtherTaxes = 'out';
        this.tdsTcsTaxTypes = ['tcsrc', 'tcspay'];
        this.companyTaxesList = [];
        this.totalTdElementWidth = 0;
        // private below
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.fetchedBaseCurrency = null;
        this.fetchedConvertToCurrency = null;
        this.fetchedConvertedRate = null;
        this.discountAccountsList$ = this.store.select(function (p) { return p.settings.discount.discountList; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.companyTaxesList$ = this.store.select(function (p) { return p.company.taxes; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.sessionKey$ = this.store.select(function (p) { return p.session.user.session.id; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.companyName$ = this.store.select(function (p) { return p.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.activeAccount$ = this.store.select(function (p) { return p.ledger.account; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isLedgerCreateInProcess$ = this.store.select(function (p) { return p.ledger.ledgerCreateInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.voucherTypeList = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])([{
                label: 'Sales',
                value: 'sal'
            }, {
                label: 'Purchases',
                value: 'pur'
            }, {
                label: 'Receipt',
                value: 'rcpt'
            }, {
                label: 'Payment',
                value: 'pay'
            }, {
                label: 'Journal',
                value: 'jr'
            }, {
                label: 'Contra',
                value: 'cntr'
            }, {
                label: 'Debit Note',
                value: 'debit note'
            }, {
                label: 'Credit Note',
                value: 'credit note'
            }]);
    }
    NewLedgerEntryPanelComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.showAdvanced = false;
        this.uploadInput = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.fileUploadOptions = { concurrency: 0 };
        this.activeAccount$.subscribe(function (acc) {
            //   console.log('activeAccount...');
            if (acc) {
                var parentAcc = acc.parentGroups[0].uniqueName;
                var incomeAccArray = ['revenuefromoperations', 'otherincome'];
                var expensesAccArray = ['operatingcost', 'indirectexpenses'];
                var assetsAccArray = ['assets'];
                var incomeAndExpensesAccArray = incomeAccArray.concat(expensesAccArray, assetsAccArray);
                if (incomeAndExpensesAccArray.indexOf(parentAcc) > -1) {
                    var appTaxes_1 = [];
                    acc.applicableTaxes.forEach(function (app) { return appTaxes_1.push(app.uniqueName); });
                    _this.currentAccountApplicableTaxes = appTaxes_1;
                }
                if (acc.currency) {
                    _this.accountBaseCurrency = acc.currency;
                }
                _this.store.select(function (p) { return p.settings.profile; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(_this.destroyed$)).subscribe(function (o) {
                    if (!_.isEmpty(o)) {
                        var companyProfile = _.cloneDeep(o);
                        if (companyProfile.isMultipleCurrency && !acc.currency) {
                            _this.accountBaseCurrency = companyProfile.baseCurrency || 'INR';
                        }
                        _this.companyCurrency = companyProfile.baseCurrency || 'INR';
                    }
                    else {
                        _this.store.dispatch(_this._settingsProfileActions.GetProfileInfo());
                    }
                });
            }
        });
        this.tags$ = this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_19__["createSelector"])([function (st) { return st.settings.tags; }], function (tags) {
            if (tags && tags.length) {
                _.map(tags, function (tag) {
                    tag.label = tag.name;
                    tag.value = tag.name;
                });
                return _.orderBy(tags, 'name');
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (s) { return s.settings.profile; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            if (s) {
                _this.companyIsMultiCurrency = s.isMultipleCurrency;
            }
            else {
                _this.companyIsMultiCurrency = false;
            }
        });
        // for tcs and tds identification
        if (this.tcsOrTds === 'tcs') {
            this.tdsTcsTaxTypes = ['tcspay', 'tcsrc'];
        }
        else {
            this.tdsTcsTaxTypes = ['tdspay', 'tdsrc'];
        }
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (s) { return s.company.taxes; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (res) {
            _this.companyTaxesList = res || [];
        });
    };
    NewLedgerEntryPanelComponent.prototype.clicked = function (e) {
        if (this.sh && !this.sh.ele.nativeElement.contains(e.path[3])) {
            this.sh.hide();
        }
    };
    NewLedgerEntryPanelComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this.currentTxn && this.currentTxn.selectedAccount) {
            if (this.currentTxn.selectedAccount.stock && this.currentTxn.selectedAccount.stock.stockTaxes && this.currentTxn.selectedAccount.stock.stockTaxes.length) {
                this.taxListForStock = this.currentTxn.selectedAccount.stock.stockTaxes;
            }
            else if (this.currentTxn.selectedAccount.parentGroups && this.currentTxn.selectedAccount.parentGroups.length) {
                var parentAcc = this.currentTxn.selectedAccount.parentGroups[0].uniqueName;
                var incomeAccArray = ['revenuefromoperations', 'otherincome'];
                var expensesAccArray = ['operatingcost', 'indirectexpenses'];
                var assetsAccArray = ['assets'];
                var incomeAndExpensesAccArray = incomeAccArray.concat(expensesAccArray, assetsAccArray);
                if (incomeAndExpensesAccArray.indexOf(parentAcc) > -1) {
                    var appTaxes_2 = [];
                    this.activeAccount$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (acc) {
                        if (acc && acc.applicableTaxes) {
                            acc.applicableTaxes.forEach(function (app) { return appTaxes_2.push(app.uniqueName); });
                            _this.taxListForStock = appTaxes_2;
                        }
                    });
                }
            }
            else {
                this.taxListForStock = [];
            }
            var companyTaxes_1 = [];
            this.companyTaxesList$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (taxes) { return companyTaxes_1 = taxes; });
            var appliedTaxes_1 = [];
            this.taxListForStock.forEach(function (tl) {
                var tax = companyTaxes_1.find(function (f) { return f.uniqueName === tl; });
                if (tax) {
                    switch (tax.taxType) {
                        case 'tcsrc':
                        case 'tcspay':
                        case 'tdsrc':
                        case 'tdspay':
                            _this.blankLedger.otherTaxModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
                            break;
                        default:
                            appliedTaxes_1.push(tax.uniqueName);
                    }
                }
            });
            this.taxListForStock = appliedTaxes_1;
            if (this.blankLedger.otherTaxModal.appliedOtherTax && this.blankLedger.otherTaxModal.appliedOtherTax.uniqueName) {
                this.blankLedger.isOtherTaxesApplicable = true;
            }
        }
        // if (changes['blankLedger'] && (changes['blankLedger'].currentValue ? changes['blankLedger'].currentValue.entryDate : '') !== (changes['blankLedger'].previousValue ? changes['blankLedger'].previousValue.entryDate : '')) {
        //   // this.amountChanged();
        //   if (moment(changes['blankLedger'].currentValue.entryDate, 'DD-MM-yyyy').isValid()) {
        //     this.taxControll.date = changes['blankLedger'].currentValue.entryDate;
        //   }
        // }
    };
    NewLedgerEntryPanelComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.needToReCalculate.subscribe(function (a) {
            if (a) {
                _this.amountChanged();
                _this.calculateTotal();
                _this.calculateCompoundTotal();
            }
        });
        this.cdRef.markForCheck();
    };
    NewLedgerEntryPanelComponent.prototype.onResized = function (event) {
        this.totalTdElementWidth = event.newWidth + 10;
    };
    NewLedgerEntryPanelComponent.prototype.ngAfterViewChecked = function () {
        // this.cdRef.markForCheck();
    };
    /**
     *
     * @param {string} type
     * @param {Event} e
     */
    NewLedgerEntryPanelComponent.prototype.addToDrOrCr = function (type, e) {
        this.changeTransactionType.emit(type);
        e.stopPropagation();
    };
    NewLedgerEntryPanelComponent.prototype.calculateTax = function () {
        var totalPercentage;
        totalPercentage = this.currentTxn.taxesVm.reduce(function (pv, cv) {
            return cv.isChecked ? pv + cv.amount : pv;
        }, 0);
        this.currentTxn.tax = ((totalPercentage * (Number(this.currentTxn.amount) - this.currentTxn.discount)) / 100);
        this.calculateTotal();
    };
    NewLedgerEntryPanelComponent.prototype.calculateTotal = function () {
        if (this.currentTxn && this.currentTxn.selectedAccount) {
            if (this.currentTxn.selectedAccount.stock && this.currentTxn.amount > 0) {
                if (this.currentTxn.inventory.unit.rate) {
                    // this.currentTxn.inventory.quantity = Number((this.currentTxn.amount / this.currentTxn.inventory.unit.rate).toFixed(2));
                }
            }
        }
        if (this.currentTxn && this.currentTxn.amount) {
            var total = (this.currentTxn.amount - this.currentTxn.discount) || 0;
            this.totalForTax = total;
            this.currentTxn.total = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_25__["giddhRoundOff"])((total + this.currentTxn.tax), 2);
        }
        this.calculateOtherTaxes(this.blankLedger.otherTaxModal);
        this.calculateCompoundTotal();
    };
    NewLedgerEntryPanelComponent.prototype.amountChanged = function () {
        if (this.discountControl) {
            this.discountControl.change();
        }
        if (this.currentTxn && this.currentTxn.selectedAccount) {
            if (this.currentTxn.selectedAccount.stock && this.currentTxn.amount > 0) {
                if (this.currentTxn.inventory.quantity) {
                    this.currentTxn.inventory.unit.rate = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_25__["giddhRoundOff"])((this.currentTxn.amount / this.currentTxn.inventory.quantity), 2);
                }
            }
        }
        if (this.isAmountFirst || this.isTotalFirts) {
            return;
        }
        else {
            this.isAmountFirst = true;
            // this.currentTxn.isInclusiveTax = false;
        }
    };
    NewLedgerEntryPanelComponent.prototype.changePrice = function (val) {
        this.currentTxn.inventory.unit.rate = Number(Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_14__["cloneDeep"])(val));
        this.currentTxn.amount = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_25__["giddhRoundOff"])((this.currentTxn.inventory.unit.rate * this.currentTxn.inventory.quantity), 2);
        // calculate discount
        if (this.discountControl) {
            this.discountControl.ledgerAmount = this.currentTxn.amount;
            this.discountControl.change();
        }
        this.calculateTotal();
        this.calculateCompoundTotal();
    };
    NewLedgerEntryPanelComponent.prototype.changeQuantity = function (val) {
        this.currentTxn.inventory.quantity = Number(val);
        this.currentTxn.amount = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_25__["giddhRoundOff"])((this.currentTxn.inventory.unit.rate * this.currentTxn.inventory.quantity), 2);
        // calculate discount
        if (this.discountControl) {
            this.discountControl.ledgerAmount = this.currentTxn.amount;
            this.discountControl.change();
        }
        this.calculateTotal();
        this.calculateCompoundTotal();
    };
    NewLedgerEntryPanelComponent.prototype.calculateAmount = function () {
        if (!(typeof this.currentTxn.total === 'string')) {
            return;
        }
        var fixDiscount = 0;
        var percentageDiscount = 0;
        if (this.discountControl) {
            percentageDiscount = this.discountControl.discountAccountsDetails.filter(function (f) { return f.isActive; })
                .filter(function (s) { return s.discountType === 'PERCENTAGE'; })
                .reduce(function (pv, cv) {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;
            fixDiscount = this.discountControl.discountAccountsDetails.filter(function (f) { return f.isActive; })
                .filter(function (s) { return s.discountType === 'FIX_AMOUNT'; })
                .reduce(function (pv, cv) {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;
        }
        var taxTotal = 0;
        if (this.taxControll) {
            taxTotal = this.taxControll.taxRenderData.filter(function (f) { return f.isChecked; })
                .reduce(function (pv, cv) {
                return Number(pv) + Number(cv.amount);
            }, 0) || 0;
        }
        // A = (P+X+ 0.01XT) /(1-0.01Y + 0.01T -0.0001YT)
        // p = total
        // a = amount
        // x= fixed discount
        // y = percentage discount
        // t = percentage taz
        //   P = A - D + (A- D )*T/100;
        // D = X + A*Y/100;
        // Y = A*Y/100
        // P = A  - (X + A*Y/100) +  (A - (X + A*Y/100))* T/100
        //
        // P = A  - (X + A*Y/100) + T;
        // A - X - A*Y/100 + T  = P
        // A - AY/100 = P +X -T
        // A*(100- Y)/100 = P + X - T
        // A  = (P + X - T)*100/ (100- Y)
        // this.currentTxn.amount = giddhRoundOff((Number(this.currentTxn.total)+ fixDiscount - Number(this.currentTxn.tax)) * 100 / (100 - percentageDiscount),2)
        this.currentTxn.amount = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_25__["giddhRoundOff"])(((Number(this.currentTxn.total) + fixDiscount + 0.01 * fixDiscount * Number(taxTotal)) /
            (1 - 0.01 * percentageDiscount + 0.01 * Number(taxTotal) - 0.0001 * percentageDiscount * Number(taxTotal))), 2);
        if (this.discountControl) {
            this.discountControl.ledgerAmount = this.currentTxn.amount;
            this.discountControl.change();
        }
        if (this.taxControll) {
            this.taxControll.taxTotalAmount = this.currentTxn.amount;
            this.taxControll.change();
        }
        if (this.currentTxn.selectedAccount) {
            if (this.currentTxn.selectedAccount.stock) {
                this.currentTxn.inventory.unit.rate = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_25__["giddhRoundOff"])((this.currentTxn.amount / this.currentTxn.inventory.quantity), 2);
            }
        }
        this.calculateCompoundTotal();
        if (this.isTotalFirts || this.isAmountFirst) {
            return;
        }
        else {
            this.isTotalFirts = true;
            this.currentTxn.isInclusiveTax = true;
        }
    };
    NewLedgerEntryPanelComponent.prototype.calculateCompoundTotal = function () {
        // let debitTotal = Number(sumBy(this.blankLedger.transactions.filter(t => t.type === 'DEBIT'), 'total')) || 0;
        var debitTotal = Number(Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_14__["sumBy"])(this.blankLedger.transactions.filter(function (t) { return t.type === 'DEBIT'; }), function (trxn) { return Number(trxn.total); })) || 0;
        // let creditTotal = Number(sumBy(this.blankLedger.transactions.filter(t => t.type === 'CREDIT'), 'total')) || 0;
        var creditTotal = Number(Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_14__["sumBy"])(this.blankLedger.transactions.filter(function (t) { return t.type === 'CREDIT'; }), function (trxn) { return Number(trxn.total); })) || 0;
        if (debitTotal > creditTotal) {
            this.blankLedger.compoundTotal = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_25__["giddhRoundOff"])((debitTotal - creditTotal), 2);
        }
        else {
            this.blankLedger.compoundTotal = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_25__["giddhRoundOff"])((creditTotal - debitTotal), 2);
        }
        if (this.currentTxn && this.currentTxn.selectedAccount) {
            this.calculateConversionRate();
        }
    };
    NewLedgerEntryPanelComponent.prototype.saveLedger = function () {
        this.saveBlankLedger.emit(true);
    };
    /**
     * reset panel form
     */
    NewLedgerEntryPanelComponent.prototype.resetPanel = function () {
        this.resetBlankLedger.emit(true);
        this.currentTxn = null;
    };
    NewLedgerEntryPanelComponent.prototype.onUploadOutput = function (output) {
        if (output.type === 'allAddedToQueue') {
            var sessionKey_1 = null;
            var companyUniqueName_1 = null;
            this.sessionKey$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (a) { return sessionKey_1 = a; });
            this.companyName$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (a) { return companyUniqueName_1 = a; });
            var event_1 = {
                type: 'uploadAll',
                url: apps_web_giddh_src_app_app_constant__WEBPACK_IMPORTED_MODULE_17__["Configuration"].ApiUrl + _services_apiurls_ledger_api__WEBPACK_IMPORTED_MODULE_8__["LEDGER_API"].UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName_1),
                method: 'POST',
                fieldName: 'file',
                data: { company: companyUniqueName_1 },
                headers: { 'Session-Id': sessionKey_1 },
            };
            this.uploadInput.emit(event_1);
        }
        else if (output.type === 'start') {
            this.isFileUploading = true;
            this._loaderService.show();
        }
        else if (output.type === 'done') {
            this._loaderService.hide();
            if (output.file.response.status === 'success') {
                this.isFileUploading = false;
                this.blankLedger.attachedFile = output.file.response.body.uniqueName;
                this.blankLedger.attachedFileName = output.file.response.body.name;
                this._toasty.successToast('file uploaded successfully');
            }
            else {
                this.isFileUploading = false;
                this.blankLedger.attachedFile = '';
                this.blankLedger.attachedFileName = '';
                this._toasty.errorToast(output.file.response.message);
            }
        }
    };
    NewLedgerEntryPanelComponent.prototype.showDeleteAttachedFileModal = function () {
        this.deleteAttachedFileModal.show();
    };
    NewLedgerEntryPanelComponent.prototype.hideDeleteAttachedFileModal = function () {
        this.deleteAttachedFileModal.hide();
    };
    NewLedgerEntryPanelComponent.prototype.unitChanged = function (stockUnitCode) {
        var unit = this.currentTxn.selectedAccount.stock.accountStockDetails.unitRates.find(function (p) { return p.stockUnitCode === stockUnitCode; });
        this.currentTxn.inventory.unit = { code: unit.stockUnitCode, rate: unit.rate, stockUnitCode: unit.stockUnitCode };
        if (this.currentTxn.inventory.unit) {
            this.changePrice(this.currentTxn.inventory.unit.rate.toString());
        }
    };
    NewLedgerEntryPanelComponent.prototype.deleteAttachedFile = function () {
        this.blankLedger.attachedFile = '';
        this.blankLedger.attachedFileName = '';
        this.hideDeleteAttachedFileModal();
    };
    NewLedgerEntryPanelComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    NewLedgerEntryPanelComponent.prototype.getReconciledEntries = function () {
        var _this = this;
        this.matchingEntriesData = [];
        var o = {};
        o.chequeNumber = (this.blankLedger.chequeNumber) ? this.blankLedger.chequeNumber : '';
        o.accountUniqueName = this.trxRequest.accountUniqueName;
        o.from = this.trxRequest.from;
        o.to = this.trxRequest.to;
        this._ledgerService.GetReconcile(o.accountUniqueName, o.from, o.to, o.chequeNumber).subscribe(function (res) {
            var data = res;
            if (data.status === 'success') {
                if (data.body.length) {
                    Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_14__["forEach"])(data.body, function (entry) {
                        Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_14__["forEach"])(entry.transactions, function (txn) {
                            if (txn.amount === _this.currentTxn.amount) {
                                _this.matchingEntriesData.push(entry);
                            }
                        });
                    });
                    if (_this.matchingEntriesData.length === 1) {
                        _this.confirmBankTransactionMap(_this.matchingEntriesData[0]);
                    }
                    else if (_this.matchingEntriesData.length > 1) {
                        _this.showMatchingEntries = true;
                    }
                    else {
                        _this.showErrMsgOnUI();
                    }
                }
                else {
                    _this.showErrMsgOnUI();
                }
            }
            else {
                _this._toasty.errorToast(data.message, data.code);
            }
        });
    };
    NewLedgerEntryPanelComponent.prototype.showErrMsgOnUI = function () {
        this._toasty.warningToast('no entry with matching amount found, please create a new entry with same amount as this transaction.');
    };
    NewLedgerEntryPanelComponent.prototype.confirmBankTransactionMap = function (item) {
        this.selectedItemToMap = item;
        this.mapBodyContent = "Selected bank transaction will be mapped with cheque number " + item.chequeNumber + " Click yes to accept.";
        this.confirmBankTxnMapModal.show();
    };
    NewLedgerEntryPanelComponent.prototype.hideConfirmBankTxnMapModal = function () {
        this.confirmBankTxnMapModal.hide();
    };
    NewLedgerEntryPanelComponent.prototype.mapBankTransaction = function () {
        var _this = this;
        if (this.blankLedger.transactionId && this.selectedItemToMap.uniqueName) {
            var model = {
                uniqueName: this.selectedItemToMap.uniqueName
            };
            var unqObj = {
                accountUniqueName: this.trxRequest.accountUniqueName,
                transactionId: this.blankLedger.transactionId
            };
            this._ledgerService.MapBankTransactions(model, unqObj).subscribe(function (res) {
                if (res.status === 'success') {
                    if (typeof (res.body) === 'string') {
                        _this._toasty.successToast(res.body);
                    }
                    else {
                        _this._toasty.successToast('Entry Mapped Successfully!');
                    }
                    _this.hideConfirmBankTxnMapModal();
                    _this.clickedOutsideEvent.emit(false);
                }
                else {
                    _this._toasty.errorToast(res.message, res.code);
                }
            });
        }
        else {
            // err
        }
    };
    NewLedgerEntryPanelComponent.prototype.hideDiscountTax = function () {
        if (this.discountControl) {
            this.discountControl.discountMenu = false;
        }
        if (this.taxControll) {
            this.taxControll.showTaxPopup = false;
        }
    };
    NewLedgerEntryPanelComponent.prototype.hideDiscount = function () {
        if (this.discountControl) {
            this.discountControl.change();
            this.discountControl.discountMenu = false;
        }
    };
    NewLedgerEntryPanelComponent.prototype.hideTax = function () {
        if (this.taxControll) {
            this.taxControll.change();
            this.taxControll.showTaxPopup = false;
        }
    };
    NewLedgerEntryPanelComponent.prototype.detactChanges = function () {
        this.cdRef.detectChanges();
    };
    NewLedgerEntryPanelComponent.prototype.saveCtrlEnter = function (event) {
        if (event.ctrlKey && event.keyCode === 13) {
            this.saveLedger();
        }
        else {
            return;
        }
    };
    NewLedgerEntryPanelComponent.prototype.clickedOutsideOfComponent = function (e) {
        var classList = e.path.map(function (m) {
            return m.classList;
        });
        if (classList && classList instanceof Array) {
            var notClose = classList.some(function (cls) {
                if (!cls) {
                    return;
                }
                return cls.contains('chkclrbsdp');
            });
            if (notClose) {
                return;
            }
        }
        if (!e.relatedTarget || !this.entryContent.nativeElement.contains(e.relatedTarget)) {
            this.clickedOutsideEvent.emit(e);
        }
    };
    NewLedgerEntryPanelComponent.prototype.assignConversionRate = function (baseCurr, convertTo, amount) {
        var _this = this;
        if (baseCurr && convertTo) {
            // obj.convertedAmount = 0;
            this.currentTxn.selectedAccount.conversionRate = 0;
            if (this.currentTxn.selectedAccount.conversionRate) {
                this.currentTxn.convertedAmount = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_25__["giddhRoundOff"])((amount * this.currentTxn.selectedAccount.conversionRate), 2);
                this.detactChanges();
                return;
            }
            else {
                this.fetchedBaseCurrency = baseCurr;
                this.fetchedConvertToCurrency = convertTo;
                // this._ledgerService.GetCurrencyRate(baseCurr, convertTo).subscribe((res: any) => {
                // Note: Sagar told me to interchange baseCurr and convertTo #1128
                this._ledgerService.GetCurrencyRate(convertTo, baseCurr).subscribe(function (res) {
                    var rate = res.body;
                    if (rate) {
                        _this.currentTxn.selectedAccount.conversionRate = rate;
                        _this.currentTxn.convertedAmount = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_25__["giddhRoundOff"])((amount * rate), 2);
                        _this.fetchedConvertedRate = rate;
                        _this.detactChanges();
                        return;
                    }
                });
            }
        }
    };
    /**
     * calculateConversionRate
     */
    NewLedgerEntryPanelComponent.prototype.calculateConversionRate = function () {
        this.currentTxn.convertedAmount = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_25__["giddhRoundOff"])((this.currentTxn.total * this.currentTxn.selectedAccount.conversionRate), 2);
    };
    /**
     * checkForCurrency
     */
    NewLedgerEntryPanelComponent.prototype.checkForCurrency = function (currency) {
        if (!currency && this.companyCurrency) {
            return this.companyCurrency;
        }
        else {
            return currency;
        }
    };
    NewLedgerEntryPanelComponent.prototype.checkForMulitCurrency = function () {
        this.currentTxn.selectedAccount.currency = this.checkForCurrency(this.currentTxn.selectedAccount.currency);
        if ((this.accountBaseCurrency !== this.currentTxn.selectedAccount.currency)) {
            this.assignConversionRate(this.accountBaseCurrency, this.currentTxn.selectedAccount.currency, this.currentTxn.total);
        }
        else {
            this.currentTxn.convertedAmount = 0;
        }
    };
    NewLedgerEntryPanelComponent.prototype.selectInvoice = function (invoiceNo, ev) {
        invoiceNo.isSelected = ev.target.checked;
        if (ev.target.checked) {
            this.blankLedger.invoicesToBePaid.push(invoiceNo.label);
        }
        else {
            var indx = this.blankLedger.invoicesToBePaid.indexOf(invoiceNo.label);
            this.blankLedger.invoicesToBePaid.splice(indx, 1);
        }
        // this.selectedInvoice.emit(this.selectedInvoices);
    };
    NewLedgerEntryPanelComponent.prototype.getInvoiveListsData = function (e) {
        if (e.value === 'rcpt') {
            this.clickUnpaidInvoiceList.emit(true);
        }
    };
    NewLedgerEntryPanelComponent.prototype.getInvoiveLists = function () {
        if (this.blankLedger.voucherType === 'rcpt') {
            this.clickUnpaidInvoiceList.emit(true);
        }
    };
    NewLedgerEntryPanelComponent.prototype.onScrollEvent = function () {
        if (this.datepickers) {
            this.datepickers.hide();
        }
    };
    NewLedgerEntryPanelComponent.prototype.toggleBodyClass = function () {
        if (this.asideMenuStateForOtherTaxes === 'in') {
            document.querySelector('body').classList.add('fixed');
        }
        else {
            document.querySelector('body').classList.remove('fixed');
        }
    };
    NewLedgerEntryPanelComponent.prototype.toggleOtherTaxesAsidePane = function (modalBool) {
        if (!modalBool) {
            this.blankLedger.otherTaxModal = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_24__["SalesOtherTaxesModal"]();
            this.blankLedger.otherTaxesSum = 0;
            this.blankLedger.tdsTcsTaxesSum = 0;
            this.blankLedger.otherTaxModal.itemLabel = '';
            return;
        }
        this.blankLedger.otherTaxModal.itemLabel = this.currentTxn && this.currentTxn.selectedAccount ?
            this.currentTxn.selectedAccount.stock ? this.currentTxn.selectedAccount.name + "(" + this.currentTxn.selectedAccount.stock.name + ")" :
                this.currentTxn.selectedAccount.name : '';
        this.asideMenuStateForOtherTaxes = this.asideMenuStateForOtherTaxes === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    NewLedgerEntryPanelComponent.prototype.calculateOtherTaxes = function (modal, index) {
        if (index === void 0) { index = null; }
        var transaction = this.blankLedger.transactions[index];
        if (index !== null) {
            transaction = this.blankLedger.transactions[index];
        }
        else {
            transaction = this.currentTxn;
        }
        var taxableValue = 0;
        var companyTaxes = [];
        var totalTaxes = 0;
        this.companyTaxesList$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (taxes) { return companyTaxes = taxes; });
        if (!transaction) {
            return;
        }
        if (modal.appliedOtherTax && modal.appliedOtherTax.uniqueName) {
            if (modal.tcsCalculationMethod === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_24__["SalesOtherTaxesCalculationMethodEnum"].OnTaxableAmount) {
                taxableValue = Number(transaction.amount) - transaction.discount;
            }
            else if (modal.tcsCalculationMethod === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_24__["SalesOtherTaxesCalculationMethodEnum"].OnTotalAmount) {
                var rawAmount = Number(transaction.amount) - transaction.discount;
                taxableValue = (rawAmount + ((rawAmount * transaction.tax) / 100));
            }
            var tax = companyTaxes.find(function (ct) { return ct.uniqueName === modal.appliedOtherTax.uniqueName; });
            this.blankLedger.otherTaxType = ['tcsrc', 'tcspay'].includes(tax.taxType) ? 'tcs' : 'tds';
            if (tax) {
                totalTaxes += tax.taxDetail[0].taxValue;
            }
            this.blankLedger.tdsTcsTaxesSum = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_25__["giddhRoundOff"])(((taxableValue * totalTaxes) / 100), 2);
        }
        this.blankLedger.otherTaxModal = modal;
        this.blankLedger.tcsCalculationMethod = modal.tcsCalculationMethod;
        this.blankLedger.otherTaxesSum = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_25__["giddhRoundOff"])((this.blankLedger.tdsTcsTaxesSum), 2);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _ledger_vm__WEBPACK_IMPORTED_MODULE_6__["BlankLedgerVM"])
    ], NewLedgerEntryPanelComponent.prototype, "blankLedger", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _ledger_vm__WEBPACK_IMPORTED_MODULE_6__["TransactionVM"])
    ], NewLedgerEntryPanelComponent.prototype, "currentTxn", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"])
    ], NewLedgerEntryPanelComponent.prototype, "needToReCalculate", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], NewLedgerEntryPanelComponent.prototype, "showTaxationDiscountBox", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], NewLedgerEntryPanelComponent.prototype, "isBankTransaction", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _models_interfaces_AdvanceSearchRequest__WEBPACK_IMPORTED_MODULE_20__["AdvanceSearchRequest"])
    ], NewLedgerEntryPanelComponent.prototype, "trxRequest", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], NewLedgerEntryPanelComponent.prototype, "invoiceList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], NewLedgerEntryPanelComponent.prototype, "tcsOrTds", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], NewLedgerEntryPanelComponent.prototype, "changeTransactionType", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], NewLedgerEntryPanelComponent.prototype, "resetBlankLedger", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], NewLedgerEntryPanelComponent.prototype, "saveBlankLedger", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], NewLedgerEntryPanelComponent.prototype, "clickedOutsideEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], NewLedgerEntryPanelComponent.prototype, "clickUnpaidInvoiceList", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('entryContent'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ElementRef"])
    ], NewLedgerEntryPanelComponent.prototype, "entryContent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('sh'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_15__["ShSelectComponent"])
    ], NewLedgerEntryPanelComponent.prototype, "sh", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])(ngx_bootstrap__WEBPACK_IMPORTED_MODULE_10__["BsDatepickerDirective"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_10__["BsDatepickerDirective"])
    ], NewLedgerEntryPanelComponent.prototype, "datepickers", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('deleteAttachedFileModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_10__["ModalDirective"])
    ], NewLedgerEntryPanelComponent.prototype, "deleteAttachedFileModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('discount'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _ledgerDiscount_ledgerDiscount_component__WEBPACK_IMPORTED_MODULE_11__["LedgerDiscountComponent"])
    ], NewLedgerEntryPanelComponent.prototype, "discountControl", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('tax'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_tax_control_tax_control_component__WEBPACK_IMPORTED_MODULE_12__["TaxControlComponent"])
    ], NewLedgerEntryPanelComponent.prototype, "taxControll", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('confirmBankTxnMapModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_10__["ModalDirective"])
    ], NewLedgerEntryPanelComponent.prototype, "confirmBankTxnMapModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["HostListener"])('click', ['$event']),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Object]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], NewLedgerEntryPanelComponent.prototype, "clicked", null);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["HostListener"])('window:click', ['$event']),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Object]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], NewLedgerEntryPanelComponent.prototype, "clickedOutsideOfComponent", null);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["HostListener"])('window:scroll'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", []),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], NewLedgerEntryPanelComponent.prototype, "onScrollEvent", null);
    NewLedgerEntryPanelComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'new-ledger-entry-panel',
            template: __webpack_require__(/*! ./newLedgerEntryPanel.component.html */ "./src/app/ledger/components/newLedgerEntryPanel/newLedgerEntryPanel.component.html"),
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_3__["ChangeDetectionStrategy"].OnPush,
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["style"])({
                        transform: 'translate3d(0, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["style"])({
                        transform: 'translate3d(100%, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["animate"])('400ms ease-in-out'))
                ]),
            ],
            styles: [__webpack_require__(/*! ./newLedgerEntryPanel.component.css */ "./src/app/ledger/components/newLedgerEntryPanel/newLedgerEntryPanel.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _services_ledger_service__WEBPACK_IMPORTED_MODULE_13__["LedgerService"],
            _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_5__["LedgerActions"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_7__["CompanyActions"],
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ChangeDetectorRef"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_9__["ToasterService"],
            _loader_loader_service__WEBPACK_IMPORTED_MODULE_16__["LoaderService"],
            _actions_settings_tag_settings_tag_actions__WEBPACK_IMPORTED_MODULE_18__["SettingsTagActions"],
            _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_21__["SettingsProfileActions"]])
    ], NewLedgerEntryPanelComponent);
    return NewLedgerEntryPanelComponent;
}());



/***/ }),

/***/ "./src/app/ledger/components/shareLedger/shareLedger.component.html":
/*!**************************************************************************!*\
  !*** ./src/app/ledger/components/shareLedger/shareLedger.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"shareModal\">\n  <div id=\"share-modal\" class=\"\" ng-if=\"ledgerCtrl.toggleShare\">\n    <div class=\"modal-header\">\n      <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"closeShareLedgerModal.emit()\"\n            aria-label=\"Close\">×</span>\n      <h3>Share Ledger</h3>\n    </div>\n\n    <div class=\"modal-body mrB4\" id=\"SharePop\">\n      <div class=\"row\">\n        <div class=\"col-md-10\">\n\n      <div class=\"modal_wrap\">\n        <!-- <h3 class=\"pdB1\">Share with</h3> -->\n        <div class=\"form-group add-mailer\">\n          <label>Share with</label>\n          <!--share account from-->\n          <form name=\"shareGroupForm\" #shareAccountForm=\"ngForm\" novalidate=\"\" autocomplete=\"off\">\n            <div class=\"input-group\">\n              <input name=\"userEmail\" class=\"form-control\" type=\"email\" [(ngModel)]=\"email\" required placeholder=\"Email ID\"\n                     class=\"form-control\" pattern=\"[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$\">\n                <span class=\"input-group-btn\">\n                <button class=\"btn btn-success btn-md\" type=\"submit\" [disabled]=\"shareAccountForm.invalid\"\n                        (click)=\"shareAccount()\">Share\n                </button>\n              </span>\n              <!-- /btn-account -->\n            </div>\n          </form>\n          <!--shared with array-->\n          <div class=\"col-xs-8 mrB2\" *ngIf=\"activeAccountSharedWith?.length > 0\">\n            <div class=\"row\">\n              <ul class=\"shared_list\">\n                <li *ngFor=\"let val of activeAccountSharedWith\" class=\"clearfix\">\n                                    <span class=\"pull-left\">\n                            <small class=\"Useremail\">{{ val.emailId }}</small>\n                            </span>\n                  <span class=\"form-inline\">\n                            <span class=\"delIcon pull-right\">\n                            <i (click)=\"unShareAccount(val.uniqueName, val.emailId)\" class=\"fa fa-times\"\n                               aria-hidden=\"true\"></i>\n                            </span>\n                                    </span>\n                </li>\n              </ul>\n            </div>\n          </div>\n        </div>\n      </div>\n      <!-- <h3 class=\"pdB2 clearfix\"></h3> -->\n      <div class=\"modal_wrap clearfix\">\n        <div class=\"clearfix\">\n          <span>Or</span>\n          <button class=\"btn-link\" (click)=\"getMagicLink()\">Get shareable link</button>\n          <!-- <span class=\"l8grey\">Get shareable link</span> -->\n          <span class=\"success\" *ngIf=\"isCopied\">Copied..</span>\n        </div>\n        <div class=\"input-group\">\n          <input #magicLinkInput class=\"form-control dashed\" [readonly]=\"true\" type=\"text\" [(ngModel)]=\"magicLink\"/>\n          <span class=\"input-group-btn\">\n            <button class=\"btn btn-success\" (click)=\"toggleIsCopied()\" [ngxClipboard]=\"magicLinkInput\">Copy</button>\n          </span                                                                       >\n          <!-- /btn-group -->\n        </div>\n        <!-- /input-group -->\n        <small class=\"mrT1 l8grey\">Anyone can see the ledger who gets this URL.</small>\n      </div>\n\n    </div>\n  </div>\n\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/ledger/components/shareLedger/shareLedger.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/ledger/components/shareLedger/shareLedger.component.ts ***!
  \************************************************************************/
/*! exports provided: ShareLedgerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ShareLedgerComponent", function() { return ShareLedgerComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../actions/accounts.actions */ "./src/app/actions/accounts.actions.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_ledger_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../services/ledger.service */ "./src/app/services/ledger.service.ts");
/* harmony import */ var _models_api_models_Ledger__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../models/api-models/Ledger */ "./src/app/models/api-models/Ledger.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../actions/ledger/ledger.actions */ "./src/app/actions/ledger/ledger.actions.ts");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");












var ShareLedgerComponent = /** @class */ (function () {
    function ShareLedgerComponent(_ledgerService, _accountService, store, _ledgerActions, accountActions) {
        this._ledgerService = _ledgerService;
        this._accountService = _accountService;
        this.store = store;
        this._ledgerActions = _ledgerActions;
        this.accountActions = accountActions;
        this.accountUniqueName = '';
        this.closeShareLedgerModal = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.magicLink = '';
        this.isCopied = false;
        this.activeAccountSharedWith = [];
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_7__["ReplaySubject"](1);
        this.universalDate$ = this.store.select(function (p) { return p.session.applicationDate; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_11__["takeUntil"])(this.destroyed$));
    }
    ShareLedgerComponent.prototype.ngOnInit = function () {
        //
    };
    ShareLedgerComponent.prototype.checkAccountSharedWith = function () {
        var _this = this;
        this.store.dispatch(this._ledgerActions.sharedAccountWith(this.accountUniqueName));
        this.store.select(function (state) { return state.ledger.activeAccountSharedWith; }).subscribe(function (data) {
            _this.activeAccountSharedWith = _.cloneDeep(data);
        });
    };
    ShareLedgerComponent.prototype.getMagicLink = function () {
        var _this = this;
        var magicLinkRequest = new _models_api_models_Ledger__WEBPACK_IMPORTED_MODULE_5__["MagicLinkRequest"]();
        var data = _.cloneDeep(this.advanceSearchRequest);
        if (!data.dataToSend.bsRangeValue) {
            this.universalDate$.subscribe(function (a) {
                if (a) {
                    data.dataToSend.bsRangeValue = [moment_moment__WEBPACK_IMPORTED_MODULE_10__(a[0], 'DD-MM-YYYY').toDate(), moment_moment__WEBPACK_IMPORTED_MODULE_10__(a[1], 'DD-MM-YYYY').toDate()];
                }
            });
        }
        magicLinkRequest.from = moment_moment__WEBPACK_IMPORTED_MODULE_10__(data.dataToSend.bsRangeValue[0]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]) ? moment_moment__WEBPACK_IMPORTED_MODULE_10__(data.dataToSend.bsRangeValue[0]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]) : moment_moment__WEBPACK_IMPORTED_MODULE_10__().add(-1, 'month').format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]);
        magicLinkRequest.to = moment_moment__WEBPACK_IMPORTED_MODULE_10__(data.dataToSend.bsRangeValue[1]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]) ? moment_moment__WEBPACK_IMPORTED_MODULE_10__(data.dataToSend.bsRangeValue[1]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]) : moment_moment__WEBPACK_IMPORTED_MODULE_10__().format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_1__["GIDDH_DATE_FORMAT"]);
        this._ledgerService.GenerateMagicLink(magicLinkRequest, this.accountUniqueName).subscribe(function (resp) {
            if (resp.status === 'success') {
                _this.magicLink = resp.body.magicLink;
            }
            else {
                _this.magicLink = '';
                console.log(resp);
            }
        });
    };
    ShareLedgerComponent.prototype.toggleIsCopied = function () {
        var _this = this;
        this.isCopied = true;
        setTimeout(function () {
            _this.isCopied = false;
        }, 3000);
    };
    ShareLedgerComponent.prototype.shareAccount = function () {
        var _this = this;
        var userRole = {
            emailId: this.email,
            entity: 'account',
            entityUniqueName: this.accountUniqueName,
        };
        var selectedPermission = 'view';
        this.store.dispatch(this.accountActions.shareEntity(userRole, selectedPermission.toLowerCase()));
        this.email = '';
        setTimeout(function () {
            _this.store.dispatch(_this._ledgerActions.sharedAccountWith(_this.accountUniqueName));
        }, 1000);
    };
    ShareLedgerComponent.prototype.unShareAccount = function (entryUniqueName, val) {
        var _this = this;
        this.store.dispatch(this.accountActions.unShareEntity(entryUniqueName, 'account', this.accountUniqueName));
        setTimeout(function () {
            _this.store.dispatch(_this._ledgerActions.sharedAccountWith(_this.accountUniqueName));
        }, 1000);
    };
    ShareLedgerComponent.prototype.clear = function () {
        this.email = '';
        this.magicLink = '';
        this.isCopied = false;
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], ShareLedgerComponent.prototype, "accountUniqueName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], ShareLedgerComponent.prototype, "advanceSearchRequest", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], ShareLedgerComponent.prototype, "closeShareLedgerModal", void 0);
    ShareLedgerComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'share-ledger',
            template: __webpack_require__(/*! ./shareLedger.component.html */ "./src/app/ledger/components/shareLedger/shareLedger.component.html"),
            styles: ["\n    .btn-success:disabled {\n      color: #28ab00 !important;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_ledger_service__WEBPACK_IMPORTED_MODULE_4__["LedgerService"], _services_account_service__WEBPACK_IMPORTED_MODULE_6__["AccountService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_8__["Store"], _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_9__["LedgerActions"], _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_2__["AccountsAction"]])
    ], ShareLedgerComponent);
    return ShareLedgerComponent;
}());



/***/ }),

/***/ "./src/app/ledger/components/updateLedger-tax-control/updateLedger-tax-control.component.html":
/*!****************************************************************************************************!*\
  !*** ./src/app/ledger/components/updateLedger-tax-control/updateLedger-tax-control.component.html ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<span class=\"c-dropdown\" [ngClass]=\"{'open': showTaxPopup}\" [attachOutsideOnClick]=\"true\" (clickOutside)=\"toggleTaxPopup(false)\">\n  <label *ngIf=\"showHeading\">Tax</label>\n  <div class=\"relative clearfix\">\n    <a id=\"tax\" class=\"clearfix\">\n      <div class=\"multi-select adjust\">\n        <input type=\"text\" decimalDigitsDirective [DecimalPlaces]=\"3\" readonly name=\"\" class=\"form-control cursor-pointer text-right\"\n          [(ngModel)]=\"formattedTotal\" readOnly (focus)=\"showTaxPopup = true;hideOtherPopups.emit(true)\" />\n        <span class=\"caret\"></span>\n      </div>\n    </a>\n    <ul class=\"dropdown-menu pd\" [ngStyle]=\"{'display': showTaxPopup ? 'block': 'none'}\" (click)=\"$event.stopPropagation()\" style=\"max-height: 102px;min-height: 40px\">\n      <li *ngFor=\"let tax of taxRenderData;trackBy: trackByFn\" class=\"relative\">\n        <label class=\"checkbox oh width100 p0 m0 customItem bdrB\" placement=\"bottom\" [tooltip]=\"tax.name\" style=\"padding: 5px;margin-bottom: 5px;\" (click)=\"$event.stopPropagation()\"\n          [ngClass]=\"{'fake-disabled-label': tax.isDisabled}\">\n          <input class=\"pull-left\" type=\"checkbox\" [(ngModel)]=\"tax.isChecked\" [disabled]=\"tax.isDisabled\" (change)=\"change()\" (click)=\"$event.stopPropagation()\"\n          />\n          <span class=\"pull-left ellp\">{{tax.name}}</span>\n          <!-- <span class=\"custom-tooltipe\">{{tax.name}}</span> -->\n        </label>\n      </li>\n    </ul>\n    <div tabindex=\"0\" (focus)=\"onFocusLastDiv($event)\"></div>\n  </div>\n</span>\n"

/***/ }),

/***/ "./src/app/ledger/components/updateLedger-tax-control/updateLedger-tax-control.component.scss":
/*!****************************************************************************************************!*\
  !*** ./src/app/ledger/components/updateLedger-tax-control/updateLedger-tax-control.component.scss ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".c-dropdown .dropdown-menu li label span {\n  max-width: calc(100% - 31px) !important; }\n"

/***/ }),

/***/ "./src/app/ledger/components/updateLedger-tax-control/updateLedger-tax-control.component.ts":
/*!**************************************************************************************************!*\
  !*** ./src/app/ledger/components/updateLedger-tax-control/updateLedger-tax-control.component.ts ***!
  \**************************************************************************************************/
/*! exports provided: TAX_CONTROL_VALUE_ACCESSOR, UpdateLedgerTaxData, UpdateLedgerTaxControlComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TAX_CONTROL_VALUE_ACCESSOR", function() { return TAX_CONTROL_VALUE_ACCESSOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateLedgerTaxData", function() { return UpdateLedgerTaxData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateLedgerTaxControlComponent", function() { return UpdateLedgerTaxControlComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _theme_tax_control_tax_control_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../theme/tax-control/tax-control.component */ "./src/app/theme/tax-control/tax-control.component.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");







var TAX_CONTROL_VALUE_ACCESSOR = {
    provide: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["NG_VALUE_ACCESSOR"],
    // tslint:disable-next-line:no-forward-ref
    useExisting: Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["forwardRef"])(function () { return UpdateLedgerTaxControlComponent; }),
    multi: true
};
var UpdateLedgerTaxData = /** @class */ (function () {
    function UpdateLedgerTaxData() {
        this.particular = { name: '', uniqueName: '' };
        this.amount = 0;
    }
    return UpdateLedgerTaxData;
}());

var UpdateLedgerTaxControlComponent = /** @class */ (function () {
    function UpdateLedgerTaxControlComponent() {
        this.showHeading = true;
        this.showTaxPopup = false;
        this.totalForTax = 0;
        this.customTaxTypesForTaxFilter = [];
        this.exceptTaxTypes = [];
        this.allowedSelection = 0;
        this.isApplicableTaxesEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.taxAmountSumEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.selectedTaxEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.hideOtherPopups = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.sum = 0;
        this.selectedTaxes = [];
        //
    }
    UpdateLedgerTaxControlComponent.prototype.ngOnInit = function () {
        // this.sum = 0;
        // this.prepareTaxObject();
        // this.change();
    };
    UpdateLedgerTaxControlComponent.prototype.ngOnChanges = function (changes) {
        if (changes['applicableTaxes'] && changes['applicableTaxes'].currentValue !== changes['applicableTaxes'].previousValue) {
            this.taxRenderData = [];
            this.sum = 0;
            this.prepareTaxObject();
            this.change();
        }
        if (changes['date'] && changes['date'].currentValue !== changes['date'].previousValue) {
            if (moment_moment__WEBPACK_IMPORTED_MODULE_3__(changes['date'].currentValue, 'DD-MM-YYYY').isValid()) {
                this.sum = 0;
                this.prepareTaxObject();
                this.change();
            }
        }
        if (changes['totalForTax'] && changes['totalForTax'].currentValue !== changes['totalForTax'].previousValue) {
            this.formattedTotal = "" + Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_6__["giddhRoundOff"])(((this.totalForTax * this.sum) / 100), 2);
        }
    };
    /**
     * prepare taxObject as per needed
     */
    UpdateLedgerTaxControlComponent.prototype.prepareTaxObject = function () {
        var _this = this;
        // if updating don't recalculate
        if (this.taxRenderData.length) {
            return;
        }
        if (this.customTaxTypesForTaxFilter && this.customTaxTypesForTaxFilter.length) {
            this.taxes = this.taxes.filter(function (f) { return _this.customTaxTypesForTaxFilter.includes(f.taxType); });
        }
        if (this.exceptTaxTypes && this.exceptTaxTypes.length) {
            this.taxes = this.taxes.filter(function (f) { return !_this.exceptTaxTypes.includes(f.taxType); });
        }
        this.taxes.map(function (tx) {
            var taxObj = new _theme_tax_control_tax_control_component__WEBPACK_IMPORTED_MODULE_5__["TaxControlData"]();
            taxObj.name = tx.name;
            taxObj.uniqueName = tx.uniqueName;
            if (_this.date) {
                var taxObject = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["orderBy"](tx.taxDetail, function (p) {
                    return moment_moment__WEBPACK_IMPORTED_MODULE_3__(p.date, 'DD-MM-YYYY');
                }, 'desc');
                var exactDate = taxObject.filter(function (p) { return moment_moment__WEBPACK_IMPORTED_MODULE_3__(p.date, 'DD-MM-YYYY').isSame(moment_moment__WEBPACK_IMPORTED_MODULE_3__(_this.date, 'DD-MM-YYYY')); });
                if (exactDate.length > 0) {
                    taxObj.amount = exactDate[0].taxValue;
                }
                else {
                    var filteredTaxObject = taxObject.filter(function (p) { return moment_moment__WEBPACK_IMPORTED_MODULE_3__(p.date, 'DD-MM-YYYY') < moment_moment__WEBPACK_IMPORTED_MODULE_3__(_this.date, 'DD-MM-YYYY'); });
                    if (filteredTaxObject.length > 0) {
                        taxObj.amount = filteredTaxObject[0].taxValue;
                    }
                    else {
                        taxObj.amount = 0;
                    }
                }
            }
            else {
                taxObj.amount = tx.taxDetail[0].taxValue;
            }
            taxObj.isChecked = (_this.applicableTaxes && (_this.applicableTaxes.indexOf(tx.uniqueName) > -1));
            // if (taxObj.amount && taxObj.amount > 0) {
            _this.taxRenderData.push(taxObj);
            // }
        });
    };
    UpdateLedgerTaxControlComponent.prototype.toggleTaxPopup = function (action) {
        this.showTaxPopup = action;
    };
    UpdateLedgerTaxControlComponent.prototype.trackByFn = function (index) {
        return index; // or item.id
    };
    UpdateLedgerTaxControlComponent.prototype.ngOnDestroy = function () {
        this.taxAmountSumEvent.unsubscribe();
        this.isApplicableTaxesEvent.unsubscribe();
        this.selectedTaxEvent.unsubscribe();
    };
    /**
     * select/deselect tax checkbox
     */
    UpdateLedgerTaxControlComponent.prototype.change = function () {
        this.selectedTaxes = [];
        this.sum = this.calculateSum();
        this.formattedTotal = "" + Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_6__["giddhRoundOff"])(((this.totalForTax * this.sum) / 100), 2);
        this.selectedTaxes = this.generateSelectedTaxes();
        if (this.allowedSelection > 0) {
            if (this.selectedTaxes.length >= this.allowedSelection) {
                this.taxRenderData = this.taxRenderData.map(function (m) {
                    m.isDisabled = !m.isChecked;
                    return m;
                });
            }
            else {
                this.taxRenderData = this.taxRenderData.map(function (m) {
                    m.isDisabled = m.isDisabled ? false : m.isDisabled;
                    return m;
                });
            }
        }
        this.taxAmountSumEvent.emit(this.sum);
        this.selectedTaxEvent.emit(this.selectedTaxes);
        var diff;
        if (this.selectedTaxes.length > 0) {
            diff = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["difference"](this.selectedTaxes, this.applicableTaxes).length > 0;
        }
        else {
            diff = this.applicableTaxes.length > 0;
        }
        if (diff) {
            this.isApplicableTaxesEvent.emit(false);
        }
        else {
            this.isApplicableTaxesEvent.emit(true);
        }
    };
    UpdateLedgerTaxControlComponent.prototype.onFocusLastDiv = function (el) {
        el.stopPropagation();
        el.preventDefault();
        if (!this.showTaxPopup) {
            this.showTaxPopup = true;
            this.hideOtherPopups.emit(true);
            return;
        }
        var focussableElements = '.entrypanel input[type=text]:not([disabled]),.entrypanel [tabindex]:not([disabled]):not([tabindex="-1"])';
        // if (document.activeElement && document.activeElement.form) {
        var focussable = Array.prototype.filter.call(document.querySelectorAll(focussableElements), function (element) {
            // check for visibility while always include the current activeElement
            return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement;
        });
        var index = focussable.indexOf(document.activeElement);
        if (index > -1) {
            var nextElement = focussable[index + 1] || focussable[0];
            nextElement.focus();
        }
        this.toggleTaxPopup(false);
        return false;
    };
    UpdateLedgerTaxControlComponent.prototype.isTaxApplicable = function (tax) {
        var today = moment_moment__WEBPACK_IMPORTED_MODULE_3__(moment_moment__WEBPACK_IMPORTED_MODULE_3__().format('DD-MM-YYYY'), 'DD-MM-YYYY', true).valueOf();
        var isApplicable = false;
        _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["each"](tax.taxDetail, function (det) {
            if (today >= moment_moment__WEBPACK_IMPORTED_MODULE_3__(det.date, 'DD-MM-YYYY', true).valueOf()) {
                return isApplicable = true;
            }
        });
        return isApplicable;
    };
    /**
     * calculate sum of selected tax amount
     * @returns {number}
     */
    UpdateLedgerTaxControlComponent.prototype.calculateSum = function () {
        return this.taxRenderData.reduce(function (pv, cv) {
            return cv.isChecked ? pv + cv.amount : pv;
        }, 0);
    };
    /**
     * generate array of selected tax uniqueName
     * @returns {string[]}
     */
    UpdateLedgerTaxControlComponent.prototype.generateSelectedTaxes = function () {
        return this.taxRenderData.filter(function (p) { return p.isChecked; }).map(function (p) {
            var tax = new UpdateLedgerTaxData();
            tax.particular.name = p.name;
            tax.particular.uniqueName = p.uniqueName;
            tax.amount = p.amount;
            return tax;
        });
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], UpdateLedgerTaxControlComponent.prototype, "date", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], UpdateLedgerTaxControlComponent.prototype, "taxes", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], UpdateLedgerTaxControlComponent.prototype, "applicableTaxes", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], UpdateLedgerTaxControlComponent.prototype, "taxRenderData", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], UpdateLedgerTaxControlComponent.prototype, "showHeading", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], UpdateLedgerTaxControlComponent.prototype, "showTaxPopup", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], UpdateLedgerTaxControlComponent.prototype, "totalForTax", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], UpdateLedgerTaxControlComponent.prototype, "customTaxTypesForTaxFilter", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], UpdateLedgerTaxControlComponent.prototype, "exceptTaxTypes", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], UpdateLedgerTaxControlComponent.prototype, "allowedSelection", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], UpdateLedgerTaxControlComponent.prototype, "allowedSelectionOfAType", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], UpdateLedgerTaxControlComponent.prototype, "isApplicableTaxesEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], UpdateLedgerTaxControlComponent.prototype, "taxAmountSumEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], UpdateLedgerTaxControlComponent.prototype, "selectedTaxEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], UpdateLedgerTaxControlComponent.prototype, "hideOtherPopups", void 0);
    UpdateLedgerTaxControlComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'update-ledger-tax-control',
            template: __webpack_require__(/*! ./updateLedger-tax-control.component.html */ "./src/app/ledger/components/updateLedger-tax-control/updateLedger-tax-control.component.html"),
            providers: [TAX_CONTROL_VALUE_ACCESSOR],
            styles: [__webpack_require__(/*! ./updateLedger-tax-control.component.scss */ "./src/app/ledger/components/updateLedger-tax-control/updateLedger-tax-control.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], UpdateLedgerTaxControlComponent);
    return UpdateLedgerTaxControlComponent;
}());



/***/ }),

/***/ "./src/app/ledger/components/updateLedgerDiscount/updateLedgerDiscount.component.html":
/*!********************************************************************************************!*\
  !*** ./src/app/ledger/components/updateLedgerDiscount/updateLedgerDiscount.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--<span (blur)=\"hideDiscountMenu()\" [attachOutsideOnClick]=\"true\" (clickOutside)=\"hideDiscountMenu()\">-->\n<!--<label>Discount</label>-->\n<!--<a (click)=\"discountMenu = !discountMenu\" id=\"discount\">-->\n<!--<input type=\"text\" decimalDigitsDirective [DecimalPlaces]=\"2\" name=\"\" class=\"form-control cursor-pointer\"-->\n<!--[(ngModel)]=\"discountTotal\" disabled=\"disabled\"/>-->\n<!--</a>-->\n<!--<ul class=\"my-dropdown-menu pd\" *ngIf=\"discountMenu\" (click)=\"$event.stopPropagation()\">-->\n<!--<li>-->\n<!--<table>-->\n<!--<tr-->\n<!--*ngFor=\"let discount of discountAccountsDetails;\">-->\n<!--<td class=\"pdL w100\">{{ discount.name }}</td>-->\n<!--<td class=\"pdR pdT w50\">-->\n<!--<input type=\"text\" decimalDigitsDirective [DecimalPlaces]=\"2\" class=\"form-control\"-->\n<!--(change)=\"change()\" [(ngModel)]=\"discount.amount\"/>-->\n<!--</td>-->\n<!--</tr>-->\n<!--</table>-->\n<!--</li>-->\n<!--</ul>-->\n<!--</span>-->\n\n\n<span (clickOutside)=\"hideDiscountMenu()\">\n    <label>Discount</label>\n\n    <a id=\"discount\">\n      <div class=\"multi-select adjust\">\n        <input type=\"text\" decimalDigitsDirective [DecimalPlaces]=\"2\" name=\"\" class=\"form-control cursor-pointer text-right\"\n               [(ngModel)]=\"discountTotal\" readonly (focus)=\"discountMenu = true;hideOtherPopups.emit(true)\"/>\n        <span class=\"caret\"></span>\n      </div>\n    </a>\n\n  <div class=\"my-dropdown-menu pd\" [ngStyle]=\"{'display': discountMenu ? 'block': 'none'}\"\n       (click)=\"$event.stopPropagation()\" style=\"padding: 10px;\">\n\n    <div>\n\n      <div class=\"d-flex mb-1\">\n\n        <label class=\"mr-1 align-items-center d-flex\" style=\"width: 50px\">Percent</label>\n\n        <div class=\"pos-rel\">\n          <input type=\"text\" class=\"form-control text-right cursor-pointer\"\n                 [disabled]=\"!discountFromPer\"\n                 decimalDigitsDirective [DecimalPlaces]=\"2\"\n                 [(ngModel)]=\"discountPercentageModal\"\n                 (input)=\"discountFromInput('PERCENTAGE', $event.target.value)\"\n                 style=\"width: 100px;padding-right: 20px !important;\">\n        <i class=\"fa fa-percent pos-abs\" style=\"top: 9px;right: 6px;color: #acb0b9;\"></i>\n        </div>\n\n      </div>\n\n      <div class=\"d-flex mb-1\">\n        <label class=\"mr-1 align-items-center d-flex\" style=\"width: 50px\">Value</label>\n        <input type=\"text\" class=\"form-control text-right cursor-pointer\"\n               [disabled]=\"!discountFromVal\"\n               decimalDigitsDirective [DecimalPlaces]=\"2\"\n               [(ngModel)]=\"discountFixedValueModal\"\n               (input)=\"discountFromInput('FIX_AMOUNT', $event.target.value)\"\n               style=\"width: 100px\">\n      </div>\n\n    </div>\n\n    <div class=\"d-flex flex-col\" style=\"justify-content: center\" *ngIf=\"discountAccountsDetails.length > 1\">\n      <span class=\"or-line\">AND</span>\n    </div>\n\n    <div *ngIf=\"discountAccountsDetails.length > 1\">\n       <ul style=\"list-style: none;overflow: auto;max-height: 100px\">\n\n\n       <ng-container *ngFor=\"let discount of discountAccountsDetails;trackBy: trackByFn; let idx = index\">\n         <li *ngIf=\"idx > 0\" class=\"discountItem\" style=\"padding: 5px;margin-bottom: 5px;\">\n          <label class=\"checkbox oh width100 p0 m0\" (click)=\"$event.stopPropagation()\">\n            <input class=\"pull-left\" name=\"tax_{{idx}}\" type=\"checkbox\" [(ngModel)]=\"discount.isActive\"\n                   (change)=\"change()\"\n                   (click)=\"$event.stopPropagation()\"\n            />\n            <span class=\"pull-left ellp\">{{discount.name}}</span>\n          </label>\n         </li>\n       </ng-container>\n  </ul>\n    </div>\n  </div>\n<div tabindex=\"0\" (focus)=\"onFocusLastDiv($event)\"></div>\n</span>\n"

/***/ }),

/***/ "./src/app/ledger/components/updateLedgerDiscount/updateLedgerDiscount.component.scss":
/*!********************************************************************************************!*\
  !*** ./src/app/ledger/components/updateLedgerDiscount/updateLedgerDiscount.component.scss ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".or-line::before {\n  content: \" \";\n  border-bottom: 1px solid #a2a2a2;\n  display: inline-block;\n  width: 57px;\n  margin-right: 13px; }\n\n.or-line::after {\n  content: \"\";\n  border-bottom: 1px solid #a2a2a2;\n  display: inline-block;\n  width: 57px;\n  margin-left: 13px; }\n\n.or-line {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  color: #a2a2a2;\n  margin-bottom: 10px; }\n\n.discountItem:hover {\n  background-color: #f4f5f8;\n  color: #d25f2a; }\n"

/***/ }),

/***/ "./src/app/ledger/components/updateLedgerDiscount/updateLedgerDiscount.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/ledger/components/updateLedgerDiscount/updateLedgerDiscount.component.ts ***!
  \******************************************************************************************/
/*! exports provided: UpdateLedgerDiscountData, UpdateLedgerDiscountComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateLedgerDiscountData", function() { return UpdateLedgerDiscountData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateLedgerDiscountComponent", function() { return UpdateLedgerDiscountComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _models_api_models_SettingsDiscount__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../models/api-models/SettingsDiscount */ "./src/app/models/api-models/SettingsDiscount.ts");






var UpdateLedgerDiscountData = /** @class */ (function () {
    function UpdateLedgerDiscountData() {
        this.particular = { name: '', uniqueName: '' };
        this.amount = 0;
    }
    return UpdateLedgerDiscountData;
}());

var UpdateLedgerDiscountComponent = /** @class */ (function () {
    function UpdateLedgerDiscountComponent(store) {
        this.store = store;
        this.ledgerAmount = 0;
        this.discountTotalUpdated = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        this.hideOtherPopups = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        this.appliedDiscount = [];
        this.discountFromPer = true;
        this.discountFromVal = true;
        this.discountPercentageModal = 0;
        this.discountFixedValueModal = 0;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["ReplaySubject"](1);
        this.discountAccountsList$ = this.store.select(function (p) { return p.settings.discount.discountList; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
    }
    Object.defineProperty(UpdateLedgerDiscountComponent.prototype, "defaultDiscount", {
        get: function () {
            return this.discountAccountsDetails[0];
        },
        enumerable: true,
        configurable: true
    });
    UpdateLedgerDiscountComponent.prototype.ngOnInit = function () {
        this.prepareDiscountList();
        this.change();
    };
    UpdateLedgerDiscountComponent.prototype.ngOnChanges = function (changes) {
        if ('discountAccountsDetails' in changes && changes.discountAccountsDetails.currentValue !== changes.discountAccountsDetails.previousValue) {
            this.prepareDiscountList();
            /* check if !this.defaultDiscount.discountUniqueName so it's means
              that this is default discount and we have added it manually not
             from server side */
            if (this.defaultDiscount && !this.defaultDiscount.discountUniqueName) {
                if (this.defaultDiscount.discountType === 'FIX_AMOUNT') {
                    this.discountFixedValueModal = this.defaultDiscount.discountValue;
                    this.discountFromPer = false;
                    this.discountFromVal = true;
                }
                else {
                    this.discountPercentageModal = this.defaultDiscount.discountValue;
                    this.discountFromVal = false;
                    this.discountFromPer = true;
                }
            }
            this.change();
        }
    };
    /**
     * prepare discount obj
     */
    UpdateLedgerDiscountComponent.prototype.prepareDiscountList = function () {
        var _this = this;
        var discountAccountsList = [];
        this.discountAccountsList$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (d) { return discountAccountsList = d; });
        if (discountAccountsList.length) {
            discountAccountsList.forEach(function (acc) {
                var hasItem = _this.discountAccountsDetails.some(function (s) { return s.discountUniqueName === acc.uniqueName; });
                if (!hasItem) {
                    var obj = new _models_api_models_SettingsDiscount__WEBPACK_IMPORTED_MODULE_5__["LedgerDiscountClass"]();
                    obj.amount = acc.discountValue;
                    obj.discountValue = acc.discountValue;
                    obj.discountType = acc.discountType;
                    obj.isActive = false;
                    obj.particular = acc.linkAccount.uniqueName;
                    obj.discountUniqueName = acc.uniqueName;
                    obj.name = acc.name;
                    _this.discountAccountsDetails.push(obj);
                }
            });
        }
    };
    UpdateLedgerDiscountComponent.prototype.discountFromInput = function (type, val) {
        this.defaultDiscount.amount = parseFloat(val);
        this.defaultDiscount.discountValue = parseFloat(val);
        this.defaultDiscount.discountType = type;
        this.change();
        if (!val) {
            this.discountFromVal = true;
            this.discountFromPer = true;
            return;
        }
        if (type === 'PERCENTAGE') {
            this.discountFromPer = true;
            this.discountFromVal = false;
        }
        else {
            this.discountFromPer = false;
            this.discountFromVal = true;
        }
    };
    /**
     * on change of discount amount
     */
    UpdateLedgerDiscountComponent.prototype.change = function () {
        this.discountTotal = Number(this.generateTotal());
        this.discountTotalUpdated.emit(this.discountTotal);
        // this.appliedDiscount = this.generateAppliedDiscounts();
        // this.appliedDiscountEvent.emit(this.appliedDiscount);
    };
    /**
     * generate total of discount amount
     * @returns {number}
     */
    UpdateLedgerDiscountComponent.prototype.generateTotal = function () {
        var percentageListTotal = this.discountAccountsDetails.filter(function (f) { return f.isActive; })
            .filter(function (s) { return s.discountType === 'PERCENTAGE'; })
            .reduce(function (pv, cv) {
            return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
        }, 0) || 0;
        var fixedListTotal = this.discountAccountsDetails.filter(function (f) { return f.isActive; })
            .filter(function (s) { return s.discountType === 'FIX_AMOUNT'; })
            .reduce(function (pv, cv) {
            return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
        }, 0) || 0;
        var perFromAmount = Math.round(((percentageListTotal * this.ledgerAmount) / 100) * 100) / 100;
        return perFromAmount + Math.round(fixedListTotal * 100) / 100;
        // return this.discountAccountsDetails.map(ds => {
        //   ds.amount = Number(ds.amount);
        //   return ds;
        // }).reduce((pv, cv) => {
        //   return Number(cv.amount) ? Number(pv) + Number(cv.amount) : Number(pv);
        // }, 0) || 0;
    };
    // public generateAppliedDiscounts(): UpdateLedgerDiscountData[] {
    //   return this.discountAccountsDetails.map(p => {
    //     let discountObj = new UpdateLedgerDiscountData();
    //     discountObj.particular.name = p.name;
    //     discountObj.particular.uniqueName = p.particular;
    //     discountObj.amount = p.amount;
    //     return discountObj;
    //   });
    // }
    UpdateLedgerDiscountComponent.prototype.trackByFn = function (index) {
        return index; // or item.id
    };
    UpdateLedgerDiscountComponent.prototype.hideDiscountMenu = function () {
        this.discountMenu = false;
    };
    UpdateLedgerDiscountComponent.prototype.onFocusLastDiv = function (el) {
        el.stopPropagation();
        el.preventDefault();
        if (!this.discountMenu) {
            this.discountMenu = true;
            this.hideOtherPopups.emit(true);
            return;
        }
        var focussableElements = '.entrypanel input[type=text]:not([disabled]),.entrypanel [tabindex]:not([disabled]):not([tabindex="-1"])';
        // if (document.activeElement && document.activeElement.form) {
        var focussable = Array.prototype.filter.call(document.querySelectorAll(focussableElements), function (element) {
            // check for visibility while always include the current activeElement
            return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement;
        });
        var index = focussable.indexOf(document.activeElement);
        if (index > -1) {
            var nextElement = focussable[index + 1] || focussable[0];
            nextElement.focus();
        }
        this.hideDiscountMenu();
        return false;
    };
    UpdateLedgerDiscountComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], UpdateLedgerDiscountComponent.prototype, "discountAccountsDetails", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], UpdateLedgerDiscountComponent.prototype, "ledgerAmount", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], UpdateLedgerDiscountComponent.prototype, "discountTotalUpdated", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"])
    ], UpdateLedgerDiscountComponent.prototype, "hideOtherPopups", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], UpdateLedgerDiscountComponent.prototype, "discountMenu", void 0);
    UpdateLedgerDiscountComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'update-ledger-discount',
            template: __webpack_require__(/*! ./updateLedgerDiscount.component.html */ "./src/app/ledger/components/updateLedgerDiscount/updateLedgerDiscount.component.html"),
            styles: [__webpack_require__(/*! ./updateLedgerDiscount.component.scss */ "./src/app/ledger/components/updateLedgerDiscount/updateLedgerDiscount.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"]])
    ], UpdateLedgerDiscountComponent);
    return UpdateLedgerDiscountComponent;
}());



/***/ }),

/***/ "./src/app/ledger/components/updateLedgerEntryPanel/updateLedger.vm.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/ledger/components/updateLedgerEntryPanel/updateLedger.vm.ts ***!
  \*****************************************************************************/
/*! exports provided: UpdateLedgerVm */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateLedgerVm", function() { return UpdateLedgerVm; });
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var apps_web_giddh_src_app_ledger_underStandingTextData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! apps/web-giddh/src/app/ledger/underStandingTextData */ "./src/app/ledger/underStandingTextData.ts");
/* harmony import */ var _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../models/api-models/Sales */ "./src/app/models/api-models/Sales.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");




var UpdateLedgerVm = /** @class */ (function () {
    function UpdateLedgerVm() {
        this.flatternAccountList = [];
        this.flatternAccountList4BaseAccount = [];
        this.entryTotal = { drTotal: 0, crTotal: 0 };
        this.grandTotal = 0;
        this.totalAmount = 0;
        this.totalForTax = 0;
        this.compoundTotal = 0;
        this.discountArray = [];
        this.discountTrxTotal = 0;
        this.taxTrxTotal = 0;
        this.isInvoiceGeneratedAlready = false;
        this.showNewEntryPanel = true;
        this.selectedTaxes = [];
        this.taxRenderData = [];
        this.dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        this.ledgerUnderStandingObj = {
            accountType: '',
            text: {
                cr: '',
                dr: ''
            },
            balanceText: {
                cr: '',
                dr: ''
            }
        };
        this.voucherTypeList = [{
                label: 'Sales',
                value: 'sal'
            }, {
                label: 'Purchases',
                value: 'pur'
            }, {
                label: 'Receipt',
                value: 'rcpt'
            }, {
                label: 'Payment',
                value: 'pay'
            }, {
                label: 'Journal',
                value: 'jr'
            }, {
                label: 'Contra',
                value: 'cntr'
            }, {
                label: 'Debit Note',
                value: 'debit note'
            }, {
                label: 'Credit Note',
                value: 'credit note'
            }];
    }
    Object.defineProperty(UpdateLedgerVm.prototype, "stockTrxEntry", {
        get: function () {
            return Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["find"])(this.selectedLedger.transactions, (function (t) { return !!(t.inventory && t.inventory.stock); })) || null;
        },
        enumerable: true,
        configurable: true
    });
    UpdateLedgerVm.prototype.blankTransactionItem = function (type) {
        if (type === void 0) { type = 'DEBIT'; }
        return {
            amount: 0,
            type: type,
            particular: {
                name: '',
                uniqueName: ''
            }
        };
    };
    UpdateLedgerVm.prototype.handleDiscountEntry = function () {
        var _this = this;
        if (this.selectedLedger.transactions) {
            this.selectedLedger.transactions = this.selectedLedger.transactions.filter(function (f) { return !f.isDiscount; });
            var incomeExpenseEntryIndex = this.selectedLedger.transactions.findIndex(function (trx) {
                if (trx.particular.uniqueName) {
                    var category = _this.getCategoryNameFromAccount(_this.getUniqueName(trx));
                    return _this.isValidCategory(category);
                }
            });
            var discountEntryType_1 = 'CREDIT';
            if (incomeExpenseEntryIndex > -1) {
                discountEntryType_1 = this.selectedLedger.transactions[incomeExpenseEntryIndex].type === 'DEBIT' ? 'CREDIT' : 'DEBIT';
            }
            else {
                discountEntryType_1 = 'CREDIT';
            }
            this.discountArray.filter(function (f) { return f.isActive && f.amount > 0; }).forEach(function (dx, index) {
                var trx = _this.blankTransactionItem(discountEntryType_1);
                if (dx.discountUniqueName) {
                    trx.particular.uniqueName = dx.discountUniqueName;
                    trx.particular.name = dx.name;
                    trx.amount = dx.discountType === 'FIX_AMOUNT' ? dx.amount : Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["giddhRoundOff"])(((dx.discountValue * _this.totalAmount) / 100), 2);
                    trx.isStock = false;
                    trx.isTax = false;
                    trx.isDiscount = true;
                }
                else {
                    trx.particular.uniqueName = 'discount';
                    trx.particular.name = 'discount';
                    trx.amount = dx.discountType === 'FIX_AMOUNT' ? dx.amount : Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["giddhRoundOff"])(((dx.discountValue * _this.totalAmount) / 100), 2);
                    trx.isStock = false;
                    trx.isTax = false;
                    trx.isDiscount = true;
                }
                _this.selectedLedger.transactions.splice(index, 0, trx);
            });
            this.getEntryTotal();
            this.generateCompoundTotal();
        }
        return;
    };
    UpdateLedgerVm.prototype.getCategoryNameFromAccount = function (accountName) {
        var _this = this;
        var categoryName = '';
        var account = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["find"])(this.flatternAccountList, function (fla) { return fla.uniqueName === accountName; });
        if (account && account.parentGroups[0]) {
            categoryName = this.accountCatgoryGetterFunc(account, accountName);
        }
        else {
            var flatterAccounts = this.flatternAccountList;
            flatterAccounts.map(function (fa) {
                if (fa.mergedAccounts !== '') {
                    var tempMergedAccounts = fa.mergedAccounts.split(',').map(function (mm) { return mm.trim(); });
                    if (tempMergedAccounts.indexOf(accountName) > -1) {
                        categoryName = _this.accountCatgoryGetterFunc(fa, accountName);
                        if (categoryName) {
                            return categoryName;
                        }
                    }
                }
            });
        }
        return categoryName;
    };
    UpdateLedgerVm.prototype.accountCatgoryGetterFunc = function (account, accountName) {
        var parent = account.parentGroups[0];
        if (Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["find"])(['shareholdersfunds', 'noncurrentliabilities', 'currentliabilities'], function (p) { return p === parent.uniqueName; })) {
            return 'liabilities';
        }
        else if (Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["find"])(['fixedassets'], function (p) { return p === parent.uniqueName; })) {
            return 'fixedassets';
        }
        else if (Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["find"])(['noncurrentassets', 'currentassets'], function (p) { return p === parent.uniqueName; })) {
            return 'assets';
        }
        else if (Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["find"])(['revenuefromoperations', 'otherincome'], function (p) { return p === parent.uniqueName; })) {
            return 'income';
        }
        else if (Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["find"])(['operatingcost', 'indirectexpenses'], function (p) { return p === parent.uniqueName; })) {
            if (accountName === 'roundoff') {
                return 'roundoff';
            }
            var subParent = account.parentGroups[1];
            if (subParent && subParent.uniqueName === 'discount') {
                return 'discount';
            }
            return 'expenses';
        }
        else {
            return '';
        }
    };
    UpdateLedgerVm.prototype.isValidCategory = function (category) {
        return category === 'income' || category === 'expenses' || category === 'fixedassets';
    };
    UpdateLedgerVm.prototype.isThereStockEntry = function (uniqueName) {
        // check if entry with same stock added multiple times
        var count = this.selectedLedger.transactions.filter(function (f) { return f.particular.uniqueName === uniqueName; }).length;
        if (count > 1) {
            return true;
        }
        // check if is there any stock entry or not
        return Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["find"])(this.selectedLedger.transactions, function (f) {
            if (f.particular.uniqueName && f.particular.uniqueName !== uniqueName) {
                return !!(f.inventory && f.inventory.stock);
            }
        }) !== undefined;
    };
    UpdateLedgerVm.prototype.isThereIncomeOrExpenseEntry = function () {
        var _this = this;
        return Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["filter"])(this.selectedLedger.transactions, function (trx) {
            if (trx.particular.uniqueName) {
                var category = _this.getCategoryNameFromAccount(_this.getUniqueName(trx));
                return _this.isValidCategory(category) || trx.inventory;
            }
        }).length;
    };
    UpdateLedgerVm.prototype.checkDiscountTaxesAllowedOnOpenedLedger = function (acc) {
        var allowedUniqueNameArr = ['revenuefromoperations', 'otherincome', 'operatingcost', 'indirectexpenses', 'fixedassets'];
        return allowedUniqueNameArr.indexOf(acc.parentGroups[0].uniqueName) > -1;
    };
    UpdateLedgerVm.prototype.getEntryTotal = function () {
        this.entryTotal.drTotal = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["giddhRoundOff"])(Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["sumBy"])(this.selectedLedger.transactions, function (tr) {
            if (tr.type === 'DEBIT') {
                return Number(tr.amount) || 0;
            }
            return 0;
        }), 2);
        this.entryTotal.crTotal = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["giddhRoundOff"])(Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["sumBy"])(this.selectedLedger.transactions, function (tr) {
            if (tr.type === 'CREDIT') {
                return Number(tr.amount) || 0;
            }
            return 0;
        }), 2);
    };
    UpdateLedgerVm.prototype.onTxnAmountChange = function (txn) {
        if (!txn.isUpdated) {
            if (this.selectedLedger.taxes.length && !txn.isTax) {
                txn.isUpdated = true;
            }
        }
        this.generatePanelAmount();
        if (this.discountComponent) {
            this.discountComponent.ledgerAmount = this.totalAmount;
            this.discountComponent.change();
        }
        this.getEntryTotal();
        this.generateGrandTotal();
        this.generateCompoundTotal();
    };
    // FIXME: fix amount calculation
    UpdateLedgerVm.prototype.generatePanelAmount = function () {
        var _this = this;
        if (this.selectedLedger.transactions && this.selectedLedger.transactions.length) {
            if (this.stockTrxEntry) {
                this.totalAmount = this.stockTrxEntry.amount;
            }
            else {
                var trx = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["find"])(this.selectedLedger.transactions, function (t) {
                    var category = _this.getCategoryNameFromAccount(_this.getUniqueName(t));
                    return _this.isValidCategory(category);
                });
                this.totalAmount = trx ? Number(trx.amount) : 0;
            }
        }
    };
    UpdateLedgerVm.prototype.calculateOtherTaxes = function (modal) {
        var taxableValue = 0;
        var companyTaxes = [];
        var totalTaxes = 0;
        this.companyTaxesList$.subscribe(function (taxes) { return companyTaxes = taxes; });
        if (modal.appliedOtherTax && modal.appliedOtherTax.uniqueName) {
            if (modal.tcsCalculationMethod === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["SalesOtherTaxesCalculationMethodEnum"].OnTaxableAmount) {
                taxableValue = Number(this.totalAmount) - this.discountTrxTotal;
            }
            else if (modal.tcsCalculationMethod === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["SalesOtherTaxesCalculationMethodEnum"].OnTotalAmount) {
                var rawAmount = Number(this.totalAmount) - this.discountTrxTotal;
                taxableValue = (rawAmount + ((rawAmount * this.taxTrxTotal) / 100));
            }
            var tax = companyTaxes.find(function (ct) { return ct.uniqueName === modal.appliedOtherTax.uniqueName; });
            if (tax && tax.taxDetail[0]) {
                this.selectedLedger.otherTaxType = ['tcsrc', 'tcspay'].includes(tax.taxType) ? 'tcs' : 'tds';
                totalTaxes += tax.taxDetail[0].taxValue;
            }
            this.selectedLedger.tdsTcsTaxesSum = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["giddhRoundOff"])(((taxableValue * totalTaxes) / 100), 2);
        }
        else {
            this.selectedLedger.tdsTcsTaxesSum = 0;
            this.selectedLedger.isOtherTaxesApplicable = false;
            this.selectedLedger.otherTaxModal = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["SalesOtherTaxesModal"]();
        }
        this.selectedLedger.otherTaxModal = modal;
        this.selectedLedger.tcsCalculationMethod = modal.tcsCalculationMethod;
        this.selectedLedger.otherTaxesSum = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["giddhRoundOff"])((this.selectedLedger.tdsTcsTaxesSum), 2);
    };
    // FIXME: fix total calculation
    UpdateLedgerVm.prototype.generateGrandTotal = function () {
        var taxTotal = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["sumBy"])(this.selectedTaxes, 'amount') || 0;
        var total = this.totalAmount - this.discountTrxTotal;
        this.taxTrxTotal = taxTotal;
        this.totalForTax = total;
        this.grandTotal = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["giddhRoundOff"])((total + ((total * taxTotal) / 100)), 2);
        this.calculateOtherTaxes(this.selectedLedger.otherTaxModal);
    };
    UpdateLedgerVm.prototype.generateCompoundTotal = function () {
        if (this.entryTotal.crTotal > this.entryTotal.drTotal) {
            this.compoundTotal = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["giddhRoundOff"])((this.entryTotal.crTotal - this.entryTotal.drTotal), 2);
        }
        else {
            this.compoundTotal = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["giddhRoundOff"])((this.entryTotal.drTotal - this.entryTotal.crTotal), 2);
        }
    };
    UpdateLedgerVm.prototype.getUniqueName = function (txn) {
        if ((txn.selectedAccount && txn.selectedAccount.stock)) {
            return txn.particular.uniqueName.split('#')[0];
        }
        else if (txn.inventory && txn.inventory.stock) {
            return txn.particular.uniqueName.split('#')[0];
        }
        return txn.particular.uniqueName;
    };
    UpdateLedgerVm.prototype.inventoryQuantityChanged = function (val) {
        // if val is typeof string change event should be fired and if not then paste event should be fired
        if (typeof val !== 'string') {
            var tempVal = val.clipboardData.getData('text/plain');
            if (Number.isNaN(Number(tempVal))) {
                val.stopImmediatePropagation();
                val.preventDefault();
                return;
            }
            val = tempVal;
        }
        if (Number(this.stockTrxEntry.inventory.rate * val) !== this.stockTrxEntry.amount) {
            this.stockTrxEntry.isUpdated = true;
        }
        this.stockTrxEntry.amount = Number(this.stockTrxEntry.inventory.rate * val);
        this.stockTrxEntry.inventory.unit.rate = this.stockTrxEntry.amount;
        this.getEntryTotal();
        this.generatePanelAmount();
        this.generateGrandTotal();
        this.generateCompoundTotal();
    };
    UpdateLedgerVm.prototype.inventoryPriceChanged = function (val) {
        // if val is typeof string change event should be fired and if not then paste event should be fired
        if (typeof val !== 'string') {
            var tempVal = val.clipboardData.getData('text/plain');
            if (Number.isNaN(Number(tempVal))) {
                val.stopImmediatePropagation();
                val.preventDefault();
                return;
            }
            val = tempVal;
        }
        if (Number(val * this.stockTrxEntry.inventory.quantity) !== this.stockTrxEntry.amount) {
            this.stockTrxEntry.isUpdated = true;
        }
        this.stockTrxEntry.amount = Number(val * this.stockTrxEntry.inventory.quantity);
        this.getEntryTotal();
        this.generatePanelAmount();
        this.generateGrandTotal();
        this.generateCompoundTotal();
    };
    UpdateLedgerVm.prototype.inventoryAmountChanged = function (event) {
        var _this = this;
        if (event === void 0) { event = null; }
        // if val is typeof string change event should be fired and if not then paste event should be fired
        if (event) {
            var tempVal = event.clipboardData.getData('text/plain');
            if (Number.isNaN(Number(tempVal))) {
                event.stopImmediatePropagation();
                event.preventDefault();
                return;
            }
            this.totalAmount = Number(tempVal);
        }
        if (this.stockTrxEntry) {
            if (this.stockTrxEntry.amount !== Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["giddhRoundOff"])(Number(this.totalAmount), 2)) {
                this.stockTrxEntry.isUpdated = true;
            }
            this.stockTrxEntry.amount = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["giddhRoundOff"])(Number(this.totalAmount), 2);
            this.stockTrxEntry.inventory.rate = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["giddhRoundOff"])((Number(this.totalAmount) / this.stockTrxEntry.inventory.quantity), 2);
        }
        else {
            // find account that's from category income || expenses || fixedassets
            var trx = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["find"])(this.selectedLedger.transactions, function (t) {
                var category = _this.getCategoryNameFromAccount(_this.getUniqueName(t));
                return _this.isValidCategory(category);
            });
            if (trx) {
                trx.amount = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["giddhRoundOff"])(Number(this.totalAmount), 2);
                // trx.isUpdated = true;
                // if (trx.amount !== Number(Number(this.totalAmount).toFixed(2))) {
                trx.isUpdated = true;
                // }
            }
        }
        this.getEntryTotal();
        // this.generatePanelAmount();
        if (this.discountComponent) {
            this.discountComponent.ledgerAmount = this.totalAmount;
            this.discountComponent.change();
        }
        this.generateGrandTotal();
        this.generateCompoundTotal();
    };
    UpdateLedgerVm.prototype.inventoryTotalChanged = function (event) {
        var _this = this;
        // if val is typeof string change event should be fired and if not then paste event should be fired
        if (event instanceof ClipboardEvent) {
            var tempVal = event.clipboardData.getData('text/plain');
            if (Number.isNaN(Number(tempVal))) {
                event.stopImmediatePropagation();
                event.preventDefault();
                return;
            }
            this.grandTotal = Number(tempVal);
        }
        else {
            // key press event
            var e = event;
            if (!(typeof this.grandTotal === 'string')) {
                return;
            }
        }
        var fixDiscount = 0;
        var percentageDiscount = 0;
        if (this.discountComponent) {
            percentageDiscount = this.discountComponent.discountAccountsDetails.filter(function (f) { return f.isActive; })
                .filter(function (s) { return s.discountType === 'PERCENTAGE'; })
                .reduce(function (pv, cv) {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;
            fixDiscount = this.discountComponent.discountAccountsDetails.filter(function (f) { return f.isActive; })
                .filter(function (s) { return s.discountType === 'FIX_AMOUNT'; })
                .reduce(function (pv, cv) {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;
        }
        var taxTotal = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["sumBy"])(this.selectedTaxes, 'amount') || 0;
        this.totalAmount = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["giddhRoundOff"])(Number(((Number(this.grandTotal) + fixDiscount + 0.01 * fixDiscount * Number(taxTotal)) /
            (1 - 0.01 * percentageDiscount + 0.01 * Number(taxTotal) - 0.0001 * percentageDiscount * Number(taxTotal)))), 2);
        if (this.stockTrxEntry) {
            this.stockTrxEntry.amount = this.totalAmount;
            var rate = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_3__["giddhRoundOff"])(Number(this.stockTrxEntry.amount / this.stockTrxEntry.inventory.quantity), 2);
            this.stockTrxEntry.inventory.rate = rate;
            this.stockTrxEntry.isUpdated = true;
            if (this.discountComponent) {
                this.discountComponent.ledgerAmount = this.totalAmount;
                this.discountComponent.change();
            }
        }
        else {
            // find account that's from category income || expenses || fixedassets
            var trx = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["find"])(this.selectedLedger.transactions, function (t) {
                var category = _this.getCategoryNameFromAccount(_this.getUniqueName(t));
                return _this.isValidCategory(category);
            });
            if (trx) {
                trx.amount = this.totalAmount;
                trx.isUpdated = true;
            }
            if (this.discountComponent) {
                this.discountComponent.ledgerAmount = this.totalAmount;
                this.discountComponent.change();
            }
        }
        this.getEntryTotal();
        this.generateCompoundTotal();
    };
    UpdateLedgerVm.prototype.unitChanged = function (stockUnitCode) {
        var unit = this.stockTrxEntry.unitRate.find(function (p) { return p.stockUnitCode === stockUnitCode; });
        this.stockTrxEntry.inventory.unit = { code: unit.stockUnitCode, rate: unit.rate, stockUnitCode: unit.stockUnitCode };
        this.stockTrxEntry.inventory.rate = this.stockTrxEntry.inventory.unit.rate;
        this.inventoryPriceChanged(Number(this.stockTrxEntry.inventory.unit.rate));
    };
    UpdateLedgerVm.prototype.taxTrxUpdated = function (taxes) {
        this.selectedTaxes = taxes;
        this.generateGrandTotal();
        this.generateCompoundTotal();
    };
    UpdateLedgerVm.prototype.reInitilizeDiscount = function (resp) {
        var discountArray = [];
        var defaultDiscountIndex = resp.discounts.findIndex(function (f) { return !f.discount.uniqueName; });
        if (defaultDiscountIndex > -1) {
            discountArray.push({
                discountType: resp.discounts[defaultDiscountIndex].discount.discountType,
                amount: resp.discounts[defaultDiscountIndex].amount,
                discountValue: resp.discounts[defaultDiscountIndex].discount.discountValue,
                discountUniqueName: resp.discounts[defaultDiscountIndex].discount.uniqueName,
                name: resp.discounts[defaultDiscountIndex].discount.name,
                particular: resp.discounts[defaultDiscountIndex].account.uniqueName,
                isActive: true
            });
        }
        else {
            discountArray.push({
                discountType: 'FIX_AMOUNT',
                amount: 0,
                name: '',
                particular: '',
                isActive: true,
                discountValue: 0
            });
        }
        resp.discounts.forEach(function (f, index) {
            if (index !== defaultDiscountIndex) {
                discountArray.push({
                    discountType: f.discount.discountType,
                    amount: f.discount.discountValue,
                    name: f.discount.name,
                    particular: f.account.uniqueName,
                    isActive: true,
                    discountValue: f.discount.discountValue,
                    discountUniqueName: f.discount.uniqueName
                });
            }
        });
        this.discountArray = discountArray;
    };
    UpdateLedgerVm.prototype.prepare4Submit = function () {
        var requestObj = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["cloneDeep"])(this.selectedLedger);
        var discounts = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["cloneDeep"])(this.discountArray);
        var taxes = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_0__["cloneDeep"])(this.selectedTaxes);
        requestObj.voucherType = requestObj.voucher.shortCode;
        requestObj.transactions = requestObj.transactions ? requestObj.transactions.filter(function (p) { return p.particular.uniqueName && !p.isDiscount; }) : [];
        requestObj.generateInvoice = this.selectedLedger.generateInvoice;
        requestObj.transactions.map(function (trx) {
            if (trx.inventory && trx.inventory.stock) {
                trx.particular.uniqueName = trx.particular.uniqueName.split('#')[0];
            }
        });
        requestObj.taxes = taxes.map(function (t) { return t.particular.uniqueName; }).slice();
        if (requestObj.isOtherTaxesApplicable) {
            requestObj.taxes.push(requestObj.otherTaxModal.appliedOtherTax.uniqueName);
        }
        requestObj.discounts = discounts.filter(function (p) { return p.amount && p.isActive; }).map(function (m) {
            m.amount = m.discountValue;
            return m;
        });
        this.getEntryTotal();
        requestObj.total = this.entryTotal.drTotal - this.entryTotal.crTotal;
        return requestObj;
    };
    UpdateLedgerVm.prototype.getUnderstandingText = function (selectedLedgerAccountType, accountName) {
        var data = _.cloneDeep(apps_web_giddh_src_app_ledger_underStandingTextData__WEBPACK_IMPORTED_MODULE_1__["underStandingTextData"].find(function (p) { return p.accountType === selectedLedgerAccountType; }));
        if (data) {
            data.balanceText.cr = data.balanceText.cr.replace('<accountName>', accountName);
            data.balanceText.dr = data.balanceText.dr.replace('<accountName>', accountName);
            data.text.dr = data.text.dr.replace('<accountName>', accountName);
            data.text.cr = data.text.cr.replace('<accountName>', accountName);
            this.ledgerUnderStandingObj = _.cloneDeep(data);
        }
    };
    UpdateLedgerVm.prototype.resetVM = function () {
        this.selectedLedger = null;
        this.selectedLedgerBackup = null;
        this.taxRenderData = [];
        this.selectedTaxes = [];
        this.discountArray = [];
    };
    return UpdateLedgerVm;
}());



/***/ }),

/***/ "./src/app/ledger/components/updateLedgerEntryPanel/updateLedgerEntryPanel.component.css":
/*!***********************************************************************************************!*\
  !*** ./src/app/ledger/components/updateLedgerEntryPanel/updateLedgerEntryPanel.component.css ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".pItem {\n    padding: 0 4px;\n}\n\n.ledgHead.entry-popup table td.select2-ledger>sh-select {\n    position: initial;\n    margin-top: 1px;\n}\n\n.mr-15{\n    margin-right: -15px;\n}\n\ntable.width100 {\n    position: relative\n}\n\n.currency_type {\n    position: absolute;\n    top: 50%;\n    right: 6px;\n    -webkit-transform: translateY(-50%);\n            transform: translateY(-50%);\n}\n\n.multicurrency_input {\n    padding-right: 35px !important;\n}\n\n.modal-header ng-select {\n    width: 339px !important;\n}\n\n.modal-header ng-select div {\n    border: 0;\n    background-color: transparent;\n}\n\n.modal-header ng-select div a.ng-star-inserted {\n    font-size: 18px;\n    color: #fff;\n}\n\n.modal-header ng-select div i.fa.fa-caret-up::before {\n    color: #fff;\n    font-size: 24px;\n}\n\nng-select>div i.fa.fa-caret-down::before {\n    color: #fff;\n    font-size: 20px;\n}\n\nng-select>div a.ng-star-inserted {\n    color: #fff;\n    text-transform: uppercase;\n    font-size: 16px;\n}\n\nng-select>div {\n    background-color: transparent;\n    border: none;\n}\n\nng-select .select_drop i.fa.fa-caret-up::before {\n    color: #fff;\n    font-size: 20px;\n}\n\n.trxFakeInput {\n    width: 100%;\n    height: 34px;\n    background: #f1f1f1;\n    border: none !important;\n    padding: 5px;\n    color: #b5b5b5;\n}\n\n.notfound-option.active {\n    background: #efeff1 !important;\n    padding: 2px 5px !important;\n}\n\n.no-padding {\n    padding: 0px !important;\n}\n\n.amnt-total {\n    font-size: 12px;\n    color: #999999;\n    padding-left: 5px;\n}\n\n.total_col span.bdrT {\n    width: 150px;\n    display: inline-block;\n    padding: 2px 0;\n}\n\n/* .ledger-main .form-control {\n    height: 26px;\n} */\n\n.ledger_book {\n    position: relative;\n    width: 100%;\n    display: -webkit-box;\n    display: flex;\n}\n\n.left-col-new, .right-col-new {\n    width: 100%;\n    padding-bottom: 100px;\n    height: initial;\n}\n\n.ledgHead.entry-popup table td:last-child {\n    border-right: 0px;\n}\n\n.custom-tabs {\n    display: none !important;\n}\n\n@media only screen and (max-width: 1024px) {\n    .ledger_book {\n        display: block;\n    }\n    .left-col-new, .right-col-new {\n        width: 100% !important;\n        float: left;\n        height: initial;\n        display: none;\n    }\n    .custom-tabs {\n        display: block !important;\n    }\n    .left-col-new.active, .right-col-new.active {\n        display: block !important;\n    }\n}\n\n@media only screen and (max-width: 767px) {\n    .ledger_book .h-table tbody .ledger-row td {\n        padding-left: 80px !important;\n    }\n    .card-table tbody tr td {\n        padding-left: 70px !important;        \n    }\n    .ledger-footer-1 {\n        position: absolute;\n        bottom: 0;\n    }\n    \n\n\n    /*  */\n    .total-detail-table tbody tr td {\n        padding: 8px 0;\n    }\n    .total-detail-table > tbody > tr {\n        display: -webkit-box;\n        display: flex;\n        flex-wrap: wrap;\n    }\n    .qty-unit {\n        width: 90%;\n    }\n    .qty-unit table {\n        width: 100%;\n    }\n    .qty-unit table td.text-right.width40 {\n        padding-right: 20px !important;\n    }\n    .table-plus {\n        width: 10%;\n        text-align: center;\n    }\n    .price {\n        width: 40%;\n    }\n    .equal-2, .table-minus { \n        width: 10%;\n        text-align: center;\n    }\n    .amount {\n        width: 40%;\n    }\n    .entrypanel:before {\n        display: none;\n    }\n    .total-amn {\n        width: 100%;\n    }\n    .xs-table-block {\n        width: 100%;\n        display: block;\n    }\n    .xs-table-block tbody tr td {\n        display: block;\n    }\n\n    \n}\n\n\n"

/***/ }),

/***/ "./src/app/ledger/components/updateLedgerEntryPanel/updateLedgerEntryPanel.component.html":
/*!************************************************************************************************!*\
  !*** ./src/app/ledger/components/updateLedgerEntryPanel/updateLedgerEntryPanel.component.html ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"entryModal\">\n  <div class=\"modal-header\">\n    <span aria-hidden=\"true\" class=\"close hover-orange\" data-dismiss=\"modal\" (click)=\"closeUpdateLedgerModal.emit()\" aria-label=\"Close\">×</span>\n\n    <h3 *ngIf=\"!openDropDown\" (dblclick)=\"openHeaderDropDown()\" class=\"d-inline-block mr-1\">{{(baseAccount$ | async)?.name}} A/c</h3>\n    <sh-select *ngIf=\"openDropDown\" class=\"d-inline-block\" [disabled]=\"false\" placeholder=\"Select Group\" filterPlaceholder=\"Type to filter..\"\n      name=\"accountUniqueName\" [(ngModel)]=\"baseAccountName$\" [useInBuiltFilterForFlattenAc]=\"true\" [showClear]=\"false\" [options]=\"vm.flatternAccountList4BaseAccount\"\n      style=\"width:30%\">\n      <ng-template #optionTemplate let-option=\"option\">\n        <ng-container *ngIf=\"!option.additional?.stock\">\n          <a href=\"javascript:void(0)\" class=\"\" (click)=\"changeBaseAccount(option)\" style=\"border-bottom: 1px solid #ccc;\">\n            <div class=\"item\">{{option?.label}}</div>\n            <div class=\"item_unq fs12\">{{option.additional?.uniqueName}}</div>\n          </a>\n        </ng-container>\n        <ng-container *ngIf=\"option.additional?.stock\">\n          <a href=\"javascript:void(0)\" class=\"\" (click)=\"changeBaseAccount(option)\" style=\"border-bottom: 1px solid #ccc;\">\n            <div class=\"item\">{{option?.label}}</div>\n            <div class=\"item_unq fs12\">{{option.additional?.uniqueName}}</div>\n            <div class=\"item_stock\">Stock: {{option.additional?.stock.name}}</div>\n          </a>\n        </ng-container>\n      </ng-template>\n    </sh-select>\n    <!--<div class=\"\">\n<button class=\"btn btn-success\" [ladda]=\"isTxnUpdateInProcess$ | async\" (click)=\"saveLedgerTransaction()\" [hidden]=\"!isChangeAcc\">Update\n</button>\n</div>-->\n    <!-- <h3 *ngIf=\"(baseAccount$ | async)?.name\">\n{{(baseAccount$ | async)?.name}} A/c\n<button class=\"btn btn-default mrL1\" (click)=\"openBaseAccountModal()\" *ngIf=\"!vm.selectedLedger.voucherGenerated\">change</button>\n</h3> -->\n    <!-- <h3>{{(baseAccount$ | async)?.name}} A/c</h3> -->\n  </div>\n  <div class=\"modal-body\" [hidden]=\"isChangeAcc\">\n    <!-- transactions -->\n    <!-- <div class=\"row\">\n<h1 class=\"text-center lead\">{{(activeAccount$ | async)?.name}} A/c</h1>\n</div> -->\n    <div class=\"ledgHead entry-popup\">\n      <table class=\"col-xs-12 ledger-head mrT1 hidden-xs\">\n        <thead>\n          <tr>\n            <th [ngClass]=\"Shown ? 'active' : ''\" class=\"col-xs-6 hidden-xs\">{{vm.ledgerUnderStandingObj.text.dr}}</th>\n            <th class=\"col-xs-6 hidden-xs\">{{vm.ledgerUnderStandingObj.text.cr}}</th>\n          </tr>\n        </thead>\n      </table>\n\n      <div class=\"custom-tabs mt-2 mb-2\">\n        <ul class=\"nav nav-tabs pt-0\">\n          <li role=\"presentation\" [className]=\"condition ? 'active' : ''\">\n            <a href=\"javascript:void(0)\" (click)=\"toggleShow()\">DR</a>\n          </li>\n          <li role=\"presentation\" [className]=\"condition2 ? 'active' : ''\">\n            <a href=\"javascript:void(0)\" (click)=\"toggleShow()\">CR</a>\n          </li>\n        </ul>\n      </div>\n\n      <div class=\"ledger_book\">\n        <!-- debit -->\n        <div class=\"left-col-new bdrR\" [ngClass]=\"Shown ? 'active' : ''\">\n\n          <table class=\"width100 card-table\">\n            <thead class=\"hidden-xs\">\n              <tr class=\"t-h-bg1\">\n                <th class=\"col-xs-2\" style=\"border-top:none\">\n                  <span class=\"cursor-pointer\">\n                    Date\n                  </span>\n                </th>\n                <th class=\"col-xs-6\" style=\"border-top:none\">Paticular</th>\n                <th class=\"col-xs-2\" style=\"border-top:none\">\n                  Amount\n                  <span *ngIf=\"isMultiCurrencyAvailable\">{{ baseCurrency }}</span>\n                </th>\n                <th class=\"col-xs-2 text-right\" style=\"border-top:none\" *ngIf=\"isMultiCurrencyAvailable\">\n                  Amount\n                </th>\n              </tr>\n            </thead>\n\n            <tbody class=\"ledger-main\">\n              <tr class=\"debit-blank-row\" *ngFor=\"let txn of vm.selectedLedger.transactions\">\n                <ng-container *ngIf=\"txn.type === 'DEBIT'\">\n                  <td class=\"col-xs-2\" data-title=\"Date\">\n                    <input type=\"text\" autocomplete=\"off\" name=\"datess\" #dbs='bsDatepicker' [(ngModel)]=\"vm.selectedLedger.entryDate\" class=\"form-control\"\n                      bsDatepicker [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\" (click)=\"addBlankTrx('DEBIT', txn, $event)\"\n                      placeholder=\"date\">\n                  </td>\n\n                  <td data-title=\"Paticular\" id=\"DbtTd\" class=\"col-xs-6 pos-rel select2-parent select2-ledger\">\n\n                    <ng-template [ngIf]=\"!txn.isDiscount\">\n                      <sh-select id=\"dbtID\" [notFoundLink]=\"true\" (noResultsClicked)=\"showQuickAccountModal()\" (keydown)=\"keydownPressed($event)\"\n                        [options]=\"vm.flatternAccountList4Select | async\" #dbtSelect (click)=\"addBlankTrx('DEBIT', txn, $event)\"\n                        (selected)=\"selectAccount($event,txn, dbtSelect)\" [showClear]=\"false\" [(ngModel)]=\"txn.particular.uniqueName\"\n                        [ItemHeight]=\"67\" (onShow)=\"dbs.hide()\" [useInBuiltFilterForFlattenAc]=\"true\">\n                        <ng-template #optionTemplate let-option=\"option\">\n                          <ng-container *ngIf=\"!option.additional?.stock\">\n                            <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                              <div class=\"item\">{{ option.label }}</div>\n                              <div class=\"item_unq\">{{ option.additional?.uniqueName }}</div>\n                            </a>\n                          </ng-container>\n                          <ng-container *ngIf=\"option.additional?.stock\">\n                            <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                              <div class=\"item\">{{ option.label }}</div>\n                              <div class=\"item_unq\">{{ option.additional?.uniqueName }}</div>\n                              <div class=\"item_stock\">Stock: {{ option.additional?.stock.name }}</div>\n                            </a>\n                          </ng-container>\n                        </ng-template>\n                        <ng-template #notFoundLinkTemplate>\n\n                          <a id=\"createNewId\" [ngClass]=\"{'active': keydownClassAdded}\" class=\"notfound-option\" [keyboardShortcut]=\"'alt+c'\" (onShortcutPress)=\"toggleAsidePaneOpen()\">\n                            <span [ngClass]=\"{'active': keydownClassAdded}\">Create New</span>\n                            <span [ngClass]=\"{'active': keydownClassAdded}\" class=\"pull-right\">Alt+C</span>\n                          </a>\n                        </ng-template>\n                      </sh-select>\n                    </ng-template>\n\n                    <ng-template [ngIf]=\"txn.isDiscount\">\n                      <input [disabled]=\"true\" [(ngModel)]=\"txn.particular.name\" class=\"trxFakeInput\" />\n                    </ng-template>\n\n                  </td>\n\n                  <td class=\"col-xs-2\" data-title=\"Amount\">\n                    <input type=\"text\" [(ngModel)]=\"txn.amount\" class=\"form-control\" decimalDigitsDirective [DecimalPlaces]=\"2\" (click)=\"addBlankTrx('DEBIT', txn, $event)\"\n                      (ngModelChange)=\"onTxnAmountChange(txn)\">\n                    <span class=\"download-invoice-ledger\" *ngIf=\"vm.selectedLedger.attachedFile && vm.selectedLedger.attachedFile.length > 0\"\n                      (click)=\"downloadAttachedFile(vm.selectedLedger.attachedFile, $event)\" [placement]=\"'left'\" [containerClass]=\"'col-xs-3'\"\n                      tooltip=\"Download file : {{vm.selectedLedger.attachedFileName}}\">\n                      <i class=\"glyphicon glyphicon-download pull-left\" style=\"font-size:15px;\"></i>\n                    </span>\n                    <span class=\"download-invoice-ledger \" *ngIf=\"vm.selectedLedger.voucherNumber && vm.selectedLedger.voucherNumber.length> 0\"\n                      [placement]=\"'left'\" [containerClass]=\"'col-xs-3'\" tooltip=\"Download Invoice : {{vm.selectedLedger.voucherNumber}}\"\n                      (click)=\"downloadInvoice(vm.selectedLedger.voucherNumber, vm.selectedLedger.voucherGeneratedType ? vm.selectedLedger.voucherGeneratedType : vm.selectedLedger.voucher.name, $event)\">\n                      <i class=\"glyphicon glyphicon-download pull-left\" style=\"font-size:15px;\"></i>\n                    </span>\n                    <p class=\"mb-0 amnt-total\" *ngIf=\"totalPrice\">$454</p>\n                  </td>\n                  <td data-title=\"Amount\" class=\"col-xs-2 pos-rel text-right\" *ngIf=\"isMultiCurrencyAvailable\">\n                    <input type=\"text\" [(ngModel)]=\"txn.convertedAmount\" class=\"form-control multicurrency_input\" decimalDigitsDirective [DecimalPlaces]=\"2\"\n                      (click)=\"addBlankTrx('DEBIT', txn, $event)\" (change)=\"onTxnAmountChange(txn)\">\n                    <span class=\"currency_type\" *ngIf=\"isMultiCurrencyAvailable && txn.convertedAmount\">({{txn.convertedAmountCurrency}})</span>\n                  </td>\n                </ng-container>\n              </tr>\n            </tbody>\n          </table>\n\n          <!-- debit -->\n          <table class=\"ledger-footer-1\">\n\n            <tbody>\n              <tr class=\"total_col\">\n                <td colspan=\"12\" class=\"col-xs-12 text-right h32\">\n                  <span *ngIf=\"vm.entryTotal.crTotal > vm.entryTotal.drTotal\" class=\"pd2\" [tooltip]=\"vm.ledgerUnderStandingObj.balanceText.cr\"\n                    [placement]=\"'top'\">\n                    C/F: CR {{vm.compoundTotal | giddhCurrency}}</span>\n                  <!-- <ng-template #understandingTextCr>\n  {{ vm.ledgerUnderStandingObj.balanceText.cr }}\n  </ng-template> -->\n                </td>\n              </tr>\n\n              <tr class=\"total_col\">\n                <!-- reckoning -->\n                <td colspan=\"12\" class=\"col-xs-12 text-right h32\">\n                  <span class=\"bdrT pr-1 pl-1 width-200\">\n                    {{ (vm.entryTotal.drTotal > vm.entryTotal.crTotal ? vm.entryTotal.drTotal : vm.entryTotal.crTotal) | giddhCurrency}}\n                    <!--{{ vm.entryTotal.crTotal > vm.entryTotal.drTotal ? vm.entryTotal.crTotal : vm.entryTotal.drTotal | giddhCurrency }}-->\n                  </span>\n                  <p class=\"mb-0 amnt-total pr-1 pl-1\" *ngIf=\"totalPrice\">$454</p>\n                </td>\n              </tr>\n\n            </tbody>\n\n          </table>\n          <!-- debit -->\n\n\n        </div>\n        <!-- debit -->\n\n        <!-- credit -->\n        <div class=\"right-col-new\" [ngClass]=\"isHide ? 'active' : 'right-col-new'\">\n\n          <table class=\"width100 card-table\">\n            <thead class=\"xs-hidden\">\n              <tr class=\"t-h-bg1\">\n                <th class=\"col-xs-2\" style=\"border-top:none\">\n                  <span class=\"cursor-pointer\">\n                    Date\n                  </span>\n                </th>\n                <th class=\"col-xs-6\" style=\"border-top:none\">Paticular</th>\n                <th class=\"col-xs-2\" style=\"border-top:none\">Amount\n                  <span *ngIf=\"isMultiCurrencyAvailable\">{{ baseCurrency }}</span>\n                </th>\n                <th class=\"col-xs-2 text-right\" style=\"border-top:none\" *ngIf=\"isMultiCurrencyAvailable\">Amount</th>\n              </tr>\n            </thead>\n\n            <tbody class=\"ledger-main\">\n\n              <tr *ngFor=\"let txn of vm.selectedLedger.transactions\">\n\n                <ng-container *ngIf=\"txn.type == 'CREDIT'\">\n\n                  <td data-title=\"Date\" class=\"col-xs-2\">\n                    <input class=\"form-control\" autocomplete=\"off\" name=\"datepic\" type=\"text\" [(ngModel)]=\"vm.selectedLedger.entryDate\" (click)=\"addBlankTrx('CREDIT', txn, $event)\"\n                      #cbs='bsDatepicker' bsDatepicker [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\">\n                  </td>\n\n                  <td data-title=\"Particular\" id=\"crdIDTd\" class=\"pos-rel col-xs-6 select2-ledger\">\n\n                    <ng-template [ngIf]=\"!txn.isDiscount\">\n\n                      <sh-select id=\"crdID\" [notFoundLink]=\"true\" (noResultsClicked)=\"showQuickAccountModal()\" (keydown)=\"keydownPressed($event)\"\n                        [options]=\"vm.flatternAccountList4Select | async\" #crdSelect (click)=\"addBlankTrx('CREDIT', txn, $event)\"\n                        (selected)=\"selectAccount($event,txn, crdSelect)\" (onShow)=\"cbs.hide()\" [showClear]=\"false\" [(ngModel)]=\"txn.particular.uniqueName\"\n                        [ItemHeight]=\"67\" [useInBuiltFilterForFlattenAc]=\"true\">\n                        <ng-template #optionTemplate let-option=\"option\">\n                          <ng-container *ngIf=\"!option.additional?.stock\">\n                            <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                              <div class=\"item\">{{ option.label }}</div>\n                              <div class=\"item_unq\">{{ option.additional?.uniqueName }}</div>\n                            </a>\n                          </ng-container>\n                          <ng-container *ngIf=\"option.additional?.stock\">\n                            <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                              <div class=\"item\">{{ option.label }}</div>\n                              <div class=\"item_unq\">{{ option.additional?.uniqueName }}</div>\n                              <div class=\"item_stock\">Stock: {{ option.additional?.stock.name }}</div>\n                            </a>\n                          </ng-container>\n                        </ng-template>\n                        <ng-template #notFoundLinkTemplate>\n\n                          <a id=\"createNewId2\" [ngClass]=\"{'active': keydownClassAdded}\" class=\"notfound-option\" [keyboardShortcut]=\"'alt+c'\" (onShortcutPress)=\"toggleAsidePaneOpen()\">\n                            <span [ngClass]=\"{'active': keydownClassAdded}\">Create New</span>\n                            <span [ngClass]=\"{'active': keydownClassAdded}\" class=\"pull-right\">Alt+C</span>\n                          </a>\n                        </ng-template>\n                      </sh-select>\n\n                    </ng-template>\n\n                    <ng-template [ngIf]=\"txn.isDiscount\">\n                      <input [disabled]=\"true\" [(ngModel)]=\"txn.particular.name\" class=\"trxFakeInput\" />\n                    </ng-template>\n\n                  </td>\n\n                  <td data-title=\"Amount\" class=\"col-xs-2\">\n\n                    <input class=\"form-control\" type=\"text\" [(ngModel)]=\"txn.amount\" [disabled]=\"txn.isDiscount\" (click)=\"addBlankTrx('CREDIT', txn, $event)\"\n                      decimalDigitsDirective [DecimalPlaces]=\"2\" (change)=\"onTxnAmountChange(txn)\">\n                    <span class=\"download-invoice-ledger\" *ngIf=\"vm.selectedLedger.attachedFile.length > 0\" [placement]=\"'left'\" [containerClass]=\"'col-xs-3'\"\n                      tooltip=\"Download file : {{vm.selectedLedger.attachedFileName}}\" (click)=\"downloadAttachedFile(vm.selectedLedger.attachedFile, $event)\">\n                      <i class=\"glyphicon glyphicon-download pull-left\" style=\"font-size:15px;\"></i>\n                    </span>\n\n                    <span class=\"download-invoice-ledger\" *ngIf=\"vm.selectedLedger.voucherNumber && vm.selectedLedger.voucherNumber.length > 0\"\n                      [placement]=\"'left'\" [containerClass]=\"'col-xs-3'\" tooltip=\"Download Invoice : {{vm.selectedLedger.voucherNumber}}\"\n                      (click)=\"downloadInvoice(vm.selectedLedger.voucherNumber, vm.selectedLedger.voucherGeneratedType ? vm.selectedLedger.voucherGeneratedType : vm.selectedLedger.voucher.name, $event)\">\n                      <i class=\"glyphicon glyphicon-download pull-left\" style=\"font-size:15px;\"></i>\n                    </span>\n\n                    <p class=\"mb-0 amnt-total\" *ngIf=\"totalPrice\">$454</p>\n\n                  </td>\n\n                  <td data-title=\"Amount\" class=\"col-xs-2 pos-rel text-right\" *ngIf=\"isMultiCurrencyAvailable\">\n\n                    <input class=\"form-control \" type=\"text\" [(ngModel)]=\"txn.convertedAmount\" [disabled]=\"txn.isDiscount\" (click)=\"addBlankTrx('CREDIT', txn, $event)\"\n                      decimalDigitsDirective [DecimalPlaces]=\"2\" (change)=\"onTxnAmountChange(txn)\">\n\n                    <span class=\"currency_type\" *ngIf=\"isMultiCurrencyAvailable && txn.convertedAmount\">({{txn.convertedAmountCurrency}})</span>\n                  </td>\n\n                </ng-container>\n              </tr>\n            </tbody>\n          </table>\n\n\n          <!-- totals -->\n\n\n          <!-- credit -->\n          <table class=\"ledger-footer-1\">\n\n            <tbody>\n\n              <tr class=\"total_col\">\n                <td colspan=\"12\" class=\"col-xs-12  text-right h32\">\n                  <span *ngIf=\"vm.entryTotal.drTotal > vm.entryTotal.crTotal\">C/F: Dr\n                    <span class=\"primary_clr pd2\" [tooltip]=\"vm.ledgerUnderStandingObj.balanceText.dr\" [placement]=\"'top'\">\n                      {{vm.compoundTotal | giddhCurrency}}</span>\n                    <!--                                <ng-template #understandingTextDr>-->\n                    <!--                                    {{ vm.ledgerUnderStandingObj.balanceText.dr }}-->\n                    <!--                                </ng-template>-->\n                  </span>\n                </td>\n              </tr>\n\n              <tr class=\"total_col\">\n\n                <!-- reckoning -->\n                <td colspan=\"12\" class=\"col-xs-12 text-right h32\" style=\"padding-right:10px !important;\">\n                  <span class=\"bdrT\">\n                    {{ (vm.entryTotal.crTotal > vm.entryTotal.drTotal ? vm.entryTotal.crTotal : vm.entryTotal.drTotal) | giddhCurrency }}\n                  </span>\n                  <p class=\"mb-0 amnt-total\" *ngIf=\"totalPrice\">$454</p>\n                </td>\n              </tr>\n\n            </tbody>\n\n          </table>\n\n        </div>\n        <!-- credit -->\n\n\n      </div>\n\n    </div>\n\n    <!-- transactions -->\n    <!-- new entry -->\n    <div class=\"entrypanel pull-left width100 pt-1\">\n      <div class=\"row\">\n        <div class=\"col-md-6\">\n          <div>\n            <!-- amount and discount container -->\n            <ng-container *ngIf=\"vm.showNewEntryPanel\">\n              <div class=\"\">\n\n                <table class=\"width100 total-detail-table\">\n                  <tbody>\n\n                    <tr>\n                      <td *ngIf=\"vm.stockTrxEntry\" class=\"qty-unit\">\n\n                        <table>\n\n                          <tbody>\n\n                            <tr>\n                              <ng-template [ngIf]=\"vm.stockTrxEntry\">\n                                <td [ngClass]=\"{width40: vm.stockTrxEntry}\" class=\"text-right\">\n                                  <label>Quantity</label>\n                                  <input type=\"number\" name=\"\" class=\"form-control text-right\" [(ngModel)]=\"vm.stockTrxEntry.inventory.quantity\" decimalDigitsDirective\n                                    [DecimalPlaces]=\"4\" (paste)=\"vm.inventoryQuantityChanged($event)\" (change)=\"vm.inventoryQuantityChanged($event.target.value)\"\n                                  />\n                                </td>\n                                <td class=\"text-right pItem\" style=\"width: 115px;\">\n                                  <label>Unit</label>\n                                  <select class=\"form-control text-right no-padding\" [(ngModel)]=\"vm.stockTrxEntry.inventory.unit.code\" (change)=\"vm.unitChanged($event.target.value)\">\n                                    <option *ngFor=\"let item of vm.stockTrxEntry.unitRate\" [value]=\"item.stockUnitCode\">\n                                      {{item.stockUnitCode}}\n                                    </option>\n                                  </select>\n                                </td>\n                              </ng-template>\n                            </tr>\n\n                          </tbody>\n                        </table>\n\n                      </td>\n\n                      <td class=\"table-plus\" *ngIf=\"vm.stockTrxEntry\">\n                        <label class=\"d-block\">&nbsp;</label>\n                        <label class=\"fs20\">x</label>\n                      </td>\n\n                      <ng-template [ngIf]=\"vm.stockTrxEntry\">\n                        <td class=\"text-right price pItem\">\n                          <label>Price</label>\n                          <input type=\"text\" name=\"\" (paste)=\"vm.inventoryPriceChanged($event)\" (change)=\"vm.inventoryPriceChanged($event.target.value)\"\n                            decimalDigitsDirective [DecimalPlaces]=\"4\" [(ngModel)]=\"vm.stockTrxEntry.inventory.rate\" class=\"form-control text-right\"\n                          />\n                          <p class=\"mb-0 amnt-total pr-1 pl-1\" *ngIf=\"totalPrice\">\n                            <i class=\"icon-rupees font-10\"></i> 3259.56</p>\n                        </td>\n                      </ng-template>\n\n                      <td class=\"equal-2\" *ngIf=\"vm.stockTrxEntry\">\n                        <label class=\"d-block\">&nbsp;</label>\n                        <label class=\"fs20\">=</label>\n                      </td>\n\n                      <td class=\"text-right pItem amount\">\n                        <label class=\"primary_clr\">Amount</label>\n                        <input type=\"text\" name=\"\" class=\"form-control text-right\" decimalDigitsDirective [DecimalPlaces]=\"2\" (paste)=\"vm.inventoryAmountChanged($event)\"\n                          (focus)=\"hideDiscountTax()\" (blur)=\"vm.inventoryAmountChanged()\" [(ngModel)]=\"vm.totalAmount\" />\n                        <p class=\"mb-0 amnt-total pr-1 pl-1\" *ngIf=\"totalPrice\">\n                          <i class=\"icon-rupees font-10\"></i> 3259.56</p>\n                      </td>\n\n                      <td class=\"table-minus\">\n                        <label class=\"d-block\">&nbsp;</label>\n                        <label class=\"fs20\">-</label>\n                      </td>\n\n                      <td class=\"text-right pItem price\">\n                        <span auto-close=\"outsideClick\">\n                          <update-ledger-discount #discount [discountAccountsDetails]=\"vm.discountArray\" [ledgerAmount]=\"vm.selectedLedger.actualAmount\"\n                            (discountTotalUpdated)=\"vm.discountTrxTotal = $event;vm.handleDiscountEntry(); vm.generateGrandTotal();\"\n                            (hideOtherPopups)=\"hideTax()\">\n                          </update-ledger-discount>\n                        </span>\n                        <p class=\"mb-0 amnt-total pr-1 pl-1\" *ngIf=\"totalPrice\">\n                          <i class=\"icon-rupees font-10\"></i> 3259.56</p>\n                      </td>\n\n                      <td class=\"text-center equal-2\" *ngIf=\"(vm.companyTaxesList$ | async)?.length\">\n                        <label class=\"d-block\">&nbsp;</label>\n                        <label class=\"fs20\">+</label>\n                      </td>\n\n                      <td class=\"pos-rel dropdown-container pItem amount dropdow-tooltip\" *ngIf=\"(vm.companyTaxesList$ | async)?.length\">\n                        <span auto-close=\"outsideClick\">\n                          <update-ledger-tax-control #tax [taxes]=\"vm.companyTaxesList$ | async\" [date]=\"vm.selectedLedger.entryDate\" [taxRenderData]=\"vm.taxRenderData\"\n                            [totalForTax]=\"vm.totalForTax\" [exceptTaxTypes]=\"['tdsrc', 'tdspay','tcspay', 'tcsrc']\" [applicableTaxes]=\"currentAccountApplicableTaxes.length ? currentAccountApplicableTaxes : vm.selectedLedger.taxes\"\n                            (hideOtherPopups)=\"hideDiscount()\" (selectedTaxEvent)=\"vm.taxTrxUpdated($event)\"></update-ledger-tax-control>\n                        </span>\n                        <p class=\"mb-0 amnt-total pr-1 pl-1\" *ngIf=\"totalPrice\">\n                          <i class=\"icon-rupees font-10\"></i> 3259.56</p>\n                      </td>\n\n                      <td class=\"text-center equal-2\">\n                        <label class=\"d-block\">&nbsp;</label>\n                        <label class=\"fs20\">=</label>\n                      </td>\n\n                      <td class=\"text-right pItem total-amn\" style=\"min-width: 85px;\" (resized)=\"onResized($event)\">\n                        <label class=\"primary_clr\">Total</label>\n                        <input type=\"text\" name=\"\" class=\"form-control text-right\" decimalDigitsDirective [DecimalPlaces]=\"2\" [(ngModel)]=\"vm.grandTotal\"\n                          (paste)=\"vm.inventoryTotalChanged($event)\" (blur)=\"vm.inventoryTotalChanged($event)\" />\n                        <p class=\"mb-0 amnt-total pr-1 pl-1\" *ngIf=\"totalPrice\">\n                          <i class=\"icon-rupees font-10\"></i> 3259.56</p>\n                      </td>\n\n                    </tr>\n\n                  </tbody>\n\n                </table>\n\n\n                <div class=\"text-right mrB1\" style=\"display: flex;justify-content: flex-end;\">\n                  <input type=\"checkbox\" [(ngModel)]=\"vm.selectedLedger.isOtherTaxesApplicable\" *ngIf=\"!vm.selectedLedger.isOtherTaxesApplicable\"\n                    (ngModelChange)=\"toggleOtherTaxesAsideMenu.emit(vm)\" />\n                  <p *ngIf=\"!vm.selectedLedger.isOtherTaxesApplicable\">Other Tax ?</p>\n\n                  <div *ngIf=\"vm.selectedLedger.isOtherTaxesApplicable\" class=\"mrT1\">\n                    <label>Other Tax</label>\n                    <span style=\"display: flex;align-items: center;margin-right: 6px\" [ngStyle]=\"{'width': totalTdElementWidth + 'px'}\">\n                      <span>\n                        <a href=\"javascript: void 0\" (click)=\"toggleOtherTaxesAsideMenu.emit(vm)\">\n                          <img src=\"assets/images/edit-pencilicon.svg\">\n                        </a>\n                      </span>\n                      <input class=\"text-right form-control mrL1\" disabled=\"disabled\" [(ngModel)]=\"vm.selectedLedger.otherTaxesSum\" name=\"entry.otherTaxesSum\"\n                      />\n                    </span>\n                  </div>\n                </div>\n\n              </div>\n\n              <div class=\"col-xs-12 pd1 text-right\">\n                <span class=\"inWords\">{{vm.grandTotal | myNumberToWordsPipe | lowercase}}</span>\n              </div>\n\n            </ng-container>\n\n            <div class=\"\" [ngClass]=\"{'col-xs-12': vm.showNewEntryPanel, 'col-xs-8': !vm.showNewEntryPanel}\">\n              <div class=\"row\">\n                <textarea rows=\"3\" cols=\"\" [(ngModel)]=\"vm.selectedLedger.description\" class=\"form-control\" placeholder=\"Description\"></textarea>\n              </div>\n            </div>\n\n          </div>\n\n        </div>\n\n        <div class=\"col-md-6\">\n\n          <table class=\"width100\">\n            <tbody>\n\n              <tr>\n                <td class=\"primary_clr\" (click)=\"getInvoiveLists(); showAdvanced = !showAdvanced\">\n                  <i class=\"fa cp\" [ngClass]=\"{'fa-minus-square-o':showAdvanced, 'fa-plus-square-o': !showAdvanced}\"></i>\n                  <button class=\"no-btn pdL0\">&nbsp; More Details</button>\n                </td>\n                <td class=\"text-right\">\n                  <span class=\"primary_clr\" *ngIf=\"totalPrice\">Total in INR: {{vm.compoundTotal | giddhCurrency}}</span>\n                </td>\n              </tr>\n\n            </tbody>\n          </table>\n\n          <div class=\"pd1 mrB mrT advanced\" style=\"background: #F1F5F8;\" *ngIf=\"showAdvanced\">\n\n            <table class=\"xs-table-block\">\n\n              <tr>\n                <td class=\"select2-parent pdR1\">\n                  <div class=\"form-group\">\n                    <label class=\"default_clr\">Voucher Type</label>\n                    <sh-select [options]=\"vm.voucherTypeList\" [isFilterEnabled]=\"true\" [(ngModel)]=\"vm.selectedLedger.voucher.shortCode\" [showClear]=\"false\"\n                      (selected)=\"getInvoiveListsData($event)\" [ItemHeight]=\"'auto'\" [width]=\"'161px'\"></sh-select>\n                  </div>\n                </td>\n                <td class=\"pdR1\" *ngIf=\"(vm.selectedLedger.voucher.shortCode === 'sal' || vm.selectedLedger.voucher.shortCode === 'pur'      ||     vm.selectedLedger.voucher.shortCode == 'debit note' || vm.selectedLedger.voucher.shortCode == 'credit note'  || vm.selectedLedger.voucher.shortCode == 'pay')\">\n                  <div class=\"form-group\">\n                    <label class=\"default_clr\">Invoice No.</label>\n                    <input type=\"text\" placeholder=\"Invoice no.\" class=\"form-control\" [(ngModel)]=\"vm.selectedLedger.invoiceNumberAgainstVoucher\"\n                    />\n                  </div>\n                </td>\n                <td class=\"pdR1\" *ngIf=\"vm.selectedLedger.voucher.shortCode == 'rcpt'\">\n                  <div class=\"form-group\">\n                    <label class=\"default_clr\">Invoice No.</label>\n                    <div class=\"btn-group btn-block invoice-btn\" dropdown>\n                      <button dropdownToggle type=\"button\" class=\"form-control text-left btn-block dropdown-toggle\">\n                        Select Invoices\n                        <span class=\"select_drop pull-right mrT1\">\n                          <i class=\"fa fa-caret-down\"></i>\n                        </span>\n                      </button>\n                      <ul *dropdownMenu class=\"dropdown-menu dropdown-menu-2 width100\" role=\"menu\">\n                        <li *ngIf=\"invoiceList.length==0\">No results found</li>\n                        <li *ngFor=\"let invoice of invoiceList\">\n\n                          <input type=\"checkbox\" [checked]=\"invoice.isSelected\" (click)=\"selectInvoice (invoice, $event)\" /> {{invoice.label}}\n                        </li>\n                      </ul>\n                    </div>\n                  </div>\n                </td>\n                <td class=\"\">\n                  <div class=\"form-group\">\n                    <label class=\"default_clr\">Voucher No.</label>\n                    <input type=\"text\" placeholder=\"Voucher no.\" class=\"form-control\" [ngModel]=\"vm.selectedLedger.voucherNo\" [disabled]=\"true\"\n                      [style.width.px]=\"80\" />\n                  </div>\n                </td>\n              </tr>\n\n            </table>\n\n            <table class=\"mrT1 xs-table-block\">\n\n              <tbody>\n                <tr>\n                  <td class=\"pdR1\">\n                    <label class=\"default_clr\">Cheque Number</label>\n                    <input type=\"text\" placeholder=\"XXXX2619\" class=\"form-control\" [(ngModel)]=\"vm.selectedLedger.chequeNumber\" />\n                  </td>\n                  <td>\n                    <label class=\"default_clr\">Cheque Clearance Date</label>\n                    <input type=\"text\" autocomplete=\"off\" class=\"form-control\" [(ngModel)]=\"vm.selectedLedger.chequeClearanceDate\" bsDatepicker\n                      #chbs='bsDatepicker' [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\" />\n                  </td>\n                </tr>\n\n              </tbody>\n\n            </table>\n\n            <table class=\"mrT1\">\n\n              <tbody>\n                <tr>\n                  <td class=\"pdR1\">\n                    <label class=\"default_clr\">Assign Tag</label>\n                    <sh-select [options]=\"tags$ | async\" [isFilterEnabled]=\"true\" [placeholder]=\"'Select Tag'\" [showClear]=\"false\" [multiple]=\"true\"\n                      name=\"tagNames\" [(ngModel)]=\"vm.selectedLedger.tagNames\" [ItemHeight]=\"'auto'\"></sh-select>\n                  </td>\n                </tr>\n              </tbody>\n\n            </table>\n\n          </div>\n\n          <div class=\"row\">\n            <div class=\"col-xs-12 clearfix mrT1\">\n              <div class=\"mrR1 form-group pull-left cp\">\n                <label class=\"pull-left cp fs16\">\n                  <input class=\"pull-left\" type=\"checkbox\" name=\"generateInvoice\" [(ngModel)]=\"vm.selectedLedger.generateInvoice\" [disabled]=\"vm.isInvoiceGeneratedAlready\"> Generate Invoice\n                </label>\n              </div>\n\n              <div class=\"pull-right\">\n                <span class=\"primary_clr\">Compound Total: {{vm.compoundTotal | giddhCurrency}}</span>\n                <span *ngIf=\"totalPrice\">Total in USD: $454</span>\n              </div>\n\n                <div class=\"col-xs-12 clearfix \">\n                <div class=\"file_attached pull-right mr-15\" *ngIf=\"(vm.selectedLedger)?.attachedFile?.length > 0\">\n                  <span>{{ (vm.selectedLedger)?.attachedFileName }}</span>\n                  <label class=\"remove cp primary_clr\" (click)=\"showDeleteAttachedFileModal()\">(remove)</label>\n                </div>\n              </div>\n            </div>\n\n            <div class=\"clearfix mb-2\">\n              <div class=\"pull-left pl-15\" *ngIf=\"totalPrice\">\n                <ul class=\"list-inline font-14\" *ngIf=\"totalPrice\">\n                  <li>1 USD</li>\n                  <li>\n                    <a href=\"javascript:void(0)\" class=\"text-light\">\n                      <i class=\"icon-switch-icon\"></i>\n                    </a>\n                  </li>\n                  <li>\n                    <input type=\"text\" class=\"price-input\" placeholder=\"71.9034\"> INR</li>\n                </ul>\n              </div>\n              <div class=\"pull-right pr-15\">\n                <label class=\"upload_div\" [ngClass]=\"{hide:vm.selectedLedger.attachedFile}\">\n                  <input type=\"file\" name=\"invoiceFile\" id=\"invoiceFile\" ngFileSelect [uploadInput]=\"uploadInput\" (uploadOutput)=\"onUploadOutputUpdate($event)\">\n                  <label for=\"invoiceFile\" class=\"cp fs16\">\n                    <i class=\"glyphicon glyphicon-paperclip\"></i> Attach file</label>\n                </label>\n              </div>\n            </div>\n\n            <div class=\"col-xs-12 pdT1\">\n              <div class=\"pull-right\">\n                <button class=\"btn btn-danger\" (click)=\"showDeleteEntryModal()\">Delete</button>\n                <button class=\"btn btn-success\" [ladda]=\"isTxnUpdateInProcess$ | async\" (click)=\"saveLedgerTransaction()\">Update\n                </button>\n              </div>\n            </div>\n          </div>\n\n\n        </div>\n      </div>\n    </div>\n    <!-- new entry -->\n  </div>\n</div>\n\n<!--deleteAttachedFile  -->\n<div bsModal #deleteAttachedFileModal=\"bs-modal\" class=\"modal fade\" role=\"dialog\">\n  <div class=\"modal-dialog modal-lg\">\n    <div class=\"modal-content\">\n      <confirm-modal [title]=\"'Delete'\" [body]=\"'Are you sure you want to delete the attached file?'\" (cancelCallBack)=\"hideDeleteAttachedFileModal()\"\n        (successCallBack)=\"deleteAttachedFile()\">\n      </confirm-modal>\n    </div>\n  </div>\n</div>\n\n<!--delete entry  -->\n<div bsModal #deleteEntryModal=\"bs-modal\" class=\"modal fade\" role=\"dialog\">\n  <div class=\"modal-dialog modal-lg\">\n    <div class=\"modal-content\">\n      <confirm-modal [title]=\"'Delete'\" [body]=\"'Are you sure you want to delete this entry?'\" (cancelCallBack)=\"hideDeleteEntryModal()\"\n        (successCallBack)=\"deleteTrxEntry()\">\n      </confirm-modal>\n    </div>\n  </div>\n</div>\n\n\n<!-- update base account popup -->\n<div bsModal #updateBaseAccount=\"bs-modal\" class=\"modal fade\" role=\"dialog\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <base-account #baseAccount [accountUniqueName]=\"(baseAccount$ | async)?.uniqueName\" (closeBaseAccountModal)=\"hideBaseAccountModal()\"\n        [flattenAccountList]=\"vm.flatternAccountList4Select | async\" (updateBaseAccount)=\"changeBaseAccount($event)\"></base-account>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/ledger/components/updateLedgerEntryPanel/updateLedgerEntryPanel.component.ts":
/*!**********************************************************************************************!*\
  !*** ./src/app/ledger/components/updateLedgerEntryPanel/updateLedgerEntryPanel.component.ts ***!
  \**********************************************************************************************/
/*! exports provided: UpdateLedgerEntryPanelComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateLedgerEntryPanelComponent", function() { return UpdateLedgerEntryPanelComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_ledger_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../services/ledger.service */ "./src/app/services/ledger.service.ts");
/* harmony import */ var _models_api_models_Ledger__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../models/api-models/Ledger */ "./src/app/models/api-models/Ledger.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _services_apiurls_ledger_api__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../services/apiurls/ledger.api */ "./src/app/services/apiurls/ledger.api.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../actions/ledger/ledger.actions */ "./src/app/actions/ledger/ledger.actions.ts");
/* harmony import */ var _updateLedger_vm__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./updateLedger.vm */ "./src/app/ledger/components/updateLedgerEntryPanel/updateLedger.vm.ts");
/* harmony import */ var _updateLedgerDiscount_updateLedgerDiscount_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../updateLedgerDiscount/updateLedgerDiscount.component */ "./src/app/ledger/components/updateLedgerDiscount/updateLedgerDiscount.component.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! file-saver */ "../../node_modules/file-saver/FileSaver.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _loader_loader_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../loader/loader.service */ "./src/app/loader/loader.service.ts");
/* harmony import */ var apps_web_giddh_src_app_app_constant__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! apps/web-giddh/src/app/app.constant */ "./src/app/app.constant.ts");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var _actions_settings_tag_settings_tag_actions__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../actions/settings/tag/settings.tag.actions */ "./src/app/actions/settings/tag/settings.tag.actions.ts");
/* harmony import */ var apps_web_giddh_src_app_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! apps/web-giddh/src/app/shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var _theme_tax_control_tax_control_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../../theme/tax-control/tax-control.component */ "./src/app/theme/tax-control/tax-control.component.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../../../models/api-models/Sales */ "./src/app/models/api-models/Sales.ts");


























var UpdateLedgerEntryPanelComponent = /** @class */ (function () {
    function UpdateLedgerEntryPanelComponent(store, _ledgerService, _toasty, _accountService, _ledgerAction, _loaderService, _settingsTagActions) {
        this.store = store;
        this._ledgerService = _ledgerService;
        this._toasty = _toasty;
        this._accountService = _accountService;
        this._ledgerAction = _ledgerAction;
        this._loaderService = _loaderService;
        this._settingsTagActions = _settingsTagActions;
        this.closeUpdateLedgerModal = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.showQuickAccountModalFromUpdateLedger = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.toggleOtherTaxesAsideMenu = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.isFileUploading = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.currentAccountApplicableTaxes = [];
        this.isMultiCurrencyAvailable = false;
        this.baseCurrency = null;
        this.isChangeAcc = false;
        this.existingTaxTxn = [];
        this.baseAccount$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(null);
        this.baseAccountChanged = false;
        this.changedAccountUniq = null;
        this.invoiceList = [];
        this.openDropDown = false;
        this.baseAccountName$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(null);
        this.giddhDateFormat = apps_web_giddh_src_app_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_21__["GIDDH_DATE_FORMAT"];
        this.keydownClassAdded = false;
        this.tcsOrTds = 'tcs';
        this.totalTdElementWidth = 0;
        this.totalPrice = false;
        this.Shown = true;
        this.isHide = false;
        this.condition = true;
        this.condition2 = false;
        this.vm = new _updateLedger_vm__WEBPACK_IMPORTED_MODULE_13__["UpdateLedgerVm"]();
        this.entryUniqueName$ = this.store.select(function (p) { return p.ledger.selectedTxnForEditUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.editAccUniqueName$ = this.store.select(function (p) { return p.ledger.selectedAccForEditUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.selectedLedgerStream$ = this.store.select(function (p) { return p.ledger.transactionDetails; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.flattenAccountListStream$ = this.store.select(function (p) { return p.general.flattenAccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.vm.companyTaxesList$ = this.store.select(function (p) { return p.company.taxes; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.sessionKey$ = this.store.select(function (p) { return p.session.user.session.id; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.companyName$ = this.store.select(function (p) { return p.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isDeleteTrxEntrySuccess$ = this.store.select(function (p) { return p.ledger.isDeleteTrxEntrySuccessfull; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isTxnUpdateInProcess$ = this.store.select(function (p) { return p.ledger.isTxnUpdateInProcess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isTxnUpdateSuccess$ = this.store.select(function (p) { return p.ledger.isTxnUpdateSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.closeUpdateLedgerModal.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.store.dispatch(this._settingsTagActions.GetALLTags());
    }
    UpdateLedgerEntryPanelComponent.prototype.toggleShow = function () {
        this.condition = this.condition ? false : true;
        this.condition2 = this.condition ? false : true;
        this.Shown = this.Shown ? false : true;
        this.isHide = this.isHide ? false : true;
    };
    UpdateLedgerEntryPanelComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.showAdvanced = false;
        this.vm.selectedLedger = new _models_api_models_Ledger__WEBPACK_IMPORTED_MODULE_5__["LedgerResponse"]();
        this.vm.selectedLedger.otherTaxModal = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_25__["SalesOtherTaxesModal"]();
        // this.totalAmount = this.vm.totalAmount;
        this.tags$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_6__["select"])(Object(reselect__WEBPACK_IMPORTED_MODULE_19__["createSelector"])([function (st) { return st.settings.tags; }], function (tags) {
            if (tags && tags.length) {
                _.map(tags, function (tag) {
                    tag.label = tag.name;
                    tag.value = tag.name;
                });
                return _.orderBy(tags, 'name');
            }
        })), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        // get enetry name and ledger account uniquename
        Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["combineLatest"])(this.entryUniqueName$, this.editAccUniqueName$).subscribe(function (resp) {
            if (resp[0] && resp[1]) {
                _this.entryUniqueName = resp[0];
                _this.accountUniqueName = resp[1];
                _this.store.dispatch(_this._ledgerAction.getLedgerTrxDetails(_this.accountUniqueName, _this.entryUniqueName));
                // this.firstBaseAccountSelected = this.accountUniqueName;
            }
        });
        // emit upload event
        this.uploadInput = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        // set file upload options
        this.fileUploadOptions = { concurrency: 0 };
        // get flatten_accounts list && get transactions list && get ledger account list
        Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["combineLatest"])(this.flattenAccountListStream$, this.selectedLedgerStream$, this._accountService.GetAccountDetailsV2(this.accountUniqueName))
            .subscribe(function (resp) {
            if (resp[0] && resp[1] && resp[2].status === 'success') {
                //#region flattern group list assign process
                var stockListFormFlattenAccount_1;
                if (resp[0]) {
                    stockListFormFlattenAccount_1 = resp[0].find(function (acc) { return acc.uniqueName === resp[2].body.uniqueName; });
                }
                _this.vm.flatternAccountList = resp[0];
                _this.activeAccount$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(resp[2].body);
                var accountDetails = resp[2].body;
                _this.activeAccount$.subscribe(function (acc) {
                    if (acc && acc.currency && _this.isMultiCurrencyAvailable) {
                        _this.baseCurrency = acc.currency;
                    }
                });
                // check if current account category is type 'income' or 'expenses'
                var parentAcc = accountDetails.parentGroups[0].uniqueName;
                var incomeAccArray = ['revenuefromoperations', 'otherincome'];
                var expensesAccArray = ['operatingcost', 'indirectexpenses'];
                var incomeAndExpensesAccArray = incomeAccArray.concat(expensesAccArray);
                if (incomeAndExpensesAccArray.indexOf(parentAcc) > -1) {
                    var appTaxes_1 = [];
                    accountDetails.applicableTaxes.forEach(function (app) { return appTaxes_1.push(app.uniqueName); });
                    _this.currentAccountApplicableTaxes = appTaxes_1;
                }
                //    this.vm.getUnderstandingText(accountDetails.accountType, accountDetails.name);
                _this.vm.getUnderstandingText(resp[1].particularType, resp[1].particular.name);
                // check if account is stockable
                var isStockableAccount = accountDetails.uniqueName !== 'roundoff' ? incomeAndExpensesAccArray.includes(parentAcc) : false;
                // (parentOfAccount.uniqueName === 'revenuefromoperations' || parentOfAccount.uniqueName === 'otherincome' ||
                //   parentOfAccount.uniqueName === 'operatingcost' || parentOfAccount.uniqueName === 'indirectexpenses') : false;
                var accountsArray_1 = [];
                var accountsForBaseAccountArray_1 = [];
                if (isStockableAccount) {
                    // stocks from ledger account
                    resp[0].map(function (acc) {
                        // normal entry
                        accountsArray_1.push({ value: acc.uniqueName, label: acc.name, additional: acc });
                        // normal merge account entry
                        if (acc.mergedAccounts && acc.mergedAccounts !== '') {
                            var mergeAccs = acc.mergedAccounts.split(',');
                            mergeAccs.map(function (m) { return m.trim(); }).forEach(function (ma) {
                                accountsArray_1.push({
                                    value: ma,
                                    label: ma,
                                    additional: acc
                                });
                            });
                        }
                        // check if taxable or roundoff account then don't assign stocks
                        var notRoundOff = acc.uniqueName === 'roundoff';
                        var isTaxAccount = acc.uNameStr.indexOf('dutiestaxes') > -1;
                        if (!isTaxAccount && !notRoundOff && stockListFormFlattenAccount_1 && stockListFormFlattenAccount_1.stocks) {
                            stockListFormFlattenAccount_1.stocks.map(function (as) {
                                // stock entry
                                accountsArray_1.push({
                                    value: acc.uniqueName + "#" + as.uniqueName,
                                    label: acc.name + '(' + as.uniqueName + ')',
                                    additional: Object.assign({}, acc, { stock: as })
                                });
                                // normal merge account entry
                                if (acc.mergedAccounts && acc.mergedAccounts !== '') {
                                    var mergeAccs = acc.mergedAccounts.split(',');
                                    mergeAccs.map(function (m) { return m.trim(); }).forEach(function (ma) {
                                        accountsArray_1.push({
                                            value: ma + "#" + as.uniqueName,
                                            label: ma + '(' + as.uniqueName + ')',
                                            additional: Object.assign({}, acc, { stock: as })
                                        });
                                    });
                                }
                            });
                        }
                        // add current account entry in base account array
                        accountsForBaseAccountArray_1.push({ value: acc.uniqueName, label: acc.name, additional: acc });
                    });
                    // accountsArray = uniqBy(accountsArray, 'value');
                }
                else {
                    resp[0].map(function (acc) {
                        if (acc.stocks) {
                            acc.stocks.map(function (as) {
                                accountsArray_1.push({
                                    value: acc.uniqueName + "#" + as.uniqueName,
                                    label: acc.name + " (" + as.uniqueName + ")",
                                    additional: Object.assign({}, acc, { stock: as })
                                });
                            });
                            accountsArray_1.push({ value: acc.uniqueName, label: acc.name, additional: acc });
                        }
                        else {
                            accountsArray_1.push({ value: acc.uniqueName, label: acc.name, additional: acc });
                            // add current account entry in base account array
                            accountsForBaseAccountArray_1.push({ value: acc.uniqueName, label: acc.name, additional: acc });
                        }
                        // normal merge account entry
                        if (acc.mergedAccounts && acc.mergedAccounts !== '') {
                            var mergeAccs = acc.mergedAccounts.split(',');
                            mergeAccs.map(function (m) { return m.trim(); }).forEach(function (ma) {
                                accountsArray_1.push({
                                    value: ma,
                                    label: ma,
                                    additional: acc
                                });
                            });
                        }
                    });
                    // accountsArray = uniqBy(accountsArray, 'value');
                }
                _this.vm.flatternAccountList4Select = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["orderBy"])(accountsArray_1, 'text'));
                _this.vm.flatternAccountList4BaseAccount = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["orderBy"])(accountsForBaseAccountArray_1, 'text');
                //#endregion
                //#region transaction assignment process
                _this.vm.selectedLedger = resp[1];
                _this.vm.selectedLedgerBackup = resp[1];
                // other taxes assigning process
                var companyTaxes_1 = [];
                _this.vm.companyTaxesList$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (taxes) { return companyTaxes_1 = taxes; });
                var otherTaxesModal = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_25__["SalesOtherTaxesModal"]();
                otherTaxesModal.itemLabel = resp[1].particular.name;
                var tax = void 0;
                if (resp[1].tcsTaxes && resp[1].tcsTaxes.length) {
                    tax = companyTaxes_1.find(function (f) { return f.uniqueName === resp[1].tcsTaxes[0]; });
                    _this.vm.selectedLedger.otherTaxType = 'tcs';
                }
                else if (resp[1].tdsTaxes && resp[1].tdsTaxes.length) {
                    tax = companyTaxes_1.find(function (f) { return f.uniqueName === resp[1].tdsTaxes[0]; });
                    _this.vm.selectedLedger.otherTaxType = 'tds';
                }
                if (tax) {
                    otherTaxesModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
                }
                // otherTaxesModal.appliedOtherTax = (resp[1].tcsTaxes.length ? resp[1].tcsTaxes : resp[1].tdsTaxes) || [];
                otherTaxesModal.tcsCalculationMethod = resp[1].tcsCalculationMethod || _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_25__["SalesOtherTaxesCalculationMethodEnum"].OnTaxableAmount;
                _this.vm.selectedLedger.isOtherTaxesApplicable = !!(tax);
                _this.vm.selectedLedger.otherTaxModal = otherTaxesModal;
                _this.baseAccount$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(resp[1].particular);
                _this.baseAccountName$ = resp[1].particular.uniqueName;
                _this.baseAcc = resp[1].particular.uniqueName;
                _this.firstBaseAccountSelected = resp[1].particular.uniqueName;
                _this.vm.selectedLedger.transactions.map(function (t) {
                    if (_this.vm.selectedLedger.discounts.length > 0 && !t.isTax && t.particular.uniqueName !== 'roundoff') {
                        var category = _this.vm.getCategoryNameFromAccount(t.particular.uniqueName);
                        if (_this.vm.isValidCategory(category)) {
                            t.amount = _this.vm.selectedLedger.actualAmount;
                        }
                    }
                    if (!_this.isMultiCurrencyAvailable) {
                        _this.isMultiCurrencyAvailable = !!t.convertedAmountCurrency;
                    }
                    if (t.inventory) {
                        var findStocks = accountsArray_1.find(function (f) { return f.value === t.particular.uniqueName + '#' + t.inventory.stock.uniqueName; });
                        if (findStocks) {
                            var findUnitRates = findStocks.additional.stock;
                            if (findUnitRates && findUnitRates.accountStockDetails && findUnitRates.accountStockDetails.unitRates.length) {
                                var tempUnitRates = findUnitRates.accountStockDetails.unitRates;
                                tempUnitRates.map(function (tmp) { return tmp.code = tmp.stockUnitCode; });
                                t.unitRate = tempUnitRates;
                            }
                            else {
                                t.unitRate = [{
                                        code: t.inventory.unit.code,
                                        rate: t.inventory.rate,
                                        stockUnitCode: t.inventory.unit.code
                                    }];
                            }
                        }
                        else {
                            t.unitRate = [{
                                    code: t.inventory.unit.code,
                                    rate: t.inventory.rate,
                                    stockUnitCode: t.inventory.unit.code
                                }];
                        }
                        t.particular.uniqueName = t.particular.uniqueName + "#" + t.inventory.stock.uniqueName;
                    }
                });
                _this.vm.isInvoiceGeneratedAlready = _this.vm.selectedLedger.voucherGenerated;
                // check if entry allows to show discount and taxes box
                // first check with opened lager
                if (_this.vm.checkDiscountTaxesAllowedOnOpenedLedger(resp[2].body)) {
                    _this.vm.showNewEntryPanel = true;
                }
                else {
                    // now check if we transactions array have any income/expense/fixed assets entry
                    var incomeExpenseEntryLength = _this.vm.isThereIncomeOrExpenseEntry();
                    _this.vm.showNewEntryPanel = incomeExpenseEntryLength === 1;
                }
                _this.vm.reInitilizeDiscount(resp[1]);
                _this.vm.selectedLedger.transactions.push(_this.vm.blankTransactionItem('CREDIT'));
                _this.vm.selectedLedger.transactions.push(_this.vm.blankTransactionItem('DEBIT'));
                _this.vm.getEntryTotal();
                _this.vm.generatePanelAmount();
                _this.vm.generateGrandTotal();
                _this.vm.generateCompoundTotal();
                _this.existingTaxTxn = _.filter(_this.vm.selectedLedger.transactions, function (o) { return o.isTax; });
                //#endregion
            }
        });
        // check if delete entry is success
        this.isDeleteTrxEntrySuccess$.subscribe(function (del) {
            if (del) {
                _this.store.dispatch(_this._ledgerAction.resetDeleteTrxEntryModal());
                _this.closeUpdateLedgerModal.emit(true);
                _this.baseAccountChanged = false;
            }
        });
        // check if update entry is success
        this.isTxnUpdateSuccess$.subscribe(function (upd) {
            if (upd) {
                _this.store.dispatch(_this._ledgerAction.ResetUpdateLedger());
                _this.baseAccountChanged = false;
                // this.closeUpdateLedgerModal.emit(true);
            }
        });
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_6__["select"])(function (s) { return s.settings.profile; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            _this.profileObj = s;
        });
    };
    UpdateLedgerEntryPanelComponent.prototype.ngAfterViewInit = function () {
        this.vm.discountComponent = this.discountComponent;
    };
    UpdateLedgerEntryPanelComponent.prototype.addBlankTrx = function (type, txn, event) {
        var _this = this;
        if (type === void 0) { type = 'DEBIT'; }
        var isMultiCurrencyAvailable = false;
        if (txn.selectedAccount && txn.selectedAccount.currency) {
            this.activeAccount$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (acc) {
                if (acc.currency !== txn.selectedAccount.currency) {
                    _this.isMultiCurrencyAvailable = true;
                    isMultiCurrencyAvailable = true;
                    _this.baseCurrency = acc.currency;
                }
            });
        }
        if (Number(txn.amount) === 0) {
            txn.amount = undefined;
        }
        var lastTxn = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["last"])(Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_11__["filter"])(this.vm.selectedLedger.transactions, function (p) { return p.type === type; }));
        if (txn.particular.uniqueName && lastTxn.particular.uniqueName) {
            var blankTrxnRow = this.vm.blankTransactionItem(type);
            if (isMultiCurrencyAvailable) {
                blankTrxnRow.convertedAmount = null;
                blankTrxnRow.convertedAmountCurrency = null;
            }
            this.vm.selectedLedger.transactions.push(blankTrxnRow);
        }
    };
    UpdateLedgerEntryPanelComponent.prototype.onUploadOutputUpdate = function (output) {
        if (output.type === 'allAddedToQueue') {
            var sessionKey_1 = null;
            var companyUniqueName_1 = null;
            this.sessionKey$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (a) { return sessionKey_1 = a; });
            this.companyName$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (a) { return companyUniqueName_1 = a; });
            var event_1 = {
                type: 'uploadAll',
                url: apps_web_giddh_src_app_app_constant__WEBPACK_IMPORTED_MODULE_18__["Configuration"].ApiUrl + _services_apiurls_ledger_api__WEBPACK_IMPORTED_MODULE_8__["LEDGER_API"].UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName_1),
                method: 'POST',
                fieldName: 'file',
                data: { company: companyUniqueName_1 },
                headers: { 'Session-Id': sessionKey_1 },
            };
            this.uploadInput.emit(event_1);
        }
        else if (output.type === 'start') {
            this.isFileUploading = true;
            this._loaderService.show();
        }
        else if (output.type === 'done') {
            this._loaderService.hide();
            if (output.file.response.status === 'success') {
                // this.isFileUploading = false;
                this.vm.selectedLedger.attachedFile = output.file.response.body.uniqueName;
                this.vm.selectedLedger.attachedFileName = output.file.response.body.name;
                this._toasty.successToast('file uploaded successfully');
            }
            else {
                this.isFileUploading = false;
                this.vm.selectedLedger.attachedFile = '';
                this.vm.selectedLedger.attachedFileName = '';
                this._toasty.errorToast(output.file.response.message);
            }
        }
    };
    UpdateLedgerEntryPanelComponent.prototype.onResized = function (event) {
        this.totalTdElementWidth = event.newWidth + 10;
    };
    UpdateLedgerEntryPanelComponent.prototype.selectAccount = function (e, txn, selectCmp) {
        if (!e.value) {
            // if there's no selected account set selectedAccount to null
            txn.selectedAccount = null;
            txn.inventory = null;
            txn.particular.name = undefined;
            // check if need to showEntryPanel
            // first check with opened lager
            var activeAccount_1 = null;
            this.activeAccount$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (s) { return activeAccount_1 = s; });
            if (this.vm.checkDiscountTaxesAllowedOnOpenedLedger(activeAccount_1)) {
                this.vm.showNewEntryPanel = true;
            }
            else {
                // now check if we transactions array have any income/expense/fixed assets entry
                var incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
                this.vm.showNewEntryPanel = incomeExpenseEntryLength === 1;
            }
            return;
        }
        else {
            if (!txn.isUpdated) {
                if (this.vm.selectedLedger.taxes.length && !txn.isTax) {
                    txn.isUpdated = true;
                }
            }
            // check if txn.selectedAccount is aleready set so it means account name is changed without firing deselect event
            if (txn.selectedAccount) {
                // check if discount is added and update component as needed
                this.vm.discountArray.map(function (d) {
                    if (d.particular === txn.selectedAccount.uniqueName) {
                        d.amount = 0;
                    }
                });
            }
            // if ther's stock entry
            if (e.additional.stock) {
                // check if we aleready have stock entry
                if (this.vm.isThereStockEntry(e.value)) {
                    selectCmp.clear();
                    txn.particular.uniqueName = null;
                    txn.particular.name = null;
                    txn.selectedAccount = null;
                    this._toasty.warningToast('you can\'t add multiple stock entry');
                    return;
                }
                else {
                    // add unitArrys in txn for stock entry
                    txn.selectedAccount = e.additional;
                    var rate = 0;
                    var unitCode = '';
                    var unitName = '';
                    var stockName = '';
                    var stockUniqueName = '';
                    var unitArray = [];
                    var defaultUnit_1 = {
                        stockUnitCode: e.additional.stock.stockUnit.name,
                        code: e.additional.stock.stockUnit.code,
                        rate: 0
                    };
                    if (e.additional.stock.accountStockDetails && e.additional.stock.accountStockDetails.unitRates) {
                        var cond = e.additional.stock.accountStockDetails.unitRates.find(function (p) { return p.stockUnitCode === e.additional.stock.stockUnit.code; });
                        if (cond) {
                            defaultUnit_1.rate = cond.rate;
                            rate = defaultUnit_1.rate;
                        }
                        unitArray = unitArray.concat(e.additional.stock.accountStockDetails.unitRates.map(function (p) {
                            return {
                                stockUnitCode: p.stockUnitCode,
                                code: p.stockUnitCode,
                                rate: p.rate
                            };
                        }));
                        if (unitArray.findIndex(function (p) { return p.code === defaultUnit_1.code; }) === -1) {
                            unitArray.push(defaultUnit_1);
                        }
                    }
                    else {
                        unitArray.push(defaultUnit_1);
                    }
                    txn.unitRate = unitArray;
                    stockName = e.additional.stock.name;
                    stockUniqueName = e.additional.stock.uniqueName;
                    unitName = e.additional.stock.stockUnit.name;
                    unitCode = e.additional.stock.stockUnit.code;
                    if (stockName && stockUniqueName) {
                        txn.inventory = {
                            stock: {
                                name: stockName,
                                uniqueName: stockUniqueName,
                            },
                            quantity: 1,
                            unit: {
                                stockUnitCode: unitCode,
                                code: unitCode,
                                rate: rate
                            },
                            amount: 0,
                            rate: rate
                        };
                    }
                    if (rate > 0 && txn.amount === 0) {
                        txn.amount = rate;
                    }
                }
            }
            else {
                // directly assign additional property
                txn.selectedAccount = e.additional;
            }
            // check if need to showEntryPanel
            // first check with opened lager
            var activeAccount_2 = null;
            this.activeAccount$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (s) { return activeAccount_2 = s; });
            if (this.vm.checkDiscountTaxesAllowedOnOpenedLedger(activeAccount_2)) {
                this.vm.showNewEntryPanel = true;
            }
            else {
                // now check if we transactions array have any income/expense/fixed assets entry
                var incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
                this.vm.showNewEntryPanel = incomeExpenseEntryLength === 1;
            }
            this.vm.onTxnAmountChange(txn);
        }
    };
    UpdateLedgerEntryPanelComponent.prototype.onTxnAmountChange = function (txn) {
        if (!txn.selectedAccount) {
            this.vm.flatternAccountList4Select.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (accounts) {
                if (accounts && accounts.length) {
                    var selectedAcc = accounts.find(function (acc) { return acc.value === txn.particular.uniqueName; });
                    if (selectedAcc) {
                        txn.selectedAccount = selectedAcc.additional;
                    }
                }
            });
        }
        txn.isUpdated = true;
        this.vm.onTxnAmountChange(txn);
    };
    /**
     * calculateConversionRate
     */
    UpdateLedgerEntryPanelComponent.prototype.calculateConversionRate = function (baseCurr, convertTo, amount, obj) {
        if (baseCurr && convertTo) {
            this._ledgerService.GetCurrencyRate(baseCurr, convertTo).subscribe(function (res) {
                var rate = res.body;
                if (rate) {
                    obj.convertedAmount = amount * rate;
                    obj.convertedAmountCurrency = convertTo;
                    return obj;
                }
            });
        }
    };
    UpdateLedgerEntryPanelComponent.prototype.showDeleteAttachedFileModal = function () {
        this.deleteAttachedFileModal.show();
    };
    UpdateLedgerEntryPanelComponent.prototype.hideDeleteAttachedFileModal = function () {
        this.deleteAttachedFileModal.hide();
    };
    UpdateLedgerEntryPanelComponent.prototype.showDeleteEntryModal = function () {
        this.deleteEntryModal.show();
    };
    UpdateLedgerEntryPanelComponent.prototype.hideDeleteEntryModal = function () {
        this.deleteEntryModal.hide();
    };
    UpdateLedgerEntryPanelComponent.prototype.deleteTrxEntry = function () {
        var uniqueName = this.vm.selectedLedger.particular.uniqueName;
        this.store.dispatch(this._ledgerAction.deleteTrxEntry(uniqueName, this.entryUniqueName));
        this.hideDeleteEntryModal();
    };
    UpdateLedgerEntryPanelComponent.prototype.deleteAttachedFile = function () {
        this.vm.selectedLedger.attachedFile = '';
        this.vm.selectedLedger.attachedFileName = '';
        this.hideDeleteAttachedFileModal();
    };
    UpdateLedgerEntryPanelComponent.prototype.saveLedgerTransaction = function () {
        // due to date picker of Tx entry date format need to change
        if (this.vm.selectedLedger.entryDate) {
            if (!moment_moment__WEBPACK_IMPORTED_MODULE_22__(this.vm.selectedLedger.entryDate, 'DD-MM-YYYY').isValid()) {
                this._toasty.errorToast('Invalid Date Selected.Please Select Valid Date');
                this._loaderService.hide();
                return;
            }
            else {
                this.vm.selectedLedger.entryDate = moment_moment__WEBPACK_IMPORTED_MODULE_22__(this.vm.selectedLedger.entryDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
            }
        }
        // due to date picker of Tx chequeClearance date format need to change
        if (this.vm.selectedLedger.chequeClearanceDate) {
            if (!moment_moment__WEBPACK_IMPORTED_MODULE_22__(this.vm.selectedLedger.chequeClearanceDate, 'DD-MM-YYYY').isValid()) {
                this._toasty.errorToast('Invalid Date Selected In Cheque Clearance Date.Please Select Valid Date');
                this._loaderService.hide();
                return;
            }
            else {
                this.vm.selectedLedger.chequeClearanceDate = moment_moment__WEBPACK_IMPORTED_MODULE_22__(this.vm.selectedLedger.chequeClearanceDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
            }
        }
        var requestObj = this.vm.prepare4Submit();
        var isThereAnyTaxEntry = requestObj.taxes.length > 0;
        if (isThereAnyTaxEntry) {
            if (this.profileObj && this.profileObj.gstDetails && this.profileObj.gstDetails.length) {
                var isThereAnyGstDetails = this.profileObj.gstDetails.some(function (gst) { return gst.gstNumber; });
                if (!isThereAnyGstDetails) {
                    this._toasty.errorToast('Please add GSTIN details in Settings before applying taxes', 'Error');
                    this._loaderService.hide();
                    return;
                }
            }
            else {
                this._toasty.errorToast('Please add GSTIN details in Settings before applying taxes', 'Error');
                this._loaderService.hide();
                return;
            }
        }
        requestObj.transactions = requestObj.transactions.filter(function (f) { return !f.isDiscount; });
        requestObj.transactions = requestObj.transactions.filter(function (tx) { return !tx.isTax; });
        if (this.tcsOrTds === 'tds') {
            delete requestObj['tcsCalculationMethod'];
        }
        delete requestObj['tdsTaxes'];
        delete requestObj['tcsTaxes'];
        if (this.baseAccountChanged) {
            this.store.dispatch(this._ledgerAction.updateTxnEntry(requestObj, this.firstBaseAccountSelected, this.entryUniqueName + '?newAccountUniqueName=' + this.changedAccountUniq));
        }
        else {
            this.store.dispatch(this._ledgerAction.updateTxnEntry(requestObj, this.firstBaseAccountSelected, this.entryUniqueName));
        }
    };
    UpdateLedgerEntryPanelComponent.prototype.ngOnDestroy = function () {
        this.vm.resetVM();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    UpdateLedgerEntryPanelComponent.prototype.downloadAttachedFile = function (fileName, e) {
        var _this = this;
        e.stopPropagation();
        this._ledgerService.DownloadAttachement(fileName).subscribe(function (d) {
            if (d.status === 'success') {
                var blob = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_15__["base64ToBlob"])(d.body.uploadedFile, "image/" + d.body.fileType, 512);
                return Object(file_saver__WEBPACK_IMPORTED_MODULE_16__["saveAs"])(blob, d.body.name);
            }
            else {
                _this._toasty.errorToast(d.message);
            }
        });
    };
    UpdateLedgerEntryPanelComponent.prototype.downloadInvoice = function (invoiceName, voucherType, e) {
        var _this = this;
        e.stopPropagation();
        var activeAccount = null;
        this.activeAccount$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (p) { return activeAccount = p; });
        var downloadRequest = new _models_api_models_Ledger__WEBPACK_IMPORTED_MODULE_5__["DownloadLedgerRequest"]();
        downloadRequest.invoiceNumber = [invoiceName];
        downloadRequest.voucherType = voucherType;
        this._ledgerService.DownloadInvoice(downloadRequest, activeAccount.uniqueName).subscribe(function (d) {
            if (d.status === 'success') {
                var blob = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_15__["base64ToBlob"])(d.body, 'application/pdf', 512);
                return Object(file_saver__WEBPACK_IMPORTED_MODULE_16__["saveAs"])(blob, activeAccount.name + " - " + invoiceName + ".pdf");
            }
            else {
                _this._toasty.errorToast(d.message);
            }
        });
    };
    UpdateLedgerEntryPanelComponent.prototype.showQuickAccountModal = function () {
        this.showQuickAccountModalFromUpdateLedger.emit(true);
    };
    UpdateLedgerEntryPanelComponent.prototype.changeBaseAccount = function (acc) {
        this.openDropDown = false;
        if (!acc) {
            this._toasty.errorToast('Account not changed');
            this.hideBaseAccountModal();
            return;
        }
        if (acc === this.baseAcc) {
            this._toasty.errorToast('Account not changed');
            this.hideBaseAccountModal();
            return;
        }
        this.changedAccountUniq = acc.value;
        this.baseAccountChanged = true;
        this.saveLedgerTransaction();
        this.hideBaseAccountModal();
    };
    UpdateLedgerEntryPanelComponent.prototype.openBaseAccountModal = function () {
        if (this.vm.selectedLedger.voucherGenerated) {
            this._toasty.errorToast('You are not permitted to change base account. Voucher is already Generated');
            return;
        }
        this.updateBaseAccount.show();
        //
    };
    UpdateLedgerEntryPanelComponent.prototype.hideBaseAccountModal = function () {
        this.updateBaseAccount.hide();
        //
    };
    UpdateLedgerEntryPanelComponent.prototype.getInvoiveListsData = function (e) {
        var _this = this;
        if (e.value === 'rcpt') {
            this.invoiceList = [];
            this._ledgerService.GetInvoiceList({ accountUniqueName: this.accountUniqueName, status: 'unpaid' }).subscribe(function (res) {
                _.map(res.body.invoiceList, function (o) {
                    _this.invoiceList.push({ label: o.invoiceNumber, value: o.invoiceNumber, isSelected: false });
                });
            });
        }
        else {
            this.invoiceList = [];
        }
    };
    UpdateLedgerEntryPanelComponent.prototype.getInvoiveLists = function () {
        var _this = this;
        if (this.vm.selectedLedger.voucher.shortCode === 'rcpt') {
            this.invoiceList = [];
            this._ledgerService.GetInvoiceList({ accountUniqueName: this.accountUniqueName, status: 'unpaid' }).subscribe(function (res) {
                _.map(res.body.invoiceList, function (o) {
                    _this.invoiceList.push({ label: o.invoiceNumber, value: o.invoiceNumber, isSelected: false });
                });
            });
        }
        else {
            this.invoiceList = [];
        }
    };
    UpdateLedgerEntryPanelComponent.prototype.selectInvoice = function (invoiceNo, ev) {
        invoiceNo.isSelected = ev.target.checked;
        if (ev.target.checked) {
            this.vm.selectedLedger.invoicesToBePaid.push(invoiceNo.label);
        }
        else {
            var indx = this.vm.selectedLedger.invoicesToBePaid.indexOf(invoiceNo.label);
            this.vm.selectedLedger.invoicesToBePaid.splice(indx, 1);
        }
    };
    UpdateLedgerEntryPanelComponent.prototype.openHeaderDropDown = function () {
        if (!this.vm.selectedLedger.voucherGenerated) {
            this.openDropDown = true;
        }
        else {
            this.openDropDown = false;
            this._toasty.errorToast('You are not permitted to change base account. Voucher is already Generated');
            return;
        }
    };
    UpdateLedgerEntryPanelComponent.prototype.keydownPressed = function (e) {
        if (e.code === 'ArrowDown') {
            this.keydownClassAdded = true;
        }
        else if (e.code === 'Enter' && this.keydownClassAdded) {
            this.keydownClassAdded = true;
            this.toggleAsidePaneOpen();
        }
        else {
            this.keydownClassAdded = false;
        }
    };
    UpdateLedgerEntryPanelComponent.prototype.toggleAsidePaneOpen = function () {
        if (document.getElementById('createNewId')) {
            document.getElementById('createNewId').click();
            this.keydownClassAdded = false;
        }
        if (document.getElementById('createNewId2')) {
            document.getElementById('createNewId2').click();
            this.keydownClassAdded = false;
        }
    };
    UpdateLedgerEntryPanelComponent.prototype.hideDiscountTax = function () {
        if (this.discountComponent) {
            this.discountComponent.discountMenu = false;
        }
        if (this.taxControll) {
            this.taxControll.showTaxPopup = false;
        }
    };
    UpdateLedgerEntryPanelComponent.prototype.hideDiscount = function () {
        if (this.discountComponent) {
            this.discountComponent.change();
            this.discountComponent.discountMenu = false;
        }
    };
    UpdateLedgerEntryPanelComponent.prototype.hideTax = function () {
        if (this.taxControll) {
            this.taxControll.change();
            this.taxControll.showTaxPopup = false;
        }
    };
    UpdateLedgerEntryPanelComponent.prototype.onScrollEvent = function () {
        this.datepickers.hide();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], UpdateLedgerEntryPanelComponent.prototype, "closeUpdateLedgerModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], UpdateLedgerEntryPanelComponent.prototype, "showQuickAccountModalFromUpdateLedger", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], UpdateLedgerEntryPanelComponent.prototype, "toggleOtherTaxesAsideMenu", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('deleteAttachedFileModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["ModalDirective"])
    ], UpdateLedgerEntryPanelComponent.prototype, "deleteAttachedFileModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('deleteEntryModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["ModalDirective"])
    ], UpdateLedgerEntryPanelComponent.prototype, "deleteEntryModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('discount'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _updateLedgerDiscount_updateLedgerDiscount_component__WEBPACK_IMPORTED_MODULE_14__["UpdateLedgerDiscountComponent"])
    ], UpdateLedgerEntryPanelComponent.prototype, "discountComponent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('tax'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _theme_tax_control_tax_control_component__WEBPACK_IMPORTED_MODULE_23__["TaxControlComponent"])
    ], UpdateLedgerEntryPanelComponent.prototype, "taxControll", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('updateBaseAccount'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["ModalDirective"])
    ], UpdateLedgerEntryPanelComponent.prototype, "updateBaseAccount", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])(ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["BsDatepickerDirective"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_9__["BsDatepickerDirective"])
    ], UpdateLedgerEntryPanelComponent.prototype, "datepickers", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["HostListener"])('window:scroll'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", []),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], UpdateLedgerEntryPanelComponent.prototype, "onScrollEvent", null);
    UpdateLedgerEntryPanelComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'update-ledger-entry-panel',
            template: __webpack_require__(/*! ./updateLedgerEntryPanel.component.html */ "./src/app/ledger/components/updateLedgerEntryPanel/updateLedgerEntryPanel.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["style"])({
                        transform: 'translate3d(0, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["style"])({
                        transform: 'translate3d(100%, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_24__["animate"])('400ms ease-in-out'))
                ]),
            ],
            styles: [__webpack_require__(/*! ./updateLedgerEntryPanel.component.css */ "./src/app/ledger/components/updateLedgerEntryPanel/updateLedgerEntryPanel.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_6__["Store"], _services_ledger_service__WEBPACK_IMPORTED_MODULE_4__["LedgerService"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_7__["ToasterService"], _services_account_service__WEBPACK_IMPORTED_MODULE_10__["AccountService"],
            _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_12__["LedgerActions"], _loader_loader_service__WEBPACK_IMPORTED_MODULE_17__["LoaderService"],
            _actions_settings_tag_settings_tag_actions__WEBPACK_IMPORTED_MODULE_20__["SettingsTagActions"]])
    ], UpdateLedgerEntryPanelComponent);
    return UpdateLedgerEntryPanelComponent;
}());



/***/ }),

/***/ "./src/app/ledger/ledger.component.html":
/*!**********************************************!*\
  !*** ./src/app/ledger/ledger.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- <div class=\"loader mrT4\" *ngIf=\"showLoader\">\n    <span></span>\n    <span></span>\n    <span></span>\n    <span></span>\n    <span></span>\n</div> -->\n<!-- *ngIf=\"!showLoader\" -->\n<section class=\"container\">\n\n  <!--ledger table-->\n  <div class=\"ledgHead transactions-page mrT3 pos-rel\">\n\n    <!-- ledger header -->\n    <div class=\"clearfix\">\n      <div class=\"col-sm-2\">\n        <div class=\"row\">\n          <!-- (hideDaterangepicker)=\"selectedDate($event)\"  -->\n          <input type=\"text\" name=\"daterangeInput\" daterangepicker [options]=\"datePickerOptions\"\n            (applyDaterangepicker)=\"selectedDate($event)\" class=\"form-control daterange_picker_ledger\" />\n          <!--<input date-range-picker=\"\" id=\"daterange3\" name=\"daterange3\"-->\n          <!--class=\"form-control date-picker date-range-picker ng-pristine ng-untouched ng-valid ng-isolate-scope ng-valid-required\"-->\n          <!--type=\"text\" ng-model=\"cDate\" options=\"opts\" required=\"\">-->\n        </div>\n      </div>\n      <!--<div class=\"col-xs-2\">-->\n      <!--<div class=\"row\">-->\n      <!--&lt;!&ndash;<button class=\"btn btn-link\" (click)=\"onOpenAdvanceSearch()\">Advance Search</button>&ndash;&gt;-->\n      <!--</div>-->\n      <!--</div>-->\n      <div class=\"col-sm-4\">\n        <!--<div class=\"row\">-->\n        <!--<h1 class=\"text-center account_Name fs20\">{{ (lc.activeAccount$ | async)?.name }} A/c</h1>-->\n        <!--</div>-->\n      </div>\n      <div class=\"col-sm-6 text-right C-flex-end xs-pl-0 xs-pr-0\">\n        <div class=\"d-flex xs-width-100 ledger-head-top\">\n\n          <div class=\"d-flex\" *ngIf=\"checkedTrxWhileHovering.length === 0\">\n\n            <span class=\"d-flex\" style=\"margin-right: 10px;\">\n              <button class=\"btn btn-link xs-pl-0\" style=\"margin-right: -3px;\" (click)=\"onOpenAdvanceSearch()\">Advance\n                Search</button>\n              <a class=\"cp\" href=\"javascript: void 0\" (click)=\"resetAdvanceSearch()\" *ngIf=\"isAdvanceSearchImplemented\"\n                style=\"margin-right: 7px;\">\n                <i aria-hidden=\"true\" class=\"glyphicon glyphicon-refresh\" style=\"font-size: 15px;\"\n                  tooltip=\"Reset Filter\"></i>\n              </a>\n            </span>\n\n            <div style=\"position: relative\">\n              <input type=\"search\" [(ngModel)]=\"searchText\" name=\"searchText\" class=\"form-control\"\n                (keyup)=\"search(searchText)\" placeholder=\"Search ledger\" #ledgerSearchTerms>\n              <i class=\"icon-search pos-abs\" style=\"right:5px;top:10px;\"></i>\n            </div>\n\n          </div>\n\n          <div class=\"d-flex xs-mb-1\" *ngIf=\"checkedTrxWhileHovering.length > 0\">\n\n            <button class=\"btn btn-danger\" (click)=\"performBulkAction('delete')\" container=\"body\" tooltip=\"Delete\"\n              [placement]=\"'top'\">Delete\n            </button>\n\n            <button class=\"btn btn-warning\" (click)=\"performBulkAction('generate')\" container=\"body\"\n              tooltip=\"Generate Invoice\" [placement]=\"'top'\">Generate Invoice\n            </button>\n\n            <button class=\"btn btn-success\" (click)=\"performBulkAction('upload', BulkUploadfileInput)\" container=\"body\"\n              tooltip=\"Attach File\" [placement]=\"'top'\">Attach File\n            </button>\n            <input type=\"file\" #BulkUploadfileInput style=\"display: none;\" name=\"BulkUploadfileInput\"\n              id=\"BulkUploadfileInput\" [options]=\"fileUploadOptions\" ngFileSelect [uploadInput]=\"uploadInput\"\n              (uploadOutput)=\"onUploadOutput($event)\">\n          </div>\n\n          <div class=\"d-flex\">\n            <a href=\"javascript:void(0)\" id=\"share\" class=\"icomoon_ico d-flex align-items-center\"\n              (click)=\"showShareLedgerModal()\">\n              <i [tooltip]=\"'Share Ledger'\" [placement]=\"'right'\" class=\"fa icon-ledger-path\"\n                style=\"line-height: 0px\"></i>\n            </a>\n            <a class=\"icomoon_ico d-flex align-items-center\" href=\"javascript:void(0)\" title=\"\" [tooltip]=\"'Export'\"\n              [placement]=\"'right'\" (click)=\"showExportLedgerModal()\">\n              <i class=\"icon-ledger-union-5\" style=\"line-height: 0px\"></i>\n            </a>\n          </div>\n\n        </div>\n      </div>\n    </div>\n    <!-- ledger header end -->\n\n    <div class=\"custom-tabs mt-2 mb-2\">\n      <ul class=\"nav nav-tabs pt-0\">\n        <li role=\"presentation\" [className]=\"condition ? 'active' : ''\"><a href=\"javascript:void(0)\"\n            (click)=\"toggleShow()\">DR</a></li>\n        <li role=\"presentation\" [className]=\"condition2 ? 'active' : ''\"><a href=\"javascript:void(0)\"\n            (click)=\"toggleShow()\">CR</a></li>\n      </ul>\n    </div>\n\n    <!--bank ledgers-->\n    <div class=\"clearfix\"></div>\n    <h1 class=\"mrT2 primary_clr\" *ngIf=\"isBankTransactionLoading\">Loading Transactions...</h1>\n    <section id=\"eledgerwrap\" class=\"mrT2\" *ngIf=\"lc.showEledger\">\n      <div class=\"alert alert-danger fade in pr\" style=\"padding-right:15px\">\n        <button type=\"button\" class=\"close\">\n          <span style=\"font-size:12px;font-weight:normal\" (click)=\"lc.showEledger = !lc.showEledger\">Close</span>\n        </button>\n\n        <table class=\"table ledgerTable\" style=\"margin-bottom:0\">\n          <thead>\n            <th class=\"nopad\" colspan=\"6\">\n              <div class=\"clearfix ldgTheadL\">\n                <h3 class=\"ledgerHead\">\n                  <span>Transactions from mapped account</span>\n                </h3>\n              </div>\n            </th>\n          </thead>\n          <tbody>\n            <tr>\n              <td class=\"nopad bdrL bdrR hidden-xs\" style=\"width:50%\" colspan=\"3\">\n                <table class=\"table\">\n                  <thead>\n                    <tr class=\"splBg\">\n                      <th colspan=\"100%\">Debit (Dr)</th>\n                    </tr>\n                    <tr class=\"dgreyBg\">\n                      <th width=\"28%\">Date\n                        <span class=\"small\">(DD-MM-YYYY)</span>\n                      </th>\n                      <th width=\"44%\">Particular</th>\n                      <th width=\"28%\" class=\"alR\">Amount</th>\n                    </tr>\n                  </thead>\n                </table>\n              </td>\n              <!-- main left td end here -->\n              <td class=\"nopad bdrL bdrR hidden-xs\" style=\"width:50%\" colspan=\"3\">\n                <table class=\"table\">\n                  <thead>\n                    <tr class=\"splBg\">\n                      <th colspan=\"100%\">Credit (Cr)</th>\n                    </tr>\n                    <tr class=\"\">\n                      <th width=\"28%\">Date\n                        <span class=\"small\">(DD-MM-YYYY)</span>\n                      </th>\n                      <th width=\"44%\">Particular</th>\n                      <th width=\"28%\" class=\"alR\">Amount</th>\n                    </tr>\n                  </thead>\n                </table>\n              </td>\n              <!-- main right td end here -->\n            </tr>\n            <tr>\n              <td class=\"nopad bdrL bdrR\" colspan=\"3\">\n                <table class=\"width100\" *ngFor=\"let item of lc.bankTransactionsData;\"\n                  (clickOutside)=\"hideBankLedgerPopup(true)\" (click)=\"$event.stopPropagation()\">\n                  <tbody>\n                    <tr *ngFor=\"let txn of item.transactions;\" (click)=\"showBankLedgerPopup(txn, item);\">\n                      <td class=\"width100 pos-rel\" *ngIf=\"txn.type === 'DEBIT'\">\n                        <table class=\"width100\">\n                          <tbody class=\"ledger-main\">\n                            <!-- [(ngModel)]=\"txn.isChecked\" -->\n                            <tr class=\"ledger-row\" [ngClass]=\"{compoundEntry: txn.id === lc.selectedBankTxnUniqueName}\">\n                              <td class=\"col-xs-1 text-center\">\n                                <input type=\"checkbox\" (click)=\"selectEntryForBulkAction($event, item)\" />\n                              </td>\n                              <td class=\"col-xs-2\">\n\n                                <input class=\"form-control\" [maxlength]=\"10\" autocomplete=\"off\" name=\"bsdateledger\"\n                                  type=\"text\" [(ngModel)]=\"item.entryDate\" bsDatepicker\n                                  [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\" [outsideClick]=\"true\">\n                              </td>\n                              <td class=\"col-xs-7 select2-parent select2-ledger\">\n                                <sh-select [options]=\"lc.flattenAccountList | async\" [(ngModel)]=\"txn.particular\"\n                                  (selected)=\"selectAccount($event,txn)\" [placeholder]=\"'Select Accounts'\"\n                                  [notFoundLink]=\"true\" (noResultsClicked)=\"showQuickAccountModal()\" [showClear]=\"false\"\n                                  [multiple]=\"false\" [ItemHeight]=\"67\" [useInBuiltFilterForFlattenAc]=\"true\">\n                                  <ng-template #optionTemplate let-option=\"option\">\n                                    <ng-container *ngIf=\"!option.additional?.stock\">\n                                      <a href=\"javascript:void(0)\" class=\"list-item\"\n                                        style=\"border-bottom: 1px solid #ccc;\">\n                                        <div class=\"item\">{{ option.label }}\n                                        </div>\n                                        <div class=\"item_unq\">\n                                          {{ option.additional?.uniqueName }}\n                                        </div>\n                                      </a>\n                                    </ng-container>\n                                    <ng-container *ngIf=\"option.additional?.stock\">\n                                      <a href=\"javascript:void(0)\" class=\"list-item\"\n                                        style=\"border-bottom: 1px solid #ccc;\">\n                                        <div class=\"item\">{{ option.label }}\n                                        </div>\n                                        <div class=\"item_unq\">\n                                          {{ option.additional?.uniqueName }}\n                                        </div>\n                                        <div class=\"item_stock\">Stock:\n                                          {{ option.additional?.stock.name }}\n                                        </div>\n                                      </a>\n                                    </ng-container>\n                                  </ng-template>\n                                </sh-select>\n                                <ul class=\"no-result-template\" *ngIf=\"lc.noAccountChosenForNewEntry\">\n                                  <li>Create New Account</li>\n                                </ul>\n                              </td>\n\n                              <td class=\"col-xs-3 pos-rel\">\n                                <input class=\"form-control alR\" type=\"text\" decimalDigitsDirective [DecimalPlaces]=\"2\"\n                                  [(ngModel)]=\"txn.amount\" (input)=\"needToReCalculate.next(true)\"\n                                  (click)=\"blankLedgerAmountClick()\">\n                              </td>\n                            </tr>\n                          </tbody>\n                        </table>\n                        <!--new ledge popup-->\n                        <div class=\"pos-abs entry-modal\"\n                          *ngIf=\"lc.showBankLedgerPanel && lc.currentBlankTxn?.id === txn.id\">\n                          <new-ledger-entry-panel #newLedPanel [trxRequest]=\"advanceSearchRequest\"\n                            [isBankTransaction]=\"true\" [blankLedger]=\"item\" [currentTxn]=\"lc.currentBlankTxn\"\n                            [needToReCalculate]=\"needToReCalculate\"\n                            (changeTransactionType)=\"toggleTransactionType($event)\"\n                            [showTaxationDiscountBox]=\"lc.currentBlankTxn.showTaxationDiscountBox\"\n                            (saveBlankLedger)=\"saveBankTransaction()\"\n                            (clickedOutsideEvent)=\"hideBankLedgerPopup($event)\"\n                            (clickUnpaidInvoiceList)=\"clickUnpaidInvoiceList($event)\" [invoiceList]=\"invoiceList\">\n                          </new-ledger-entry-panel>\n                        </div>\n                        <!-- end  -->\n                      </td>\n                    </tr>\n                  </tbody>\n                </table>\n              </td>\n              <td colspan=\"3\" class=\"nopad bdrL bdrR\">\n                <table class=\"width100\" *ngFor=\"let item of lc.bankTransactionsData;\"\n                  (clickOutside)=\"hideBankLedgerPopup(true)\" (click)=\"$event.stopPropagation()\">\n                  <tbody>\n                    <tr *ngFor=\"let txn of item.transactions;\" (click)=\"showBankLedgerPopup(txn, item);\">\n                      <td class=\"width100 pos-rel\" *ngIf=\"txn.type === 'CREDIT'\">\n                        <table class=\"width100\">\n                          <tbody class=\"ledger-main\">\n                            <tr class=\"ledger-row\">\n                              <td class=\"col-xs-1 text-center\">\n                                <input type=\"checkbox\" [(ngModel)]=\"txn.isChecked\"\n                                  (click)=\"selectEntryForBulkAction($event, item)\" />\n                              </td>\n                              <td class=\"col-xs-2\">\n                                <input class=\"form-control\" [maxlength]=\"10\" name=\"bsDatess\" autocomplete=\"off\"\n                                  type=\"text\" #cbs='bsDatepicker' [(ngModel)]=\"item.entryDate\" bsDatepicker\n                                  [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\" [outsideClick]=\"true\">\n\n                              </td>\n                              <td class=\"col-xs-7 select2-parent select2-ledger\">\n                                <sh-select [options]=\"lc.flattenAccountList | async\" [(ngModel)]=\"txn.particular\"\n                                  (selected)=\"selectAccount($event,txn)\" [placeholder]=\"'Select Accounts'\"\n                                  [notFoundLink]=\"true\" (noResultsClicked)=\"showQuickAccountModal()\" [multiple]=\"false\"\n                                  [ItemHeight]=\"67\" [showClear]=\"false\" [useInBuiltFilterForFlattenAc]=\"true\">\n                                  <ng-template #optionTemplate let-option=\"option\">\n                                    <ng-container *ngIf=\"!option.additional?.stock\">\n                                      <a href=\"javascript:void(0)\" class=\"list-item\"\n                                        style=\"border-bottom: 1px solid #ccc;\">\n                                        <div class=\"item\">{{ option.label }}\n                                        </div>\n                                        <div class=\"item_unq\">\n                                          {{ option.additional?.uniqueName }}\n                                        </div>\n                                        <!-- <span class=\"list-item\" style=\"visibility: hidden;font-size:11px\">&nbsp;</span> -->\n                                      </a>\n                                    </ng-container>\n                                    <ng-container *ngIf=\"option.additional?.stock\">\n                                      <a href=\"javascript:void(0)\" class=\"list-item\"\n                                        style=\"border-bottom: 1px solid #ccc;\">\n                                        <div class=\"item\">{{ option.label }}\n                                        </div>\n                                        <div class=\"item_unq\">\n                                          {{ option.additional?.uniqueName }}\n                                        </div>\n                                        <div class=\"item_stock\">Stock:\n                                          {{ option.additional?.stock.name }}\n                                        </div>\n                                      </a>\n                                    </ng-container>\n                                  </ng-template>\n                                </sh-select>\n                                <ul class=\"no-result-template\" *ngIf=\"lc.noAccountChosenForNewEntry\">\n                                  <li>Create New Account</li>\n                                </ul>\n                              </td>\n\n                              <td class=\"col-xs-3 pos-rel\">\n                                <input class=\"form-control alR\" type=\"text\" decimalDigitsDirective [DecimalPlaces]=\"2\"\n                                  [(ngModel)]=\"txn.amount\" (input)=\"needToReCalculate.next(true)\"\n                                  (click)=\"blankLedgerAmountClick()\">\n                              </td>\n                            </tr>\n                          </tbody>\n                        </table>\n                        <!--new ledge popup-->\n                        <div class=\"pos-abs entry-modal\"\n                          *ngIf=\"lc.showBankLedgerPanel && lc.currentBlankTxn?.id === txn.id\">\n                          <new-ledger-entry-panel #newLedPanel [trxRequest]=\"advanceSearchRequest\"\n                            [isBankTransaction]=\"true\" [blankLedger]=\"item\" [currentTxn]=\"lc.currentBlankTxn\"\n                            [needToReCalculate]=\"needToReCalculate\"\n                            (changeTransactionType)=\"toggleTransactionType($event)\"\n                            [showTaxationDiscountBox]=\"lc.currentBlankTxn.showTaxationDiscountBox\"\n                            (saveBlankLedger)=\"saveBankTransaction()\"\n                            (clickedOutsideEvent)=\"hideBankLedgerPopup($event)\"\n                            (clickUnpaidInvoiceList)=\"clickUnpaidInvoiceList($event)\" [invoiceList]=\"invoiceList\">\n                          </new-ledger-entry-panel>\n                        </div>\n                        <!-- end  -->\n                      </td>\n                    </tr>\n                  </tbody>\n                </table>\n              </td>\n            </tr>\n          </tbody>\n          <!-- end main tbody -->\n          <tfoot>\n            <tr class=\"fw600 dgreyBg\">\n              <td colspan=\"2\" class=\"bdrL\" style=\"width:36%\">\n                <div class=\"pull-right\" *ngIf=\"eLedgType == 'CREDIT'\">\n                  C/F Balance\n                </div>\n              </td>\n              <td style=\"width:14%\" class=\"bdrR alR\">\n                <span *ngIf=\"eLedgType == 'CREDIT'\">{{eDrBalAmnt | giddhCurrency}}</span>\n              </td>\n              <td colspan=\"2\" style=\"width:36%\" class=\"bdrL\">\n                <div class=\"pull-right\" *ngIf=\"eLedgType == 'DEBIT'\">\n                  C/F Balance\n                </div>\n              </td>\n              <td style=\"width:14%\" class=\"bdrR alR\">\n                <span *ngIf=\"eLedgType == 'DEBIT'\">{{eCrBalAmnt | giddhCurrency}}</span>\n              </td>\n            </tr>\n\n          </tfoot>\n          <!-- end main tfoot -->\n        </table>\n      </div>\n    </section>\n    <!--/bank ledger-->\n\n    <!--<section class=\"ico-btn text-right mrT1\" *ngIf=\"checkedTrxWhileHovering.length > 0\">-->\n    <!--<button class=\"btn btn-xs\" (click)=\"performBulkAction('delete')\" container=\"body\" tooltip=\"Delete\"-->\n    <!--[placement]=\"'top'\"><i class=\"fa fa-trash-o\"></i></button>-->\n    <!--<button class=\"btn btn-xs\" (click)=\"performBulkAction('generate')\" container=\"body\" tooltip=\"Generate Invoice\"-->\n    <!--[placement]=\"'top'\"><i class=\"fa fa-file-text-o\"></i></button>-->\n    <!--&lt;!&ndash; (click)=\"openSelectFilePopup(BulkUploadfileInput);\" &ndash;&gt;-->\n    <!--<button class=\"btn btn-xs\" (click)=\"performBulkAction('upload', BulkUploadfileInput)\" container=\"body\"-->\n    <!--tooltip=\"Attach File\" [placement]=\"'top'\"><i class=\"fa fa-paperclip\"></i></button>-->\n    <!--<input type=\"file\" #BulkUploadfileInput style=\"display: none;\" name=\"BulkUploadfileInput\" id=\"BulkUploadfileInput\"-->\n    <!--[options]=\"fileUploadOptions\" ngFileSelect [uploadInput]=\"uploadInput\"-->\n    <!--(uploadOutput)=\"onUploadOutput($event)\">-->\n    <!--</section>-->\n\n    <!--account table-->\n    <table class=\"col-xs-12 ledger-head mrT1\">\n      <thead>\n        <tr>\n          <th [ngClass]=\"Shown ? 'active' : ''\" class=\"col-xs-6 hidden-xs\">\n            <b>{{lc.ledgerUnderStandingObj.text.dr}}</b>\n          </th>\n          <th class=\"col-xs-6 hidden-xs\">\n            <b>{{lc.ledgerUnderStandingObj.text.cr}}</b>\n          </th>\n        </tr>\n      </thead>\n    </table>\n    <!--account table end-->\n\n    <!--transaction-->\n    <div class=\"ledger_book\" [navigationWalker]=\"{horizontal:'hr-item',vertical:'vr-item', ignore: 'no-tree'}\"\n      #navigator=\"navigationWalker\" #root (onReset)=\"initNavigator(navigator,root.children[0])\"\n      (onLeft)=\"onLeftArrow(navigator,$event)\" (onRight)=\"onRightArrow(navigator,$event)\">\n\n      <div class=\"ledger-section\">\n\n\n      <!--debit transaction-->\n      <div [ngClass]=\"Shown ? 'active' : ''\" hr-item\n        (ngInit)=\"initNavigator(navigator,$event.nativeElement);    navigator.nextVertical();\" class=\"left-col-new bdrR\"\n        [ngClass]=\"{bdrR: (lc.transactionData$ | async)?.debitTransactions.length >= (lc.transactionData$ | async)?.creditTransactions.length}\">\n\n        <!--debit transaction header-->\n        <table class=\"width100 h-table table-head hidden-xs\">\n          <thead>\n            <tr class=\"t-h-bg1\">\n              <th class=\"col-xs-3\">\n                <span class=\"cp\">Date</span>\n              </th>\n              <th class=\"col-xs-6\">Particular</th>\n              <th class=\"col-xs-3 text-right\">Amount</th>\n            </tr>\n          </thead>\n        </table>\n        <!--debit transaction header-->\n\n\n        <table class=\"width100 h-table\">\n          <tbody>\n            <!--debit transaction if forwardedBalance -->\n            <tr class=\"ledger-row\" container=\"body\" vr-item tabindex=\"-1\"\n              *ngIf=\"(ledgerTxnBalance$ | async)?.forwardedBalance?.amount > 0 && (ledgerTxnBalance$ | async)?.forwardedBalance?.type === 'DEBIT'\">\n\n              <!--<td class=\"col-xs-1 text-center\">-->\n              <!--<input type=\"checkbox\" [(ngModel)]=\"debitSelectAll\" (click)=\"selectAllEntries($event, 'debit')\">-->\n              <!--</td>-->\n\n              <td class=\"col-xs-3\" data-title=\"Date\">\n                <input type=\"checkbox\" [(ngModel)]=\"debitSelectAll\" *ngIf=\"checkedTrxWhileHovering.length > 0\"\n                  (click)=\"selectAllEntries($event, 'debit')\">\n              </td>\n              <td data-title=\"Particular\" class=\"col-xs-6\">B/F Balance</td>\n              <td data-title=\"Amount\" class=\"col-xs-3 text-right\">\n                <span *ngIf=\"(ledgerTxnBalance$ | async)?.forwardedBalance?.type === 'DEBIT'\" class=\"\">{{\n                                  (ledgerTxnBalance$ | async)?.forwardedBalance?.amount  | giddhCurrency }}</span>\n                <span *ngIf=\"(ledgerTxnBalance$ | async)?.forwardedBalance?.type === 'CREDIT'\" class=\"\">0</span>\n\n\n              </td>\n            </tr>\n            <!--debit transaction if forwardedBalance -->\n\n            <!--debit transaction if no forwardedBalance -->\n            <tr class=\"ledger-row\" container=\"body\"\n              *ngIf=\"((ledgerTxnBalance$ | async)?.forwardedBalance?.type !== 'DEBIT') || ((ledgerTxnBalance$ | async)?.forwardedBalance?.amount == 0)\">\n\n              <!--<td class=\"col-xs-1 text-center\"><input type=\"checkbox\" [(ngModel)]=\"debitSelectAll\"-->\n              <!--(click)=\"selectAllEntries($event, 'debit')\"></td>-->\n\n              <td class=\"col-xs-3\">\n                <input type=\"checkbox\" [(ngModel)]=\"debitSelectAll\" *ngIf=\"checkedTrxWhileHovering.length > 0\"\n                  (click)=\"selectAllEntries($event, 'debit')\">\n              </td>\n              <td class=\"col-xs-6\"></td>\n              <td class=\"col-xs-3\"></td>\n            </tr>\n            <!--debit transaction if no forwardedBalance -->\n\n            <!--debit transaction loop over transactions -->\n            <tr vr-item tabindex=\"-1\" class=\"ledger-row \"\n              *ngFor=\"let txn of (lc.transactionData$ | async)?.debitTransactions;\"\n              (dblclick)=\"showUpdateLedgerModal(txn)\" (keydown.enter)=\"showUpdateLedgerModal(txn)\"\n              [ngClass]=\"{compoundEntry: txn.entryUniqueName === lc.selectedTxnUniqueName || txn.isChecked}\"\n              tooltip=\"{{txn.description}}\" (mouseover)=\"entryHovered(txn.entryUniqueName)\"\n              (mouseout)=\"selectedTrxWhileHovering = ''\">\n\n              <!--<td class=\"col-xs-1 text-center\">-->\n              <!---->\n              <!--</td>-->\n\n              <td class=\"col-xs-3\" data-title=\"Date\">\n\n                <div class=\"d-flex align-items-center\">\n                  <span style=\"float: left\">\n                    <input type=\"checkbox\"\n                      [ngClass]=\"{'d-none': (selectedTrxWhileHovering !== txn.entryUniqueName && !(txn.isChecked) && checkedTrxWhileHovering.length === 0)}\"\n                      class=\"d-none\" [(ngModel)]=\"txn.isChecked\" (click)=\"entrySelected($event, txn.entryUniqueName)\" />\n                  </span>\n                  <span>{{ txn.entryDate }}</span>\n                </div>\n\n              </td>\n              <td class=\"col-xs-6\" data-title=\"Particular\">\n                <div class=\"d-flex align-items-center\" style=\"justify-content: space-between\">\n\n                  <div class=\"ellp\">\n                    {{ txn.inventory ? txn.particular.name + ' (' + txn.inventory.stock.name + ')' : txn.particular.name }}\n                  </div>\n\n                  <span class=\"download-invoice-ledger d-flex\" *ngIf=\"txn.attachedFileUniqueName\"\n                    style=\"position: unset;align-items: center\"\n                    (click)=\"downloadAttachedFile(txn.attachedFileUniqueName , $event)\"\n                    tooltip=\"Download file : {{txn.attachedFileName}}\" [placement]=\"'right'\">\n                    <i class=\"glyphicon glyphicon-download pull-left\"\n                      style=\"font-size:15px;top: 0 !important;margin-top: 1px !important;\"></i>\n                  </span>\n                  <span class=\"download-invoice-ledger d-flex\" *ngIf=\"txn.voucherGenerated\"\n                    style=\"position: unset;align-items: center\"\n                    (click)=\"downloadInvoice(txn.voucherNumber, txn.voucherGeneratedType, $event)\"\n                    tooltip=\"Download Invoice : {{txn.voucherNumber}}\" [placement]=\"'right'\">\n                    <i class=\"glyphicon glyphicon-download pull-left\"\n                      style=\"font-size:15px;top: 0 !important;margin-top: 1px !important;\"></i>\n                  </span>\n                </div>\n              </td>\n              <td class=\"col-xs-3 pos-rel text-right\" data-title=\"Amount\">\n                {{ txn.amount | giddhCurrency }}\n\n                <p class=\"mb-0 amnt-total\" *ngIf=\"totalPrice\">$454</p>\n              </td>\n            </tr>\n            <!--debit transaction loop over transactions -->\n          </tbody>\n        </table>\n\n        <!--blank ledger-->\n        <table class=\"width100 h-table\" no-tree (click)=\"$event.stopPropagation();\" id=\"blankLedgerContainer\"\n          (clickOutside)=\"hideNewLedgerEntryPopup($event)\">\n          <tbody>\n            <tr *ngFor=\"let txn of lc.blankLedger.transactions;\">\n              <td class=\"width100\" *ngIf=\"txn.type === 'DEBIT'\">\n                <table class=\"width100\">\n                  <tbody class=\"ledger-main\">\n                    <tr class=\"ledger-row\" container=\"body\">\n\n                      <td class=\"col-xs-3\" data-title=\"Date\">\n                        <div class=\"d-flex align-items-center\">\n                          <span class=\"ledger-checkbox\" style=\"float: left\">\n                            <!--<input type=\"checkbox\"/>-->\n                          </span>\n                          <input type=\"text\" name=\"ledgDate\" [maxlength]=\"10\" #bs=\"bsDatepicker\"\n                            class=\"form-control dateStep focusUnset\" style=\"padding-left: 7px !important;\" bsDatepicker\n                            [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\" [(ngModel)]=\"lc.blankLedger.entryDate\"\n                            [placeholder]=\"lc.formatPlaceholder\" [outsideClick]=\"true\"\n                            (click)=\"$event.stopPropagation()\" autocomplete=\"off\" />\n\n                        </div>\n                      </td>\n                      <td data-title=\"Particular\" class=\"col-xs-6 select2-parent select2-ledger\" (click)=\"bs.hide();\"\n                        (mousedown)=\"showNewLedgerEntryPopup(txn);\">\n\n                        <sh-select [idEl]=\"txn.id\" #shDebit [options]=\"lc.flattenAccountList | async\"\n                          [(ngModel)]=\"txn.particular\" vr-item tabindex=\"-1\" #select [showClear]=\"false\"\n                          (keydown.enter)=\"onEnter(select,txn)\" (onShow)=\"isSelectOpen=true;bs.hide();\"\n                          (onHide)=\"onSelectHide()\" (selected)=\"selectAccount($event,txn)\"\n                          (keydown)=\"keydownPressed($event)\" [placeholder]=\"'Select Accounts'\" [notFoundLink]=\"true\"\n                          (noResultsClicked)=\"toggleAsidePane()\" [multiple]=\"false\" [ItemHeight]=\"67\"\n                          [useInBuiltFilterForFlattenAc]=\"true\">\n                          <ng-template #optionTemplate let-option=\"option\">\n                            <ng-container *ngIf=\"!option.additional?.stock\">\n                              <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                                <div class=\"item\">{{ option.label }}</div>\n                                <div class=\"item_unq\">\n                                  {{ option.additional?.uniqueName }}</div>\n                              </a>\n                            </ng-container>\n                            <ng-container *ngIf=\"option.additional?.stock\">\n                              <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                                <div class=\"item\">{{ option.label }}</div>\n                                <div class=\"item_unq\">\n                                  {{ option.additional?.uniqueName }}</div>\n                                <div class=\"item_stock\">Stock:\n                                  {{ option.additional?.stock.name }}</div>\n                              </a>\n                            </ng-container>\n                          </ng-template>\n                          <ng-template #notFoundLinkTemplate>\n\n                            <a [ngClass]=\"{'active': keydownClassAdded}\" class=\"notfound-option\"\n                              [keyboardShortcut]=\"'alt+c'\" (onShortcutPress)=\"toggleAsidePane()\">\n                              <span [ngClass]=\"{'active': keydownClassAdded}\">Create\n                                New A/c</span>\n                              <span>Alt+C</span>\n                            </a>\n                          </ng-template>\n                        </sh-select>\n\n                        <ul class=\"no-result-template\" *ngIf=\"lc.noAccountChosenForNewEntry\">\n                          <li>Create New Account</li>\n                        </ul>\n\n\n                      </td>\n\n                      <td data-title=\"Amount\" class=\"col-xs-4 pos-rel\">\n                        <input class=\"form-control alR\" type=\"text\" decimalDigitsDirective [DecimalPlaces]=\"2\"\n                          [(ngModel)]=\"txn.amount\" (input)=\"needToReCalculate.next(true)\"\n                          (click)=\"showNewLedgerEntryPopup(txn);blankLedgerAmountClick()\">\n                      </td>\n\n                    </tr>\n\n                  </tbody>\n                </table>\n                <!--new ledge popup-->\n                <div class=\"pos-abs entry-modal\" (click)=\"shDebit?.hide()\"\n                  *ngIf=\"lc.showNewLedgerPanel && lc.currentBlankTxn?.type === 'DEBIT' && lc.currentBlankTxn?.id === txn.id \">\n                  <new-ledger-entry-panel #newLedPanel class=\"\" [blankLedger]=\"lc.blankLedger\"\n                    [currentTxn]=\"lc.currentBlankTxn\" [needToReCalculate]=\"needToReCalculate\" [tcsOrTds]=\"tcsOrTds\"\n                    (changeTransactionType)=\"toggleTransactionType($event)\"\n                    [showTaxationDiscountBox]=\"lc.currentBlankTxn.showTaxationDiscountBox\"\n                    (resetBlankLedger)=\"resetBlankTransaction()\" (saveBlankLedger)=\"saveBlankTransaction()\"\n                    (clickedOutsideEvent)=\"hideNewLedgerEntryPopup()\"\n                    (clickUnpaidInvoiceList)=\"clickUnpaidInvoiceList($event)\" [invoiceList]=\"invoiceList\">\n                  </new-ledger-entry-panel>\n                </div>\n\n              </td>\n            </tr>\n\n          </tbody>\n        </table>\n      </div>\n      <!--debit transaction-->\n\n      <!--credit transaction-->\n\n\n      <div [ngClass]=\"isHide ? 'active' : 'right-col-new'\" class=\"right-col-new\" hr-item\n        [ngClass]=\"{bdrL: (lc.transactionData$ | async)?.debitTransactions.length < (lc.transactionData$ | async)?.creditTransactions.length}\">\n\n        <table class=\"col-xs-12 ledger-head hidden-lg hidden-md hidden-sm\">\n          <thead>\n            <tr>\n              <th class=\"col-xs-12\">\n                <b>{{lc.ledgerUnderStandingObj.text.cr}}</b>\n              </th>\n            </tr>\n          </thead>\n        </table>\n\n        <!--credit transaction header-->\n        <table class=\"width100 h-table hidden-xs\">\n          <thead>\n            <tr class=\"t-h-bg1\">\n              <th class=\"col-xs-3\">\n                <span class=\"cp\">Date</span>\n              </th>\n              <th class=\"col-xs-6\">Particular</th>\n              <th class=\"col-xs-3 text-right\">Amount</th>\n            </tr>\n          </thead>\n        </table>\n        <!--credit transaction header-->\n\n        <table class=\"width100 h-table\">\n          <tbody>\n\n            <!--credit transaction if forwardedBalance -->\n            <tr class=\"ledger-row\" vr-item tabindex=\"-1\"\n              *ngIf=\"(ledgerTxnBalance$ | async)?.forwardedBalance?.amount > 0 && (ledgerTxnBalance$ | async)?.forwardedBalance?.type === 'CREDIT'\">\n\n              <!--<td class=\"col-xs-1 text-center\">-->\n              <!--<input type=\"checkbox\" [(ngModel)]=\"creditSelectAll\" (click)=\"selectAllEntries($event,'credit')\">-->\n              <!--</td>-->\n\n              <td class=\"col-xs-3\" data-title=\"Date\">\n                <input type=\"checkbox\" [(ngModel)]=\"creditSelectAll\" *ngIf=\"checkedTrxWhileHovering.length > 0\"\n                  (click)=\"selectAllEntries($event,'credit')\">\n              </td>\n              <td data-title=\"B/F Balance\" class=\"col-xs-6\">B/F Balance</td>\n              <td data-title=\"Amount\" class=\"col-xs-3 text-right\">\n                <span *ngIf=\"(ledgerTxnBalance$ | async)?.forwardedBalance?.type === 'CREDIT'\">\n                  {{ (ledgerTxnBalance$ | async)?.forwardedBalance?.amount | giddhCurrency}}</span>\n                <span *ngIf=\"(ledgerTxnBalance$ | async)?.forwardedBalance?.type === 'DEBIT'\">0</span>\n              </td>\n            </tr>\n            <!--credit transaction if forwardedBalance -->\n\n            <!--credit transaction no forwardedBalance -->\n            <tr class=\"ledger-row\"\n              *ngIf=\"(ledgerTxnBalance$ | async)?.forwardedBalance?.type !== 'CREDIT' || ((ledgerTxnBalance$ | async)?.forwardedBalance?.amount == 0)\">\n\n              <!--<td class=\"col-xs-1 text-center\"><input type=\"checkbox\" [(ngModel)]=\"creditSelectAll\"-->\n              <!--(click)=\"selectAllEntries($event,'credit')\"></td>-->\n\n              <td class=\"col-xs-3\">\n                <input type=\"checkbox\" [(ngModel)]=\"creditSelectAll\" *ngIf=\"checkedTrxWhileHovering.length > 0\"\n                  (click)=\"selectAllEntries($event,'credit')\">\n              </td>\n              <td class=\"col-xs-6\"></td>\n              <td class=\"col-xs-3\"></td>\n            </tr>\n            <!--credit transaction no forwardedBalance -->\n\n            <!--credit transaction loop over transactions -->\n            <tr class=\"ledger-row \" *ngFor=\"let txn of (lc.transactionData$ | async)?.creditTransactions;\"\n              (dblclick)=\"showUpdateLedgerModal(txn)\" vr-item tabindex=\"-1\" (keydown.enter)=\"showUpdateLedgerModal(txn)\"\n              [ngClass]=\"{compoundEntry: txn.entryUniqueName === lc.selectedTxnUniqueName || txn.isChecked}\"\n              tooltip=\"{{txn.description}}\" data-toggle=\"tooltip\" (mouseover)=\"entryHovered(txn.entryUniqueName)\"\n              (mouseout)=\"selectedTrxWhileHovering = ''\">\n\n              <!--<td class=\"col-xs-1 text-center\">-->\n              <!---->\n              <!--</td>-->\n\n              <td class=\"col-xs-3\" data-title=\"Date\">\n\n                <div class=\"d-flex align-items-center\">\n                  <span class=\"ledger-checkbox\" style=\"float: left\">\n\n                    <input type=\"checkbox\"\n                      [ngClass]=\"{'d-none': (selectedTrxWhileHovering !== txn.entryUniqueName && !(txn.isChecked) && checkedTrxWhileHovering.length === 0)}\"\n                      class=\"d-none\" [(ngModel)]=\"txn.isChecked\" (click)=\"entrySelected($event, txn.entryUniqueName)\" />\n\n                  </span>\n                  <span>{{ txn.entryDate }}</span>\n                </div>\n\n              </td>\n              <td class=\"col-xs-6\" data-title=\"Particular\">\n                <div class=\"d-flex align-items-center\" style=\"justify-content: space-between\">\n                  <div class=\"ellp\">\n                    {{ txn.inventory ? txn.particular.name + ' (' + txn.inventory.stock.name + ')' : txn.particular.name }}\n                  </div>\n\n                  <span class=\"download-invoice-ledger d-flex\" *ngIf=\"txn.attachedFileUniqueName\"\n                    style=\"position: unset;align-items: center\"\n                    (click)=\"downloadAttachedFile(txn.attachedFileUniqueName , $event)\"\n                    tooltip=\"Download file : {{txn.attachedFileName}}\" [placement]=\"'right'\">\n                    <i class=\"glyphicon glyphicon-download pull-left\"\n                      style=\"font-size:15px;top: 0 !important;margin-top: 1px !important;\"></i>\n                  </span>\n                  <span class=\"download-invoice-ledger d-flex\" *ngIf=\"txn.voucherGenerated\"\n                    style=\"position: unset;align-items: center\"\n                    (click)=\"downloadInvoice(txn.voucherNumber, txn.voucherGeneratedType, $event)\"\n                    tooltip=\"Download Invoice : {{txn.voucherNumber}}\" [placement]=\"'right'\">\n                    <i class=\"glyphicon glyphicon-download pull-left\"\n                      style=\"font-size:15px;top: 0 !important;margin-top: 1px !important;\"></i>\n                  </span>\n                </div>\n\n              </td>\n              <td data-title=\"Amount\" class=\"col-xs-3 pos-rel text-right\">\n                {{txn.amount | giddhCurrency}}\n              </td>\n            </tr>\n            <!--credit transaction loop over transactions -->\n          </tbody>\n        </table>\n\n        <!--blank ladger-->\n        <table class=\"width100\" no-tree (clickOutside)=\"hideNewLedgerEntryPopup($event)\"\n          (click)=\"$event.stopPropagation()\">\n          <tbody>\n            <tr *ngFor=\"let txn of lc.blankLedger.transactions;\" (click)=\"$event.stopPropagation()\">\n              <td class=\"width100\" *ngIf=\"txn.type === 'CREDIT'\">\n                <table class=\"width100 h-table\">\n                  <tbody class=\"ledger-main\">\n                    <tr class=\"ledger-row\" container=\"body\" (keydown)=\"$event.stopPropagation()\">\n\n                      <!--<td class=\"col-xs-1 text-center\">-->\n                      <!---->\n                      <!--</td>-->\n\n                      <td class=\"col-xs-3\" data-title=\"Date\">\n\n                        <div class=\"d-flex align-items-center\">\n                          <span class=\"ledger-checkbox\" style=\"float: left\">\n                            <!--<input type=\"checkbox\"/>-->\n                          </span>\n                          <input type=\"text\" name=\"bsdateledger\" [maxlength]=\"10\" #bsd='bsDatepicker'\n                            class=\"form-control dateStep focusUnset\" [outsideClick]=\"true\"\n                            style=\"padding-left: 7px !important;\" bsDatepicker\n                            [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\" [(ngModel)]=\"lc.blankLedger.entryDate\"\n                            [placeholder]=\"lc.formatPlaceholder\" autocomplete=\"off\" />\n                        </div>\n\n                      </td>\n                      <td class=\"col-xs-6 select2-parent select2-ledger\" data-title=\"Particular\" (click)=\"bsd.hide()\"\n                        (mousedown)=\"showNewLedgerEntryPopup(txn);\">\n\n                        <sh-select [idEl]=\"txn.id\" #shCredit [options]=\"lc.flattenAccountList | async\" vr-item\n                          tabindex=\"-1\" #select (keydown.enter)=\"onEnter(shCredit,txn)\"\n                          (onShow)=\"isSelectOpen=true;bsd.hide()\" (onHide)=\"onSelectHide()\" [(ngModel)]=\"txn.particular\"\n                          (selected)=\"selectAccount($event,txn)\" [showClear]=\"false\" [placeholder]=\"'Select Accounts'\"\n                          (keydown)=\"keydownPressed($event)\" [notFoundLink]=\"true\"\n                          (noResultsClicked)=\"toggleAsidePane()\" [multiple]=\"false\" [ItemHeight]=\"67\"\n                          [useInBuiltFilterForFlattenAc]=\"true\">\n                          <ng-template #optionTemplate let-option=\"option\">\n                            <ng-container *ngIf=\"!option.additional?.stock\">\n                              <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                                <div class=\"item\">{{ option.label }}</div>\n                                <div class=\"item_unq\">\n                                  {{ option.additional?.uniqueName }}</div>\n                              </a>\n                            </ng-container>\n                            <ng-container *ngIf=\"option.additional?.stock\">\n                              <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                                <div class=\"item\">{{ option.label }}</div>\n                                <div class=\"item_unq\">\n                                  {{ option.additional?.uniqueName }}</div>\n                                <div class=\"item_stock\">Stock:\n                                  {{ option.additional?.stock.name }}</div>\n                              </a>\n                            </ng-container>\n                          </ng-template>\n                          <ng-template #notFoundLinkTemplate>\n                            <div [ngClass]=\"{'active': keydownClassAdded}\" class=\"notfound-option\"\n                              [keyboardShortcut]=\"'alt+c'\" (onShortcutPress)=\"toggleAsidePane()\">\n                              <span [ngClass]=\"{'active': keydownClassAdded}\">Create\n                                New</span>\n                              <span>Alt+C</span>\n                            </div>\n                          </ng-template>\n                        </sh-select>\n\n\n                        <ul class=\"no-result-template\" *ngIf=\"lc.noAccountChosenForNewEntry\">\n                          <li>Create New Account</li>\n                        </ul>\n                      </td>\n\n                      <td class=\"col-xs-3 pos-rel\" data-title=\"Amount\">\n                        <input class=\"form-control alR\" type=\"text\" decimalDigitsDirective [DecimalPlaces]=\"2\"\n                          [(ngModel)]=\"txn.amount\" (input)=\"needToReCalculate.next(true)\"\n                          (click)=\"showNewLedgerEntryPopup(txn);blankLedgerAmountClick()\">\n                      </td>\n                    </tr>\n                  </tbody>\n                </table>\n\n                <!--new ledge popup-->\n                <div class=\"pos-abs entry-modal\" (click)=\"shCredit?.hide()\" (keydown)=\"$event.stopPropagation()\"\n                  *ngIf=\"lc.showNewLedgerPanel && lc.currentBlankTxn?.type === 'CREDIT' && lc.currentBlankTxn?.id === txn.id \">\n                  <new-ledger-entry-panel #newLedPanel class=\"\" [blankLedger]=\"lc.blankLedger\"\n                    [currentTxn]=\"lc.currentBlankTxn\" [needToReCalculate]=\"needToReCalculate\" [tcsOrTds]=\"tcsOrTds\"\n                    (changeTransactionType)=\"toggleTransactionType($event)\"\n                    [showTaxationDiscountBox]=\"lc.currentBlankTxn.showTaxationDiscountBox\"\n                    (resetBlankLedger)=\"resetBlankTransaction()\" (saveBlankLedger)=\"saveBlankTransaction()\"\n                    (clickedOutsideEvent)=\"hideNewLedgerEntryPopup()\"\n                    (clickUnpaidInvoiceList)=\"clickUnpaidInvoiceList($event)\" [invoiceList]=\"invoiceList\">\n                  </new-ledger-entry-panel>\n                </div>\n\n              </td>\n            </tr>\n\n          </tbody>\n        </table>\n\n      </div>\n      <!--credit transaction-->\n    </div>\n\n      <!--footer-->\n      <div style=\"width: 100%\">\n        <table class=\"ledger-footer-1\" style=\"width:50%;left:0;bottom:0;float: left;\">\n          <tbody>\n\n            <tr class=\"total_col\">\n              <td colspan=\"12\" class=\"col-xs-12 text-right white h32\" style=\"padding-right:10px !important\">\n                <span *ngIf=\"(ledgerTxnBalance$ | async)?.closingBalance?.type === 'CREDIT'\"\n                  [tooltip]=\"lc.ledgerUnderStandingObj.balanceText.cr\" [placement]=\"'left'\">\n                  C/F: Cr {{ (ledgerTxnBalance$ | async)?.closingBalance?.amount  | giddhCurrency }}\n                </span>\n              </td>\n            </tr>\n            <tr class=\"total_col\">\n              <td colspan=\"12\" class=\"col-xs-12 text-right white h32\" style=\"padding-right:10px !important;\">\n                <span class=\"bdrT ng-binding\" style=\"width: 150px;display: block;float: right;padding: 10px 0;\">{{\n                                  lc.reckoningDebitTotal  | giddhCurrency }}</span>\n              </td>\n            </tr>\n          </tbody>\n        </table>\n\n        <table class=\" ledger-footer-1 \" style=\"width:50%;right:0;bottom:0;\">\n          <tbody>\n\n            <tr class=\"total_col\">\n              <td colspan=\"12\" class=\"col-xs-12 text-right white h32\" style=\"padding-right:10px !important\">\n                <span *ngIf=\"(ledgerTxnBalance$ | async)?.closingBalance?.type === 'DEBIT'\"\n                  [tooltip]=\"lc.ledgerUnderStandingObj.balanceText.dr\" [placement]=\"'left'\">\n                  C/F: Dr\n                  <span class=\"primary_clr\">{{(ledgerTxnBalance$ | async)?.closingBalance?.amount  | giddhCurrency}}\n                  </span>\n                </span>\n              </td>\n            </tr>\n            <tr class=\"total_col\">\n              <td colspan=\"12\" class=\"col-xs-12 text-right white h32\" style=\"padding-right:10px !important;\">\n                <span class=\"bdrT\"\n                  style=\"width: 150px;display: block;float: right;padding: 10px 0;\">{{lc.reckoningCreditTotal | giddhCurrency }}</span>\n              </td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n      <!--footer-->\n\n      <!-- pagination -->\n      <div class=\"text-center mrT2 pageCount pa\">\n        <span class=\"grey ng-binding\">{{ (lc.transactionData$ | async)?.totalItems }} transactions,</span>\n        <span class=\"black ng-binding\">{{ (lc.transactionData$ | async)?.totalPages }} pages</span>\n\n        <div id=\"pagination\" element-view-container-ref #paginationChild=elementviewcontainerref>\n          <!-- <pagination [totalItems]=\"(lc.transactionData$ | async)?.totalPages * (lc.transactionData$ | async)?.count\" [itemsPerPage]=\"(lc.transactionData$ | async)?.count\" [maxSize]=\"5\" class=\"pagination-sm\" [(ngModel)]=\"lc.currentPage\" (pageChanged)=\"pageChanged($event)\"\n[boundaryLinks]=\"true\">\n</pagination> -->\n        </div>\n\n      </div>\n      <!-- pagination -->\n    </div>\n    <!--transaction-->\n  </div>\n  <!-- ledger table end -->\n\n</section>\n\n<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-xs-12 text-right mrT1\" [hidden]=\"!isBankOrCashAccount\">\n      <div *ngIf=\"closingBalanceBeforeReconcile\" class=\"box mrT2 clearfix text-center\">\n        <div class=\"col-xs-6 text-right\">Balance as per bank\n          <h3 class=\"fs20 primary_clr\">{{reconcileClosingBalanceForBank?.amount}}\n            {{reconcileClosingBalanceForBank?.type}}\n          </h3>\n        </div>\n        <div class=\"col-xs-6 text-left\">Balance as per books\n          <h3 class=\"fs20 primary_clr\">{{closingBalanceBeforeReconcile?.amount}}\n            {{closingBalanceBeforeReconcile?.type}}\n          </h3>\n        </div>\n      </div>\n      <button [hidden]=\"closingBalanceBeforeReconcile || showLoader\" class=\"btn btn-primary btn-sm\"\n        (click)=\"getReconciliation();\">Reconciliation\n      </button>\n    </div>\n  </div>\n</div>\n\n\n<!--total section -->\n<!-- commented due to API  -->\n<section class=\"ledger-stat mrT3\"\n  *ngIf=\"!(showLoader) && (lc.transactionData$ | async)?.debitTransactions.length > 0 || (lc.transactionData$ | async)?.creditTransactions.length > 0\">\n  <div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col-sm-3 col-xs-6\">\n        <div class=\"ledger-state-box\">\n          <h1>Total Transactions\n            <span class=\"primary_clr\">{{(lc.transactionData$ | async)?.debitTransactionsCount + (lc.transactionData$ |\n                        async)?.creditTransactionsCount}}</span>\n          </h1>\n          <span class=\"mrT1 mrR2 \">Dr {{(lc.transactionData$ | async)?.debitTransactionsCount}}</span>\n          <span class=\"mrT1 mrR2 \">Cr {{(lc.transactionData$ | async)?.creditTransactionsCount}}</span>\n        </div>\n      </div>\n      <div class=\"col-sm-3 col-xs-6\">\n        <div class=\"ledger-state-box\">\n          <h1>Opening Balance</h1>\n          <h3>{{(ledgerTxnBalance$ | async)?.forwardedBalance?.amount | giddhCurrency}}\n            {{ (ledgerTxnBalance$ | async)?.forwardedBalance?.type === 'DEBIT' ? 'Dr' : 'Cr' }}</h3>\n        </div>\n      </div>\n\n      <div class=\"col-sm-3 col-xs-6\">\n        <div class=\"ledger-state-box\">\n          <h1 class=\" primary_clr\">Net Total\n            <span\n              *ngIf=\"(ledgerTxnBalance$ | async)?.creditTotal > (ledgerTxnBalance$ | async)?.debitTotal\">Credit</span>\n            <span\n              *ngIf=\"(ledgerTxnBalance$ | async)?.creditTotal < (ledgerTxnBalance$ | async)?.debitTotal\">Debit</span>\n          </h1>\n          <h3 class=\" primary_clr\"\n            *ngIf=\"(ledgerTxnBalance$ | async)?.creditTotal > (ledgerTxnBalance$ | async)?.debitTotal\">\n            {{(ledgerTxnBalance$ | async)?.creditTotal - (ledgerTxnBalance$ | async)?.debitTotal | giddhCurrency}}\n          </h3>\n          <h3 class=\" primary_clr\"\n            *ngIf=\"(ledgerTxnBalance$ | async)?.creditTotal < (ledgerTxnBalance$ | async)?.debitTotal\">\n            {{(ledgerTxnBalance$ | async)?.debitTotal - (ledgerTxnBalance$ | async)?.creditTotal | giddhCurrency}}\n          </h3>\n          <h1 class=\"mrT font16\">Dr Total {{(ledgerTxnBalance$ | async)?.debitTotal | giddhCurrency}}</h1>\n          <h1 class=\"mrT font16\">Cr Total {{(ledgerTxnBalance$ | async)?.creditTotal | giddhCurrency}}</h1>\n        </div>\n      </div>\n\n      <div class=\"col-sm-3 col-xs-6\">\n        <div class=\"ledger-state-box\">\n          <h1>Closing Balance</h1>\n          <h3>{{(ledgerTxnBalance$ | async)?.closingBalance?.amount | giddhCurrency}}\n            {{ (ledgerTxnBalance$ | async)?.closingBalance?.type === 'DEBIT' ? 'Dr' : 'Cr' }}</h3>\n        </div>\n      </div>\n    </div>\n\n  </div>\n\n</section>\n<!-- modal sections -->\n\n<!-- aside menu section -->\n<div class=\"aside-overlay\" *ngIf=\"asideMenuState === 'in'\"></div>\n<ledger-aside-pane [class]=\"asideMenuState\" [@slideInOut]=\"asideMenuState\" (closeAsideEvent)=\"toggleAsidePane()\">\n</ledger-aside-pane>\n<!-- aside menu section -->\n\n<!-- update ladger entry popup -->\n<div bsModal #updateLedgerModal=\"bs-modal\" class=\"modal fade\" role=\"dialog\" [config]=\"{keyboard: true}\" tabindex=\"-1\">\n  <div class=\"modal-dialog modal-lg\" style=\"width:90%\">\n    <div class=\"modal-content\">\n      <div element-view-container-ref #updateledgercomponent=elementviewcontainerref>\n      </div>\n    </div>\n  </div>\n</div>\n<!-- update ladger entry popup -->\n\n<!-- export ladger popup -->\n<div bsModal #exportLedgerModal=\"bs-modal\" tabindex=\"-1\" class=\"modal fade\" role=\"dialog\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <!-- [from]=\"advanceSearchRequest?.from\" [to]=\"advanceSearchRequest?.to\"  -->\n      <export-ledger [advanceSearchRequest]=\"advanceSearchRequest\" [accountUniqueName]=\"lc.accountUnq\"\n        (closeExportLedgerModal)=\"hideExportLedgerModal()\"></export-ledger>\n    </div>\n  </div>\n</div>\n\n<!-- share ladger popup -->\n<div bsModal #shareLedgerModal=\"bs-modal\" class=\"modal fade\" role=\"dialog\" tabindex=\"-1\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <!-- [from]=\"advanceSearchRequest?.from\" [to]=\"advanceSearchRequest?.to\" -->\n      <share-ledger #sharLedger [accountUniqueName]=\"lc.accountUnq\" [advanceSearchRequest]=\"advanceSearchRequest\"\n        (closeShareLedgerModal)=\"hideShareLedgerModal()\"></share-ledger>\n    </div>\n  </div>\n</div>\n\n<!--quick account popup -->\n<div bsModal #quickAccountModal=\"bs-modal\" class=\"modal fade\" role=\"dialog\" tabindex=\"-1\">\n  <div class=\"modal-dialog modal-sm\" style=\"width: 298px\">\n    <div class=\"modal-content\">\n      <div element-view-container-ref #quickAccountComponent=\"elementviewcontainerref\"></div>\n    </div>\n  </div>\n</div>\n<!-- modal sections -->\n\n<!-- Advance search popup -->\n<div bsModal #advanceSearchModel=\"bs-modal\" tabindex=\"-1\" class=\"modal fade\" role=\"dialog\" style=\"z-index : 1045;\">\n  <div class=\"modal-dialog modal-lg\">\n    <div class=\"modal-content\">\n      <advance-search-model #advanceSearchComp [advanceSearchRequest]=\"advanceSearchRequest\"\n        (closeModelEvent)=\"closeAdvanceSearchPopup($event)\"></advance-search-model>\n    </div>\n  </div>\n</div>\n<!-- Advance  search popup -->\n\n<!-- Bulk action confirmation popup -->\n<div bsModal #bulkActionConfirmationModal=\"bs-modal\" tabindex=\"-1\" class=\"modal fade\" role=\"dialog\"\n  style=\"z-index : 1045;\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <div id=\"\" class=\"\">\n        <div class=\"modal-header themeBg pdL2 pdR2 clearfix\">\n          <h3 class=\"modal-title bg\" id=\"modal-title\">Confirmation </h3>\n          <i class=\"fa fa-times text-right close_modal\" aria-hidden=\"true\"\n            (click)=\"onCancelBulkActionConfirmation()\"></i>\n        </div>\n        <div class=\"modal-body pdL2 pdR2 clearfix\" id=\"export-body\">\n          <form name=\"newRole\" novalidate class=\"\" autocomplete=\"off\">\n            <div class=\"modal_wrap mrB2\">\n              <h3>Are you sure want to delete?</h3>\n            </div>\n            <div class=\"pull-right\">\n              <button type=\"submit\" class=\"btn btn-md btn-success mrR1\"\n                (click)=\"onConfirmationBulkActionConfirmation()\">Yes\n              </button>\n              <button type=\"submit\" class=\"btn btn-md btn-primary\" (click)=\"onCancelBulkActionConfirmation()\">No\n              </button>\n            </div>\n          </form>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<!-- Bulk action confirmation popup -->\n\n<!-- Bulk action generate voucher popup -->\n<div bsModal #bulkActionGenerateVoucherModal=\"bs-modal\" tabindex=\"-1\" class=\"modal fade\" role=\"dialog\"\n  style=\"z-index : 1045;\" performBulkAction>\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <div id=\"\" class=\"\">\n        <div class=\"modal-header themeBg pdL2 pdR2 clearfix\">\n          <h3 class=\"modal-title bg\" id=\"modal-title\">Confirmation</h3>\n          <i class=\"fa fa-times text-right close_modal\" aria-hidden=\"true\" (click)=\"onCancelSelectInvoiceModal()\"></i>\n        </div>\n        <div class=\"modal-body pdL2 pdR2 clearfix\" id=\"export-body\">\n          <form name=\"newRole\" novalidate class=\"\" autocomplete=\"off\">\n            <div class=\"modal_wrap mrB2 text-center\">\n              <h2>Select invoice generate option</h2>\n            </div>\n            <div class=\"row mrT2 ledger-btn\">\n              <div class=\"col-xs-6 pr-1 pl-1\">\n                <button type=\"submit\" class=\"btn btn-block btn-success\" (click)=\"onSelectInvoiceGenerateOption(false)\">\n                  Generate Multiple\n                </button>\n              </div>\n              <div class=\"col-xs-6 pr-1 pl-1\">\n                <button type=\"submit\" class=\"btn btn-block btn-success\" (click)=\"onSelectInvoiceGenerateOption(true)\">\n                  Generate Compound\n                </button>\n              </div>\n            </div>\n          </form>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<!-- Bulk action generate voucher popup -->\n\n\n<!-- aside menu section -->\n<div class=\"aside-overlay\" *ngIf=\"asideMenuStateForOtherTaxes === 'in'\"></div>\n<!--<ng-template #otherTaxSidePane let-entry>-->\n<app-aside-menu-sales-other-taxes *ngIf=\"asideMenuStateForOtherTaxes === 'in' && updateLedgerComponentInstance\"\n  [class]=\"asideMenuStateForOtherTaxes\" [taxes]=\"companyTaxesList\"\n  [otherTaxesModal]=\"updateLedgerComponentInstance.vm.selectedLedger.otherTaxModal\"\n  [@slideInOut]=\"asideMenuStateForOtherTaxes\" (closeModal)=\"toggleOtherTaxesAsidePane(null)\"\n  (applyTaxes)=\"calculateOtherTaxes($event);toggleOtherTaxesAsidePane(null);\">\n</app-aside-menu-sales-other-taxes>\n<!--</ng-template>-->\n"

/***/ }),

/***/ "./src/app/ledger/ledger.component.scss":
/*!**********************************************!*\
  !*** ./src/app/ledger/ledger.component.scss ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".form-control, input {\n  color: #4d4d4d; }\n\n.notfound-option {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: justify;\n          justify-content: space-between; }\n\n.ledgHead table td[class*=col-],\n.ledgHead table td .select2-container {\n  padding: 8px !important;\n  border-bottom: 1px solid #ccc;\n  border-right: 1px solid #ccc;\n  font-size: 13px;\n  color: #4d4d4d;\n  max-width: 0;\n  text-overflow: ellipsis;\n  white-space: nowrap; }\n\n.ledgHead table td.pdR25imp {\n  padding-right: 25px !important; }\n\n.ledgHead.entry-popup table td[class*=col-] {\n  padding: 0px !important;\n  padding-bottom: 1px !important;\n  border-bottom: 1px solid #ccc;\n  border-right: 1px solid #ccc;\n  font-size: 13px;\n  color: #4d4d4d;\n  max-width: 0;\n  text-overflow: ellipsis;\n  white-space: nowrap; }\n\n.ledgHead.entry-popup table td.pdR25imp {\n  padding-right: 25px !important; }\n\n.ledgHead .ledger-main td[class*=col-] {\n  padding: 0px !important; }\n\n.total_col td {\n  border: 0 !important; }\n\n.ledger-main .form-control {\n  border: 0; }\n\n.t-h-bg1 th {\n  border-left: 0; }\n\n.ledgHead input[type=search] {\n  min-width: auto; }\n\n.ledger-stat {\n  padding: 50px 0;\n  background: #fff;\n  color: #808080;\n  font-size: 18px;\n  margin: 0px 0 0; }\n\n.ledger-stat .row {\n  display: -webkit-box;\n  display: flex;\n  flex-wrap: wrap; }\n\n.icomoon_ico {\n  margin-left: 8px; }\n\n.account_Name {\n  color: rgba(0, 0, 0, 0.8);\n  font-family: 'LatoWebBold';\n  text-transform: capitalize; }\n\n.ledger-footer-1 {\n  position: absolute;\n  bottom: 0; }\n\n.ledger-head th {\n  color: rgba(0, 0, 0, 0.4); }\n\n.total_col td {\n  border: 0; }\n\n.ledger-stat span {\n  display: inline-block; }\n\n.pageCount {\n  overflow: hidden;\n  width: 100% !important;\n  left: 0% !important;\n  bottom: 100px;\n  background: #fff;\n  padding: 5px;\n  font-size: 12px;\n  z-index: 0; }\n\n#pagination {\n  margin: 0 auto;\n  overflow: hidden;\n  width: 100%;\n  text-align: center; }\n\n.pagination > li > a {\n  color: #4d4d4d; }\n\n.pagination > .active > a {\n  background: #d35f29 !important;\n  color: #fff !important;\n  border-color: #bd501d !important; }\n\n.pagination > li > a:hover {\n  color: #d35f29; }\n\n.grey {\n  color: #4d4d4d; }\n\n.ledger-panel label {\n  font-weight: 400; }\n\n.upload_div {\n  float: left;\n  text-decoration: underline;\n  margin: 0px 5px;\n  border: 1px solid #ccc; }\n\n.upload_div label {\n  padding: 6px; }\n\n.pdR25imp {\n  padding-right: 25px !important; }\n\n.t-h-bg1 th {\n  background: #EAEBED;\n  color: #4d4d4d;\n  border-right: 1px solid #c4c6c7;\n  padding: 11px !important;\n  font-weight: 400;\n  border-bottom: 1px solid #c4c6c7; }\n\n.ledger_book {\n  border: 0px solid #ccc;\n  clear: both;\n  position: relative;\n  float: left;\n  width: 100%;\n  margin-bottom: 30px;\n  background: #fff; }\n\n.Width600 {\n  position: absolute;\n  width: 600px; }\n\n.daterange_picker_ledger {\n  border: 0;\n  background: #f7f8fa !important;\n  -webkit-text-decoration-line: underline;\n          text-decoration-line: underline;\n  -webkit-text-decoration-style: dashed;\n          text-decoration-style: dashed; }\n\n.daterange_picker_ledger:hover {\n  border: 1px !important;\n  background: #fff !important; }\n\n.C-flex-end {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: end;\n          justify-content: flex-end; }\n\n.d-flex {\n  display: -webkit-box;\n  display: flex; }\n\n.d-none {\n  display: none; }\n\n.h-table tr {\n  height: 42px; }\n\n.dateStep {\n  padding: 0 !important;\n  font-size: 13px;\n  height: 41px;\n  line-height: 1; }\n\ninput[type=date]::-webkit-inner-spin-button,\ninput[type=date]::-webkit-outer-spin-button {\n  -webkit-appearance: none; }\n\n::-webkit-calendar-picker-indicator {\n  display: none; }\n\n.focusUnset.ledger-main .form-control:focus {\n  border: unset !important; }\n\ntr[vr-item]:focus {\n  background-color: #F7F8FA;\n  outline: 0; }\n\nsh-select:focus {\n  outline: 1px #d35f29 solid; }\n\n.notfound-option.active {\n  background: #efeff1 !important;\n  padding: 2px 5px !important; }\n\n.amnt-total {\n  font-size: 12px;\n  color: #999999;\n  padding-left: 5px; }\n\n.ledger_book .left-col-new, .ledger_book .right-col-new {\n  background: #fff; }\n\n.left-col-new table.width100.h-table tbody tr td:last-child, .left-col-new table.width100.h-table thead tr th:last-child {\n  border-right: 0px !important; }\n\n.left-col-new table.width100.h-table tbody tr td:first-child, .left-col-new table.width100.h-table thead tr th:first-child {\n  border-left: 1px solid #ccc !important; }\n\n.custom-tabs {\n  display: none; }\n\n.left-col-new, .right-col-new {\n  height: initial;\n  width: 100%; }\n\n.ledger-section {\n  display: -webkit-box;\n  display: flex; }\n\n.ledger-section {\n  display: -webkit-box;\n  display: flex; }\n\n@media (min-width: 1200px) {\n  .container {\n    width: 100%;\n    max-width: 1280px; } }\n\n@media only screen and (max-width: 1024px) {\n  .container {\n    width: 100%;\n    max-width: 100%; }\n  .custom-tabs {\n    display: block; } }\n\n@media only screen and (max-width: 767px) {\n  .ledgHead table td[class*=col-],\n  .ledgHead table td .select2-container {\n    border-bottom: 0px solid #ccc;\n    border-right: 0px solid #ccc; }\n  .ledger-state-box {\n    margin-bottom: 20px; }\n  .amount-total {\n    background: #efefef; }\n  .pageCount {\n    width: 100%;\n    left: 0;\n    bottom: 0;\n    position: relative; }\n  .ledger-stat {\n    margin: 0px 0 0; }\n  .ledger_book {\n    margin-bottom: 30px; }\n  .ledger_book .h-table tbody .ledger-row td {\n    padding-left: 80px !important; }\n  .ledger_book .h-table {\n    display: block;\n    clear: both; }\n  .ledger_book .h-table tbody {\n    display: block; }\n  .ledger_book .h-table tbody tr {\n    display: block;\n    height: inherit !important; }\n  .ledger_book .h-table tbody tr td {\n    width: 100% !important;\n    display: block; }\n  .right-col-new .ledger-head {\n    background: #f7f8fa; }\n  .ledger-row td:empty {\n    display: none !important; }\n  #blankLedgerContainer tbody tr:empty {\n    display: none; }\n  .ledger-head-top {\n    flex-wrap: wrap; }\n  .xs-mb-1 {\n    margin-bottom: 10px; }\n  .ledger-btn .btn {\n    font-size: 12px !important;\n    padding: 6px; }\n  .ledger-btn button.btn {\n    font-size: 12px !important;\n    padding: 6px; }\n  .left-col-new table.width100.h-table tbody tr td:first-child, .left-col-new table.width100.h-table thead tr th:first-child {\n    border-left: 0px solid #ccc !important; } }\n"

/***/ }),

/***/ "./src/app/ledger/ledger.component.ts":
/*!********************************************!*\
  !*** ./src/app/ledger/ledger.component.ts ***!
  \********************************************/
/*! exports provided: LedgerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LedgerComponent", function() { return LedgerComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ledger_vm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ledger.vm */ "./src/app/ledger/ledger.vm.ts");
/* harmony import */ var _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../actions/ledger/ledger.actions */ "./src/app/actions/ledger/ledger.actions.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _models_api_models_Ledger__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../models/api-models/Ledger */ "./src/app/models/api-models/Ledger.ts");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! uuid */ "../../node_modules/uuid/index.js");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _services_ledger_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../services/ledger.service */ "./src/app/services/ledger.service.ts");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! file-saver */ "../../node_modules/file-saver/FileSaver.js");
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _services_group_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../services/group.service */ "./src/app/services/group.service.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../shared/helpers/directives/elementViewChild/element.viewchild.directive */ "./src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive.ts");
/* harmony import */ var _components_updateLedgerEntryPanel_updateLedgerEntryPanel_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./components/updateLedgerEntryPanel/updateLedgerEntryPanel.component */ "./src/app/ledger/components/updateLedgerEntryPanel/updateLedgerEntryPanel.component.ts");
/* harmony import */ var _actions_general_general_actions__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../actions/general/general.actions */ "./src/app/actions/general/general.actions.ts");
/* harmony import */ var _components_newLedgerEntryPanel_newLedgerEntryPanel_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./components/newLedgerEntryPanel/newLedgerEntryPanel.component */ "./src/app/ledger/components/newLedgerEntryPanel/newLedgerEntryPanel.component.ts");
/* harmony import */ var apps_web_giddh_src_app_theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.component */ "./src/app/theme/ng-virtual-select/sh-select.component.ts");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_26___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_26__);
/* harmony import */ var apps_web_giddh_src_app_actions_login_action__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! apps/web-giddh/src/app/actions/login.action */ "./src/app/actions/login.action.ts");
/* harmony import */ var apps_web_giddh_src_app_ledger_components_shareLedger_shareLedger_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! apps/web-giddh/src/app/ledger/components/shareLedger/shareLedger.component */ "./src/app/ledger/components/shareLedger/shareLedger.component.ts");
/* harmony import */ var apps_web_giddh_src_app_theme_quick_account_component_quickAccount_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! apps/web-giddh/src/app/theme/quick-account-component/quickAccount.component */ "./src/app/theme/quick-account-component/quickAccount.component.ts");
/* harmony import */ var _models_interfaces_AdvanceSearchRequest__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../models/interfaces/AdvanceSearchRequest */ "./src/app/models/interfaces/AdvanceSearchRequest.ts");
/* harmony import */ var _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ../actions/invoice/invoice.actions */ "./src/app/actions/invoice/invoice.actions.ts");
/* harmony import */ var apps_web_giddh_src_app_app_constant__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! apps/web-giddh/src/app/app.constant */ "./src/app/app.constant.ts");
/* harmony import */ var _services_apiurls_ledger_api__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ../services/apiurls/ledger.api */ "./src/app/services/apiurls/ledger.api.ts");
/* harmony import */ var _loader_loader_service__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ../loader/loader.service */ "./src/app/loader/loader.service.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _actions_settings_discount_settings_discount_action__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ../actions/settings/discount/settings.discount.action */ "./src/app/actions/settings/discount/settings.discount.action.ts");
/* harmony import */ var apps_web_giddh_src_app_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! apps/web-giddh/src/app/shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ngx-bootstrap/datepicker */ "../../node_modules/ngx-bootstrap/datepicker/index.js");
/* harmony import */ var _actions_settings_tag_settings_tag_actions__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ../actions/settings/tag/settings.tag.actions */ "./src/app/actions/settings/tag/settings.tag.actions.ts");
/* harmony import */ var _components_advance_search_advance_search_component__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./components/advance-search/advance-search.component */ "./src/app/ledger/components/advance-search/advance-search.component.ts");
/* harmony import */ var _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ../models/api-models/Sales */ "./src/app/models/api-models/Sales.ts");










































var LedgerComponent = /** @class */ (function () {
    function LedgerComponent(store, _ledgerActions, route, _ledgerService, _accountService, _groupService, _router, _toaster, _companyActions, _settingsTagActions, componentFactoryResolver, _generalActions, _loginActions, invoiceActions, _loaderService, _settingsDiscountAction, _cdRf) {
        this.store = store;
        this._ledgerActions = _ledgerActions;
        this.route = route;
        this._ledgerService = _ledgerService;
        this._accountService = _accountService;
        this._groupService = _groupService;
        this._router = _router;
        this._toaster = _toaster;
        this._companyActions = _companyActions;
        this._settingsTagActions = _settingsTagActions;
        this.componentFactoryResolver = componentFactoryResolver;
        this._generalActions = _generalActions;
        this._loginActions = _loginActions;
        this.invoiceActions = invoiceActions;
        this._loaderService = _loaderService;
        this._settingsDiscountAction = _settingsDiscountAction;
        this._cdRf = _cdRf;
        this.selectedAccountUniqueName = '';
        this.selectedInvoiceList = [];
        this.datePickerOptions = {
            hideOnEsc: true,
            locale: {
                applyClass: 'btn-green',
                applyLabel: 'Go',
                fromLabel: 'From',
                format: 'D-MMM-YY',
                toLabel: 'To',
                cancelLabel: 'Cancel',
                customRangeLabel: 'Custom range'
            },
            ranges: {
                'Last 1 Day': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_9__().subtract(1, 'days'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_9__()
                ],
                'Last 7 Days': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_9__().subtract(6, 'days'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_9__()
                ],
                'Last 30 Days': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_9__().subtract(29, 'days'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_9__()
                ],
                'Last 6 Months': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_9__().subtract(6, 'months'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_9__()
                ],
                'Last 1 Year': [
                    moment_moment__WEBPACK_IMPORTED_MODULE_9__().subtract(12, 'months'),
                    moment_moment__WEBPACK_IMPORTED_MODULE_9__()
                ]
            },
            startDate: moment_moment__WEBPACK_IMPORTED_MODULE_9__().subtract(30, 'days'),
            endDate: moment_moment__WEBPACK_IMPORTED_MODULE_9__()
        };
        this.needToReCalculate = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](false);
        this.showUpdateLedgerForm = false;
        this.searchTermStream = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.showLoader = false;
        this.isFileUploading = false;
        // aside menu properties
        this.asideMenuState = 'out';
        this.needToShowLoader = true;
        this.entryUniqueNamesForBulkAction = [];
        this.searchText = '';
        this.debitSelectAll = false;
        this.creditSelectAll = false;
        this.isBankTransactionLoading = false;
        this.todaySelected = false;
        this.todaySelected$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(false);
        this.checkedTrxWhileHovering = [];
        this.ledgerTxnBalance$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({});
        this.isAdvanceSearchImplemented = false;
        this.invoiceList = [];
        this.keydownClassAdded = false;
        this.giddhDateFormat = apps_web_giddh_src_app_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_37__["GIDDH_DATE_FORMAT"];
        this.companyTaxesList = [];
        this.selectedTxnAccUniqueName = '';
        this.tcsOrTds = 'tcs';
        this.asideMenuStateForOtherTaxes = 'out';
        this.tdsTcsTaxTypes = ['tcsrc', 'tcspay'];
        // public accountBaseCurrency: string;
        // public showMultiCurrency: boolean;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.subscribeCount = 0;
        this.totalPrice = false;
        this.Shown = true;
        this.isHide = false;
        this.condition = true;
        this.condition2 = false;
        this.lc = new _ledger_vm__WEBPACK_IMPORTED_MODULE_5__["LedgerVM"]();
        this.advanceSearchRequest = new _models_interfaces_AdvanceSearchRequest__WEBPACK_IMPORTED_MODULE_30__["AdvanceSearchRequest"]();
        this.trxRequest = new _models_api_models_Ledger__WEBPACK_IMPORTED_MODULE_8__["TransactionsRequest"]();
        this.lc.activeAccount$ = this.store.select(function (p) { return p.ledger.account; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.accountInprogress$ = this.store.select(function (p) { return p.ledger.accountInprogress; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.select(function (s) { return s.groupwithaccounts.createAccountIsSuccess; });
        this.lc.transactionData$ = this.store.select(function (p) { return p.ledger.transactionsResponse; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["shareReplay"])(1));
        this.isLedgerCreateSuccess$ = this.store.select(function (p) { return p.ledger.ledgerCreateSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.lc.groupsArray$ = this.store.select(function (p) { return p.general.groupswithaccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.lc.flattenAccountListStream$ = this.store.select(function (p) { return p.general.flattenAccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.todaySelected$ = this.store.select(function (p) { return p.session.todaySelected; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.universalDate$ = this.store.select(function (p) { return p.session.applicationDate; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isTransactionRequestInProcess$ = this.store.select(function (p) { return p.ledger.transactionInprogress; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.ledgerBulkActionSuccess$ = this.store.select(function (p) { return p.ledger.ledgerBulkActionSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.store.dispatch(this._generalActions.getFlattenAccount());
        this.store.dispatch(this._ledgerActions.GetDiscountAccounts());
        this.store.dispatch(this._settingsDiscountAction.GetDiscount());
        this.store.dispatch(this._settingsTagActions.GetALLTags());
        // get company taxes
        this.store.dispatch(this._companyActions.getTax());
        // reset redirect state from login action
        this.store.dispatch(this._loginActions.ResetRedirectToledger());
        this.sessionKey$ = this.store.select(function (p) { return p.session.user.session.id; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.companyName$ = this.store.select(function (p) { return p.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.createStockSuccess$ = this.store.select(function (s) { return s.inventory.createStockSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isCompanyCreated$ = this.store.select(function (s) { return s.session.isCompanyCreated; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.failedBulkEntries$ = this.store.select(function (p) { return p.ledger.ledgerBulkActionFailedEntries; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.ledgerTxnBalance$ = this.store.select(function (p) { return p.ledger.ledgerTransactionsBalance; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
    }
    LedgerComponent.prototype.toggleShow = function () {
        this.condition = this.condition ? false : true;
        this.condition2 = this.condition ? false : true;
        this.Shown = this.Shown ? false : true;
        this.isHide = this.isHide ? false : true;
    };
    LedgerComponent.prototype.selectCompoundEntry = function (txn) {
        this.lc.currentBlankTxn = null;
        this.lc.currentTxn = txn;
        this.lc.selectedTxnUniqueName = txn.entryUniqueName;
    };
    LedgerComponent.prototype.selectBlankTxn = function (txn) {
        this.lc.currentTxn = null;
        this.lc.currentBlankTxn = txn;
        this.lc.selectedTxnUniqueName = txn ? txn.id : null;
    };
    LedgerComponent.prototype.selectedDate = function (value) {
        var _this = this;
        this.needToShowLoader = false;
        var from = moment_moment__WEBPACK_IMPORTED_MODULE_9__(value.picker.startDate, 'DD-MM-YYYY').toDate();
        var to = moment_moment__WEBPACK_IMPORTED_MODULE_9__(value.picker.endDate, 'DD-MM-YYYY').toDate();
        // if ((this.advanceSearchRequest.dataToSend.bsRangeValue[0] !== from) || (this.advanceSearchRequest.dataToSend.bsRangeValue[1] !== to)) {
        this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
            page: 0,
            dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                bsRangeValue: [from, to]
            })
        });
        this.trxRequest.from = moment_moment__WEBPACK_IMPORTED_MODULE_9__(value.picker.startDate).format('DD-MM-YYYY');
        this.trxRequest.to = moment_moment__WEBPACK_IMPORTED_MODULE_9__(value.picker.endDate).format('DD-MM-YYYY');
        this.todaySelected = true;
        this.getTransactionData();
        // Después del éxito de la entrada. llamar para transacciones bancarias
        this.lc.activeAccount$.subscribe(function (data) {
            if (data && data.yodleeAdded) {
                _this.getBankTransactions();
            }
            else {
                _this.hideEledgerWrap();
            }
        });
        // setTimeout(()=>{this._cdRf.detectChanges()} , 500);
    };
    LedgerComponent.prototype.selectAccount = function (e, txn) {
        this.keydownClassAdded = false;
        this.selectedTxnAccUniqueName = '';
        if (!e.value) {
            // if there's no selected account set selectedAccount to null
            txn.selectedAccount = null;
            this.lc.currentBlankTxn = null;
            txn.amount = 0;
            txn.total = 0;
            // reset taxes and discount on selected account change
            txn.tax = 0;
            txn.taxes = [];
            txn.discount = 0;
            txn.discounts = [
                this.lc.staticDefaultDiscount()
            ];
            return;
        }
        this.lc.flattenAccountList.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (data) {
            data.map(function (fa) {
                // change (e.value[0]) to e.value to use in single select for ledger transaction entry
                if (fa.value === e.value) {
                    txn.selectedAccount = fa.additional;
                    var rate = 0;
                    var unitCode = '';
                    var unitName = '';
                    var stockName = '';
                    var stockUniqueName = '';
                    var unitArray = [];
                    //#region unit rates logic
                    if (fa.additional && fa.additional.stock) {
                        var defaultUnit_1 = {
                            stockUnitCode: fa.additional.stock.stockUnit.name,
                            code: fa.additional.stock.stockUnit.code,
                            rate: 0,
                            name: fa.additional.stock.stockUnit.name
                        };
                        if (fa.additional.stock.accountStockDetails && fa.additional.stock.accountStockDetails.unitRates) {
                            var cond = fa.additional.stock.accountStockDetails.unitRates.find(function (p) { return p.stockUnitCode === fa.additional.stock.stockUnit.code; });
                            if (cond) {
                                defaultUnit_1.rate = cond.rate;
                                rate = defaultUnit_1.rate;
                            }
                            unitArray = unitArray.concat(fa.additional.stock.accountStockDetails.unitRates.map(function (p) {
                                return {
                                    stockUnitCode: p.stockUnitCode,
                                    code: p.stockUnitCode,
                                    rate: 0,
                                    name: p.stockUnitName
                                };
                            }));
                            if (unitArray.findIndex(function (p) { return p.code === defaultUnit_1.code; }) === -1) {
                                unitArray.push(defaultUnit_1);
                            }
                        }
                        else {
                            unitArray.push(defaultUnit_1);
                        }
                        txn.unitRate = unitArray;
                        stockName = fa.additional.stock.name;
                        stockUniqueName = fa.additional.stock.uniqueName;
                        unitName = fa.additional.stock.stockUnit.name;
                        unitCode = fa.additional.stock.stockUnit.code;
                    }
                    if (stockName && stockUniqueName) {
                        txn.inventory = {
                            stock: {
                                name: stockName,
                                uniqueName: stockUniqueName
                            },
                            quantity: 1,
                            unit: {
                                stockUnitCode: unitCode,
                                code: unitCode,
                                rate: rate
                            }
                        };
                    }
                    if (rate > 0 && txn.amount === 0) {
                        txn.amount = rate;
                    }
                    //#endregion
                    // reset taxes and discount on selected account change
                    // txn.tax = 0;
                    // txn.taxes = [];
                    // txn.discount = 0;
                    // txn.discounts = [];
                    // txn.currency = e.additional.currency;
                    // if (e.additional.currency && (this.accountBaseCurrency !== e.additional.currency)) {
                    //   this.showMultiCurrency = true;
                    // } else {
                    //   this.showMultiCurrency = false;
                    // }
                    return;
                }
            });
        });
        // check if selected account category allows to show taxationDiscountBox in newEntry popup
        txn.showTaxationDiscountBox = this.getCategoryNameFromAccountUniqueName(txn);
        this.newLedPanelCtrl.calculateTotal();
        this.newLedPanelCtrl.checkForMulitCurrency();
        this.newLedPanelCtrl.detactChanges();
        this.selectedTxnAccUniqueName = txn.selectedAccount.uniqueName;
    };
    LedgerComponent.prototype.hideEledgerWrap = function () {
        this.lc.showEledger = false;
    };
    LedgerComponent.prototype.pageChanged = function (event) {
        this.advanceSearchRequest.page = event.page;
        this.trxRequest.page = event.page;
        // this.lc.currentPage = event.page;
        this.getAdvanceSearchTxn(true);
    };
    LedgerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.uploadInput = new _angular_core__WEBPACK_IMPORTED_MODULE_4__["EventEmitter"]();
        this.fileUploadOptions = { concurrency: 0 };
        Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["combineLatest"])(this.universalDate$, this.route.params, this.todaySelected$).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (resp) {
            if (!Array.isArray(resp[0])) {
                return;
            }
            _this.subscribeCount++;
            _this.hideEledgerWrap();
            var dateObj = resp[0];
            var params = resp[1];
            _this.todaySelected = resp[2];
            // check if params have from and to, this means ledger has been opened from other account-details-component
            if (params['from'] && params['to']) {
                var from = params['from'];
                var to = params['to'];
                _this.datePickerOptions = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _this.datePickerOptions, { startDate: moment_moment__WEBPACK_IMPORTED_MODULE_9__(from, 'DD-MM-YYYY').toDate(), endDate: moment_moment__WEBPACK_IMPORTED_MODULE_9__(to, 'DD-MM-YYYY').toDate() });
                _this.advanceSearchRequest = Object.assign({}, _this.advanceSearchRequest, {
                    dataToSend: Object.assign({}, _this.advanceSearchRequest.dataToSend, {
                        bsRangeValue: [moment_moment__WEBPACK_IMPORTED_MODULE_9__(from, 'DD-MM-YYYY').toDate(), moment_moment__WEBPACK_IMPORTED_MODULE_9__(to, 'DD-MM-YYYY').toDate()]
                    })
                });
                _this.advanceSearchRequest.to = to;
                _this.advanceSearchRequest.page = 0;
                _this.trxRequest.from = from;
                _this.trxRequest.to = to;
                _this.trxRequest.page = 0;
            }
            else {
                // means ledger is opened normally
                if (dateObj && !_this.todaySelected) {
                    var universalDate = _.cloneDeep(dateObj);
                    _this.datePickerOptions = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _this.datePickerOptions, { startDate: moment_moment__WEBPACK_IMPORTED_MODULE_9__(universalDate[0], 'DD-MM-YYYY').toDate(), endDate: moment_moment__WEBPACK_IMPORTED_MODULE_9__(universalDate[1], 'DD-MM-YYYY').toDate() });
                    _this.advanceSearchRequest = Object.assign({}, _this.advanceSearchRequest, {
                        dataToSend: Object.assign({}, _this.advanceSearchRequest.dataToSend, {
                            bsRangeValue: [moment_moment__WEBPACK_IMPORTED_MODULE_9__(universalDate[0], 'DD-MM-YYYY').toDate(), moment_moment__WEBPACK_IMPORTED_MODULE_9__(universalDate[1], 'DD-MM-YYYY').toDate()]
                        })
                    });
                    _this.advanceSearchRequest.to = universalDate[1];
                    _this.advanceSearchRequest.page = 0;
                    _this.trxRequest.from = moment_moment__WEBPACK_IMPORTED_MODULE_9__(universalDate[0]).format('DD-MM-YYYY');
                    _this.trxRequest.to = moment_moment__WEBPACK_IMPORTED_MODULE_9__(universalDate[1]).format('DD-MM-YYYY');
                    _this.trxRequest.page = 0;
                }
            }
            if (params['accountUniqueName']) {
                // this.advanceSearchComp.resetAdvanceSearchModal();
                _this.lc.accountUnq = params['accountUniqueName'];
                _this.needToShowLoader = true;
                // this.showLoader = false; // need to enable loder
                // if (this.ledgerSearchTerms) {
                //   this.ledgerSearchTerms.nativeElement.value = '';
                // }
                _this.searchText = '';
                // this.searchTermStream.next('');
                _this.resetBlankTransaction();
                // set state details
                var companyUniqueName_1 = null;
                _this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (s) { return companyUniqueName_1 = s; });
                var stateDetailsRequest = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_17__["StateDetailsRequest"]();
                stateDetailsRequest.companyUniqueName = companyUniqueName_1;
                stateDetailsRequest.lastState = 'ledger/' + _this.lc.accountUnq;
                _this.store.dispatch(_this._companyActions.SetStateDetails(stateDetailsRequest));
                _this.isCompanyCreated$.subscribe(function (s) {
                    if (!s) {
                        _this.store.dispatch(_this._ledgerActions.GetLedgerAccount(_this.lc.accountUnq));
                        if (_this.trxRequest && _this.trxRequest.q) {
                            _this.trxRequest.q = null;
                        }
                        _this.initTrxRequest(params['accountUniqueName']);
                    }
                });
                _this.store.dispatch(_this._ledgerActions.setAccountForEdit(_this.lc.accountUnq));
                // init transaction request and call for transaction data
                // this.advanceSearchRequest = new AdvanceSearchRequest();
            }
            else if (_this.selectedAccountUniqueName) {
                // this.advanceSearchComp.resetAdvanceSearchModal();
                _this.lc.accountUnq = _this.selectedAccountUniqueName;
                _this.needToShowLoader = true;
                // this.showLoader = false; // need to enable loder
                // if (this.ledgerSearchTerms) {
                //   this.ledgerSearchTerms.nativeElement.value = '';
                // }
                _this.searchText = '';
                // this.searchTermStream.next('');
                _this.resetBlankTransaction();
                // set state details
                var companyUniqueName_2 = null;
                _this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (s) { return companyUniqueName_2 = s; });
                var stateDetailsRequest = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_17__["StateDetailsRequest"]();
                // stateDetailsRequest.companyUniqueName = companyUniqueName;
                // stateDetailsRequest.lastState = 'ledger/' + this.lc.accountUnq;
                // this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
                // this.isCompanyCreated$.subscribe(s => {
                //   if (!s) {
                //     this.store.dispatch(this._ledgerActions.GetLedgerAccount(this.lc.accountUnq));
                //     if (this.trxRequest && this.trxRequest.q) {
                //       this.trxRequest.q = null;
                //     }
                //     this.initTrxRequest(this.selectedAccountUniqueName);
                //   }
                // });
                _this.store.dispatch(_this._ledgerActions.setAccountForEdit(_this.lc.accountUnq));
                // init transaction request and call for transaction data
                // this.advanceSearchRequest = new AdvanceSearchRequest();
            }
        });
        this.isTransactionRequestInProcess$.subscribe(function (s) {
            if (_this.needToShowLoader) {
                _this.showLoader = _.clone(s);
            }
            else {
                _this.showLoader = false;
            }
            // if (!s && this.showLoader) {
            //   this.showLoader = false;
            // }
        });
        this.lc.transactionData$.subscribe(function (lt) {
            if (lt) {
                if (lt.closingBalanceForBank) {
                    _this.reconcileClosingBalanceForBank = lt.closingBalanceForBank;
                    _this.reconcileClosingBalanceForBank.type = _this.reconcileClosingBalanceForBank.type === 'CREDIT' ? 'Cr' : 'Dr';
                }
                var checkedEntriesName = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["uniq"])(lt.debitTransactions.filter(function (f) { return f.isChecked; }).map(function (dt) { return dt.entryUniqueName; }).concat(lt.creditTransactions.filter(function (f) { return f.isChecked; }).map(function (ct) { return ct.entryUniqueName; })));
                if (checkedEntriesName.length) {
                    checkedEntriesName.forEach(function (f) {
                        var duplicate = _this.checkedTrxWhileHovering.some(function (s) { return s === f; });
                        if (!duplicate) {
                            _this.checkedTrxWhileHovering.push(f);
                        }
                    });
                }
                else {
                    _this.checkedTrxWhileHovering = [];
                }
                var failedEntries_1 = [];
                _this.failedBulkEntries$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (ent) { return failedEntries_1 = ent; });
                if (failedEntries_1.length > 0) {
                    _this.store.dispatch(_this._ledgerActions.SelectGivenEntries(failedEntries_1));
                }
                _this.lc.currentPage = lt.page;
                // commented due to new API
                if (_this.isAdvanceSearchImplemented) {
                    _this.lc.calculateReckonging(lt);
                }
                setTimeout(function () {
                    _this.loadPaginationComponent(lt);
                    _this._cdRf.detectChanges();
                }, 400);
            }
        });
        this.ledgerTxnBalance$.subscribe(function (txnBalance) {
            if (txnBalance) {
                _this.lc.calculateReckonging(txnBalance);
                _this._cdRf.detectChanges();
            }
        });
        this.isLedgerCreateSuccess$.subscribe(function (s) {
            if (s) {
                _this._toaster.successToast('Entry created successfully', 'Success');
                _this.lc.showNewLedgerPanel = false;
                // this.store.dispatch(this._ledgerActions.GetLedgerBalance(this.trxRequest));
                _this.initTrxRequest(_this.lc.accountUnq);
                _this.resetBlankTransaction();
                // Después del éxito de la entrada. llamar para transacciones bancarias
                _this.lc.activeAccount$.subscribe(function (data) {
                    _this._loaderService.show();
                    if (data && data.yodleeAdded) {
                        _this.getBankTransactions();
                    }
                    else {
                        _this.hideEledgerWrap();
                    }
                });
            }
        });
        Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["combineLatest"])(this.lc.activeAccount$, this.lc.flattenAccountListStream$).subscribe(function (data) {
            if (data[0] && data[1]) {
                var stockListFormFlattenAccount_1;
                if (data[1]) {
                    stockListFormFlattenAccount_1 = data[1].find(function (acc) { return acc.uniqueName === _this.lc.accountUnq; });
                }
                var accountDetails = data[0];
                var parentOfAccount = accountDetails.parentGroups[0];
                // tcs tds identification
                if (['revenuefromoperations', 'otherincome', 'operatingcost', 'indirectexpenses', 'currentassets', 'noncurrentassets', 'fixedassets'].includes(parentOfAccount.uniqueName)) {
                    _this.tcsOrTds = ['indirectexpenses', 'operatingcost'].includes(parentOfAccount.uniqueName) ? 'tds' : 'tcs';
                    // for tcs and tds identification
                    if (_this.tcsOrTds === 'tcs') {
                        _this.tdsTcsTaxTypes = ['tcspay', 'tcsrc'];
                    }
                    else {
                        _this.tdsTcsTaxTypes = ['tdspay', 'tdsrc'];
                    }
                }
                // check if account is stockable
                var isStockableAccount = parentOfAccount ?
                    (parentOfAccount.uniqueName === 'revenuefromoperations' || parentOfAccount.uniqueName === 'otherincome' ||
                        parentOfAccount.uniqueName === 'operatingcost' || parentOfAccount.uniqueName === 'indirectexpenses') : false;
                var accountsArray_1 = [];
                if (isStockableAccount) {
                    // stocks from ledger account
                    data[1].map(function (acc) {
                        // normal entry
                        accountsArray_1.push({ value: uuid__WEBPACK_IMPORTED_MODULE_11__["v4"](), label: acc.name, additional: acc });
                        // check if taxable or roundoff account then don't assign stocks
                        var notRoundOff = acc.uniqueName === 'roundoff';
                        var isTaxAccount = acc.uNameStr.indexOf('dutiestaxes') > -1;
                        // accountDetails.stocks.map(as => { // As discussed with Gaurav sir, we need to pick stocks form flatten account's response
                        if (!isTaxAccount && !notRoundOff && stockListFormFlattenAccount_1 && stockListFormFlattenAccount_1.stocks) {
                            stockListFormFlattenAccount_1.stocks.map(function (as) {
                                // stock entry
                                accountsArray_1.push({
                                    value: uuid__WEBPACK_IMPORTED_MODULE_11__["v4"](),
                                    label: "" + acc.name + (" (" + as.name + ")"),
                                    additional: Object.assign({}, acc, { stock: as })
                                });
                            });
                        }
                    });
                }
                else {
                    // stocks from account itself
                    data[1].map(function (acc) {
                        if (acc.stocks) {
                            // normal entry
                            accountsArray_1.push({ value: uuid__WEBPACK_IMPORTED_MODULE_11__["v4"](), label: acc.name, additional: acc });
                            // stock entry
                            acc.stocks.map(function (as) {
                                accountsArray_1.push({
                                    value: uuid__WEBPACK_IMPORTED_MODULE_11__["v4"](),
                                    // label: acc.name + '(' + as.uniqueName + ')',
                                    label: "" + acc.name + (" (" + as.name + ")"),
                                    additional: Object.assign({}, acc, { stock: as })
                                });
                            });
                        }
                        else {
                            accountsArray_1.push({ value: uuid__WEBPACK_IMPORTED_MODULE_11__["v4"](), label: acc.name, additional: acc });
                        }
                    });
                }
                _this.lc.flattenAccountList = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["orderBy"])(accountsArray_1, 'label'));
            }
        });
        this.lc.activeAccount$.subscribe(function (acc) {
            if (acc) {
                // need to clear selected entries when account changes
                _this.entryUniqueNamesForBulkAction = [];
                _this.needToShowLoader = true;
                _this.lc.getUnderstandingText(acc.accountType, acc.name);
                _this.accountUniquename = acc.uniqueName;
                // this.getInvoiveLists({accountUniqueName: acc.uniqueName, status: 'unpaid'});
                if (_this.advanceSearchComp) {
                    _this.advanceSearchComp.resetAdvanceSearchModal();
                }
                // this.store.dispatch(this._ledgerActions.GetUnpaidInvoiceListAction({accountUniqueName: acc.uniqueName, status: 'unpaid'}));
            }
        });
        // search
        // Observable.fromEvent(this.ledgerSearchTerms.nativeElement, 'input')
        //   .debounceTime(700)
        //   .distinctUntilChanged()
        //   .map((e: any) => e.target.value)
        //   .subscribe(term => {
        //     this.trxRequest.q = term;
        //     this.trxRequest.page = 0;
        //     this.getTransactionData();
        //   });
        this.searchTermStream.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(700), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["distinctUntilChanged"])())
            .subscribe(function (term) {
            _this.trxRequest.q = term;
            _this.trxRequest.page = 0;
            _this.needToShowLoader = false;
            _this.getTransactionData();
        });
        // get A/c details
        this.lc.activeAccount$.subscribe(function (data) {
            if (data) {
                if (data.yodleeAdded) {
                    _this.getBankTransactions();
                }
                if (data.parentGroups && data.parentGroups.length) {
                    var findCashOrBankIndx = data.parentGroups.findIndex(function (grp) { return grp.uniqueName === 'bankaccounts'; });
                    if (findCashOrBankIndx !== -1) {
                        _this.isBankOrCashAccount = true;
                    }
                    else {
                        _this.isBankOrCashAccount = false;
                    }
                }
                // if (data.currency) {
                //   this.accountBaseCurrency = data.currency;
                // }
            }
            else {
                _this.hideEledgerWrap();
            }
        });
        this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_26__["createSelector"])([function (st) { return st.general.addAndManageClosed; }], function (yesOrNo) {
            if (yesOrNo) {
                _this.getTransactionData();
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(300)).subscribe();
        this.ledgerBulkActionSuccess$.subscribe(function (yes) {
            if (yes) {
                _this.entryUniqueNamesForBulkAction = [];
                _this.getTransactionData();
                // this.store.dispatch(this._ledgerActions.doAdvanceSearch(_.cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName,
                //   moment(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format('DD-MM-YYYY'), moment(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format('DD-MM-YYYY'),
                //   this.advanceSearchRequest.page, this.advanceSearchRequest.count, this.advanceSearchRequest.q));
            }
        });
        this.createStockSuccess$.subscribe(function (s) {
            if (s) {
                _this.store.dispatch(_this._generalActions.getFlattenAccount());
            }
        });
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(function (s) { return s.settings.profile; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (s) {
            _this.profileObj = s;
        });
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["select"])(function (s) { return s.company.taxes; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (res) {
            _this.companyTaxesList = res || [];
        });
    };
    LedgerComponent.prototype.initTrxRequest = function (accountUnq) {
        this._loaderService.show();
        // this.advanceSearchRequest = this.advanceSearchRequest || new AdvanceSearchRequest();
        // this.advanceSearchRequest.page = 0;
        // this.advanceSearchRequest.count = 15;
        this.advanceSearchRequest.accountUniqueName = accountUnq;
        // this.advanceSearchRequest.from = this.advanceSearchRequest.from || moment(this.datePickerOptions.startDate).format('DD-MM-YYYY');
        // this.advanceSearchRequest.to = this.advanceSearchRequest.to || moment(this.datePickerOptions.endDate).format('DD-MM-YYYY');
        // this.advanceSearchRequest.dataToSend = this.advanceSearchRequest.dataToSend || new AdvanceSearchModel();
        this.trxRequest.accountUniqueName = accountUnq;
        this.getTransactionData();
    };
    LedgerComponent.prototype.getBankTransactions = function () {
        var _this = this;
        // && this.advanceSearchRequest.from
        if (this.trxRequest.accountUniqueName) {
            this.isBankTransactionLoading = true;
            this._ledgerService.GetBankTranscationsForLedger(this.trxRequest.accountUniqueName, this.trxRequest.from).subscribe(function (res) {
                _this.isBankTransactionLoading = false;
                if (res.status === 'success') {
                    _this.lc.getReadyBankTransactionsForUI(res.body);
                }
            });
        }
        // else {
        //   this._toaster.warningToast('Something went wrong please reload page');
        // }
    };
    LedgerComponent.prototype.selectBankTxn = function (txn) {
        this.lc.currentTxn = null;
        this.lc.currentBlankTxn = txn;
        this.lc.selectedBankTxnUniqueName = txn.id;
    };
    LedgerComponent.prototype.showBankLedgerPopup = function (txn, item) {
        this.selectBankTxn(txn);
        this.lc.currentBankEntry = item;
        this.lc.showBankLedgerPanel = true;
        // console.log('txn selected');
    };
    LedgerComponent.prototype.hideBankLedgerPopup = function (e) {
        // cuando se emita falso en caso de éxito del mapa de cuenta
        if (!e) {
            this.getBankTransactions();
            this.getTransactionData();
        }
        this.lc.showBankLedgerPanel = false;
        this.lc.currentBlankTxn = null;
        this.lc.selectedBankTxnUniqueName = null;
    };
    LedgerComponent.prototype.clickUnpaidInvoiceList = function (e) {
        if (e) {
            if (this.accountUniquename === 'cash' || this.accountUniquename === 'bankaccounts' && this.selectedTxnAccUniqueName) {
                this.getInvoiveLists({ accountUniqueName: this.selectedTxnAccUniqueName, status: 'unpaid' });
            }
            else {
                this.getInvoiveLists({ accountUniqueName: this.accountUniquename, status: 'unpaid' });
            }
        }
    };
    LedgerComponent.prototype.saveBankTransaction = function () {
        // Api llama para mover la transacción bancaria al libro mayor
        var blankTransactionObj = this.lc.prepareBankLedgerRequestObject();
        blankTransactionObj.invoicesToBePaid = this.selectedInvoiceList;
        if (blankTransactionObj.transactions.length > 0) {
            this.store.dispatch(this._ledgerActions.CreateBlankLedger(Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"])(blankTransactionObj), this.lc.accountUnq));
            // let transactonId = blankTransactionObj.transactionId;
            // this.isLedgerCreateSuccess$.subscribe(s => {
            //   if (s && transactonId) {
            //     this.deleteBankTxn(transactonId);
            //   }
            // });
        }
        else {
            this._toaster.errorToast('There must be at least a transaction to make an entry.', 'Error');
        }
    };
    LedgerComponent.prototype.getselectedInvoice = function (event) {
        this.selectedInvoiceList = event;
        // console.log('parent list is..', this.selectedInvoiceList);
    };
    LedgerComponent.prototype.getTransactionData = function () {
        this.isAdvanceSearchImplemented = false;
        this.closingBalanceBeforeReconcile = null;
        this.store.dispatch(this._ledgerActions.GetLedgerBalance(this.trxRequest));
        this.store.dispatch(this._ledgerActions.GetTransactions(this.trxRequest));
    };
    LedgerComponent.prototype.toggleTransactionType = function (event) {
        var _this = this;
        var allTrx = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["filter"])(this.lc.blankLedger.transactions, function (bl) { return bl.type === event; });
        var unAccountedTrx = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["find"])(allTrx, function (a) { return !a.selectedAccount; });
        if (unAccountedTrx) {
            this.selectBlankTxn(unAccountedTrx);
            this.dropDowns.filter(function (dd) { return dd.idEl === unAccountedTrx.id; }).forEach(function (dd) {
                setTimeout(function () {
                    dd.show(null);
                }, 0);
            });
        }
        else {
            var newTrx_1 = this.lc.addNewTransaction(event);
            this.lc.blankLedger.transactions.push(newTrx_1);
            this.selectBlankTxn(newTrx_1);
            setTimeout(function () {
                _this.dropDowns.filter(function (dd) { return dd.idEl === newTrx_1.id; }).forEach(function (dd) {
                    dd.show(null);
                });
            }, 0);
        }
    };
    LedgerComponent.prototype.downloadAttachedFile = function (fileName, e) {
        var _this = this;
        e.stopPropagation();
        this._ledgerService.DownloadAttachement(fileName).subscribe(function (d) {
            if (d.status === 'success') {
                var blob = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_20__["base64ToBlob"])(d.body.uploadedFile, "image/" + d.body.fileType, 512);
                return Object(file_saver__WEBPACK_IMPORTED_MODULE_13__["saveAs"])(blob, d.body.name);
            }
            else {
                _this._toaster.errorToast(d.message);
            }
        });
    };
    LedgerComponent.prototype.downloadInvoice = function (invoiceName, voucherType, e) {
        var _this = this;
        e.stopPropagation();
        var activeAccount = null;
        this.lc.activeAccount$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (p) { return activeAccount = p; });
        var downloadRequest = new _models_api_models_Ledger__WEBPACK_IMPORTED_MODULE_8__["DownloadLedgerRequest"]();
        downloadRequest.invoiceNumber = [invoiceName];
        downloadRequest.voucherType = voucherType;
        this._ledgerService.DownloadInvoice(downloadRequest, this.lc.accountUnq).subscribe(function (d) {
            if (d.status === 'success') {
                var blob = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_20__["base64ToBlob"])(d.body, 'application/pdf', 512);
                return Object(file_saver__WEBPACK_IMPORTED_MODULE_13__["saveAs"])(blob, activeAccount.name + " - " + invoiceName + ".pdf");
            }
            else {
                _this._toaster.errorToast(d.message);
            }
        });
    };
    LedgerComponent.prototype.resetBlankTransaction = function () {
        this.lc.blankLedger = {
            transactions: [
                this.lc.addNewTransaction('DEBIT'),
                this.lc.addNewTransaction('CREDIT')
            ],
            voucherType: null,
            entryDate: this.datePickerOptions.endDate ? moment_moment__WEBPACK_IMPORTED_MODULE_9__(this.datePickerOptions.endDate).format('DD-MM-YYYY') : moment_moment__WEBPACK_IMPORTED_MODULE_9__().format('DD-MM-YYYY'),
            unconfirmedEntry: false,
            attachedFile: '',
            attachedFileName: '',
            tag: null,
            description: '',
            generateInvoice: false,
            chequeNumber: '',
            chequeClearanceDate: '',
            invoiceNumberAgainstVoucher: '',
            compoundTotal: 0,
            invoicesToBePaid: [],
            otherTaxModal: new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_41__["SalesOtherTaxesModal"](),
            otherTaxesSum: 0,
            tdsTcsTaxesSum: 0,
            otherTaxType: 'tcs'
        };
        this.hideNewLedgerEntryPopup();
    };
    LedgerComponent.prototype.showNewLedgerEntryPopup = function (trx) {
        this.selectBlankTxn(trx);
        this.lc.showNewLedgerPanel = true;
    };
    LedgerComponent.prototype.onSelectHide = function () {
        var _this = this;
        // To Prevent Race condition
        setTimeout(function () { return _this.isSelectOpen = false; }, 500);
    };
    LedgerComponent.prototype.onEnter = function (se, txn) {
        if (!this.isSelectOpen) {
            this.isSelectOpen = true;
            se.show();
            this.showNewLedgerEntryPopup(txn);
        }
    };
    LedgerComponent.prototype.onRightArrow = function (navigator, result) {
        if (result.currentHorizontal) {
            navigator.addVertical(result.currentHorizontal);
            navigator.nextVertical();
        }
    };
    LedgerComponent.prototype.onLeftArrow = function (navigator, result) {
        navigator.removeVertical();
        if (navigator.currentVertical && navigator.currentVertical.attributes.getNamedItem('vr-item')) {
            navigator.currentVertical.focus();
        }
        else {
            navigator.nextVertical();
        }
    };
    LedgerComponent.prototype.initNavigator = function (navigator, el) {
        navigator.setVertical(el);
        navigator.nextHorizontal();
    };
    LedgerComponent.prototype.hideNewLedgerEntryPopup = function (event) {
        if (event) {
            var classList = event.path.map(function (m) {
                return m.classList;
            });
            if (classList && classList instanceof Array) {
                var notClose = classList.some(function (cls) {
                    if (!cls) {
                        return;
                    }
                    return cls.contains('chkclrbsdp');
                });
                if (notClose) {
                    return;
                }
            }
        }
        this.lc.showNewLedgerPanel = false;
    };
    LedgerComponent.prototype.showUpdateLedgerModal = function (txn) {
        var transactions = null;
        this.store.select(function (t) { return t.ledger.transactionsResponse; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (trx) { return transactions = trx; });
        if (transactions) {
            // if (txn.isBaseAccount) {
            //   // store the trx values in store
            //   this.store.dispatch(this._ledgerActions.setAccountForEdit(txn.particular.uniqueName));
            // } else {
            //   // find trx from transactions array and store it in store
            //   let debitTrx: ITransactionItem[] = transactions.debitTransactions.filter(f => f.entryUniqueName === txn.entryUniqueName);
            //   let creditTrx: ITransactionItem[] = transactions.creditTransactions.filter(f => f.entryUniqueName === txn.entryUniqueName);
            //   let finalTrx: ITransactionItem[] = [...debitTrx, ...creditTrx];
            //   let baseAccount: ITransactionItem = finalTrx.find(f => f.isBaseAccount);
            //   if (baseAccount) {
            //     this.store.dispatch(this._ledgerActions.setAccountForEdit(baseAccount.particular.uniqueName));
            //   } else {
            //     // re activate account from url params
            //     this.store.dispatch(this._ledgerActions.setAccountForEdit(this.lc.accountUnq));
            //   }
            // }
            this.store.dispatch(this._ledgerActions.setAccountForEdit(this.lc.accountUnq));
        }
        this.showUpdateLedgerForm = true;
        this.store.dispatch(this._ledgerActions.setTxnForEdit(txn.entryUniqueName));
        this.lc.selectedTxnUniqueName = txn.entryUniqueName;
        this.loadUpdateLedgerComponent();
        this.updateLedgerModal.show();
    };
    LedgerComponent.prototype.hideUpdateLedgerModal = function () {
        this.showUpdateLedgerForm = false;
        this.updateLedgerModal.hide();
        this._loaderService.show();
    };
    LedgerComponent.prototype.showShareLedgerModal = function () {
        this.sharLedger.clear();
        this.shareLedgerModal.show();
        this.sharLedger.checkAccountSharedWith();
    };
    LedgerComponent.prototype.hideShareLedgerModal = function () {
        this.shareLedgerModal.hide();
    };
    LedgerComponent.prototype.showExportLedgerModal = function () {
        this.exportLedgerModal.show();
    };
    LedgerComponent.prototype.hideExportLedgerModal = function () {
        this.exportLedgerModal.hide();
    };
    LedgerComponent.prototype.saveBlankTransaction = function () {
        this._loaderService.show();
        if (this.lc.blankLedger.entryDate) {
            if (!moment_moment__WEBPACK_IMPORTED_MODULE_9__(this.lc.blankLedger.entryDate, 'DD-MM-YYYY').isValid()) {
                this._toaster.errorToast('Invalid Date Selected.Please Select Valid Date');
                this._loaderService.hide();
                return;
            }
            else {
                this.lc.blankLedger.entryDate = moment_moment__WEBPACK_IMPORTED_MODULE_9__(this.lc.blankLedger.entryDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
            }
        }
        if (this.lc.blankLedger.chequeClearanceDate) {
            if (!moment_moment__WEBPACK_IMPORTED_MODULE_9__(this.lc.blankLedger.chequeClearanceDate, 'DD-MM-YYYY').isValid()) {
                this._toaster.errorToast('Invalid Date Selected In Cheque Clearance Date.Please Select Valid Date');
                this._loaderService.hide();
                return;
            }
            else {
                this.lc.blankLedger.chequeClearanceDate = moment_moment__WEBPACK_IMPORTED_MODULE_9__(this.lc.blankLedger.chequeClearanceDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
            }
        }
        var blankTransactionObj = this.lc.prepareBlankLedgerRequestObject();
        if (blankTransactionObj.transactions.length > 0) {
            var isThereAnyTaxEntry = blankTransactionObj.transactions.some(function (s) { return s.taxes.length > 0; });
            if (isThereAnyTaxEntry) {
                if (this.profileObj && this.profileObj.gstDetails && this.profileObj.gstDetails.length) {
                    var isThereAnyGstDetails = this.profileObj.gstDetails.some(function (gst) { return gst.gstNumber; });
                    if (!isThereAnyGstDetails) {
                        this._toaster.errorToast('Please add GSTIN details in Settings before applying taxes', 'Error');
                        this._loaderService.hide();
                        return;
                    }
                }
                else {
                    this._toaster.errorToast('Please add GSTIN details in Settings before applying taxes', 'Error');
                    this._loaderService.hide();
                    return;
                }
            }
            if (blankTransactionObj.otherTaxType === 'tds') {
                delete blankTransactionObj['tcsCalculationMethod'];
            }
            this.store.dispatch(this._ledgerActions.CreateBlankLedger(Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["cloneDeep"])(blankTransactionObj), this.lc.accountUnq));
        }
        else {
            this._toaster.errorToast('There must be at least a transaction to make an entry.', 'Error');
            this._loaderService.hide();
        }
    };
    LedgerComponent.prototype.blankLedgerAmountClick = function () {
        if (this.lc.currentBlankTxn && Number(this.lc.currentBlankTxn.amount) === 0) {
            this.lc.currentBlankTxn.amount = undefined;
        }
    };
    LedgerComponent.prototype.entryManipulated = function () {
        if (this.isAdvanceSearchImplemented) {
            this.getAdvanceSearchTxn();
        }
        else {
            this.getTransactionData();
        }
    };
    LedgerComponent.prototype.resetAdvanceSearch = function () {
        this.advanceSearchComp.resetAdvanceSearchModal();
        this.getTransactionData();
    };
    LedgerComponent.prototype.showQuickAccountModal = function () {
        this.loadQuickAccountComponent();
        this.quickAccountModal.show();
    };
    LedgerComponent.prototype.hideQuickAccountModal = function () {
        this.quickAccountModal.hide();
    };
    LedgerComponent.prototype.getCategoryNameFromAccountUniqueName = function (txn) {
        var activeAccount;
        var groupWithAccountsList;
        this.lc.activeAccount$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (a) { return activeAccount = a; });
        this.lc.groupsArray$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (a) { return groupWithAccountsList = a; });
        var parent;
        var parentGroup;
        var showDiscountAndTaxPopup = false;
        parent = activeAccount.parentGroups[0].uniqueName;
        parentGroup = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["find"])(groupWithAccountsList, function (p) { return p.uniqueName === parent; });
        // check url account category
        if (parentGroup.category === 'income' || parentGroup.category === 'expenses' || parentGroup.category === 'assets') {
            if (parentGroup.category === 'assets') {
                showDiscountAndTaxPopup = activeAccount.parentGroups[0].uniqueName.includes('fixedassets');
            }
            else {
                showDiscountAndTaxPopup = true;
            }
        }
        // if url's account allows show discount and tax popup then don't check for selected account
        if (showDiscountAndTaxPopup) {
            return true;
        }
        // check selected account category
        if (txn.selectedAccount) {
            parent = txn.selectedAccount.parentGroups[0].uniqueName;
            parentGroup = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_10__["find"])(groupWithAccountsList, function (p) { return p.uniqueName === parent; });
            if (parentGroup.category === 'income' || parentGroup.category === 'expenses' || parentGroup.category === 'assets') {
                if (parentGroup.category === 'assets') {
                    showDiscountAndTaxPopup = txn.selectedAccount.uNameStr.includes('fixedassets');
                }
                else {
                    showDiscountAndTaxPopup = true;
                }
            }
        }
        return showDiscountAndTaxPopup;
    };
    LedgerComponent.prototype.ngOnDestroy = function () {
        this.store.dispatch(this._ledgerActions.ResetLedger());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    LedgerComponent.prototype.loadUpdateLedgerComponent = function () {
        var _this = this;
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(_components_updateLedgerEntryPanel_updateLedgerEntryPanel_component__WEBPACK_IMPORTED_MODULE_22__["UpdateLedgerEntryPanelComponent"]);
        var viewContainerRef = this.updateledgercomponent.viewContainerRef;
        viewContainerRef.remove();
        var componentRef = viewContainerRef.createComponent(componentFactory);
        var componentInstance = componentRef.instance;
        componentInstance.tcsOrTds = this.tcsOrTds;
        this.updateLedgerComponentInstance = componentInstance;
        componentInstance.toggleOtherTaxesAsideMenu.subscribe(function (res) {
            _this.toggleOtherTaxesAsidePane(res);
        });
        componentInstance.closeUpdateLedgerModal.subscribe(function () {
            _this.hideUpdateLedgerModal();
        });
        this.updateLedgerModal.onHidden.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function () {
            if (_this.showUpdateLedgerForm) {
                _this.hideUpdateLedgerModal();
            }
            _this.entryManipulated();
            _this.updateLedgerComponentInstance = null;
            componentRef.destroy();
        });
        componentInstance.showQuickAccountModalFromUpdateLedger.subscribe(function () {
            _this.showQuickAccountModal();
        });
    };
    LedgerComponent.prototype.loadQuickAccountComponent = function () {
        var _this = this;
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(apps_web_giddh_src_app_theme_quick_account_component_quickAccount_component__WEBPACK_IMPORTED_MODULE_29__["QuickAccountComponent"]);
        var viewContainerRef = this.quickAccountComponent.viewContainerRef;
        viewContainerRef.remove();
        var componentRef = viewContainerRef.createComponent(componentFactory);
        var componentInstance = componentRef.instance;
        componentInstance.closeQuickAccountModal.subscribe(function (a) {
            _this.hideQuickAccountModal();
            componentInstance.newAccountForm.reset();
            componentInstance.destroyed$.next(true);
            componentInstance.destroyed$.complete();
        });
    };
    LedgerComponent.prototype.loadPaginationComponent = function (s) {
        var _this = this;
        if (!this.paginationChild) {
            return;
        }
        var transactionData = null;
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(ngx_bootstrap__WEBPACK_IMPORTED_MODULE_19__["PaginationComponent"]);
        var viewContainerRef = this.paginationChild.viewContainerRef;
        viewContainerRef.remove();
        var componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
        viewContainerRef.insert(componentInstanceView.hostView);
        var componentInstance = componentInstanceView.instance;
        componentInstance.totalItems = s.count * s.totalPages;
        componentInstance.itemsPerPage = s.count;
        componentInstance.maxSize = 5;
        componentInstance.writeValue(s.page);
        componentInstance.boundaryLinks = true;
        componentInstance.pageChanged.subscribe(function (e) {
            // commenting this as we will use advance search api from now
            // if (this.isAdvanceSearchImplemented) {
            // this.advanceSearchPageChanged(e);
            // return;
            // }
            _this.pageChanged(e); // commenting this as we will use advance search api from now
        });
    };
    /**
     * onOpenAdvanceSearch
     */
    LedgerComponent.prototype.onOpenAdvanceSearch = function () {
        this.advanceSearchModel.show();
    };
    LedgerComponent.prototype.search = function (term) {
        // this.ledgerSearchTerms.nativeElement.value = term;
        this.searchTermStream.next(term);
    };
    /**
     * closeAdvanceSearchPopup
     */
    LedgerComponent.prototype.closeAdvanceSearchPopup = function (isCancel) {
        this.advanceSearchModel.hide();
        if (!isCancel) {
            this.getAdvanceSearchTxn();
            // this.getTransactionData();
        }
        // this.advanceSearchRequest = _.cloneDeep(advanceSearchRequest);
    };
    LedgerComponent.prototype.getReconciliation = function () {
        var _this = this;
        this.lc.transactionData$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (val) {
            if (val) {
                _this.closingBalanceBeforeReconcile = val.closingBalance;
                _this.closingBalanceBeforeReconcile.type = _this.closingBalanceBeforeReconcile.type === 'CREDIT' ? 'Cr' : 'Dr';
            }
        });
        var dataToSend = {
            reconcileDate: null,
            closingBalance: 0,
            ClosingBalanceType: null,
            accountUniqueName: this.lc.accountUnq
        };
        this.store.dispatch(this._ledgerActions.GetReconciliation(dataToSend));
    };
    LedgerComponent.prototype.performBulkAction = function (actionType, fileInput) {
        var _a;
        this.entryUniqueNamesForBulkAction = [];
        // if (this.lc.showEledger) {
        //   this.entryUniqueNamesForBulkAction.push(
        //     ...this.lc.bankTransactionsData.map(bt => bt.transactions)
        //       .reduce((prev, curr) => {
        //         return prev.concat(curr);
        //       }, []).filter(f => f.isChecked).map(m => m.particular)
        //   );
        // } else {
        var debitTrx = [];
        var creditTrx = [];
        this.lc.transactionData$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (s) {
            if (s) {
                debitTrx = s.debitTransactions;
                creditTrx = s.creditTransactions;
            }
        });
        (_a = this.entryUniqueNamesForBulkAction).push.apply(_a, debitTrx.filter(function (f) { return f.isChecked; }).map(function (dt) { return dt.entryUniqueName; }).concat(creditTrx.filter(function (f) { return f.isChecked; }).map(function (ct) { return ct.entryUniqueName; })));
        // }
        if (!this.entryUniqueNamesForBulkAction.length) {
            this._toaster.errorToast('Please select at least one entry.', 'Error');
            return;
        }
        switch (actionType) {
            case 'delete':
                this.bulkActionConfirmationModal.show();
                break;
            case 'generate':
                this.bulkActionGenerateVoucherModal.show();
                break;
            case 'upload':
                fileInput.click();
                break;
            default:
                this._toaster.warningToast('Please select a valid action.', 'Warning');
        }
    };
    LedgerComponent.prototype.selectAllEntries = function (ev, type) {
        var key = type === 'debit' ? 'DEBIT' : 'CREDIT';
        if (!ev.target.checked) {
            if (type === 'debit') {
                this.debitSelectAll = false;
            }
            else {
                this.creditSelectAll = false;
            }
            this.selectedTrxWhileHovering = null;
            this.checkedTrxWhileHovering = [];
        }
        this.store.dispatch(this._ledgerActions.SelectDeSelectAllEntries(type, ev.target.checked));
    };
    LedgerComponent.prototype.selectEntryForBulkAction = function (ev, entryUniqueName) {
        if (entryUniqueName) {
            if (ev.target.checked) {
                this.entryUniqueNamesForBulkAction.push(entryUniqueName);
            }
            else {
                var itemIndx = this.entryUniqueNamesForBulkAction.findIndex(function (item) { return item === entryUniqueName; });
                this.entryUniqueNamesForBulkAction.splice(itemIndx, 1);
            }
        }
        else {
            // console.log('entryUniqueName not found');
        }
    };
    LedgerComponent.prototype.entryHovered = function (uniqueName) {
        this.selectedTrxWhileHovering = uniqueName;
    };
    LedgerComponent.prototype.entrySelected = function (ev, uniqueName) {
        if (ev.target.checked) {
            this.checkedTrxWhileHovering.push(uniqueName);
            this.store.dispatch(this._ledgerActions.SelectGivenEntries([uniqueName]));
        }
        else {
            var itemIndx = this.checkedTrxWhileHovering.findIndex(function (item) { return item === uniqueName; });
            this.checkedTrxWhileHovering.splice(itemIndx, 1);
            if (this.checkedTrxWhileHovering.length === 0) {
                this.creditSelectAll = false;
                this.debitSelectAll = false;
                this.selectedTrxWhileHovering = '';
            }
            this.lc.selectedTxnUniqueName = null;
            this.store.dispatch(this._ledgerActions.DeSelectGivenEntries([uniqueName]));
        }
    };
    LedgerComponent.prototype.onCancelBulkActionConfirmation = function () {
        this.entryUniqueNamesForBulkAction = [];
        this.bulkActionConfirmationModal.hide();
    };
    LedgerComponent.prototype.onConfirmationBulkActionConfirmation = function () {
        this.store.dispatch(this._ledgerActions.DeleteMultipleLedgerEntries(this.lc.accountUnq, _.cloneDeep(this.entryUniqueNamesForBulkAction)));
        this.entryUniqueNamesForBulkAction = [];
        this.bulkActionConfirmationModal.hide();
    };
    LedgerComponent.prototype.onUploadOutput = function (output) {
        if (output.type === 'allAddedToQueue') {
            var sessionKey_1 = null;
            var companyUniqueName_3 = null;
            this.sessionKey$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (a) { return sessionKey_1 = a; });
            this.companyName$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (a) { return companyUniqueName_3 = a; });
            var event_1 = {
                type: 'uploadAll',
                url: apps_web_giddh_src_app_app_constant__WEBPACK_IMPORTED_MODULE_32__["Configuration"].ApiUrl + _services_apiurls_ledger_api__WEBPACK_IMPORTED_MODULE_33__["LEDGER_API"].UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName_3),
                method: 'POST',
                fieldName: 'file',
                data: { entries: _.cloneDeep(this.entryUniqueNamesForBulkAction).join() },
                headers: { 'Session-Id': sessionKey_1 },
            };
            this.uploadInput.emit(event_1);
        }
        else if (output.type === 'start') {
            this.isFileUploading = true;
            this._loaderService.show();
        }
        else if (output.type === 'done') {
            this._loaderService.hide();
            if (output.file.response.status === 'success') {
                this.entryUniqueNamesForBulkAction = [];
                this.getTransactionData();
                this.isFileUploading = false;
                this._toaster.successToast('file uploaded successfully');
            }
            else {
                this.isFileUploading = false;
                this._toaster.errorToast(output.file.response.message);
            }
        }
    };
    LedgerComponent.prototype.onSelectInvoiceGenerateOption = function (isCombined) {
        this.bulkActionGenerateVoucherModal.hide();
        this.entryUniqueNamesForBulkAction = _.uniq(this.entryUniqueNamesForBulkAction);
        this.store.dispatch(this._ledgerActions.GenerateBulkLedgerInvoice({ combined: isCombined }, [{ accountUniqueName: this.lc.accountUnq, entries: _.cloneDeep(this.entryUniqueNamesForBulkAction) }], 'ledger'));
    };
    LedgerComponent.prototype.onCancelSelectInvoiceModal = function () {
        this.bulkActionGenerateVoucherModal.hide();
    };
    LedgerComponent.prototype.openSelectFilePopup = function (fileInput) {
        if (!this.entryUniqueNamesForBulkAction.length) {
            this._toaster.errorToast('Please select at least one entry.', 'Error');
            return;
        }
        fileInput.click();
    };
    LedgerComponent.prototype.toggleBodyClass = function () {
        if (this.asideMenuState === 'in' || this.asideMenuStateForOtherTaxes === 'in') {
            document.querySelector('body').classList.add('fixed');
        }
        else {
            document.querySelector('body').classList.remove('fixed');
        }
    };
    LedgerComponent.prototype.toggleAsidePane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    LedgerComponent.prototype.toggleOtherTaxesAsidePane = function (modal) {
        // if (!modalBool) {
        //   this.vm.selectedLedger.otherTaxModal = new SalesOtherTaxesModal();
        //   this.vm.selectedLedger.otherTaxesSum = 0;
        //   this.vm.selectedLedger.tdsTcsTaxesSum = 0;
        //   this.vm.selectedLedger.cessSum = 0;
        //   this.vm.selectedLedger.otherTaxModal.itemLabel = '';
        //   return;
        // }
        this.asideMenuStateForOtherTaxes = this.asideMenuStateForOtherTaxes === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    LedgerComponent.prototype.calculateOtherTaxes = function (modal) {
        if (this.updateLedgerComponentInstance) {
            this.updateLedgerComponentInstance.vm.calculateOtherTaxes(modal);
        }
    };
    /**
     * deleteBankTxn
     */
    LedgerComponent.prototype.deleteBankTxn = function (transactionId) {
        var _this = this;
        this._ledgerService.DeleteBankTransaction(transactionId).subscribe(function (res) {
            if (res.status === 'success') {
                _this._toaster.successToast('Bank transaction deleted Successfully');
            }
        });
    };
    // endregion
    LedgerComponent.prototype.getAdvanceSearchTxn = function (fromPageChange) {
        this.advanceSearchRequest.count = 15; // because getTransactionData have 15 count
        if (!fromPageChange) {
            this.isAdvanceSearchImplemented = true;
        }
        if (this.advanceSearchRequest.dataToSend.bsRangeValue && !this.todaySelected) {
            this.advanceSearchRequest.dataToSend = this.advanceSearchRequest.dataToSend || new _models_interfaces_AdvanceSearchRequest__WEBPACK_IMPORTED_MODULE_30__["AdvanceSearchModel"]();
            this.store.dispatch(this._ledgerActions.doAdvanceSearch(_.cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName, moment_moment__WEBPACK_IMPORTED_MODULE_9__(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format('DD-MM-YYYY'), moment_moment__WEBPACK_IMPORTED_MODULE_9__(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format('DD-MM-YYYY'), this.advanceSearchRequest.page, this.advanceSearchRequest.count, this.advanceSearchRequest.q));
        }
        else {
            var from = this.advanceSearchRequest.dataToSend.bsRangeValue && this.advanceSearchRequest.dataToSend.bsRangeValue[0] ? moment_moment__WEBPACK_IMPORTED_MODULE_9__(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format('DD-MM-YYYY') : '';
            var to = this.advanceSearchRequest.dataToSend.bsRangeValue && this.advanceSearchRequest.dataToSend.bsRangeValue[1] ? moment_moment__WEBPACK_IMPORTED_MODULE_9__(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format('DD-MM-YYYY') : '';
            this.store.dispatch(this._ledgerActions.doAdvanceSearch(_.cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName, from, to, this.advanceSearchRequest.page, this.advanceSearchRequest.count));
        }
    };
    LedgerComponent.prototype.getInvoiveLists = function (request) {
        var _this = this;
        this.invoiceList = [];
        this._ledgerService.GetInvoiceList(request).subscribe(function (res) {
            _.map(res.body.invoiceList, function (o) {
                _this.invoiceList.push({ label: o.invoiceNumber, value: o.invoiceNumber, isSelected: false });
            });
            _.uniqBy(_this.invoiceList, 'value');
        });
    };
    LedgerComponent.prototype.onScrollEvent = function () {
        this.datepickers.hide();
    };
    LedgerComponent.prototype.keydownPressed = function (e) {
        if (e.code === 'ArrowDown') {
            this.keydownClassAdded = true;
        }
        else if (e.code === 'Enter' && this.keydownClassAdded) {
            this.keydownClassAdded = true;
            this.toggleAsidePane();
        }
        else {
            this.keydownClassAdded = false;
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('updateledgercomponent'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_21__["ElementViewContainerRef"])
    ], LedgerComponent.prototype, "updateledgercomponent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('quickAccountComponent'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_21__["ElementViewContainerRef"])
    ], LedgerComponent.prototype, "quickAccountComponent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('paginationChild'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_21__["ElementViewContainerRef"])
    ], LedgerComponent.prototype, "paginationChild", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('sharLedger'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", apps_web_giddh_src_app_ledger_components_shareLedger_shareLedger_component__WEBPACK_IMPORTED_MODULE_28__["ShareLedgerComponent"])
    ], LedgerComponent.prototype, "sharLedger", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])(ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_38__["BsDatepickerDirective"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_38__["BsDatepickerDirective"])
    ], LedgerComponent.prototype, "datepickers", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('advanceSearchComp'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _components_advance_search_advance_search_component__WEBPACK_IMPORTED_MODULE_40__["AdvanceSearchModelComponent"])
    ], LedgerComponent.prototype, "advanceSearchComp", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChildren"])(apps_web_giddh_src_app_theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_25__["ShSelectComponent"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_4__["QueryList"])
    ], LedgerComponent.prototype, "dropDowns", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], LedgerComponent.prototype, "selectedAccountUniqueName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('newLedPanel'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _components_newLedgerEntryPanel_newLedgerEntryPanel_component__WEBPACK_IMPORTED_MODULE_24__["NewLedgerEntryPanelComponent"])
    ], LedgerComponent.prototype, "newLedPanelCtrl", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('updateLedgerModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_19__["ModalDirective"])
    ], LedgerComponent.prototype, "updateLedgerModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('exportLedgerModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_19__["ModalDirective"])
    ], LedgerComponent.prototype, "exportLedgerModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('shareLedgerModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_19__["ModalDirective"])
    ], LedgerComponent.prototype, "shareLedgerModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('advanceSearchModel'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_19__["ModalDirective"])
    ], LedgerComponent.prototype, "advanceSearchModel", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('quickAccountModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_19__["ModalDirective"])
    ], LedgerComponent.prototype, "quickAccountModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('bulkActionConfirmationModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_19__["ModalDirective"])
    ], LedgerComponent.prototype, "bulkActionConfirmationModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('bulkActionGenerateVoucherModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_19__["ModalDirective"])
    ], LedgerComponent.prototype, "bulkActionGenerateVoucherModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])('ledgerSearchTerms'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ElementRef"])
    ], LedgerComponent.prototype, "ledgerSearchTerms", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["HostListener"])('window:scroll'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", []),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], LedgerComponent.prototype, "onScrollEvent", null);
    LedgerComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: 'ledger',
            template: __webpack_require__(/*! ./ledger.component.html */ "./src/app/ledger/ledger.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_35__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_35__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_35__["style"])({
                        transform: 'translate3d(0, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_35__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_35__["style"])({
                        transform: 'translate3d(100%, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_35__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_35__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_35__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_35__["animate"])('400ms ease-in-out'))
                ]),
            ],
            styles: [__webpack_require__(/*! ./ledger.component.scss */ "./src/app/ledger/ledger.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"], _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_6__["LedgerActions"], _angular_router__WEBPACK_IMPORTED_MODULE_7__["ActivatedRoute"],
            _services_ledger_service__WEBPACK_IMPORTED_MODULE_12__["LedgerService"], _services_account_service__WEBPACK_IMPORTED_MODULE_14__["AccountService"], _services_group_service__WEBPACK_IMPORTED_MODULE_15__["GroupService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"], _services_toaster_service__WEBPACK_IMPORTED_MODULE_16__["ToasterService"], _actions_company_actions__WEBPACK_IMPORTED_MODULE_18__["CompanyActions"], _actions_settings_tag_settings_tag_actions__WEBPACK_IMPORTED_MODULE_39__["SettingsTagActions"],
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ComponentFactoryResolver"], _actions_general_general_actions__WEBPACK_IMPORTED_MODULE_23__["GeneralActions"], apps_web_giddh_src_app_actions_login_action__WEBPACK_IMPORTED_MODULE_27__["LoginActions"],
            _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_31__["InvoiceActions"], _loader_loader_service__WEBPACK_IMPORTED_MODULE_34__["LoaderService"], _actions_settings_discount_settings_discount_action__WEBPACK_IMPORTED_MODULE_36__["SettingsDiscountActions"],
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["ChangeDetectorRef"]])
    ], LedgerComponent);
    return LedgerComponent;
}());



/***/ }),

/***/ "./src/app/ledger/ledger.module.ts":
/*!*****************************************!*\
  !*** ./src/app/ledger/ledger.module.ts ***!
  \*****************************************/
/*! exports provided: LedgerModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LedgerModule", function() { return LedgerModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _shared_helpers_pipes_currencyPipe_currencyType_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/helpers/pipes/currencyPipe/currencyType.module */ "./src/app/shared/helpers/pipes/currencyPipe/currencyType.module.ts");
/* harmony import */ var ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-bootstrap/datepicker */ "../../node_modules/ngx-bootstrap/datepicker/index.js");
/* harmony import */ var _components_advance_search_advance_search_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/advance-search/advance-search.component */ "./src/app/ledger/components/advance-search/advance-search.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-bootstrap/dropdown */ "../../node_modules/ngx-bootstrap/dropdown/index.js");
/* harmony import */ var _ledger_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ledger.component */ "./src/app/ledger/ledger.component.ts");
/* harmony import */ var _ledger_routing_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ledger.routing.module */ "./src/app/ledger/ledger.routing.module.ts");
/* harmony import */ var _components_newLedgerEntryPanel_newLedgerEntryPanel_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/newLedgerEntryPanel/newLedgerEntryPanel.component */ "./src/app/ledger/components/newLedgerEntryPanel/newLedgerEntryPanel.component.ts");
/* harmony import */ var _components_updateLedgerEntryPanel_updateLedgerEntryPanel_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/updateLedgerEntryPanel/updateLedgerEntryPanel.component */ "./src/app/ledger/components/updateLedgerEntryPanel/updateLedgerEntryPanel.component.ts");
/* harmony import */ var _components_shareLedger_shareLedger_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/shareLedger/shareLedger.component */ "./src/app/ledger/components/shareLedger/shareLedger.component.ts");
/* harmony import */ var _components_exportLedger_exportLedger_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/exportLedger/exportLedger.component */ "./src/app/ledger/components/exportLedger/exportLedger.component.ts");
/* harmony import */ var _components_updateLedger_tax_control_updateLedger_tax_control_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/updateLedger-tax-control/updateLedger-tax-control.component */ "./src/app/ledger/components/updateLedger-tax-control/updateLedger-tax-control.component.ts");
/* harmony import */ var _components_updateLedgerDiscount_updateLedgerDiscount_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/updateLedgerDiscount/updateLedgerDiscount.component */ "./src/app/ledger/components/updateLedgerDiscount/updateLedgerDiscount.component.ts");
/* harmony import */ var angular_resize_event__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! angular-resize-event */ "../../node_modules/angular-resize-event/fesm5/angular-resize-event.js");
/* harmony import */ var ngx_uploader__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ngx-uploader */ "../../node_modules/ngx-uploader/fesm5/ngx-uploader.js");
/* harmony import */ var ngx_clipboard__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ngx-clipboard */ "../../node_modules/ngx-clipboard/fesm5/ngx-clipboard.js");
/* harmony import */ var ngx_bootstrap_tooltip__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ngx-bootstrap/tooltip */ "../../node_modules/ngx-bootstrap/tooltip/index.js");
/* harmony import */ var ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ngx-bootstrap/pagination */ "../../node_modules/ngx-bootstrap/pagination/index.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ngx-bootstrap/modal */ "../../node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var _theme_tax_control_tax_control_module__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../theme/tax-control/tax-control.module */ "./src/app/theme/tax-control/tax-control.module.ts");
/* harmony import */ var _theme_ng2_daterangepicker_daterangepicker_module__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../theme/ng2-daterangepicker/daterangepicker.module */ "./src/app/theme/ng2-daterangepicker/daterangepicker.module.ts");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/fesm5/angular2-ladda.js");
/* harmony import */ var _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../shared/helpers/directives/elementViewChild/elementViewChild.module */ "./src/app/shared/helpers/directives/elementViewChild/elementViewChild.module.ts");
/* harmony import */ var angular2_text_mask__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! angular2-text-mask */ "../../node_modules/angular2-text-mask/dist/angular2TextMask.js");
/* harmony import */ var angular2_text_mask__WEBPACK_IMPORTED_MODULE_26___default = /*#__PURE__*/__webpack_require__.n(angular2_text_mask__WEBPACK_IMPORTED_MODULE_26__);
/* harmony import */ var _shared_helpers_pipes_numberToWords_numberToWords_module__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../shared/helpers/pipes/numberToWords/numberToWords.module */ "./src/app/shared/helpers/pipes/numberToWords/numberToWords.module.ts");
/* harmony import */ var _theme_confirm_modal__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../theme/confirm-modal */ "./src/app/theme/confirm-modal/index.ts");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../shared/helpers/directives/decimalDigits/decimalDigits.module */ "./src/app/shared/helpers/directives/decimalDigits/decimalDigits.module.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _shared_helpers_directives_textCaseChange_textCaseChange_module__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ../shared/helpers/directives/textCaseChange/textCaseChange.module */ "./src/app/shared/helpers/directives/textCaseChange/textCaseChange.module.ts");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ng-click-outside */ "../../node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_33___default = /*#__PURE__*/__webpack_require__.n(ng_click_outside__WEBPACK_IMPORTED_MODULE_33__);
/* harmony import */ var apps_web_giddh_src_app_theme_quick_account_component_quickAccount_module__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! apps/web-giddh/src/app/theme/quick-account-component/quickAccount.module */ "./src/app/theme/quick-account-component/quickAccount.module.ts");
/* harmony import */ var _components_ledgerAsidePane_ledgerAsidePane_component__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./components/ledgerAsidePane/ledgerAsidePane.component */ "./src/app/ledger/components/ledgerAsidePane/ledgerAsidePane.component.ts");
/* harmony import */ var _inventory_inventory_module__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ../inventory/inventory.module */ "./src/app/inventory/inventory.module.ts");
/* harmony import */ var _components_ledgerAsidePane_component_ledger_aside_pane_account_ledger_aside_pane_account_component__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./components/ledgerAsidePane/component/ledger-aside-pane-account/ledger-aside.pane.account.component */ "./src/app/ledger/components/ledgerAsidePane/component/ledger-aside-pane-account/ledger-aside.pane.account.component.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ../theme/ng-select/ng-select */ "./src/app/theme/ng-select/ng-select.ts");
/* harmony import */ var _components_baseAccountModal_baseAccountModal_component__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./components/baseAccountModal/baseAccountModal.component */ "./src/app/ledger/components/baseAccountModal/baseAccountModal.component.ts");
/* harmony import */ var _sales_sales_module__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ../sales/sales.module */ "./src/app/sales/sales.module.ts");

















// import { ElementViewContainerRef } from '../shared/helpers/pipes/element.viewchild.directive';

























var LedgerModule = /** @class */ (function () {
    function LedgerModule() {
    }
    LedgerModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_6__["NgModule"])({
            declarations: [
                // Components / Directives/ Pipes
                _ledger_component__WEBPACK_IMPORTED_MODULE_8__["LedgerComponent"],
                _components_newLedgerEntryPanel_newLedgerEntryPanel_component__WEBPACK_IMPORTED_MODULE_10__["NewLedgerEntryPanelComponent"],
                //LedgerDiscountComponent,
                _components_updateLedgerEntryPanel_updateLedgerEntryPanel_component__WEBPACK_IMPORTED_MODULE_11__["UpdateLedgerEntryPanelComponent"],
                _components_shareLedger_shareLedger_component__WEBPACK_IMPORTED_MODULE_12__["ShareLedgerComponent"],
                _components_exportLedger_exportLedger_component__WEBPACK_IMPORTED_MODULE_13__["ExportLedgerComponent"],
                _components_updateLedger_tax_control_updateLedger_tax_control_component__WEBPACK_IMPORTED_MODULE_14__["UpdateLedgerTaxControlComponent"],
                _components_updateLedgerDiscount_updateLedgerDiscount_component__WEBPACK_IMPORTED_MODULE_15__["UpdateLedgerDiscountComponent"],
                _components_advance_search_advance_search_component__WEBPACK_IMPORTED_MODULE_3__["AdvanceSearchModelComponent"],
                _components_ledgerAsidePane_ledgerAsidePane_component__WEBPACK_IMPORTED_MODULE_35__["LedgerAsidePaneComponent"],
                _components_ledgerAsidePane_component_ledger_aside_pane_account_ledger_aside_pane_account_component__WEBPACK_IMPORTED_MODULE_37__["LedgerAsidePaneAccountComponent"],
                _components_baseAccountModal_baseAccountModal_component__WEBPACK_IMPORTED_MODULE_40__["BaseAccountComponent"]
            ],
            exports: [
                _ledger_component__WEBPACK_IMPORTED_MODULE_8__["LedgerComponent"], _components_updateLedgerEntryPanel_updateLedgerEntryPanel_component__WEBPACK_IMPORTED_MODULE_11__["UpdateLedgerEntryPanelComponent"]
            ],
            entryComponents: [_components_updateLedgerEntryPanel_updateLedgerEntryPanel_component__WEBPACK_IMPORTED_MODULE_11__["UpdateLedgerEntryPanelComponent"], ngx_bootstrap__WEBPACK_IMPORTED_MODULE_31__["PaginationComponent"]],
            providers: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_4__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ReactiveFormsModule"],
                _theme_tax_control_tax_control_module__WEBPACK_IMPORTED_MODULE_22__["TaxControlModule"].forRoot(),
                _ledger_routing_module__WEBPACK_IMPORTED_MODULE_9__["LedgerRoutingModule"],
                ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_21__["ModalModule"],
                ngx_bootstrap_tooltip__WEBPACK_IMPORTED_MODULE_19__["TooltipModule"],
                ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_20__["PaginationModule"],
                ngx_uploader__WEBPACK_IMPORTED_MODULE_17__["NgxUploaderModule"],
                ngx_clipboard__WEBPACK_IMPORTED_MODULE_18__["ClipboardModule"],
                _theme_ng2_daterangepicker_daterangepicker_module__WEBPACK_IMPORTED_MODULE_23__["Daterangepicker"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_24__["LaddaModule"],
                _shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_25__["ElementViewChildModule"],
                angular2_text_mask__WEBPACK_IMPORTED_MODULE_26__["TextMaskModule"],
                _shared_helpers_pipes_numberToWords_numberToWords_module__WEBPACK_IMPORTED_MODULE_27__["NumberToWordsModule"],
                _theme_confirm_modal__WEBPACK_IMPORTED_MODULE_28__["ConfirmModalModule"],
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_29__["ShSelectModule"],
                _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_30__["DecimalDigitsModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_2__["BsDatepickerModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_2__["DatepickerModule"],
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_31__["ButtonsModule"],
                ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_7__["BsDropdownModule"],
                _shared_helpers_directives_textCaseChange_textCaseChange_module__WEBPACK_IMPORTED_MODULE_32__["TextCaseChangeModule"],
                ng_click_outside__WEBPACK_IMPORTED_MODULE_33__["ClickOutsideModule"],
                apps_web_giddh_src_app_theme_quick_account_component_quickAccount_module__WEBPACK_IMPORTED_MODULE_34__["QuickAccountModule"].forRoot(),
                _inventory_inventory_module__WEBPACK_IMPORTED_MODULE_36__["InventoryModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_38__["SharedModule"],
                _shared_helpers_pipes_currencyPipe_currencyType_module__WEBPACK_IMPORTED_MODULE_1__["CurrencyModule"],
                _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_39__["SelectModule"].forRoot(),
                _sales_sales_module__WEBPACK_IMPORTED_MODULE_41__["SalesModule"],
                angular_resize_event__WEBPACK_IMPORTED_MODULE_16__["AngularResizedEventModule"]
            ],
        })
    ], LedgerModule);
    return LedgerModule;
}());



/***/ }),

/***/ "./src/app/ledger/ledger.routing.module.ts":
/*!*************************************************!*\
  !*** ./src/app/ledger/ledger.routing.module.ts ***!
  \*************************************************/
/*! exports provided: LedgerRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LedgerRoutingModule", function() { return LedgerRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ledger_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ledger.component */ "./src/app/ledger/ledger.component.ts");




var LedgerRoutingModule = /** @class */ (function () {
    function LedgerRoutingModule() {
    }
    LedgerRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([
                    {
                        path: ':accountUniqueName', component: _ledger_component__WEBPACK_IMPORTED_MODULE_3__["LedgerComponent"]
                    },
                    {
                        path: ':accountUniqueName/:from/:to', component: _ledger_component__WEBPACK_IMPORTED_MODULE_3__["LedgerComponent"]
                    }
                ])
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], LedgerRoutingModule);
    return LedgerRoutingModule;
}());



/***/ }),

/***/ "./src/app/models/interfaces/AdvanceSearchRequest.ts":
/*!***********************************************************!*\
  !*** ./src/app/models/interfaces/AdvanceSearchRequest.ts ***!
  \***********************************************************/
/*! exports provided: AdvanceSearchRequest, AdvanceSearchModel, AdvanceSearchRequestInventory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdvanceSearchRequest", function() { return AdvanceSearchRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdvanceSearchModel", function() { return AdvanceSearchModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdvanceSearchRequestInventory", function() { return AdvanceSearchRequestInventory; });
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_0__);

var AdvanceSearchRequest = /** @class */ (function () {
    // set to(value: string) {
    //   if (this.dataToSend.bsRangeValue.length > 1) {
    //     this.dataToSend.bsRangeValue[1] = moment(value, 'DD-MM-YYYY').toDate();
    //   } else {
    //     if (this.dataToSend.bsRangeValue.length === 0) {
    //       this.dataToSend.bsRangeValue = [];
    //       this.dataToSend.bsRangeValue.push(moment(value, GIDDH_DATE_FORMAT).subtract(30, 'days').toDate());
    //     }
    //     this.dataToSend.bsRangeValue.push(moment(value, 'DD-MM-YYYY').toDate());
    //   }
    // }
    function AdvanceSearchRequest() {
        this.dataToSend = new AdvanceSearchModel();
        this.q = '';
        this.page = 0;
        this.count = 30;
        this.accountUniqueName = '';
        this.sort = 'asc';
        // set from(value: string) {
        //   if (this.dataToSend.bsRangeValue.length > 0) {
        //     this.dataToSend.bsRangeValue[0] = moment(value, 'DD-MM-YYYY').toDate();
        //   } else {
        //     this.dataToSend.bsRangeValue = [];
        //     this.dataToSend.bsRangeValue.push(moment(value, 'DD-MM-YYYY').toDate());
        //   }
        // }
        this.reversePage = false;
        this.dataToSend = new AdvanceSearchModel();
    }
    Object.defineProperty(AdvanceSearchRequest.prototype, "from", {
        get: function () {
            if (this.dataToSend.bsRangeValue && this.dataToSend.bsRangeValue.length > 0) {
                return moment_moment__WEBPACK_IMPORTED_MODULE_0__(this.dataToSend.bsRangeValue[0]).format('DD-MM-YYYY');
            }
            return moment_moment__WEBPACK_IMPORTED_MODULE_0__().subtract(30, 'days').format('DD-MM-YYYY');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdvanceSearchRequest.prototype, "to", {
        get: function () {
            if (this.dataToSend.bsRangeValue && this.dataToSend.bsRangeValue.length > 1) {
                return moment_moment__WEBPACK_IMPORTED_MODULE_0__(this.dataToSend.bsRangeValue[1]).format('DD-MM-YYYY');
            }
            return moment_moment__WEBPACK_IMPORTED_MODULE_0__().format('DD-MM-YYYY');
        },
        set: function (val) {
            if (val) {
                this.dataToSend.bsRangeValue[1] = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    return AdvanceSearchRequest;
}());

var AdvanceSearchModel = /** @class */ (function () {
    function AdvanceSearchModel() {
        this.uniqueNames = [];
        this.inventory = new AdvanceSearchRequestInventory();
        this.inventory = new AdvanceSearchRequestInventory();
    }
    return AdvanceSearchModel;
}());

var AdvanceSearchRequestInventory = /** @class */ (function () {
    function AdvanceSearchRequestInventory() {
    }
    return AdvanceSearchRequestInventory;
}());



/***/ }),

/***/ "./src/app/sales/aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.html":
/*!**************************************************************************************!*\
  !*** ./src/app/sales/aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.html ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane sales-aside-tax-pane text-left\" [keyboardShortcut]=\"'esc'\"\n     (onShortcutPress)=\"saveTaxes()\">\n\n  <button id=\"close\" type=\"button\" class=\"btn btn-sm btn-primary\" (click)=\"saveTaxes()\">X</button>\n\n  <div class=\"aside-header\">\n    <h3 class=\"aside-title\">Tax applicable</h3>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-sm-12 mrB2 mrT1\">\n      <span>\n        {{ otherTaxesModal.itemLabel }}\n      </span>\n    </div>\n\n    <div class=\"col-xs-6\">\n\n      <div style=\"display: flex;flex-direction: column\" class=\"selectTaxDropdown\">\n        <label>Select Tax<span class=\"text-danger\">*</span></label>\n\n        <div class=\"mrB2\">\n          <sh-select\n            name=\"selectTax\" [placeholder]=\"'Select Tax'\"\n            [options]=\"taxesOptions\" [(ngModel)]=\"selectedTaxUniqueName\"\n            (selected)=\"applyTax($event)\" (onClear)=\"onClear()\"\n            [showClear]=\"true\"\n          ></sh-select>\n\n          <label style=\"margin-top: 3px;margin-left: 2px;\" *ngIf=\"otherTaxesModal?.appliedOtherTax?.name\">\n            {{ otherTaxesModal?.appliedOtherTax?.name | uppercase}}\n          </label>\n        </div>\n\n      </div>\n\n    </div>\n\n    <div class=\"col-xs-6\">\n\n      <div>\n        <label>Calculation Method<span class=\"text-danger\">*</span></label>\n      </div>\n\n      <div>\n        <sh-select [options]=\"calculationMethodOptions\" name=\"tcsCalculationMethod\"\n                   [placeholder]=\"'Select Method'\"\n                   [disabled]=\"isDisabledCalMethod\"\n                   [(ngModel)]=\"otherTaxesModal.tcsCalculationMethod\"></sh-select>\n      </div>\n\n    </div>\n\n  </div>\n\n  <div>\n    <button class=\"btn btn-success\" type=\"button\" [disabled]=\"!otherTaxesModal.tcsCalculationMethod\"\n            (click)=\"saveTaxes()\">\n      Apply\n    </button>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/sales/aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.scss":
/*!**************************************************************************************!*\
  !*** ./src/app/sales/aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.scss ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  position: fixed;\n  left: auto;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 480px;\n  z-index: 1200; }\n\n:host.in #close {\n  display: block;\n  position: fixed;\n  left: -41px;\n  top: 0;\n  z-index: 5;\n  border: 0;\n  border-radius: 0; }\n\n:host .container-fluid {\n  padding-left: 0;\n  padding-right: 0; }\n\n:host .aside-pane {\n  width: 480px; }\n\n.sales-aside-tax-pane label {\n  margin-bottom: 10px; }\n"

/***/ }),

/***/ "./src/app/sales/aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.ts":
/*!************************************************************************************!*\
  !*** ./src/app/sales/aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.ts ***!
  \************************************************************************************/
/*! exports provided: AsideMenuSalesOtherTaxes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AsideMenuSalesOtherTaxes", function() { return AsideMenuSalesOtherTaxes; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/api-models/Sales */ "./src/app/models/api-models/Sales.ts");



var AsideMenuSalesOtherTaxes = /** @class */ (function () {
    function AsideMenuSalesOtherTaxes() {
        this.closeModal = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.taxes = [];
        this.applyTaxes = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.isDisabledCalMethod = false;
        this.taxesOptions = [];
        this.calculationMethodOptions = [
            { label: 'On Taxable Value (Amt - Dis)', value: 'OnTaxableAmount' },
            { label: 'On Total Value (Taxable + Gst + Cess)', value: 'OnTotalAmount' },
        ];
    }
    AsideMenuSalesOtherTaxes.prototype.ngOnInit = function () {
        this.taxesOptions = this.taxes
            .filter(function (f) { return ['tcsrc', 'tcspay', 'tdsrc', 'tdspay'].includes(f.taxType); })
            .map(function (m) {
            return { label: m.name, value: m.uniqueName };
        });
    };
    AsideMenuSalesOtherTaxes.prototype.ngOnChanges = function (changes) {
        if ('otherTaxesModal' in changes && changes.otherTaxesModal.currentValue !== changes.otherTaxesModal.previousValue) {
            if (this.otherTaxesModal.appliedOtherTax) {
                this.selectedTaxUniqueName = this.otherTaxesModal.appliedOtherTax.uniqueName;
                this.applyTax({ label: this.otherTaxesModal.appliedOtherTax.name, value: this.otherTaxesModal.appliedOtherTax.uniqueName });
            }
        }
    };
    AsideMenuSalesOtherTaxes.prototype.applyTax = function (tax) {
        if (tax && tax.value) {
            this.otherTaxesModal.appliedOtherTax = { name: tax.label, uniqueName: tax.value };
            var taxType = this.taxes.find(function (f) { return f.uniqueName === tax.value; }).taxType;
            this.isDisabledCalMethod = ['tdsrc', 'tdspay'].includes(taxType);
            this.otherTaxesModal.tcsCalculationMethod = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["SalesOtherTaxesCalculationMethodEnum"].OnTaxableAmount;
        }
    };
    AsideMenuSalesOtherTaxes.prototype.onClear = function () {
        this.otherTaxesModal.appliedOtherTax = null;
        this.isDisabledCalMethod = false;
        this.otherTaxesModal.tcsCalculationMethod = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["SalesOtherTaxesCalculationMethodEnum"].OnTaxableAmount;
    };
    AsideMenuSalesOtherTaxes.prototype.saveTaxes = function () {
        this.applyTaxes.emit(this.otherTaxesModal);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], AsideMenuSalesOtherTaxes.prototype, "closeModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_2__["SalesOtherTaxesModal"])
    ], AsideMenuSalesOtherTaxes.prototype, "otherTaxesModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], AsideMenuSalesOtherTaxes.prototype, "taxes", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], AsideMenuSalesOtherTaxes.prototype, "applyTaxes", void 0);
    AsideMenuSalesOtherTaxes = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-aside-menu-sales-other-taxes',
            template: __webpack_require__(/*! ./aside-menu-sales-other-taxes.html */ "./src/app/sales/aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.html"),
            styles: [__webpack_require__(/*! ./aside-menu-sales-other-taxes.scss */ "./src/app/sales/aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], AsideMenuSalesOtherTaxes);
    return AsideMenuSalesOtherTaxes;
}());



/***/ }),

/***/ "./src/app/sales/create/sales.invoice.component.html":
/*!***********************************************************!*\
  !*** ./src/app/sales/create/sales.invoice.component.html ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"pdB1 upper-layer   clearfix\">\n  <div class=\"col-xs-12 clearfix\">\n    <div class=\"btn-group\" dropdown>\n      <button id=\"button1-basic\" dropdownToggle type=\"button\" class=\"btn spcl_dropdown dropdown-toggle\"\n              aria-controls=\"dropdown-basic\">\n        {{selectedPageLabel}}\n        <span class=\"caret\" *ngIf=\"!isUpdateMode\"></span>\n      </button>\n      <ul id=\"dropdown1-basic\" *dropdownMenu class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"button-basic\">\n        <ng-container *ngIf=\"!isUpdateMode\">\n          <li role=\"menuitem\" (click)=\"pageChanged(item.value, item.additional.label)\" *ngFor=\"let item of pageList\">\n            <a class=\"dropdown-item cp\">{{ item.additional?.label }}</a>\n          </li>\n        </ng-container>\n      </ul>\n    </div>\n    <!-- <label>Select Type</label> -->\n    <!-- <sales-sh-select [width]=\"'150px'\" [showLabelOnly]=\"true\" [showClear]=\"false\" [options]=\"pageList\" [placeholder]=\"'Select Invoice Type'\" (selected)=\"pageChanged()\" name=\"selectedPage\" [(ngModel)]=\"selectedPage\"></sales-sh-select> -->\n\n  </div>\n</div>\n\n<ng-container *ngIf=\"isUpdateDataInProcess\">\n\n  <div class=\"loaderClass\">\n    <div class=\"giddh-spinner vertical-center-spinner\"></div>\n  </div>\n\n</ng-container>\n\n<div [hidden]=\"isUpdateMode && isUpdateDataInProcess\" [ngClass]=\"{'animated': showAnimation, 'fadeIn': showAnimation}\">\n  <form #invoiceForm=\"ngForm\" (ngSubmit)=\"onSubmitInvoiceForm(invoiceForm)\" novalidate autocomplete=\"off\"\n        [ngClass]=\"{ ' customerInvoiceForm ' : !invFormData.voucherDetails.customerName , 'cusomerInvoiceFormPurchase': isPurchaseInvoice } \">\n    <div class=\"clearfix sales-invoice-content \">\n\n      <div class=\"upper-layer \" [ngClass]=\"{' firstTable' : !invFormData.voucherDetails.customerName }\">\n        <div class=\"clearfix\">\n          <div class=\"col-md-9 pd0\">\n            <div class=\"customer-name\" [hidden]=\"isPurchaseInvoice\">\n              <div class=\"col-sm-2\">\n                <label>Customer Name</label>\n              </div>\n              <div class=\"col-sm-5\">\n                <ng-container *ngIf=\"!isCashInvoice\">\n                  <sales-sh-select style=\"width:100%; float: left;\" name=\"voucherDetails.customerName\"\n                                   [options]=\"customerAcList$ | async\"\n                                   [(ngModel)]=\"invFormData.voucherDetails.tempCustomerName\"\n                                   [customFilter]=\"customMoveGroupFilter\"\n                                   (noOptionsFound)=\"noResultsForCustomer($event)\"\n                                   (selected)=\"onSelectCustomer($event)\" [placeholder]=\"'Select Customer'\"\n                                   [notFoundLink]=\"true\" [doNotReset]=\"true\" [forceClearReactive]=\"forceClear$ | async\"\n                                   [isFilterEnabled]=\"true\" (noResultsClicked)=\"toggleAccountAsidePane($event)\"\n                                   [multiple]=\"false\" [ItemHeight]=\"80\" [notFoundLinkText]=\"'Add Customer'\"\n                                   (keyup)=\"resetCustomerName($event)\" (onClear)=\"resetCustomerName(null)\"\n                                   [showClear]=\"!isUpdateMode\" [disabled]=\"isUpdateMode\">\n                    <ng-template #optionTemplate let-option=\"option\">\n                      <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                        <div class=\"item\">{{ option.label }}</div>\n                        <div class=\"item_unq\">{{ option.value }}</div>\n                      </a>\n                    </ng-template>\n                    <ng-template #notFoundLinkTemplate>\n                      <a href=\"javascript:void(0)\" class=\"list-item\" [keyboardShortcut]=\"'alt+c'\"\n                         (onShortcutPress)=\"toggleAccountAsidePane()\"\n                         style=\"width:100%; display: flex;justify-content: space-between;\">\n                        <div class=\"item\">Add Customer</div>\n                        <div class=\"item\">Alt+C</div>\n                      </a>\n                    </ng-template>\n                  </sales-sh-select>\n                </ng-container>\n\n                <ng-container *ngIf=\"isCashInvoice\">\n                  <input type=\"text\" #cashInvoiceInput name=\"voucherDetails.customerName\"\n                         class=\"form-control cashInvoiceInput\" [(ngModel)]=\"invFormData.voucherDetails.customerName\"\n                         [readOnly]=\"isUpdateMode\">\n                </ng-container>\n\n              </div>\n\n\n            </div>\n            <div class=\"vendore-name\" [hidden]=\"!isPurchaseInvoice\">\n              <div class=\"col-sm-2\">\n                <label>Vendor Name</label>\n              </div>\n              <div class=\"col-sm-5\">\n                <div class=\"flex-row-child\">\n                  <div class=\"form-group noMarg\">\n\n                    <!-- [useInBuiltFilterForIOptionTypeItems]=\"true\" -->\n                    <!--  -->\n                    <sales-sh-select style=\"width:100%;\" name=\"voucherDetails.customerName\"\n                                     [options]=\"customerAcList$ | async\"\n                                     [(ngModel)]=\"invFormData.voucherDetails.tempCustomerName\"\n                                     [customFilter]=\"customMoveGroupFilter\"\n                                     (noOptionsFound)=\"noResultsForCustomer($event)\"\n                                     (selected)=\"onSelectCustomer($event)\" [placeholder]=\"'Select Vendor'\"\n                                     [notFoundLink]=\"true\" [doNotReset]=\"true\"\n                                     [forceClearReactive]=\"forceClear$ | async\"\n                                     [isFilterEnabled]=\"true\" (noResultsClicked)=\"toggleAccountAsidePane($event)\"\n                                     [multiple]=\"false\" [ItemHeight]=\"67\" [notFoundLinkText]=\"'Add Vendor'\"\n                                     (keyup)=\"resetCustomerName($event)\" (onClear)=\"resetCustomerName(null)\"\n                                     [showClear]=\"!isUpdateMode\">\n                      <ng-template #optionTemplate let-option=\"option\">\n                        <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                          <div class=\"item\">{{ option.label }}</div>\n                          <div class=\"item_unq\">{{ option.value }}</div>\n                        </a>\n                      </ng-template>\n                    </sales-sh-select>\n                  </div>\n                </div>\n              </div>\n\n            </div>\n            <div class=\"col-sm-10 col-sm-offset-2\">\n              <ng-container>\n                <section class=\"form-inline  \">\n                  <div class=\" wrap-billing-address clearfix\">\n                    <ng-container *ngIf=\"isSalesInvoice || isPurchaseInvoice\">\n                      <img src=\"assets/images/new/search_customer.svg\" class=\"img-responsive tip_img \"\n                           *ngIf=\"!invFormData.voucherDetails.customerName\"/>\n                    </ng-container>\n                    <ng-container *ngIf=\"isCashInvoice\">\n                      <img src=\"assets/images/new/search_customer_Cash Invoice.svg\" class=\"img-responsive tip_img \"\n                           *ngIf=\"!invFormData.voucherDetails.customerName\"\n                           [ngClass]=\"{'cashinvoice_tipImg' : isCashInvoice}\"/>\n                    </ng-container>\n                    <div class=\"row\">\n                      <div class=\"col-xs-6\">\n                        <div class=\"form-group\">\n                          <label>Billing Address</label>\n                          <div class=\"billing-address clearfix\">\n                            <textarea name=\"billingDetails.address\" (keyup)=\"autoFillShippingDetails()\"\n                                      class=\"form-control\"\n                                      [(ngModel)]=\"invFormData.accountDetails.billingDetails.address[0]\" rows=\"3\"\n                                      autocomplete=\"off\" autofocus=\"off\" aria-autocomplete=\"none\"></textarea>\n                            <div class=\"\">\n                              <div class=\"col-sm-6 pd\">\n                                <!-- <label>Country</label> -->\n\n                                <label class=\"salesCountryLabel\">\n                                  {{ customerCountryName }}\n                                </label>\n\n                              </div>\n                              <div class=\"col-sm-6 pd stateField\">\n                                <!-- <label>State</label> -->\n                                <!-- remove disabled after api changes -->\n                                <sales-sh-select [disabled]=\"isUpdateMode\" [placeholder]=\"'State'\"\n                                                 class=\"select-bdr-bottom\" (selected)=\"autoFillShippingDetails()\"\n                                                 #statesBilling [showBottomBorderOnly]=\"true\"\n                                                 [options]=\"statesSource$ | async\" name=\"billingDetails.stateCode\"\n                                                 [(ngModel)]=\"invFormData.accountDetails.billingDetails.stateCode\"></sales-sh-select>\n                                <!-- <ng-select (selected)=\"autoFillShippingDetails()\" #statesBilling class=\"splSales\" name=\"billingDetails.stateCode\" [options]=\"statesSource$ | async\"\n[(ngModel)]=\"invFormData.accountDetails.billingDetails.stateCode\"></ng-select> -->\n                              </div>\n                              <div class=\"col-sm-12 pd\">\n                                <!-- <label>GSTIN</label> -->\n                                <!-- remove disabled after api changes -->\n                                <input [disabled]=\"isUpdateMode\" maxLength=\"15\" type=\"text\"\n                                       name=\"billingDetails.gstNumber\" class=\"form-control input-custom\"\n                                       [(ngModel)]=\"invFormData.accountDetails.billingDetails.gstNumber\"\n                                       (keyup)=\"getStateCode('billingDetails', statesBilling); autoFillShippingDetails()\"\n                                       placeholder=\"GSTIN\"/>\n                              </div>\n                            </div>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"col-xs-6\">\n                        <div class=\"form-group p0 width100\">\n                          <label>\n                            <input type=\"checkbox\" (change)=\"autoFillShippingDetails()\" name=\"autoFillShipping\"\n                                   [attr.checked]=\"true\"\n                                   [(ngModel)]=\"autoFillShipping\"> Shipping Address Same as Billing Address</label>\n                          <div class=\"billing-address\" [ngClass]=\"{'disabled': autoFillShipping}\">\n                            <textarea [readonly]=\"autoFillShipping\" name=\"shippingDetails.address\" class=\"form-control\"\n                                      [(ngModel)]=\"invFormData.accountDetails.shippingDetails.address[0]\" rows=\"3\"\n                                      autocomplete=\"off\"></textarea>\n                            <div class=\"clearfix\">\n                              <div class=\"form-group\">\n                                <div class=\"col-sm-6 pd\">\n                                  <div class=\"form-group\">\n\n                                    <label class=\"salesCountryLabel\">\n                                      {{ customerCountryName }}\n                                    </label>\n                                  </div>\n                                </div>\n                                <div class=\"col-sm-6 pd stateField\">\n                                  <!-- <label>State</label> -->\n                                  <!-- <ng-select [disabled]=\"autoFillShipping\" #statesShipping class=\"splSales\" name=\"shippingDetails.stateCode\" [options]=\"statesSource$ | async\" [(ngModel)]=\"invFormData.accountDetails.shippingDetails.stateCode\"></ng-select> -->\n                                  <!-- (selected)=\"autoFillShippingDetails()\" -->\n\n                                  <!-- use this after api changes [disabled]=\"autoFillShipping\"  -->\n                                  <sales-sh-select [disabled]=\"isUpdateMode\" [placeholder]=\"'State'\"\n                                                   class=\"select-bdr-bottom\" #statesShipping\n                                                   [showBottomBorderOnly]=\"true\" [options]=\"statesSource$ | async\"\n                                                   name=\"shippingDetails.stateCode\"\n                                                   [(ngModel)]=\"invFormData.accountDetails.shippingDetails.stateCode\"></sales-sh-select>\n                                </div>\n                                <div class=\"col-sm-12 pd\">\n                                  <!-- <label>GSTIN</label> -->\n                                  <!-- remove disabled after api changes and add [readonly]=\"autoFillShipping\" -->\n                                  <input [disabled]=\"isUpdateMode\" maxLength=\"15\" type=\"text\"\n                                         name=\"shippingDetails.gstNumber\" class=\"form-control input-custom\"\n                                         [(ngModel)]=\"invFormData.accountDetails.shippingDetails.gstNumber\"\n                                         (keyup)=\"getStateCode('shippingDetails', statesShipping)\"\n                                         placeholder=\"GSTIN\"/>\n                                </div>\n                              </div>\n                            </div>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n\n\n                  </div>\n\n                </section>\n              </ng-container>\n            </div>\n          </div>\n          <div class=\"col-md-3  balncDue\">\n            <div class=\" text-right\" *ngIf=\"invFormData.voucherDetails.customerName && !isCashInvoice\"\n                 [hidden]=\"isPurchaseInvoice\">\n              <p *ngIf=\"toggleFieldForSales\" class=\"fs20 b\">\n                <span class=\"balance-due\">Balance Due: </span>\n                <span class=\"sp-rupees\">Rs {{invFormData.voucherDetails.balanceDue | number:'1.2-2'}}</span>\n              </p>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"\">\n        <div class=\"col-md-9 pd0\">\n          <div class=\"attention-to clearfix\">\n            <div class=\"col-sm-2\">\n              <label>Attention to</label>\n            </div>\n            <div class=\"col-sm-5\">\n              <div class=\"form-group\">\n                <!--col-xs-3 -->\n                <input type=\"text\" name=\"accountDetails.attention\" placeholder=\"Attention to\"\n                       class=\"form-control attentionTo\" [(ngModel)]=\"invFormData.accountDetails.attentionTo\"/>\n              </div>\n            </div>\n\n\n          </div>\n          <div class=\"email-id clearfix\">\n            <div class=\"col-sm-2\">\n              <label>Email Id</label>\n            </div>\n            <div class=\"col-sm-5\">\n              <div class=\"form-group\">\n                <!--col-xs-3 -->\n                <input type=\"email\" placeholder=\"someone@example.com\" name=\"accountDetails.email\"\n                       class=\"form-control attentionTo\" [(ngModel)]=\"invFormData.accountDetails.email\"/>\n              </div>\n            </div>\n\n\n          </div>\n          <div class=\"mobile-number clearfix\">\n            <div class=\"col-sm-2\">\n              <label>Mobile Number</label>\n            </div>\n            <div class=\"col-sm-5\">\n              <div class=\"form-group\">\n                <input digitsOnlyDirective placeholder=\"9198XXXXXXXX\" type=\"text\" name=\"accountDetails.mobileNumber\"\n                       class=\"form-control attentionTo\" [(ngModel)]=\"invFormData.accountDetails.mobileNumber\"/>\n              </div>\n            </div>\n\n\n          </div>\n          <div class=\"inovice-purchaseInvoice\" [ngClass]=\"{'forPurchase': isPurchaseInvoice}\">\n            <div class=\"col-sm-2\">\n              <label> {{ !isPurchaseInvoice ? 'Invoice No.' : 'Purchase Invoice No.' }}</label>\n            </div>\n            <div class=\"col-sm-5\">\n              <input type=\"text\" name=\"accountDetails.invoiceNum\" class=\"form-control invoiceDate attentionTo\"\n                     [ngClass]=\"{'dateinvoice': !isPurchaseInvoice }\"\n                     [disabled]=\"isUpdateMode  || !useCustomInvoiceNumber\"\n                     [(ngModel)]=\"invFormData.voucherDetails.voucherNumber\"/>\n            </div>\n            <div class=\"col-sm-5 invoiceDateDueDate\">\n              <div class=\"form-inline \">\n                <div class=\"form-group m-r-15\">\n                  <!--col-xs-2-->\n                  <label>{{isPurchaseInvoice ? 'Bill Date' : 'Invoice Date' }} </label>\n\n                  <input type=\"text\" [placeholder]=\"giddhDateFormat\" #voucherDate=\"ngModel\" name=\"voucherDate\"\n                         class=\"form-control dateinvoice\" bsDatepicker\n                         [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\"\n                         [(ngModel)]=\"invFormData.voucherDetails.voucherDate\" [disabled]=\"isUpdateMode\"\n                         [class.invalid-inp]=\"voucherDate.errors && (voucherDate.dirty || voucherDate.touched)\"/>\n                  <p class=\"text-danger\" *ngIf=\"voucherDate.errors && (voucherDate.dirty || voucherDate.touched)\">\n                    Invalid Date\n                  </p>\n\n\n                </div>\n                <div class=\"form-group  m-l-5\" *ngIf=\"isSalesInvoice || isPurchaseInvoice\">\n                  <label> {{isPurchaseInvoice ? ' Due Date' : 'Due Date'}}</label>\n\n                  <input type=\"text\" [placeholder]=\"giddhDateFormat\" #dueDate=\"ngModel\" name=\"dueDate\"\n                         class=\"form-control dateinvoice\" bsDatepicker\n                         [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\"\n                         [(ngModel)]=\"invFormData.voucherDetails.dueDate\"\n                         [class.invalid-inp]=\"dueDate.errors && (dueDate.dirty || dueDate.touched)\"\n                  />\n                  <p class=\"text-danger\" *ngIf=\"dueDate.errors && (dueDate.dirty || dueDate.touched)\">Invalid Date</p>\n\n                </div>\n              </div>\n            </div>\n          </div>\n          <div class=\"\">\n            <ng-container>\n\n              <section class=\"staticInvoiceTable salseInvoicetable clearfix mrB2 whiteBg container-fluid ng-tns-c8-0 \">\n                <div class=\"table_width-small \">\n                  <table class=\"table  table-custom-invoice  basic\">\n                    <thead>\n                    <tr>\n\n                      <th *ngFor=\"let item of theadArrReadOnly;\" attr.data-field=\"{{item.label}}\"\n                          [hidden]=\"!item.display\">\n                        {{item.label}}\n\n                      </th>\n                    </tr>\n                    </thead>\n                    <tbody\n                      *ngFor=\"let entry of invFormData.entries; let entryIdx = index; let first = first; let last = last\">\n                    <ng-container *ngFor=\"let transaction of entry.transactions;\">\n                      <tr (click)=\"setActiveIndx($event, entryIdx, true)\" *ngIf=\"activeIndx !== entryIdx\">\n                        <td>{{ entryIdx + 1 }}</td>\n                        <td>\n                          <div class=\"productName\">\n                            <label *ngIf=\"!transaction.accountName\" class=\"selectAccountLabel\">Click to Select\n                              Account</label> {{transaction.accountName}}\n                            <span *ngIf=\"transaction.stockDetails?.uniqueName\">({{transaction.stockDetails?.name}}\n                              )</span>\n\n                          </div>\n                          <div class=\"skuNumber\">\n                            <label>SKU:</label>Number\n                          </div>\n                          <div class=\"discription\">\n                            {{transaction.description}}\n\n                          </div>\n                          <p class=\"small text-muted\" *ngIf=\"transaction.sku_and_customfields\">{{transaction.sku_and_customfields}}</p>\n                          <div class=\"dateHsnCode\">\n                            <div class=\"row\">\n                              <div class=\"col-xs-6\" *ngIf=\"entry.entryDate\">\n                                <div class=\"entryDate\">\n                                  <label>Entry Date: </label> {{entry.entryDate | date: 'dd-MM-yyyy'}}\n                                  <span class=\"edit-icon\" *ngIf=\"!isUpdateMode\">\n                          <img src=\"assets/images/edit-pencilicon.svg\">\n                         </span>\n\n\n                                </div>\n                              </div>\n                              <div class=\"col-xs-6\" *ngIf=\"transaction.hsnNumber || transaction.sacNumber\">\n                                <div class=\"hsnCode text-right\">\n                                  <label> HSN/SAC:</label>\n                                  <span>\n                            {{transaction.hsnOrSac === 'hsn' ? transaction.hsnNumber : transaction.sacNumber}}\n                                    <!--                            <span class=\"edit-icon\">-->\n                                    <!--                              <img src=\"assets/images/edit-pencilicon.svg\">-->\n                                    <!--                            </span>-->\n                          </span>\n\n                                </div>\n                              </div>\n                            </div>\n                          </div>\n\n                        </td>\n                        <td class=\"text-right\">\n                          <!-- <input type=\"number\" (keyup)=\"txnChangeOccurred()\"\n        (ngModelChange)=\"transaction.setAmount(entry)\" placeholder=\"Quantity\"\n        name=\"transaction.quantity_{{entryIdx}}\" class=\"form-control text-right\"\n        [(ngModel)]=\"transaction.quantity\"/>\n\n        <select class=\"form-control\" name=\"transaction.stockUnit_{{entryIdx}}\"\n        [(ngModel)]=\"transaction.stockUnit\"\n        (ngModelChange)=\"onChangeUnit(transaction, $event);transaction.setAmount(entry)\">\n        <option *ngFor=\"let stock of transaction.stockList\" [ngValue]=\"stock.id\">{{stock.text}}\n        </option>\n        </select> -->\n                          {{transaction.quantity}} {{transaction.stockUnit}}\n                        </td>\n                        <td class=\"text-right\">\n                          <!-- <input type=\"number\" (ngModelChange)=\"transaction.setAmount(entry)\"\n        (keyup)=\"txnChangeOccurred()\" placeholder=\"Rate\" name=\"transaction.rate_{{entryIdx}}\"\n        class=\"form-control text-right\" [(ngModel)]=\"transaction.rate\"/> -->\n                          {{transaction.rate | number:'1.2-2'}}\n                        </td>\n                        <td class=\"text-right\">\n                          {{transaction.amount | number:'1.2-2'}}\n                        </td>\n                        <td>\n\n                          <div class=\" text-right\">\n                            {{ entry.discountSum | number:'1.2-2'}}\n                          </div>\n\n\n                        </td>\n                        <td class=\"text-right\">{{entry.taxSum}}%</td>\n                        <td class=\"text-right\">\n                          <div style=\"display: flex;flex-direction: column;\">\n                            <span>{{transaction.total | number:'1.2-2'}}</span>\n                            <span *ngIf=\"entry.isOtherTaxApplicable\">\n                      {{ entry.otherTaxModal?.appliedOtherTax?.name }} : {{ entry.otherTaxSum }}\n                    </span>\n                          </div>\n                        </td>\n                        <td class=\"text-center\" style=\"width:3%;\">\n                                        <span class=\"cp\" (click)=\"removeTransaction(entryIdx)\"\n                                              *ngIf=\"!isUpdateMode || (isUpdateMode && entry.isNewEntryInUpdateMode)\">\n                        <i class=\"icon-trash\" aria-hidden=\"true\"></i>\n                  </span>\n                        </td>\n                      </tr>\n                      <tr *ngIf=\"activeIndx === entryIdx\">\n                        <td>{{ entryIdx + 1 }}</td>\n                        <td>\n                          <div class=\"productName\">\n                            <div class=\"ng-select-wrap\">\n                              <sh-select [options]=\"salesAccounts$ | async\" [(ngModel)]=\"transaction.fakeAccForSelect2\"\n                                         name=\"transaction.fakeAccForSelect2_{{entryIdx}}\"\n                                         (selected)=\"onSelectSalesAccount($event,transaction,entryIdx, entry)\"\n                                         [placeholder]=\"'Select A/cc'\" [notFoundLink]=\"true\"\n                                         [forceClearReactive]=\"forceClear$ | async\"\n                                         (onClear)=\"onClearSalesAccount(transaction)\"\n                                         (noResultsClicked)=\"onNoResultsClicked(entryIdx)\" [multiple]=\"false\"\n                                         [ItemHeight]=\"67\"\n                                         [useInBuiltFilterForFlattenAc]=\"true\">\n\n                                <ng-template #optionTemplate let-option=\"option\">\n                                  <ng-container *ngIf=\"!option.additional?.stock\">\n                                    <a href=\"javascript:void(0)\" class=\"list-item\"\n                                       style=\"border-bottom: 1px solid #ccc;\">\n                                      <div class=\"item\">{{ option.label }}</div>\n                                      <div class=\"item_unq\">{{ option.additional?.uniqueName }}</div>\n                                    </a>\n                                  </ng-container>\n                                  <ng-container *ngIf=\"option.additional?.stock\">\n                                    <a href=\"javascript:void(0)\" class=\"list-item\"\n                                       style=\"border-bottom: 1px solid #ccc;\">\n                                      <div class=\"item\">{{ option.label }}</div>\n                                      <div class=\"item_unq\">{{ option.additional?.uniqueName }}</div>\n                                      <div class=\"item_stock\">Stock: {{ option.additional?.stock.uniqueName }}</div>\n                                    </a>\n                                  </ng-container>\n                                </ng-template>\n                              </sh-select>\n                            </div>\n\n                          </div>\n                          <div class=\"\" *ngIf=\"transaction.fakeAccForSelect2\">\n                            <div class=\"skuNumber\">\n                              <label>SKU:</label>Number\n                            </div>\n                            <div class=\"discription\">\n                      <textarea type=\"text\" placeholder=\"Add Description\" name=\"transaction.description_{{entryIdx}}\"\n                                class=\"form-control\" [(ngModel)]=\"transaction.description\"></textarea>\n                              <p class=\"small text-muted\" *ngIf=\"transaction.sku_and_customfields\">{{transaction.sku_and_customfields}}</p>\n                            </div>\n                            <div class=\"dateHsnCode\">\n                              <div class=\"row\">\n                                <div class=\"col-xs-6\">\n                                  <div class=\"entryDate\">\n                                    <label>Entry Date: </label>\n                                    <span *ngIf=\"!isUpdateMode\">\n                                <input type=\"text\" [placeholder]=\"giddhDateFormat\" bsDatepicker\n                                       name=\"transaction.date_{{entryIdx}}\"\n                                       class=\"form-control text-left\" [(ngModel)]=\"entry.entryDate\"\n                                       [disabled]=\"isUpdateMode\"\n                                       [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\" #dp=\"bsDatepicker\"\n                                />\n                            <span class=\"edit-icon\" (click)=\"dp.toggle()\" [attr.aria-expanded]=\"dp.isOpen\">\n                              <img src=\"assets/images/edit-pencilicon.svg\">\n                            </span>\n                                                            </span>\n\n                                    <span *ngIf=\"isUpdateMode\">\n                            {{ entry.entryDate | date: 'dd-MM-yyyy' }}\n                          </span>\n\n                                  </div>\n                                </div>\n                                <div class=\"col-xs-6\">\n                                  <div class=\"wrap-hsnBox\">\n                                    <div class=\"hsnCode text-right\"\n                                         (click)=\"$event.stopPropagation();hsnDropdownShow=!hsnDropdownShow\">\n                                      <label>HSN/SAC:</label>\n                                      <span>\n                              <!-- <input type=\"text\" [hidden]=\"transaction.hsnOrSac !== 'hsn'\" maxLength=\"10\" placeholder=\"HSN Number\"\n                              name=\"transaction.hsnNumber_{{entryIdx}}\" class=\"form-control text-right\"\n                              [(ngModel)]=\"transaction.hsnNumber\"/> -->\n                                        {{transaction.hsnOrSac === 'hsn' ? transaction.hsnNumber : transaction.sacNumber }}\n                                        <span *ngIf=\"!transaction.hsnNumber && !transaction.sacNumber\"\n                                              class=\"updateText cp\">Update\n                                </span>\n                                                                <span class=\"edit-icon\">\n                                 <img src=\"assets/images/edit-pencilicon.svg\">\n                                </span>\n                                                                </span>\n\n                                    </div>\n\n\n                                    <div class=\"hsnCodeDropdown\" *ngIf=\"hsnDropdownShow\">\n                                      <label>HSN/SAC:</label>\n                                      <input type=\"text\" maxLength=\"10\" placeholder=\"HSN/SAC Number\"\n                                             name=\"transaction.hsnNumber_{{entryIdx}}\" class=\"\"\n                                             [(ngModel)]=\"transaction.hsnNumber\"\n                                             *ngIf=\"transaction.hsnOrSac === 'hsn'\"/>\n\n                                      <input type=\"text\" maxLength=\"10\" placeholder=\"SAC Number\"\n                                             name=\"transaction.sacNumber_{{entryIdx}}\" class=\"\"\n                                             [(ngModel)]=\"transaction.sacNumber\"\n                                             *ngIf=\"transaction.hsnOrSac === 'sac'\"/>\n                                      <!--                              <a><i class=\"fa fa-search\"></i> </a>-->\n                                      <div class=\"btn-group\">\n                                        <button class=\"btn btn-sm btn-success\" type=\"button\"\n                                                (click)=\"hsnDropdownShow=!hsnDropdownShow\">Save\n                                        </button>\n                                        <button class=\"btn btn-sm btn-primary\" type=\"button\"\n                                                (click)=\"hsnDropdownShow=!hsnDropdownShow\">Cancel\n                                        </button>\n                                      </div>\n\n                                    </div>\n                                  </div>\n                                </div>\n                              </div>\n                            </div>\n                          </div>\n                        </td>\n                        <td class=\"text-right\">\n                          <input type=\"number\" [disabled]=\"!transaction.isStockTxn\" (keyup)=\"txnChangeOccurred()\"\n                                 (ngModelChange)=\"transaction.setAmount(entry)\" placeholder=\"Quantity\"\n                                 name=\"transaction.quantity_{{entryIdx}}\" class=\"form-control text-right\"\n                                 [(ngModel)]=\"transaction.quantity\"\n                          />\n\n                          <select class=\"form-control\" [disabled]=\"!transaction.isStockTxn\"\n                                  name=\"transaction.stockUnit_{{entryIdx}}\" [(ngModel)]=\"transaction.stockUnit\"\n                                  (ngModelChange)=\"onChangeUnit(transaction, $event);transaction.setAmount(entry)\">\n                            <option *ngFor=\"let stock of transaction.stockList\" [ngValue]=\"stock.id\">{{stock.text}}\n                            </option>\n                          </select>\n                        </td>\n                        <td class=\"text-right\">\n                          <input type=\"number\" [disabled]=\"!transaction.isStockTxn\"\n                                 (ngModelChange)=\"transaction.setAmount(entry)\" (keyup)=\"txnChangeOccurred()\"\n                                 placeholder=\"Rate\"\n                                 name=\"transaction.rate_{{entryIdx}}\" class=\"form-control transaction-rate text-right\"\n                                 [(ngModel)]=\"transaction.rate\"\n                          />\n\n                        </td>\n                        <td class=\"text-right\">\n                          <input type=\"text\" [disabled]=\"transaction.isStockTxn\"\n                                 (ngModelChange)=\"transaction.setAmount(entry)\"\n                                 (keyup)=\"txnChangeOccurred()\" placeholder=\"Amount\"\n                                 name=\"transaction.amount_{{entryIdx}}\"\n                                 class=\"form-control text-right\" [(ngModel)]=\"transaction.amount\"\n                                 decimalDigitsDirective [DecimalPlaces]=\"2\"/>\n                        </td>\n                        <td>\n\n                          <div class=\" text-right\">\n                            <discount-list #discountComponent [isMenuOpen]=\"false\"\n                                           [discountAccountsDetails]=\"entry.discounts\"\n                                           (discountTotalUpdated)=\"entry.discountSum = $event; selectedDiscountEvent(transaction, entry)\"\n                                           [totalAmount]=\"transaction.amount\"></discount-list>\n                          </div>\n\n\n                        </td>\n                        <td class=\"text-right\">\n                          <sales-tax-list class=\"salesTax\" [showTaxPopup]=\"false\"\n                                          [applicableTaxes]=\"transaction.applicableTaxes\"\n                                          [exceptTaxTypes]=\"exceptTaxTypes\"\n                                          [allowedSelectionOfAType]=\"[{ type: ['GST', 'commongst', 'InputGST'], count:1 } ]\"\n                                          (selectedTaxEvent)=\"selectedTaxEvent($event)\"\n                                          (closeOtherPopupEvent)=\"closeDiscountPopup()\"\n                                          (taxAmountSumEvent)=\"taxAmountEvent($event)\">\n                          </sales-tax-list>\n                        </td>\n                        <td class=\"text-right\">\n                          <input type=\"text\" name=\"transaction.total_{{entryIdx}}\" class=\"form-control text-right\"\n                                 [(ngModel)]=\"transaction.total\" readonly decimalDigitsDirective [DecimalPlaces]=\"2\"/>\n\n                          <div class=\"wrap-otherTax\">\n                            <input type=\"checkbox\" class=\"other-taxes-checkobx\" [(ngModel)]=\"entry.isOtherTaxApplicable\"\n                                   *ngIf=\"!entry.isOtherTaxApplicable\"\n                                   name=\"entry.isOtherTaxApplicable_{{entryIdx}}\"\n                                   id=\"entry.isOtherTaxApplicable_{{entryIdx}}\"\n                                   (ngModelChange)=\"toggleOtherTaxesAsidePane(entry.isOtherTaxApplicable, entryIdx)\">\n                            <label for=\"entry.isOtherTaxApplicable_{{entryIdx}}\" *ngIf=\"!entry.isOtherTaxApplicable\"\n                                   class=\"otherTaxLable\"\n                                   style=\"font-size:13px;\">Other Tax?</label>\n                          </div>\n                          <div *ngIf=\"entry.isOtherTaxApplicable\" class=\"mrT1\">\n\n                            <span>\n                                <span>\n                                    <a href=\"javascript: void 0\"\n                                       (click)=\"toggleOtherTaxesAsidePane(true, entryIdx, false)\">\n                                      <img src=\"assets/images/edit-pencilicon.svg\">\n                                    </a>\n                                  </span>\n                      <input class=\"text-right otherTaxsinput\" disabled=\"disabled\"\n                             [(ngModel)]=\"entry.otherTaxSum\"\n                             name=\"entry.otherTaxesSum\"/>\n                              <p style=\"margin-top: 5px; font-size: 12px; text-transform: capitalize;\">\n                                {{ entry.otherTaxModal?.appliedOtherTax?.name}}</p>\n                    </span>\n\n                          </div>\n\n                          <!--                  <ng-container-->\n                          <!--                    *ngTemplateOutlet=\"otherTaxSidePane;context: {$implicit: selectedEntry }\"></ng-container>-->\n                        </td>\n                        <td class=\"action-panel-td text-center\" style=\"width:3%;\">\n                  <span class=\"cp\" (click)=\"removeTransaction(entryIdx)\"\n                        *ngIf=\"!isUpdateMode || (isUpdateMode && entry.isNewEntryInUpdateMode)\">\n                  <i class=\"icon-trash\" aria-hidden=\"true\"></i>\n                </span>\n                        </td>\n                      </tr>\n\n                    </ng-container>\n\n                    </tbody>\n\n                    <div class=\"p-4 aquaColor add-line-bulk-item\" style=\"width: max-content;\">\n                      <a class=\"\" href=\"javascript:void 0\" (click)=\"addBlankRow(null)\">+ Add New Line</a>\n                    </div>\n\n                    <tfoot>\n\n                    <tr>\n                      <td colspan=\"4\">\n                        <div class=\"\">\n                          <div class=\"collapse-pane clearfix\">\n                            <div class=\"collapse-pane-heading\" (click)=\"isOthrDtlCollapsed = !isOthrDtlCollapsed\">\n                              <div class=\"ico-box-wrap\">\n                                <div class=\"ico-box\">\n                                  <span [ngClass]=\"isOthrDtlCollapsed ? 'icon-add' : 'icon-minus'\"\n                                        aria-hidden=\"true\"></span>\n                                </div>\n                              </div>\n                              <div class=\"ico-head\">Other Details</div>\n                            </div>\n                            <div [collapse]=\"isOthrDtlCollapsed\" class=\"clearfix max-600 pdL3 mr0\">\n                              <div class=\"row\">\n                                <div class=\"form-group col-xs-4\">\n                                  <!-- <label>Ship Date</label> -->\n                                  <input type=\"text\" #shippingDate=\"ngModel\" [placeholder]=\"giddhDateFormat\"\n                                         bsDatepicker\n                                         name=\"shippingDate\"\n                                         [(ngModel)]=\"invFormData.templateDetails.other.shippingDate\"\n                                         class=\"form-control\" [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\"\n                                         placeholder=\"Ship Date\"\n                                         [class.invalid-inp]=\"shippingDate.errors && (shippingDate.dirty || shippingDate.touched)\"/>\n                                  <p class=\"text-danger\"\n                                     *ngIf=\"shippingDate.errors && (shippingDate.dirty || shippingDate.touched)\">Invalid\n                                    Date\n                                  </p>\n                                  <!--[placeholder]=\"giddhDateFormat\"-->\n                                </div>\n                                <div class=\"form-group col-xs-4\">\n                                  <!-- <label>Ship Via</label> -->\n                                  <input type=\"text\" name=\"shippedVia\"\n                                         [(ngModel)]=\"invFormData.templateDetails.other.shippedVia\" class=\"form-control\"\n                                         placeholder=\"Ship Via\"/>\n                                </div>\n                                <div class=\"form-group col-xs-4\">\n                                  <!-- <label>Tracking No.</label> -->\n                                  <input type=\"text\" name=\"trackingNumber\"\n                                         [(ngModel)]=\"invFormData.templateDetails.other.trackingNumber\"\n                                         class=\"form-control\"\n                                         placeholder=\"Tracking No.\"/>\n                                </div>\n                              </div>\n                              <div class=\"row\">\n                                <div class=\"form-group col-xs-4\">\n                                  <!-- <label>Field 1</label> -->\n                                  <input type=\"text\" name=\"customField1\"\n                                         [(ngModel)]=\"invFormData.templateDetails.other.customField1\"\n                                         class=\"form-control\"\n                                         placeholder=\"Field 1\"/>\n                                </div>\n                                <div class=\"form-group col-xs-4\">\n                                  <!-- <label>Field 2</label> -->\n                                  <input type=\"text\" name=\"customField2\"\n                                         [(ngModel)]=\"invFormData.templateDetails.other.customField2\"\n                                         class=\"form-control\"\n                                         placeholder=\"Field 2\"/>\n                                </div>\n                                <div class=\"form-group col-xs-4\">\n                                  <!-- <label>Field 3</label> -->\n                                  <input type=\"text\" name=\"customField3\"\n                                         [(ngModel)]=\"invFormData.templateDetails.other.customField3\"\n                                         class=\"form-control\"\n                                         placeholder=\"Field 3\"/>\n                                </div>\n                              </div>\n                            </div>\n                          </div>\n                        </div>\n                        <div class=\"pdT1 pl0 max-600\" *ngIf=\"!isPurchaseInvoice\">\n                          <label class=\"mrB1\">Message</label>\n                          <textarea style=\"height:120px !important\" class=\"form-control\" name=\"message2\"\n                                    [(ngModel)]=\"invFormData.templateDetails.other.message2\"></textarea>\n                        </div>\n                        <!-- commented due to presently attachfile key is not available in request\n        -->\n                        <div class=\"pdT1 pl0 max-600 pos-rel\" *ngIf=\"isPurchaseInvoice\">\n                          <label class=\"mrB1\"><i class=\"glyphicon glyphicon-paperclip\"></i> Attachment</label>\n                          <label class=\"custom-file-label form-control cp pos-rel\" for=\"invoiceFile\"> <em\n                            *ngIf=\"!selectedFileName\">Drag/Drop\n                            file or click here</em> <em *ngIf=\"selectedFileName\"\n                                                        class=\"text-success\">{{selectedFileName}}</em>\n                            <span class=\"text-success\"><i class=\"fa fa-check\" *ngIf=\"selectedFileName\"></i></span>\n                            <input type=\"file\" name=\"invoiceFile\" id=\"invoiceFile\" [options]=\"fileUploadOptions\"\n                                   ngFileSelect\n                                   [uploadInput]=\"uploadInput\" (uploadOutput)=\"onUploadOutput($event)\"\n                                   (change)=\"onFileChange($event.target.files)\" droppable=\"true\">\n                          </label>\n                        </div>\n                      </td>\n                      <td colspan=\"4\">\n                        <section class=\"tableSec form-group\">\n                          <div class=\"tableRow\">\n                            <div class=\"tableCell\">Total Amount</div>\n                            <div\n                              class=\"tableCell figureCell\">{{invFormData.voucherDetails.subTotal | number:'1.2-2'}}</div>\n                          </div>\n                          <div class=\"tableRow\">\n                            <div class=\"tableCell\">Discount</div>\n                            <div class=\"tableCell figureCell\">\n                              -{{invFormData.voucherDetails.totalDiscount | number:'1.2-2'}}</div>\n                          </div>\n                          <div class=\"tableRow\">\n                            <div class=\"tableCell\">Taxable Value</div>\n                            <div\n                              class=\"tableCell figureCell\">{{invFormData.voucherDetails.totalTaxableValue | number:'1.2-2'}}\n                            </div>\n                          </div>\n\n                          <div class=\"tableRow\">\n                            <div class=\"tableCell\">Tax</div>\n                            <div\n                              class=\"tableCell figureCell\">{{invFormData.voucherDetails.gstTaxesTotal | number:'1.2-2'}}</div>\n                          </div>\n\n                          <div class=\"tableRow\">\n                            <div class=\"tableCell\">CESS</div>\n                            <div class=\"tableCell figureCell\">{{invFormData.voucherDetails.cessTotal | number:'1.2-2'}}\n                            </div>\n                          </div>\n\n                          <div class=\"tableRow\">\n                            <div class=\"tableCell\">\n                              <strong>Total</strong>\n                            </div>\n                            <div class=\"tableCell figureCell\">\n                              <strong>{{invFormData.voucherDetails.grandTotal | number:'1.2-2'}}</strong>\n                            </div>\n                          </div>\n\n                          <div class=\"tableRow\" *ngIf=\"invFormData.voucherDetails.tcsTotal > 0\">\n                            <div class=\"tableCell\">TCS</div>\n                            <div\n                              class=\"tableCell figureCell\">{{invFormData.voucherDetails.tcsTotal | number:'1.2-2'}}</div>\n                          </div>\n\n                          <div class=\"tableRow\" *ngIf=\"invFormData.voucherDetails.tdsTotal > 0\">\n                            <div class=\"tableCell\">TDS</div>\n                            <div\n                              class=\"tableCell figureCell\">{{invFormData.voucherDetails.tdsTotal | number:'1.2-2'}}</div>\n                          </div>\n\n\n                          <div class=\"tableRow\" *ngIf=\"isSalesInvoice || isCashInvoice\">\n                            <!-- (clickOutside)=\"dropdownisOpen=false;\" [attachOutsideOnClick]=\"true\" -->\n                            <div class=\"tableCell depositeSection\">\n                              <!--\n        <div class=\"btn-group\" dropdown #depositDropdown=\"bs-dropdown\" [autoClose]=\"false\">\n        -->\n                              <div class=\"btn-group\">\n                                <!-- <button id=\"depositBoxTrigger\" type=\"button\" class=\"btn btn-default \"\n            aria-controls=\"deposit-dropdown\">\n        {{ isPurchaseInvoice ? 'Payment' : 'Deposit' }}\n        </button> -->\n                                <div (click)=\"clickedInside($event)\" id=\"deposit-dropdown\" class=\" form-group pd1\">\n                                  <p>Deposit</p>\n                                  <ul>\n\n\n                                    <li role=\"menuitem\">\n                                      <div class=\"\">\n                                    <li role=\"menuitem\" class=\"mrT1 \">\n                                      <div class=\"clearfix paymentMode\">\n\n                                        <sh-select class=\"pull-right \" name=\"depositAccountUniqueName\"\n                                                   [options]=\"bankAccounts$ | async\"\n                                                   [(ngModel)]=\"depositAccountUniqueName\"\n                                                   (selected)=\"onSelectPaymentMode($event)\"\n                                                   [placeholder]=\"'Select Account'\"\n                                                   [showClear]=\"false\"\n                                                   [notFoundLink]=\"false\" [forceClearReactive]=\"forceClear$ | async\"\n                                                   [multiple]=\"false\" [ItemHeight]=\"33\"\n                                                   [useInBuiltFilterForIOptionTypeItems]=\"true\">\n                                          <ng-template #optionTemplate1 let-option=\"option\">\n                                            <a href=\"javascript:void(0)\" class=\"list-item\"\n                                               style=\"border-bottom: 1px solid #ccc;\">\n                                              <div class=\"item\">{{ option.label }}</div>\n                                              <div class=\"item_unq\">{{ option.value }}</div>\n                                            </a>\n                                          </ng-template>\n                                        </sh-select>\n\n\n                                        <label class=\"pull-right\">Payment Mode</label>\n                                      </div>\n                                    </li>\n                                    <li class=\"clearfix mrT1\">\n                                      <input *ngIf=\"isSalesInvoice\" type=\"number\" (blur)=\"txnChangeOccurred()\"\n                                             placeholder=\"Amount\" name=\"depositAmount\"\n                                             class=\"form-control amountField pull-right max100\" [(ngModel)]=\"depositAmount\"\n                                             [readonly]='isCashInvoice' [ngClass]='{\"amountFiledCash\": isCashInvoice}'\n                                      />\n                                      <span *ngIf=\"isCashInvoice\" class=\"amountField pull-right max100\"\n                                            [ngClass]='{\"amountFiledCash\": isCashInvoice}'>{{invFormData.voucherDetails.balanceDue | number:'1.2-2'}}</span>\n\n                                      <label class=\"pull-right\">Amount</label>\n                                    </li>\n                                    <li *ngIf=\"toggleFieldForSales && !isCashInvoice\" class=\"clearfix mrT1\">\n                                      <strong\n                                        class=\"pull-right balanceDueText\">{{invFormData.voucherDetails.balanceDue | number:'1.2-2'}}</strong>\n                                      <strong class=\"pull-right\">Balance Due</strong>\n                                    </li>\n                                </div>\n\n\n                                </ul>\n                                <div class=\"tableRow\" *ngIf=\"toggleFieldForSales\">\n                                  <div class=\"tableCell\">\n\n                                  </div>\n                                  <div class=\"tableCell figureCell\">\n\n                                  </div>\n                                </div>\n                              </div>\n                            </div>\n\n                          </div>\n                </div>\n                <div class=\"tableRow\" *ngIf=\"isPurchaseInvoice\">\n                  <div class=\"tableCell\">\n                    <strong>Balance Due </strong>\n                  </div>\n                  <div class=\"tableCell figureCell\">\n                    <strong>{{invFormData.voucherDetails.balanceDue | number:'1.2-2'}}</strong>\n                  </div>\n                </div>\n\n\n              </section>\n              </td>\n              <td></td>\n              </tr>\n              </tfoot>\n\n              </table>\n          </div>\n          <!-- region dummy data -->\n          <ng-template #template>\n            <div class=\"\">\n              <div class=\"modal-header\">\n                <h4 class=\"modal-title pull-left\">Add bulk items</h4>\n                <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"modalRef.hide()\">\n                  <span aria-hidden=\"true\">&times;</span>\n                </button>\n              </div>\n              <div class=\"modal-body\">\n                <div class=\"row\">\n                  <div class=\"col-md-6\">\n                    <div class=\"leftContent\">\n                      <div class=\"searchBox\">\n                        <input type=\"text\" placeholder=\"Search stock\">\n                      </div>\n                      <div class=\"productList\">\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (100 POLYSTER NON TEXTURED LINING FABRIC)</h5>\n                          <p>\n                            <span class=\"stockSku\"><label>SKU: </label>Number</span>\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (Dummy text Lorem ipsum)</h5>\n                          <p>\n\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (100 POLYSTER NON TEXTURED LINING FABRIC)</h5>\n                          <p>\n                            <span class=\"stockSku\"><label>SKU: </label>Number</span>\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (100 POLYSTER NON LINING FABRIC)</h5>\n                          <p>\n                            <span class=\"stockSku\"><label>SKU: </label>Number</span>\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (100 POLYSTER NON TEXTURED LINING FABRIC)</h5>\n                          <p>\n                            <span class=\"stockSku\"><label>SKU: </label>Number</span>\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (100 POLYSTER NON TEXTURED LINING FABRIC)</h5>\n                          <p>\n                            <span class=\"stockSku\"><label>SKU: </label>Number</span>\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (100 POLYSTER NON)</h5>\n                          <p>\n                            <span class=\"stockSku\"><label>SKU: </label>Number</span>\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (100 POLYSTER NON TEXTURED LINING FABRIC)</h5>\n                          <p>\n                            <span class=\"stockSku\"><label>SKU: </label>Number</span>\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (100 POLYSTER NON TEXTURED LINING FABRIC)</h5>\n                          <p>\n                            <span class=\"stockSku\"><label>SKU: </label>Number</span>\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (Dummy text Lorem ipsum)</h5>\n                          <p>\n\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (100 POLYSTER NON TEXTURED LINING FABRIC)</h5>\n                          <p>\n                            <span class=\"stockSku\"><label>SKU: </label>Number</span>\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (100 POLYSTER NON LINING FABRIC)</h5>\n                          <p>\n                            <span class=\"stockSku\"><label>SKU: </label>Number</span>\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (100 POLYSTER NON TEXTURED LINING FABRIC)</h5>\n                          <p>\n                            <span class=\"stockSku\"><label>SKU: </label>Number</span>\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (100 POLYSTER NON TEXTURED LINING FABRIC)</h5>\n                          <p>\n                            <span class=\"stockSku\"><label>SKU: </label>Number</span>\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (100 POLYSTER NON)</h5>\n                          <p>\n                            <span class=\"stockSku\"><label>SKU: </label>Number</span>\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n                        <div class=\"singleProductWrapper\">\n                          <h5>Sales (100 POLYSTER NON TEXTURED LINING FABRIC)</h5>\n                          <p>\n                            <span class=\"stockSku\"><label>SKU: </label>Number</span>\n                            <span class=\"rateStock\"><label>Rate:</label> </span>$2000/-\n                          </p>\n                        </div>\n\n                      </div>\n                    </div>\n                  </div>\n                  <div class=\"col-md-6 pl-0\">\n                    <div class=\"rightContent\">\n                      <h4>Selected Stocks <span class=\"selectdStockNumber\">(4)</span></h4>\n                      <hr>\n                      <div class=\"wrapSelectedStocks\">\n                        <div class=\"singleSelectdStock clearfix\">\n                          <div class=\"pull-left\">\n                            <div class=\"stockName\">\n                              <p>Sales (100 POLYSTER NON TEX…)</p>\n                            </div>\n\n                          </div>\n                          <div class=\"pull-right\">\n                            <div class=\"input-group\">\n                                                        <span class=\"input-group-btn\">\n                                <button type=\"button\" class=\"btn btn-default btn-number\" data-type=\"minus\"\n                                        data-field=\"quant[1]\">\n                                    <span class=\"fa fa-minus\"></span>\n                                                        </button>\n                                                        </span>\n                              <input type=\"text\" name=\"quant[1]\" class=\"form-control input-number\" value=\"1\" min=\"1\"\n                                     max=\"10\">\n                              <span class=\"input-group-btn\">\n                                <button type=\"button\" class=\"btn btn-default btn-number\" data-type=\"plus\"\n                                        data-field=\"quant[1]\">\n                                    <span class=\"fa fa-plus\"></span>\n                                                        </button>\n                                                        </span>\n                            </div>\n                          </div>\n                        </div>\n                        <div class=\"singleSelectdStock clearfix\">\n                          <div class=\"pull-left\">\n                            <div class=\"stockName\">\n                              <p>Sales (100 POLYSTER TEX…)</p>\n                            </div>\n\n                          </div>\n                          <div class=\"pull-right\">\n                            <div class=\"input-group\">\n                                                        <span class=\"input-group-btn\">\n                                <button type=\"button\" class=\"btn btn-default btn-number\" data-type=\"minus\"\n                                        data-field=\"quant[1]\">\n                                    <span class=\"fa fa-minus\"></span>\n                                                        </button>\n                                                        </span>\n                              <input type=\"text\" name=\"quant[1]\" class=\"form-control input-number\" value=\"1\" min=\"1\"\n                                     max=\"10\">\n                              <span class=\"input-group-btn\">\n                                <button type=\"button\" class=\"btn btn-default btn-number\" data-type=\"plus\"\n                                        data-field=\"quant[1]\">\n                                    <span class=\"fa fa-plus\"></span>\n                                                        </button>\n                                                        </span>\n                            </div>\n                          </div>\n                        </div>\n                        <div class=\"singleSelectdStock clearfix\">\n                          <div class=\"pull-left\">\n                            <div class=\"stockName\">\n                              <p>Sales (text)</p>\n                            </div>\n\n                          </div>\n                          <div class=\"pull-right\">\n                            <div class=\"input-group\">\n                                                        <span class=\"input-group-btn\">\n                                <button type=\"button\" class=\"btn btn-default btn-number\" data-type=\"minus\"\n                                        data-field=\"quant[1]\">\n                                    <span class=\"fa fa-minus\"></span>\n                                                        </button>\n                                                        </span>\n                              <input type=\"text\" name=\"quant[1]\" class=\"form-control input-number\" value=\"1\" min=\"1\"\n                                     max=\"10\">\n                              <span class=\"input-group-btn\">\n                                <button type=\"button\" class=\"btn btn-default btn-number\" data-type=\"plus\"\n                                        data-field=\"quant[1]\">\n                                    <span class=\"fa fa-plus\"></span>\n                                                        </button>\n                                                        </span>\n                            </div>\n                          </div>\n                        </div>\n                      </div>\n                      <div class=\"temapletFooter\">\n                        <hr>\n                        <div class=\"btn-group bulkItemBtnGroup\">\n                          <button class=\"btn btn-sm btn-success\" type=\"button\"\n                                  (click)=\"hsnDropdownShow=!hsnDropdownShow\">\n                            Save\n                          </button>\n                          <button class=\"btn btn-sm btn-primary\" (click)=\"modalRef.hide()\" type=\"button\">Cancel\n                          </button>\n                        </div>\n                      </div>\n\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </ng-template>\n          <!-- endregion -->\n\n          </section>\n\n          <section class=\"clearfix mrB2 whiteBg container-fluid\">\n          </section>\n\n\n          </ng-container>\n        </div>\n      </div>\n      <div class=\"col-md-3\"></div>\n    </div>\n\n\n    <div class=\"clearfix wrapperCustomerTable  pdT2\">\n      <table class=\"table customerInvoiceTable\"\n             [ngClass]=\"{' firstTable' : !invFormData.voucherDetails.customerName }\" style=\"display: none;\">\n        <tr [hidden]=\"isPurchaseInvoice\">\n          <td width=\"150px\">\n            <label>Customer Name </label>\n          </td>\n          <td width=\"65%\">\n            <div class=\"clearfix\">\n\n              <ng-container *ngIf=\"!isCashInvoice\">\n                <sales-sh-select style=\"width:48.5%; float: left;\" name=\"voucherDetails.customerName\"\n                                 [options]=\"customerAcList$ | async\"\n                                 [(ngModel)]=\"invFormData.voucherDetails.customerName\"\n                                 [customFilter]=\"customMoveGroupFilter\"\n                                 (noOptionsFound)=\"noResultsForCustomer($event)\"\n                                 (selected)=\"onSelectCustomer($event)\" [placeholder]=\"'Select Customer'\"\n                                 [notFoundLink]=\"true\" [doNotReset]=\"true\" [forceClearReactive]=\"forceClear$ | async\"\n                                 [isFilterEnabled]=\"true\" (noResultsClicked)=\"toggleAccountAsidePane($event)\"\n                                 [multiple]=\"false\" [ItemHeight]=\"67\" [notFoundLinkText]=\"'Add Customer'\"\n                                 (keyup)=\"resetCustomerName($event)\" (onClear)=\"resetCustomerName(null)\"\n                                 [showClear]=\"!isUpdateMode\" [disabled]=\"isUpdateMode\">\n                  <ng-template #optionTemplate let-option=\"option\">\n                    <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                      <div class=\"item\">{{ option.label }}</div>\n                      <div class=\"item_unq\">{{ option.value }}</div>\n                    </a>\n                  </ng-template>\n                  <ng-template #notFoundLinkTemplate>\n                    <a href=\"javascript:void(0)\" class=\"list-item\" [keyboardShortcut]=\"'alt+c'\"\n                       (onShortcutPress)=\"toggleAccountAsidePane()\"\n                       style=\"width:100%; display: flex;justify-content: space-between;\">\n                      <div class=\"item\">Add Customer</div>\n                      <div class=\"item\">Alt+C</div>\n                    </a>\n                  </ng-template>\n                </sales-sh-select>\n              </ng-container>\n\n              <ng-container *ngIf=\"isCashInvoice\">\n                <input type=\"text\" #cashInvoiceInput name=\"voucherDetails.customerName\"\n                       class=\"form-control cashInvoiceInput\" [(ngModel)]=\"invFormData.voucherDetails.customerName\"\n                       [readOnly]=\"isUpdateMode\" autocomplete=\"notallowedhere\">\n              </ng-container>\n              <!-- <a class=\"copyInvoice\" *ngIf=\"invFormData.voucherDetails.customerName\"> <img src=\"../../assets/images/copy-icon.svg\">Copy Previous Invoice</a> -->\n            </div>\n            <!-- <div class=\"other-options\">\n  <a href=\"#\">Unregistered Business</a> | <a href=\"#\">Customer Details</a>\n</div> -->\n            <!-- flex row child start -->\n\n            <!--            <div class=\"flex-row-child add-entryAgainst mrL2\" *ngIf=\"!isCustomerSelected\">-->\n            <!--              &lt;!&ndash;*ngIf=\"typeaheadNoResultsOfCustomer\"&ndash;&gt;-->\n            <!--              <div class=\"form-group noMarg\">-->\n            <!--                <label>Add Entry Against</label>-->\n            <!--                <sh-select name=\"accountDetails.uniqueName\" [options]=\"bankAccounts$ | async\"-->\n            <!--                           [(ngModel)]=\"invFormData.accountDetails.uniqueName\" (selected)=\"onSelectBankCash($event)\"-->\n            <!--                           [placeholder]=\"'Cash Account'\" [notFoundLink]=\"false\"-->\n            <!--                           [forceClearReactive]=\"forceClear$ | async\"-->\n            <!--                           [multiple]=\"false\" [ItemHeight]=\"33\" [useInBuiltFilterForIOptionTypeItems]=\"true\">-->\n            <!--                  <ng-template #optionTemplate1 let-option=\"option\">-->\n            <!--                    <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">-->\n            <!--                      <div class=\"item\">{{ option.label }}</div>-->\n            <!--                      <div class=\"item_unq\">{{ option.value }}</div>-->\n            <!--                    </a>-->\n            <!--                  </ng-template>-->\n            <!--                </sh-select>-->\n            <!--              </div>-->\n            <!--            </div>-->\n            <!-- flex row child end -->\n          </td>\n          <td>\n            <div class=\" text-right\" *ngIf=\"invFormData.voucherDetails.customerName && !isCashInvoice\">\n              <p *ngIf=\"toggleFieldForSales\" class=\"fs20 b\">\n                <span class=\"balance-due\">Balance Due: </span>\n                <span class=\"sp-rupees\">Rs {{invFormData.voucherDetails.balanceDue | number:'1.2-2'}}</span>\n              </p>\n            </div>\n          </td>\n        </tr>\n        <tr [hidden]=\"!isPurchaseInvoice\">\n          <td width=\"150px\">\n            <label>Vendor Name</label>\n          </td>\n          <td width=\"65%\">\n            <div class=\"flex-row-child\">\n              <div class=\"form-group noMarg\">\n\n                <!-- [useInBuiltFilterForIOptionTypeItems]=\"true\" -->\n                <!--  -->\n                <sales-sh-select style=\"width:48.5%;\" name=\"voucherDetails.customerName\"\n                                 [options]=\"customerAcList$ | async\"\n                                 [(ngModel)]=\"invFormData.voucherDetails.tempCustomerName\"\n                                 [customFilter]=\"customMoveGroupFilter\"\n                                 (noOptionsFound)=\"noResultsForCustomer($event)\"\n                                 (selected)=\"onSelectCustomer($event)\" [placeholder]=\"'Select Vendor'\"\n                                 [notFoundLink]=\"true\" [doNotReset]=\"true\" [forceClearReactive]=\"forceClear$ | async\"\n                                 [isFilterEnabled]=\"true\" (noResultsClicked)=\"toggleAccountAsidePane($event)\"\n                                 [multiple]=\"false\" [ItemHeight]=\"67\" [notFoundLinkText]=\"'Add Vendor'\"\n                                 (keyup)=\"resetCustomerName($event)\" (onClear)=\"resetCustomerName(null)\"\n                                 [showClear]=\"!isUpdateMode\">\n                  <ng-template #optionTemplate let-option=\"option\">\n                    <a href=\"javascript:void(0)\" class=\"list-item\" style=\"border-bottom: 1px solid #ccc;\">\n                      <div class=\"item\">{{ option.label }}</div>\n                      <div class=\"item_unq\">{{ option.value }}</div>\n                    </a>\n                  </ng-template>\n                </sales-sh-select>\n              </div>\n            </div>\n          </td>\n\n        </tr>\n        <tr>\n          <td></td>\n          <td>\n            <ng-container>\n              <section class=\"form-inline  \">\n                <div class=\" wrap-billing-address clearfix\">\n                  <div class=\"row\">\n                    <div class=\"col-xs-6\">\n                      <div class=\"form-group\">\n                        <label>Billing Address</label>\n                        <div class=\"billing-address clearfix\">\n                            <textarea name=\"billingDetails.address\" (keyup)=\"autoFillShippingDetails()\"\n                                      class=\"form-control\"\n                                      [(ngModel)]=\"invFormData.accountDetails.billingDetails.address[0]\" rows=\"3\"\n                                      autocomplete=\"off\" autofocus=\"off\" aria-autocomplete=\"none\"></textarea>\n                          <div class=\"\">\n                            <div class=\"col-sm-6 pd\">\n                              <!-- <label>Country</label> -->\n\n                              <label class=\"salesCountryLabel\">\n                                {{ customerCountryName }}\n                              </label>\n\n                            </div>\n                            <div class=\"col-sm-6 pd\">\n                              <!-- <label>State</label> -->\n                              <!-- remove disabled after api changes -->\n                              <sales-sh-select [disabled]=\"isUpdateMode\" [placeholder]=\"'State'\"\n                                               class=\"select-bdr-bottom\" (selected)=\"autoFillShippingDetails()\"\n                                               #statesBilling [showBottomBorderOnly]=\"true\"\n                                               [options]=\"statesSource$ | async\" name=\"billingDetails.stateCode\"\n                                               [(ngModel)]=\"invFormData.accountDetails.billingDetails.stateCode\"></sales-sh-select>\n                              <!-- <ng-select (selected)=\"autoFillShippingDetails()\" #statesBilling class=\"splSales\" name=\"billingDetails.stateCode\" [options]=\"statesSource$ | async\"\n[(ngModel)]=\"invFormData.accountDetails.billingDetails.stateCode\"></ng-select> -->\n                            </div>\n                            <div class=\"col-sm-12 pd\">\n                              <!-- <label>GSTIN</label> -->\n                              <!-- remove disabled after api changes -->\n                              <input [disabled]=\"isUpdateMode\" maxLength=\"15\" type=\"text\"\n                                     name=\"billingDetails.gstNumber\" class=\"form-control input-custom\"\n                                     [(ngModel)]=\"invFormData.accountDetails.billingDetails.gstNumber\"\n                                     (keyup)=\"getStateCode('billingDetails', statesBilling); autoFillShippingDetails()\"\n                                     placeholder=\"GSTIN\"/>\n                            </div>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <div class=\"col-xs-6\">\n                      <div class=\"form-group p0 width100\">\n                        <label>\n                          <input type=\"checkbox\" (change)=\"autoFillShippingDetails()\" name=\"autoFillShipping\"\n                                 [attr.checked]=\"true\"\n                                 [(ngModel)]=\"autoFillShipping\"> Shipping Address Same as Billing Address</label>\n                        <div class=\"billing-address\" [ngClass]=\"{'disabled': autoFillShipping}\">\n                            <textarea [readonly]=\"autoFillShipping\" name=\"shippingDetails.address\" class=\"form-control\"\n                                      [(ngModel)]=\"invFormData.accountDetails.shippingDetails.address[0]\" rows=\"3\"\n                                      autocomplete=\"off\"></textarea>\n                          <div class=\"clearfix\">\n                            <div class=\"form-group\">\n                              <div class=\"col-sm-6 pd\">\n                                <div class=\"form-group\">\n\n                                  <label class=\"salesCountryLabel\">\n                                    {{ customerCountryName }}\n                                  </label>\n                                </div>\n                              </div>\n                              <div class=\"col-sm-6 pd\">\n                                <!-- <label>State</label> -->\n                                <!-- <ng-select [disabled]=\"autoFillShipping\" #statesShipping class=\"splSales\" name=\"shippingDetails.stateCode\" [options]=\"statesSource$ | async\" [(ngModel)]=\"invFormData.accountDetails.shippingDetails.stateCode\"></ng-select> -->\n                                <!-- (selected)=\"autoFillShippingDetails()\" -->\n\n                                <!-- use this after api changes [disabled]=\"autoFillShipping\"  -->\n                                <sales-sh-select [disabled]=\"isUpdateMode\" [placeholder]=\"'State'\"\n                                                 class=\"select-bdr-bottom\" #statesShipping\n                                                 [showBottomBorderOnly]=\"true\" [options]=\"statesSource$ | async\"\n                                                 name=\"shippingDetails.stateCode\"\n                                                 [(ngModel)]=\"invFormData.accountDetails.shippingDetails.stateCode\"></sales-sh-select>\n                              </div>\n                              <div class=\"col-sm-12 pd\">\n                                <!-- <label>GSTIN</label> -->\n                                <!-- remove disabled after api changes and add [readonly]=\"autoFillShipping\" -->\n                                <input [disabled]=\"isUpdateMode\" maxLength=\"15\" type=\"text\"\n                                       name=\"shippingDetails.gstNumber\" class=\"form-control input-custom\"\n                                       [(ngModel)]=\"invFormData.accountDetails.shippingDetails.gstNumber\"\n                                       (keyup)=\"getStateCode('shippingDetails', statesShipping)\"\n                                       placeholder=\"GSTIN\"/>\n                              </div>\n                            </div>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n\n\n                </div>\n\n              </section>\n            </ng-container>\n          </td>\n          <td></td>\n        </tr>\n\n      </table>\n\n      <table class=\"innerTable table customerInvoiceTable bg-white\" style=\"display: none;\">\n\n        <tr>\n          <td>\n            <label>Attention to</label>\n          </td>\n          <td>\n            <div class=\"form-group pl0 m-r-15 col-xs-6\">\n              <!--col-xs-3 -->\n\n              <input type=\"text\" name=\"accountDetails.attention\" placeholder=\"Attention to\"\n                     class=\"form-control attentionTo\" [(ngModel)]=\"invFormData.accountDetails.attentionTo\"/>\n            </div>\n          </td>\n          <td></td>\n        </tr>\n\n        <tr>\n          <td width=\"150px\">\n            <label>Email Id</label>\n          </td>\n          <td width=\"65%\">\n            <div class=\"col-xs-6 pl-0\">\n              <input type=\"email\" placeholder=\"someone@example.com\" name=\"accountDetails.email\"\n                     class=\"form-control attentionTo\" [(ngModel)]=\"invFormData.accountDetails.email\"/>\n            </div>\n\n          </td>\n          <td></td>\n        </tr>\n\n        <tr>\n          <td>\n            <label>Mobile Number</label>\n          </td>\n          <td>\n            <div class=\"col-xs-6 pl-0\">\n              <input digitsOnlyDirective placeholder=\"9198XXXXXXXX\" type=\"text\" name=\"accountDetails.mobileNumber\"\n                     class=\"form-control attentionTo\" [(ngModel)]=\"invFormData.accountDetails.mobileNumber\"/>\n            </div>\n\n          </td>\n          <td></td>\n        </tr>\n\n        <tr>\n          <td>\n            <label> {{ !isPurchaseInvoice ? 'Invoice No.' : 'Purchase Invoice No.' }}</label>\n          </td>\n          <td style=\"position:relative\">\n            <div class=\"col-xs-6 pl-0\">\n              <input type=\"text\" name=\"accountDetails.invoiceNum\" class=\"form-control invoiceDate attentionTo\"\n                     [ngClass]=\"{'dateinvoice': !isPurchaseInvoice }\"\n                     [disabled]=\"isUpdateMode  || !useCustomInvoiceNumber\"\n                     [(ngModel)]=\"invFormData.voucherDetails.voucherNumber\"\n              />\n            </div>\n            <div class=\"col-xs-6 invoiceDateDueDate\">\n              <div class=\"form-inline \">\n                <div class=\"form-group m-r-15\">\n                  <!--col-xs-2-->\n                  <label>Invoice Date</label>\n\n                  <input type=\"text\" [placeholder]=\"giddhDateFormat\" #voucherDate=\"ngModel\" name=\"voucherDate\"\n                         class=\"form-control dateinvoice\" bsDatepicker\n                         [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\"\n                         [(ngModel)]=\"invFormData.voucherDetails.voucherDate\" [disabled]=\"isUpdateMode\"\n                         [class.invalid-inp]=\"voucherDate.errors && (voucherDate.dirty || voucherDate.touched)\"/>\n                  <p class=\"text-danger\" *ngIf=\"voucherDate.errors && (voucherDate.dirty || voucherDate.touched)\">\n                    Invalid Date\n                  </p>\n\n\n                </div>\n                <div class=\"form-group m-l-10 m-r-15\" *ngIf=\"isSalesInvoice || isPurchaseInvoice\">\n                  <label> {{isPurchaseInvoice ? 'Bill Due Date' : 'Due Date'}}</label>\n\n                  <input type=\"text\" [placeholder]=\"giddhDateFormat\" #dueDate=\"ngModel\" name=\"dueDate\"\n                         class=\"form-control dateinvoice\" bsDatepicker\n                         [bsConfig]=\"{ dateInputFormat: giddhDateFormat }\"\n                         [(ngModel)]=\"invFormData.voucherDetails.dueDate\"\n                         [class.invalid-inp]=\"dueDate.errors && (dueDate.dirty || dueDate.touched)\"\n                  />\n                  <p class=\"text-danger\" *ngIf=\"dueDate.errors && (dueDate.dirty || dueDate.touched)\">Invalid Date</p>\n\n                </div>\n              </div>\n            </div>\n\n\n          </td>\n\n        </tr>\n\n      </table>\n\n    </div>\n\n</div>\n\n\n<!-- region submit actions-->\n<section class=\"clearfix\">\n\n  <section id=\"actionPane\" class=\"text-center\">\n\n    <div class=\"col-xs-12\">\n\n      <div class=\"pull-right pr\" *ngIf=\"!isUpdateMode\">\n        <button type=\"button\" (click)=\"resetInvoiceForm(invoiceForm)\"\n                class=\"btn btn-danger d-inline-block v-align-middle\">Clear\n        </button>\n\n        <span class=\"d-inline-block v-align-middle\" *ngIf=\"isPurchaseInvoice\">\n                <button type=\"button\" (click)=\"triggerSubmitInvoiceForm(invoiceForm, true)\"\n                        class=\"btn btn-default\" *ngIf=\"isCustomerSelected\">Save &amp; Update A/c\n                </button>\n                <button type=\"button\" (click)=\"doAction(3);triggerSubmitInvoiceForm(invoiceForm, false)\"\n                        class=\"btn btn-default\">Save\n                </button>\n            </span>\n\n        <span class=\"d-inline-block v-align-middle\" *ngIf=\"!isPurchaseInvoice\">\n\n              <button type=\"button\" (click)=\"triggerSubmitInvoiceForm(invoiceForm, true)\"\n                      class=\"btn btn-default\" *ngIf=\"isCustomerSelected\"\n                      [disabled]=\"invoiceForm.invalid\">Generate {{selectedPageLabel}}\n                &amp; Update A/c\n              </button>\n\n              <div class=\"btn-group\" dropdown [dropup]=\"true\">\n\n                  <button type=\"button\" (click)=\"doAction(3);triggerSubmitInvoiceForm(invoiceForm, false)\"\n                          class=\"btn btn-default\"\n                          [disabled]=\"invoiceForm.invalid\">Generate {{selectedPageLabel}}\n                  </button>\n\n                  <button id=\"button-split\" type=\"button\" dropdownToggle\n                          class=\"btn btn-default dropdown-toggle dropdown-toggle-split\"\n                          aria-controls=\"dropdown-split\" *ngIf=\"selectedPage === 'Sales'\"\n                          [disabled]=\"invoiceForm.invalid\">\n                    <span class=\"caret\"></span>\n                            <span class=\"sr-only\">Split button!</span>\n                            </button>\n\n                            <ul id=\"dropdown-basic\" *dropdownMenu class=\"dropdown-menu dropdown-menu-right\" role=\"menu\"\n                                aria-labelledby=\"button-basic\">\n                                <li role=\"menuitem\">\n                                    <a class=\"dropdown-item cp\"\n                                       (click)=\"doAction(1);triggerSubmitInvoiceForm(invoiceForm, false)\">Generate & Close</a>\n                                </li>\n                                <li role=\"menuitem\" (click)=\"doAction(2);triggerSubmitInvoiceForm(invoiceForm, false)\">\n                                    <a class=\"dropdown-item cp\">Generate & Recurring</a>\n                                </li>\n                            </ul>\n                        </div>\n                        </span>\n\n      </div>\n\n      <div class=\"pull-right pr\" *ngIf=\"isUpdateMode\">\n\n        <button type=\"button\" class=\"btn btn-danger d-inline-block v-align-middle\" (click)=\"cancelUpdate()\">Cancel\n        </button>\n\n        <button type=\"button\" class=\"btn btn-default\" (click)=\"txnChangeOccurred();submitUpdateForm(invoiceForm)\"\n                [disabled]=\"invoiceForm.invalid\">\n          <span>Update {{selectedPageLabel}}</span>\n        </button>\n      </div>\n    </div>\n  </section>\n</section>\n<!-- endregion -->\n\n</form>\n</div>\n\n<!--<app-fixed-footer></app-fixed-footer>-->\n\n<!-- open account aside -->\n<div class=\"aside-overlay\"\n     *ngIf=\"accountAsideMenuState === 'in' || asideMenuStateForProductService === 'in'\n     || asideMenuStateForRecurringEntry === 'in' || asideMenuStateForOtherTaxes === 'in'\"></div>\n\n<sales-aside-menu-account\n  *ngIf=\"accountAsideMenuState === 'in'\"\n  [class]=\"accountAsideMenuState\" [@slideInOut]=\"accountAsideMenuState\"\n  (closeAsideEvent)=\"toggleAccountAsidePane($event)\" [isPurchaseInvoice]=\"isPurchaseInvoice\"\n  [keyboardShortcut]=\"{'esc':accountAsideMenuState ==='in'}\"\n  (onShortcutPress)=\"toggleAccountAsidePane()\"></sales-aside-menu-account>\n\n<!--&lt;!&ndash; open product service aside &ndash;&gt;-->\n<!--<aside-menu-product-service [class]=\"asideMenuStateForProductService\" [@slideInOut]=\"asideMenuStateForProductService\"-->\n<!--                            (closeAsideEvent)=\"onNoResultsClicked()\"-->\n<!--                            (animatePAside)=\"getActionFromAside($event)\"></aside-menu-product-service>-->\n\n<app-aside-recurring-entry [voucherType]=\"selectedPage\" [voucherNumber]=\"voucherNumber\"\n                           [class]=\"asideMenuStateForRecurringEntry\" [@slideInOut]=\"asideMenuStateForRecurringEntry\"\n                           (closeAsideEvent)=\"toggleRecurringAsidePane('out')\"></app-aside-recurring-entry>\n\n\n<!--<ng-template #otherTaxSidePane let-entry>-->\n<app-aside-menu-sales-other-taxes\n  *ngIf=\"asideMenuStateForOtherTaxes === 'in' && selectedEntry\"\n  [class]=\"asideMenuStateForOtherTaxes\"\n  [taxes]=\"companyTaxesList$ | async\"\n  [otherTaxesModal]=\"selectedEntry.otherTaxModal\"\n  [@slideInOut]=\"asideMenuStateForOtherTaxes\"\n  (closeModal)=\"toggleOtherTaxesAsidePane(true, null ,true)\"\n  (applyTaxes)=\"calculateOtherTaxes($event);toggleOtherTaxesAsidePane(true, null, true);calculateAffectedThingsFromOtherTaxChanges()\"\n>\n</app-aside-menu-sales-other-taxes>\n<!--</ng-template>-->\n\n<!--&lt;!&ndash; create Group modal &ndash;&gt;-->\n<!--<section *ngIf=\"showCreateGroupModal\">-->\n<!--  <div bsModal #createGroupModal=\"bs-modal\" class=\"modal fade\" role=\"dialog\" [keyboardShortcut]=\"'esc'\"-->\n<!--       (onShortcutPress)=\"closeCreateGroupModal()\" [config]=\"modalConfig\">-->\n<!--    <div class=\"modal-dialog modal-md\">-->\n<!--      <div class=\"modal-content\">-->\n<!--        <sales-add-group-modal (actionFired)=\"closeCreateGroupModal($event)\"></sales-add-group-modal>-->\n<!--      </div>-->\n<!--    </div>-->\n<!--  </div>-->\n<!--</section>-->\n\n<!--&lt;!&ndash; create Ac modal &ndash;&gt;-->\n<!--<section *ngIf=\"showCreateAcModal\">-->\n<!--  <div bsModal #createAcModal=\"bs-modal\" class=\"modal fade\" role=\"dialog\" [config]=\"modalConfig\">-->\n<!--    <div class=\"modal-dialog modal-md\">-->\n<!--      <div class=\"modal-content\">-->\n<!--        <create-account-modal [gType]=\"createAcCategory\" (actionFired)=\"closeCreateAcModal()\"></create-account-modal>-->\n<!--      </div>-->\n<!--    </div>-->\n<!--  </div>-->\n<!--</section>-->\n\n<!-- modal start -->\n<ng-template #template>\n  <div class=\"modal-header\">\n    <h4 class=\"modal-title pull-left\">Change Template</h4>\n    <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"modalRef.hide()\">\n      <span aria-hidden=\"true\">&times;</span>\n    </button>\n  </div>\n  <div class=\"modal-body\">\n    <perfect-scrollbar style=\"max-height: 740px !important; min-height: 740px;\" [scrollIndicators]=\"true\">\n      <form #CreateInvoice=\"ngForm\">\n\n        <div class=\"row\">\n          <div class=\"col-md-6\">\n            <div class=\"change-template\">\n              <img src=\"assets/images/a.png\" class=\"img-responsive\" alt=\"\">\n              <div class=\"modal-invoice-footer\">\n                <ul class=\"list-inline\">\n                  <li>Template A</li>\n                  <li><input type=\"radio\" id=\"radio-1\" name=\"creatInvoice\">\n                    <label for=\"radio-1\" class=\"btn\"><i class=\"glyphicon glyphicon-star\"></i> Template Default</label>\n                  </li>\n                </ul>\n              </div>\n            </div>\n          </div>\n\n          <div class=\"col-md-6\">\n            <div class=\"change-template\">\n              <img src=\"assets/images/b.png\" class=\"img-responsive\" alt=\"\">\n              <div class=\"modal-invoice-footer\">\n                <ul class=\"list-inline\">\n                  <li>Template B</li>\n                  <li><input type=\"radio\" id=\"radio-2\" name=\"creatInvoice\">\n                    <label for=\"radio-2\" class=\"btn\"><i class=\"glyphicon glyphicon-star\"></i> Template Default</label>\n                  </li>\n                </ul>\n              </div>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"row\">\n          <div class=\"col-md-6\">\n            <div class=\"change-template\">\n              <img src=\"assets/images/c.png\" class=\"img-responsive\" alt=\"\">\n              <div class=\"modal-invoice-footer\">\n                <ul class=\"list-inline\">\n                  <li>Template C</li>\n                  <li><input type=\"radio\" id=\"radio-3\" name=\"creatInvoice\">\n                    <label for=\"radio-3\" class=\"btn\"><i class=\"glyphicon glyphicon-star\"></i> Template Default</label>\n                  </li>\n                </ul>\n              </div>\n            </div>\n          </div>\n\n          <div class=\"col-md-6\">\n            <div class=\"change-template\">\n              <img src=\"assets/images/d.png\" class=\"img-responsive\" alt=\"\">\n              <div class=\"modal-invoice-footer\">\n                <ul class=\"list-inline\">\n                  <li>Template D</li>\n                  <li><input type=\"radio\" id=\"radio-4\" name=\"creatInvoice\">\n                    <label for=\"radio-4\" class=\"btn\"><i class=\"glyphicon glyphicon-star\"></i> Template Default</label>\n                  </li>\n                </ul>\n              </div>\n            </div>\n          </div>\n        </div>\n      </form>\n\n    </perfect-scrollbar>\n\n  </div>\n</ng-template>\n"

/***/ }),

/***/ "./src/app/sales/create/sales.invoice.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/sales/create/sales.invoice.component.ts ***!
  \*********************************************************/
/*! exports provided: SalesInvoiceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesInvoiceComponent", function() { return SalesInvoiceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! moment/moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment_moment__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(moment_moment__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../models/api-models/Sales */ "./src/app/models/api-models/Sales.ts");
/* harmony import */ var _services_account_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/account.service */ "./src/app/services/account.service.ts");
/* harmony import */ var _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../shared/helpers/directives/elementViewChild/element.viewchild.directive */ "./src/app/shared/helpers/directives/elementViewChild/element.viewchild.directive.ts");
/* harmony import */ var _actions_sales_sales_action__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../actions/sales/sales.action */ "./src/app/actions/sales/sales.action.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../actions/ledger/ledger.actions */ "./src/app/actions/ledger/ledger.actions.ts");
/* harmony import */ var _services_sales_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../services/sales.service */ "./src/app/services/sales.service.ts");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../shared/helpers/defaultDateFormat */ "./src/app/shared/helpers/defaultDateFormat.ts");
/* harmony import */ var apps_web_giddh_src_app_actions_general_general_actions__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! apps/web-giddh/src/app/actions/general/general.actions */ "./src/app/actions/general/general.actions.ts");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! reselect */ "../../node_modules/reselect/lib/index.js");
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(reselect__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var apps_web_giddh_src_app_shared_helpers_universalValidations__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! apps/web-giddh/src/app/shared/helpers/universalValidations */ "./src/app/shared/helpers/universalValidations.ts");
/* harmony import */ var _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../actions/invoice/invoice.actions */ "./src/app/actions/invoice/invoice.actions.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/animations */ "../../node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _services_apiurls_ledger_api__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../services/apiurls/ledger.api */ "./src/app/services/apiurls/ledger.api.ts");
/* harmony import */ var _app_constant__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../../app.constant */ "./src/app/app.constant.ts");
/* harmony import */ var _actions_settings_discount_settings_discount_action__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../../actions/settings/discount/settings.discount.action */ "./src/app/actions/settings/discount/settings.discount.action.ts");
/* harmony import */ var _discount_list_discountList_component__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../discount-list/discountList.component */ "./src/app/sales/discount-list/discountList.component.ts");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ngx-bootstrap/modal */ "../../node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var _theme_sales_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../../theme/sales-ng-virtual-select/sh-select.component */ "./src/app/theme/sales-ng-virtual-select/sh-select.component.ts");
/* harmony import */ var _actions_invoice_receipt_receipt_actions__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../../actions/invoice/receipt/receipt.actions */ "./src/app/actions/invoice/receipt/receipt.actions.ts");
/* harmony import */ var _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ../../actions/settings/profile/settings.profile.action */ "./src/app/actions/settings/profile/settings.profile.action.ts");
/* harmony import */ var _theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ../../theme/ng-virtual-select/sh-select.component */ "./src/app/theme/ng-virtual-select/sh-select.component.ts");
/* harmony import */ var _services_ledger_service__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ../../services/ledger.service */ "./src/app/services/ledger.service.ts");
/* harmony import */ var _shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ../../shared/helpers/helperFunctions */ "./src/app/shared/helpers/helperFunctions.ts");



//import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
















//import { GeneralActions } from 'app/actions/general/general.actions';

//import { setTimeout } from 'timers';

//import { EMAIL_REGEX_PATTERN } from 'app/shared/helpers/universalValidations';








//import { TemplateRef } from '@angular/core';







var STOCK_OPT_FIELDS = ['Qty.', 'Unit', 'Rate'];
var THEAD_ARR_1 = [
    {
        display: true,
        label: '#'
    },
    {
        display: true,
        label: 'Date'
    },
    {
        display: true,
        label: 'Product/Service'
    },
    {
        display: true,
        label: 'Description'
    },
    {
        display: true,
        label: 'HSN/SAC'
    },
];
var THEAD_ARR_OPTIONAL = [
    {
        display: false,
        label: 'Qty.'
    },
    {
        display: false,
        label: 'Unit'
    },
    {
        display: false,
        label: 'Rate'
    }
];
var THEAD_ARR_READONLY = [
    {
        display: true,
        label: '#'
    },
    {
        display: true,
        label: 'Product/Service  Description '
    },
    {
        display: true,
        label: 'Qty/Unit'
    },
    {
        display: true,
        label: 'Rate'
    },
    {
        display: true,
        label: 'Amount'
    },
    {
        display: true,
        label: 'Discount'
    },
    {
        display: true,
        label: 'Tax'
    },
    {
        display: true,
        label: 'Total'
    },
    {
        display: true,
        label: ''
    }
];
var SalesInvoiceComponent = /** @class */ (function () {
    function SalesInvoiceComponent(modalService, store, accountService, salesAction, companyActions, router, ledgerActions, salesService, _toasty, _generalActions, _invoiceActions, _settingsDiscountAction, route, invoiceReceiptActions, _settingsProfileActions, _ledgerService, _salesActions, cdr) {
        var _this = this;
        this.modalService = modalService;
        this.store = store;
        this.accountService = accountService;
        this.salesAction = salesAction;
        this.companyActions = companyActions;
        this.router = router;
        this.ledgerActions = ledgerActions;
        this.salesService = salesService;
        this._toasty = _toasty;
        this._generalActions = _generalActions;
        this._invoiceActions = _invoiceActions;
        this._settingsDiscountAction = _settingsDiscountAction;
        this.route = route;
        this.invoiceReceiptActions = invoiceReceiptActions;
        this._settingsProfileActions = _settingsProfileActions;
        this._ledgerService = _ledgerService;
        this._salesActions = _salesActions;
        this.cdr = cdr;
        this.invoiceNo = '';
        this.isUpdateMode = false;
        this.selectedAcc = false;
        this.customerCountryName = '';
        this.isPurchaseInvoice = false;
        this.isCreditNote = false;
        this.isDebitNote = false;
        this.isCashInvoice = false;
        this.accountUniqueName = '';
        this.showAnimation = false;
        this.isGenDtlCollapsed = true;
        this.isMlngAddrCollapsed = true;
        this.isOthrDtlCollapsed = false;
        this.typeaheadNoResultsOfCustomer = false;
        this.typeaheadNoResultsOfSalesAccount = false;
        this.salesAccounts$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](null);
        this.accountAsideMenuState = 'out';
        this.asideMenuStateForProductService = 'out';
        this.asideMenuStateForRecurringEntry = 'out';
        this.asideMenuStateForOtherTaxes = 'out';
        this.theadArr = THEAD_ARR_1;
        this.theadArrOpt = THEAD_ARR_OPTIONAL;
        this.theadArrReadOnly = THEAD_ARR_READONLY;
        this.selectedTaxes = [];
        this.stockList = [];
        this.allKindOfTxns = false;
        this.showCreateAcModal = false;
        this.showCreateGroupModal = false;
        this.createAcCategory = null;
        this.countrySource = [];
        this.statesSource$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])([]);
        this.autoFillShipping = true;
        this.toggleFieldForSales = true;
        this.depositAmount = 0;
        this.depositAmountAfterUpdate = 0;
        this.giddhDateFormat = _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_17__["GIDDH_DATE_FORMAT"];
        this.giddhDateFormatUI = _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_17__["GIDDH_DATE_FORMAT_UI"];
        this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: false });
        // modals related
        this.modalConfig = {
            animated: true,
            keyboard: false,
            backdrop: 'static',
            ignoreBackdropClick: true
        };
        this.pageList = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VOUCHER_TYPE_LIST"];
        this.selectedPage = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VOUCHER_TYPE_LIST"][0].value;
        this.toggleActionText = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VOUCHER_TYPE_LIST"][0].value;
        this.moment = moment_moment__WEBPACK_IMPORTED_MODULE_5__;
        this.GIDDH_DATE_FORMAT = _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_17__["GIDDH_DATE_FORMAT"];
        this.selectedPageLabel = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VOUCHER_TYPE_LIST"][0].additional.label;
        this.isCustomerSelected = false;
        this.dropdownisOpen = false;
        this.stockTaxList = []; // New
        this.isFileUploading = false;
        this.selectedFileName = '';
        this.file = null;
        this.isSalesInvoice = true;
        this.invoiceDataFound = false;
        this.isUpdateDataInProcess = false;
        this.hsnDropdownShow = false;
        this.tdsTcsTaxTypes = ['tdsrc', 'tdspay', 'gstcess'];
        this.selectedSalesAccLabel = '';
        this.selectedEntry = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["SalesEntryClass"]();
        this.isMultiCurrencyAllowed = false;
        this.fetchedConvertedRate = 0;
        // private below
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        this.updateAccount = false;
        this.sundryDebtorsAcList = [];
        this.sundryCreditorsAcList = [];
        this.prdSerAcListForDeb = [];
        this.prdSerAcListForCred = [];
        this.store.dispatch(this._generalActions.getFlattenAccount());
        this.store.dispatch(this._settingsProfileActions.GetProfileInfo());
        this.invFormData = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VoucherClass"]();
        this.companyUniqueName$ = this.store.select(function (s) { return s.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.activeAccount$ = this.store.select(function (p) { return p.groupwithaccounts.activeAccount; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.store.dispatch(this.salesAction.resetAccountDetailsForSales());
        this.store.dispatch(this.companyActions.getTax());
        this.store.dispatch(this.ledgerActions.GetDiscountAccounts());
        this.newlyCreatedAc$ = this.store.select(function (p) { return p.groupwithaccounts.newlyCreatedAccount; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.newlyCreatedStockAc$ = this.store.select(function (p) { return p.sales.newlyCreatedStockAc; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.newlyCreatedServiceAc$ = this.store.select(function (p) { return p.sales.newlyCreatedServiceAc; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.flattenAccountListStream$ = this.store.select(function (p) { return p.general.flattenAccounts; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.voucherDetails$ = this.store.select(function (p) { return p.receipt.voucher; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.selectedAccountDetails$ = this.store.select(function (p) { return p.sales.acDtl; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.select(function (p) { return p.groupwithaccounts.createAccountIsSuccess; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.store.dispatch(this._invoiceActions.getInvoiceSetting());
        this.store.dispatch(this._settingsDiscountAction.GetDiscount());
        this.sessionKey$ = this.store.select(function (p) { return p.session.user.session.id; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.companyName$ = this.store.select(function (p) { return p.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.exceptTaxTypes = ['tdsrc', 'tdspay', 'tcspay', 'tcsrc'];
        // bind state sources
        this.store.select(function (p) { return p.general.states; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (states) {
            var arr = [];
            if (states) {
                states.map(function (d) {
                    arr.push({ label: "" + d.name, value: d.code });
                });
            }
            _this.statesSource$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(arr);
        });
    }
    SalesInvoiceComponent.prototype.openBulkModal = function (template) {
        this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'addBulkItemmodal ' }));
    };
    SalesInvoiceComponent.prototype.openModal = function (template) {
        this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg sales-invoice-modal' }));
    };
    SalesInvoiceComponent.prototype.ngOnDestroy = function () {
        this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
        this.store.dispatch(this._salesActions.createStockAcSuccess(null));
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    SalesInvoiceComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // fristElementToFocus to focus on customer search box
        setTimeout(function () {
            if (!_this.isCashInvoice) {
                if (_this.isPurchaseInvoice) {
                    if ($('.fristElementToFocus')[1]) {
                        $('.fristElementToFocus')[1].focus();
                    }
                }
                else {
                    if ($('.fristElementToFocus')[0]) {
                        $('.fristElementToFocus')[0].focus();
                    }
                }
            }
            else {
                _this.cashInvoiceInput.nativeElement.focus();
            }
        }, 200);
    };
    SalesInvoiceComponent.prototype.ngOnInit = function () {
        var _this = this;
        // this.getAllFlattenAc();
        this.invoiceNo = '';
        this.isUpdateMode = false;
        // get user country from his profile
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_7__["select"])(function (s) { return s.settings.profile; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (profile) {
            if (profile) {
                _this.companyCurrency = profile.baseCurrency || 'INR';
                _this.isMultiCurrencyAllowed = profile.isMultipleCurrency;
                _this.customerCountryName = profile.country;
            }
            else {
                _this.companyCurrency = 'INR';
                _this.isMultiCurrencyAllowed = false;
                _this.customerCountryName = 'INDIA';
            }
        });
        this.route.params.subscribe(function (parmas) {
            if (parmas['accUniqueName']) {
                _this.accountUniqueName = parmas['accUniqueName'];
                _this.isUpdateMode = false;
                _this.isCashInvoice = _this.accountUniqueName === 'cash';
                _this.isSalesInvoice = !_this.isCashInvoice;
                _this.getAccountDetails(parmas['accUniqueName']);
            }
            if (parmas['invoiceNo'] && parmas['accUniqueName'] && parmas['invoiceType']) {
                _this.accountUniqueName = parmas['accUniqueName'];
                _this.invoiceNo = parmas['invoiceNo'];
                _this.invoiceType = parmas['invoiceType'];
                _this.isUpdateMode = true;
                _this.isUpdateDataInProcess = true;
                var voucherType = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VOUCHER_TYPE_LIST"].find(function (f) { return f.value.toLowerCase() === _this.invoiceType; });
                _this.pageChanged(voucherType.value, voucherType.additional.label);
                _this.isCashInvoice = _this.accountUniqueName === 'cash';
                _this.isSalesInvoice = !_this.isCashInvoice;
                _this.store.dispatch(_this.invoiceReceiptActions.GetVoucherDetails(_this.accountUniqueName, {
                    invoiceNumber: _this.invoiceNo,
                    voucherType: _this.invoiceType
                }));
            }
            if (_this.isSalesInvoice || _this.isCashInvoice) {
                _this.exceptTaxTypes.push('InputGST');
                _this.exceptTaxTypes = _this.exceptTaxTypes.filter(function (ele) {
                    return ele !== 'GST';
                });
            }
            if (_this.isPurchaseInvoice) {
                _this.exceptTaxTypes.push('GST');
                _this.exceptTaxTypes = _this.exceptTaxTypes.filter(function (ele) {
                    return ele !== 'InputGST';
                });
            }
        });
        // get account details and set it to local var
        this.selectedAccountDetails$.subscribe(function (o) {
            if (o && !_this.isUpdateMode) {
                _this.assignValuesInForm(o);
            }
        });
        // get tax list and assign values to local vars
        this.store.select(function (p) { return p.company.taxes; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o) {
                _this.companyTaxesList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(o);
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["map"](_this.theadArrReadOnly, function (item) {
                    // show tax label
                    if (item.label === 'Tax') {
                        item.display = true;
                    }
                    return item;
                });
            }
            else {
                _this.companyTaxesList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])([]);
            }
        });
        this.createAccountIsSuccess$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            // if (o && this.accountAsideMenuState === 'in') {
            //   this.toggleAccountAsidePane();
            // }
        });
        // listen for universal date
        this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_19__["createSelector"])([function (p) { return p.session.applicationDate; }], function (dateObj) {
            if (dateObj) {
                try {
                    _this.universalDate = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["cloneDeep"](moment_moment__WEBPACK_IMPORTED_MODULE_5__(dateObj[1]).toDate());
                    if (!_this.isUpdateMode) {
                        _this.assignDates();
                    }
                }
                catch (e) {
                    _this.universalDate = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["cloneDeep"](new Date());
                }
            }
        })).subscribe();
        this.addBlankRow(null);
        this.store.select(Object(reselect__WEBPACK_IMPORTED_MODULE_19__["createSelector"])([function (s) { return s.invoice.settings; }], function (setting) {
            if (setting && setting.invoiceSettings) {
                var dueDate = moment_moment__WEBPACK_IMPORTED_MODULE_5__().add(setting.invoiceSettings.duePeriod, 'days');
                _this.useCustomInvoiceNumber = setting.invoiceSettings.useCustomInvoiceNumber;
                // if(!this.useCustomInvoiceNumber && setting.invoiceSettings.invoiceNumberPrefix && setting.invoiceSettings.initialInvoiceNumber  ) {
                //   this.invFormData.voucherDetails.voucherNumber = setting.invoiceSettings.invoiceNumberPrefix + "xxx"
                // }
                _this.invFormData.voucherDetails.dueDate = dueDate._d;
            }
        })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe();
        this.uploadInput = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.fileUploadOptions = { concurrency: 0 };
        // combine get voucher details && all flatten A/c's
        Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["combineLatest"])([this.flattenAccountListStream$, this.voucherDetails$, this.newlyCreatedAc$])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["auditTime"])(700))
            .subscribe(function (results) {
            // create mode because voucher details are not available
            if (results[0]) {
                // assign flatten A/c's
                var bankaccounts_1 = [];
                _this.sundryDebtorsAcList = [];
                _this.sundryCreditorsAcList = [];
                _this.prdSerAcListForDeb = [];
                _this.prdSerAcListForCred = [];
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["forEach"](results[0], function (item) {
                    if (_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["find"](item.parentGroups, function (o) { return o.uniqueName === 'sundrydebtors'; })) {
                        _this.sundryDebtorsAcList.push({ label: item.name, value: item.uniqueName, additional: item });
                    }
                    if (_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["find"](item.parentGroups, function (o) { return o.uniqueName === 'sundrycreditors'; })) {
                        _this.sundryCreditorsAcList.push({ label: item.name, value: item.uniqueName, additional: item });
                    }
                    // creating bank account list
                    if (_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["find"](item.parentGroups, function (o) { return o.uniqueName === 'bankaccounts' || o.uniqueName === 'cash'; })) {
                        bankaccounts_1.push({ label: item.name, value: item.uniqueName, additional: item });
                    }
                    if (_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["find"](item.parentGroups, function (o) { return o.uniqueName === 'otherincome' || o.uniqueName === 'revenuefromoperations'; })) {
                        if (item.stocks) {
                            // normal entry
                            _this.prdSerAcListForDeb.push({ value: item.uniqueName, label: item.name, additional: item });
                            // stock entry
                            item.stocks.map(function (as) {
                                _this.prdSerAcListForDeb.push({
                                    value: item.uniqueName + "#" + as.uniqueName,
                                    label: item.name + " (" + as.name + ")",
                                    additional: Object.assign({}, item, { stock: as })
                                });
                            });
                        }
                        else {
                            _this.prdSerAcListForDeb.push({ value: item.uniqueName, label: item.name, additional: item });
                        }
                    }
                    if (_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["find"](item.parentGroups, function (o) { return o.uniqueName === 'operatingcost' || o.uniqueName === 'indirectexpenses'; })) {
                        if (item.stocks) {
                            // normal entry
                            _this.prdSerAcListForCred.push({ value: item.uniqueName, label: item.name, additional: item });
                            // stock entry
                            item.stocks.map(function (as) {
                                _this.prdSerAcListForCred.push({
                                    value: item.uniqueName + "#" + as.uniqueName,
                                    label: item.name + " (" + as.name + ")",
                                    additional: Object.assign({}, item, { stock: as })
                                });
                            });
                        }
                        else {
                            _this.prdSerAcListForCred.push({ value: item.uniqueName, label: item.name, additional: item });
                        }
                    }
                });
                _this.makeCustomerList();
                if (_this.accountUniqueName) {
                    _this.customerAcList$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (data) {
                        if (data && data.length) {
                            var opt = data.find(function (f) { return f.value === _this.accountUniqueName; });
                            if (opt) {
                                _this.onSelectCustomer(opt);
                            }
                        }
                    });
                }
                bankaccounts_1 = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["orderBy"](bankaccounts_1, 'label');
                _this.bankAccounts$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(bankaccounts_1);
                // this.bankAccounts$.pipe(takeUntil(this.destroyed$)).subscribe((acc) => {
                // if (this.invFormData.accountDetails && !this.invFormData.accountDetails.uniqueName) {
                //   if (bankaccounts) {
                //     if (bankaccounts.length > 0) {
                //       this.invFormData.accountDetails.uniqueName = 'cash';
                //     } else if (bankaccounts.length === 1) {
                //       this.depositAccountUniqueName = 'cash';
                //     }
                //   }
                // }
                _this.depositAccountUniqueName = 'cash';
                // });
            }
            // update mode because voucher details is available
            if (results[0] && results[1]) {
                if (results[1].voucherDetails) {
                    var obj = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["cloneDeep"](results[1]);
                    var companyTaxes_1 = [];
                    _this.companyTaxesList$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (taxes) { return companyTaxes_1 = taxes; });
                    obj.voucherDetails.tempCustomerName = obj.voucherDetails.customerName;
                    if (obj.entries.length) {
                        obj.entries = obj.entries.map(function (entry, index) {
                            _this.activeIndx = index;
                            entry.otherTaxModal = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["SalesOtherTaxesModal"]();
                            entry.discounts = _this.parseDiscountFromResponse(entry);
                            entry.entryDate = moment_moment__WEBPACK_IMPORTED_MODULE_5__(entry.entryDate, _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_17__["GIDDH_DATE_FORMAT"]).toDate();
                            entry.transactions = entry.transactions.map(function (trx) {
                                entry.otherTaxModal.itemLabel = trx.stockDetails && trx.stockDetails.name ? trx.accountName + '(' + trx.stockDetails.name + ')' : trx.accountName;
                                var newTrxObj = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["SalesTransactionItemClass"]();
                                newTrxObj.accountName = trx.accountName;
                                newTrxObj.amount = trx.amount;
                                newTrxObj.description = trx.description;
                                newTrxObj.stockDetails = trx.stockDetails;
                                newTrxObj.hsnOrSac = trx.hsnNumber ? 'hsn' : 'sac';
                                newTrxObj.hsnNumber = trx.hsnNumber;
                                newTrxObj.sacNumber = trx.sacNumber;
                                newTrxObj.isStockTxn = trx.isStockTxn;
                                newTrxObj.taxableValue = trx.taxableValue;
                                // check if stock details is available then assign uniquename as we have done while creating option
                                if (trx.isStockTxn) {
                                    newTrxObj.accountUniqueName = trx.accountUniqueName + "#" + trx.stockDetails.uniqueName;
                                    newTrxObj.fakeAccForSelect2 = trx.accountUniqueName + "#" + trx.stockDetails.uniqueName;
                                    // stock unit assign process
                                    var flattenAccs = results[0];
                                    // get account from flatten account
                                    var selectedAcc = flattenAccs.find(function (d) {
                                        return (d.uniqueName === trx.accountUniqueName);
                                    });
                                    if (selectedAcc && selectedAcc.stocks && selectedAcc.stocks.length > 0) {
                                        // get stock from flatten account
                                        var stock = selectedAcc.stocks.find(function (s) { return s.uniqueName === trx.stockDetails.uniqueName; });
                                        if (stock) {
                                            var stockUnit = {
                                                id: stock.stockUnit.code,
                                                text: stock.stockUnit.name
                                            };
                                            newTrxObj.stockList = [];
                                            if (stock.accountStockDetails.unitRates.length) {
                                                newTrxObj.stockList = _this.prepareUnitArr(stock.accountStockDetails.unitRates);
                                            }
                                            else {
                                                newTrxObj.stockList.push(stockUnit);
                                            }
                                        }
                                    }
                                    newTrxObj.quantity = trx.quantity;
                                    newTrxObj.rate = trx.rate;
                                    newTrxObj.stockUnit = trx.stockUnit;
                                }
                                else {
                                    newTrxObj.accountUniqueName = trx.accountUniqueName;
                                    newTrxObj.fakeAccForSelect2 = trx.accountUniqueName;
                                }
                                return newTrxObj;
                            });
                            if (entry.tcsTaxList && entry.tcsTaxList.length) {
                                entry.isOtherTaxApplicable = true;
                                entry.otherTaxModal.tcsCalculationMethod = entry.tcsCalculationMethod;
                                var tax = companyTaxes_1.find(function (f) { return f.uniqueName === entry.tcsTaxList[0]; });
                                if (tax) {
                                    entry.otherTaxModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
                                }
                            }
                            else if (entry.tdsTaxList && entry.tdsTaxList.length) {
                                entry.isOtherTaxApplicable = true;
                                entry.otherTaxModal.tcsCalculationMethod = _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["SalesOtherTaxesCalculationMethodEnum"].OnTaxableAmount;
                                var tax = companyTaxes_1.find(function (f) { return f.uniqueName === entry.tdsTaxList[0]; });
                                if (tax) {
                                    entry.otherTaxModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
                                }
                            }
                            // get cess tax from taxList and assign it to other taxes modal and remove it from entryTaxList
                            entry.taxes = [];
                            entry.taxList.forEach(function (t) {
                                var tax = companyTaxes_1.find(function (f) { return f.uniqueName === t; });
                                if (tax) {
                                    // if (tax.taxType === 'gstcess') {
                                    //   entry.isOtherTaxApplicable = true;
                                    //   entry.otherTaxModal.appliedCessTaxes.push(tax.uniqueName);
                                    //   return false;
                                    // } else {
                                    var o = {
                                        name: tax.name,
                                        amount: tax.taxDetail[0].taxValue,
                                        uniqueName: tax.uniqueName,
                                        isChecked: false,
                                        type: tax.taxType,
                                        isDisabled: false
                                    };
                                    entry.taxes.push(o);
                                    // }
                                }
                            });
                            var tx = entry.transactions[0];
                            entry.taxSum = entry.taxes.reduce(function (pv, cv) { return (pv + cv.amount); }, 0);
                            entry.discountSum = _this.getDiscountSum(entry.discounts, tx.amount);
                            tx.taxableValue -= entry.discountSum;
                            tx.total = tx.getTransactionTotal(entry.taxSum, entry);
                            entry.otherTaxSum = 0;
                            entry.cessSum = 0;
                            return entry;
                        });
                    }
                    // Getting from api old data "depositEntry" so here updating key with "depositEntryToBeUpdated"
                    if (obj.depositEntry || obj.depositEntryToBeUpdated) {
                        if (obj.depositEntry) {
                            obj.depositEntryToBeUpdated = obj.depositEntry;
                            delete obj.depositEntry;
                        }
                        _this.depositAmountAfterUpdate = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["get"](obj.depositEntryToBeUpdated, 'transactions[0].amount', 0);
                        _this.depositAccountUniqueName = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["get"](obj.depositEntryToBeUpdated, 'transactions[0].particular.uniqueName', '');
                    }
                    if (obj.voucherDetails.voucherDate) {
                        obj.voucherDetails.voucherDate = moment_moment__WEBPACK_IMPORTED_MODULE_5__(obj.voucherDetails.voucherDate, 'DD-MM-YYYY').toDate();
                    }
                    if (obj.voucherDetails.dueDate) {
                        obj.voucherDetails.dueDate = moment_moment__WEBPACK_IMPORTED_MODULE_5__(obj.voucherDetails.dueDate, 'DD-MM-YYYY').toDate();
                    }
                    _this.isCustomerSelected = true;
                    _this.invoiceDataFound = true;
                    _this.invFormData = obj;
                }
                else {
                    _this.invoiceDataFound = false;
                }
                _this.isUpdateDataInProcess = false;
            }
            if (results[2]) {
                if (_this.accountAsideMenuState === 'in') {
                    var item = {
                        label: results[2].name,
                        value: results[2].uniqueName
                    };
                    _this.invFormData.voucherDetails.customerName = item.label;
                    _this.invFormData.voucherDetails.tempCustomerName = item.label;
                    _this.onSelectCustomer(item);
                    _this.isCustomerSelected = true;
                    _this.toggleAccountAsidePane();
                }
            }
        });
        // listen for newly added stock and newly added service account and assign value
        Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["combineLatest"])([this.newlyCreatedStockAc$, this.salesAccounts$, this.newlyCreatedServiceAc$]).subscribe(function (resp) {
            var o = resp[0];
            var acData = resp[1];
            var serviceAcData = resp[2];
            if (acData) {
                if (o) {
                    var result = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["find"](acData, function (item) { return item.additional.uniqueName === o.linkedAc && item.additional && item.additional.stock && item.additional.stock.uniqueName === o.uniqueName; });
                    if (result && !_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["isUndefined"](_this.entryIdx)) {
                        _this.invFormData.entries[_this.entryIdx].transactions[0].fakeAccForSelect2 = result.value;
                        _this.onSelectSalesAccount(result, _this.invFormData.entries[_this.entryIdx].transactions[0], _this.entryIdx, _this.invFormData.entries[_this.entryIdx]);
                        _this.store.dispatch(_this._salesActions.createStockAcSuccess(null));
                    }
                }
                if (serviceAcData) {
                    var result = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["find"](acData, function (item) { return item.value === serviceAcData.uniqueName; });
                    if (result && !_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["isUndefined"](_this.entryIdx)) {
                        _this.invFormData.entries[_this.entryIdx].transactions[0].fakeAccForSelect2 = result.value;
                        _this.onSelectSalesAccount(result, _this.invFormData.entries[_this.entryIdx].transactions[0], _this.entryIdx, _this.invFormData.entries[_this.entryIdx]);
                        _this.store.dispatch(_this._salesActions.createServiceAcSuccess(null));
                    }
                }
            }
        });
        if (this.selectedPage === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VOUCHER_TYPE_LIST"][0].value || this.selectedPage === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VOUCHER_TYPE_LIST"][1].value) {
            this.tdsTcsTaxTypes = ['tcspay', 'tcsrc'];
        }
        else {
            this.tdsTcsTaxTypes = ['tdspay', 'tdsrc'];
        }
    };
    SalesInvoiceComponent.prototype.assignDates = function () {
        // let o = _.cloneDeep(this.invFormData);
        var date = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["cloneDeep"](this.universalDate) || _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["cloneDeep"](new Date());
        this.invFormData.voucherDetails.voucherDate = date;
        this.invFormData.entries = this.invFormData.entries.map(function (entry) {
            entry.transactions = entry.transactions.map(function (txn) {
                if (!txn.accountUniqueName) {
                    entry.entryDate = date;
                }
                return txn;
            });
            return entry;
        });
    };
    SalesInvoiceComponent.prototype.makeCustomerList = function () {
        // sales case || Credit Note
        if (this.selectedPage === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VOUCHER_TYPE_LIST"][0].value || this.selectedPage === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VOUCHER_TYPE_LIST"][1].value) {
            this.customerAcList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["orderBy"](this.sundryDebtorsAcList, 'label'));
            this.salesAccounts$.next(_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["orderBy"](this.prdSerAcListForDeb, 'label'));
        }
        else if (this.selectedPage === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VOUCHER_TYPE_LIST"][2].value || _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VOUCHER_TYPE_LIST"][3].value) {
            this.customerAcList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["orderBy"](this.sundryCreditorsAcList, 'label'));
            this.salesAccounts$.next(_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["orderBy"](this.prdSerAcListForCred, 'label'));
        }
    };
    SalesInvoiceComponent.prototype.pageChanged = function (val, label) {
        var _this = this;
        this.showAnimation = true;
        this.selectedPage = val;
        this.selectedPageLabel = label;
        this.isSalesInvoice = this.selectedPage === 'Sales';
        this.isPurchaseInvoice = this.selectedPage === 'Purchase';
        this.isCreditNote = this.selectedPage === 'Credit Note';
        this.isDebitNote = this.selectedPage === 'Debit Note';
        this.isCashInvoice = false;
        this.makeCustomerList();
        this.toggleFieldForSales = (!(this.selectedPage === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VOUCHER_TYPE_LIST"][2].value || this.selectedPage === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VOUCHER_TYPE_LIST"][1].value));
        if (this.selectedPage === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VOUCHER_TYPE_LIST"][0].value || this.selectedPage === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VOUCHER_TYPE_LIST"][1].value) {
            this.tdsTcsTaxTypes = ['tcspay', 'tcsrc', 'gstcess'];
        }
        else {
            this.tdsTcsTaxTypes = ['tdspay', 'tdsrc', 'gstcess'];
        }
        // for auto focus on inputbox when change current page
        setTimeout(function () {
            if (!_this.isCashInvoice) {
                if (_this.isPurchaseInvoice) {
                    if ($('.fristElementToFocus')[1]) {
                        $('.fristElementToFocus')[1].focus();
                    }
                }
                else {
                    if ($('.fristElementToFocus')[0]) {
                        $('.fristElementToFocus')[0].focus();
                    }
                }
            }
            else {
                _this.cashInvoiceInput.nativeElement.focus();
            }
        }, 200);
        setTimeout(function () {
            _this.showAnimation = false;
        }, 1000);
        // this.toggleActionText = this.selectedPage;
    };
    SalesInvoiceComponent.prototype.getAllFlattenAc = function () {
        // call to get flatten account from store
        this.store.dispatch(this._generalActions.getFlattenAccount());
        // this.store.dispatch(this.salesAction.storeSalesFlattenAc(_.orderBy(accountsArray, 'text')));
    };
    SalesInvoiceComponent.prototype.assignValuesInForm = function (data) {
        // toggle all collapse
        this.isGenDtlCollapsed = false;
        this.isMlngAddrCollapsed = false;
        this.isOthrDtlCollapsed = false;
        this.customerCountryName = data.country ? data.country.countryName : 'India';
        // auto fill all the details
        this.invFormData.accountDetails = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["AccountDetailsClass"](data);
    };
    SalesInvoiceComponent.prototype.getStateCode = function (type, statesEle) {
        var _this = this;
        var gstVal = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["cloneDeep"](this.invFormData.accountDetails[type].gstNumber);
        if (gstVal.length >= 2) {
            this.statesSource$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (st) {
                var s = st.find(function (item) { return item.value === gstVal.substr(0, 2); });
                if (s) {
                    _this.invFormData.accountDetails[type].stateCode = s.value;
                }
                else {
                    _this.invFormData.accountDetails[type].stateCode = null;
                    _this._toasty.clearAllToaster();
                    _this._toasty.warningToast('Invalid GSTIN.');
                }
                statesEle.disabled = true;
            });
        }
        else {
            statesEle.disabled = false;
            this.invFormData.accountDetails[type].stateCode = null;
        }
    };
    SalesInvoiceComponent.prototype.resetInvoiceForm = function (f) {
        f.form.reset();
        if (this.allShSelect) {
            this.allShSelect.forEach(function (sh) {
                sh.clear();
            });
        }
        if (this.allSalesShSelect) {
            this.allSalesShSelect.forEach(function (ssh) {
                ssh.clear();
            });
        }
        this.invFormData = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["VoucherClass"]();
        this.typeaheadNoResultsOfCustomer = false;
        // toggle all collapse
        this.isGenDtlCollapsed = true;
        this.isMlngAddrCollapsed = true;
        this.isOthrDtlCollapsed = false;
        this.forceClear$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])({ status: true });
        this.isCustomerSelected = false;
        this.selectedFileName = '';
    };
    SalesInvoiceComponent.prototype.triggerSubmitInvoiceForm = function (f, isUpdate) {
        this.updateAccount = isUpdate;
        this.onSubmitInvoiceForm(f);
    };
    SalesInvoiceComponent.prototype.autoFillShippingDetails = function () {
        // auto fill shipping address
        if (this.autoFillShipping) {
            this.invFormData.accountDetails.shippingDetails = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["cloneDeep"](this.invFormData.accountDetails.billingDetails);
        }
    };
    SalesInvoiceComponent.prototype.convertDateForAPI = function (val) {
        if (val) {
            try {
                return moment_moment__WEBPACK_IMPORTED_MODULE_5__(val).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_17__["GIDDH_DATE_FORMAT"]);
            }
            catch (error) {
                return '';
            }
        }
        else {
            return '';
        }
    };
    SalesInvoiceComponent.prototype.onSubmitInvoiceForm = function (f) {
        var _this = this;
        var data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["cloneDeep"](this.invFormData);
        if (data.accountDetails.billingDetails.gstNumber) {
            if (!this.isValidGstIn(data.accountDetails.billingDetails.gstNumber)) {
                this._toasty.errorToast('Invalid gst no in Billing Address! Please fix and try again');
                return;
            }
            if (!this.autoFillShipping) {
                if (!this.isValidGstIn(data.accountDetails.shippingDetails.gstNumber)) {
                    this._toasty.errorToast('Invalid gst no in Shipping Address! Please fix and try again');
                    return;
                }
            }
        }
        if (this.isSalesInvoice || this.isPurchaseInvoice) {
            if (moment_moment__WEBPACK_IMPORTED_MODULE_5__(data.voucherDetails.dueDate, 'DD-MM-YYYY').isBefore(moment_moment__WEBPACK_IMPORTED_MODULE_5__(data.voucherDetails.voucherDate, 'DD-MM-YYYY'), 'd')) {
                this._toasty.errorToast('Due date cannot be less than Invoice Date');
                return;
            }
        }
        else {
            delete data.voucherDetails.dueDate;
        }
        data.entries = data.entries.filter(function (entry, indx) {
            if (!entry.transactions[0].accountUniqueName && indx !== 0) {
                _this.invFormData.entries.splice(indx, 1);
            }
            return entry.transactions[0].accountUniqueName;
        });
        // filter active discounts
        data.entries = data.entries.map(function (entry) {
            entry.discounts = entry.discounts.filter(function (dis) { return dis.isActive; });
            return entry;
        });
        var txnErr;
        // before submit request making some validation rules
        // check for account uniqueName
        if (data.accountDetails) {
            if (!data.accountDetails.uniqueName) {
                if (this.typeaheadNoResultsOfCustomer) {
                    this._toasty.warningToast('Need to select Bank/Cash A/c or Customer Name');
                }
                else {
                    this._toasty.warningToast('Customer Name can\'t be empty');
                }
                return;
            }
            if (data.accountDetails.email) {
                if (!apps_web_giddh_src_app_shared_helpers_universalValidations__WEBPACK_IMPORTED_MODULE_20__["EMAIL_REGEX_PATTERN"].test(data.accountDetails.email)) {
                    this._toasty.warningToast('Invalid Email Address.');
                    return;
                }
            }
        }
        // replace /n to br for (shipping and billing)
        if (data.accountDetails.shippingDetails.address && data.accountDetails.shippingDetails.address.length && data.accountDetails.shippingDetails.address[0].length > 0) {
            data.accountDetails.shippingDetails.address[0] = data.accountDetails.shippingDetails.address[0].replace(/\n/g, '<br />');
            data.accountDetails.shippingDetails.address = data.accountDetails.shippingDetails.address[0].split('<br />');
        }
        if (data.accountDetails.billingDetails.address && data.accountDetails.billingDetails.address.length && data.accountDetails.billingDetails.address[0].length > 0) {
            data.accountDetails.billingDetails.address[0] = data.accountDetails.billingDetails.address[0].replace(/\n/g, '<br />');
            data.accountDetails.billingDetails.address = data.accountDetails.billingDetails.address[0].split('<br />');
        }
        // convert date object
        data.voucherDetails.voucherDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        data.voucherDetails.dueDate = this.convertDateForAPI(data.voucherDetails.dueDate);
        data.templateDetails.other.shippingDate = this.convertDateForAPI(data.templateDetails.other.shippingDate);
        // check for valid entries and transactions
        if (data.entries) {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["forEach"](data.entries, function (entry) {
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["forEach"](entry.transactions, function (txn) {
                    // convert date object
                    // txn.date = this.convertDateForAPI(txn.date);
                    entry.entryDate = _this.convertDateForAPI(entry.entryDate);
                    txn.convertedAmount = _this.fetchedConvertedRate > 0 ? Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_34__["giddhRoundOff"])((Number(txn.amount) * _this.fetchedConvertedRate), 2) : 0;
                    // will get errors of string and if not error then true boolean
                    if (!txn.isValid()) {
                        _this._toasty.warningToast('Product/Service can\'t be empty');
                        txnErr = true;
                        return false;
                    }
                    else {
                        txnErr = false;
                    }
                });
            });
        }
        else {
            this._toasty.warningToast('At least a single entry needed to generate Invoice');
            return;
        }
        // if txn has errors
        if (txnErr) {
            return false;
        }
        // set voucher type
        data.entries = data.entries.map(function (entry) {
            entry.voucherType = _this.pageList.find(function (p) { return p.value === _this.selectedPage; }).label;
            entry.taxList = entry.taxes.map(function (m) { return m.uniqueName; }).slice();
            entry.tcsCalculationMethod = entry.otherTaxModal.tcsCalculationMethod;
            if (entry.isOtherTaxApplicable) {
                entry.taxList.push(entry.otherTaxModal.appliedOtherTax.uniqueName);
            }
            if (entry.otherTaxType === 'tds') {
                delete entry['tcsCalculationMethod'];
            }
            return entry;
        });
        var obj = {
            voucher: data,
            updateAccountDetails: this.updateAccount
        };
        if (this.depositAmount && this.depositAmount > 0) {
            obj.paymentAction = {
                action: 'paid',
                amount: this.depositAmount + this.depositAmountAfterUpdate
            };
            if (this.isCustomerSelected) {
                obj.depositAccountUniqueName = this.depositAccountUniqueName;
            }
            else {
                obj.depositAccountUniqueName = data.accountDetails.uniqueName;
            }
        }
        else {
            obj.depositAccountUniqueName = '';
        }
        // set voucher type
        obj.voucher.voucherDetails.voucherType = this.selectedPage;
        this.salesService.generateGenericItem(obj).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$)).subscribe(function (response) {
            if (response.status === 'success') {
                // reset form and other
                _this.resetInvoiceForm(f);
                if (typeof response.body === 'string') {
                    _this._toasty.successToast(response.body);
                }
                else {
                    if (_this.isPurchaseInvoice) {
                        _this._toasty.successToast('Voucher Generated Successfully');
                        _this.voucherNumber = response.body.voucherDetails.voucherNumber;
                        _this.postResponseAction();
                    }
                    else {
                        try {
                            _this._toasty.successToast("Entry created successfully with Voucher Number: " + response.body.voucherDetails.voucherNumber);
                            // don't know what to do about this line
                            // this.router.navigate(['/pages', 'invoice', 'preview']);
                            _this.voucherNumber = response.body.voucherDetails.voucherNumber;
                            _this.postResponseAction();
                        }
                        catch (error) {
                            _this._toasty.successToast('Voucher Generated Successfully');
                        }
                    }
                }
                _this.depositAccountUniqueName = '';
                _this.depositAmount = 0;
            }
            else {
                _this._toasty.errorToast(response.message, response.code);
            }
            _this.updateAccount = false;
        });
    };
    SalesInvoiceComponent.prototype.onNoResultsClicked = function (idx) {
        if (_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["isUndefined"](idx)) {
            this.getAllFlattenAc();
        }
        else {
            this.entryIdx = idx;
        }
        this.asideMenuStateForProductService = this.asideMenuStateForProductService === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    SalesInvoiceComponent.prototype.toggleBodyClass = function () {
        if (this.asideMenuStateForProductService === 'in' || this.accountAsideMenuState === 'in' || this.asideMenuStateForRecurringEntry === 'in'
            || this.asideMenuStateForOtherTaxes === 'in') {
            document.querySelector('body').classList.add('fixed');
        }
        else {
            document.querySelector('body').classList.remove('fixed');
        }
    };
    /**
     * checkForInfinity
     * @returns {number} always
     */
    SalesInvoiceComponent.prototype.checkForInfinity = function (value) {
        return (value === Infinity) ? 0 : value;
    };
    /**
     * generate total discount amount
     * @returns {number}
     */
    SalesInvoiceComponent.prototype.generateTotalDiscount = function (list) {
        return list.filter(function (l) { return l.isActive; }).reduce(function (pv, cv) {
            return cv.amount ? pv + cv.amount : pv;
        }, 0);
    };
    /**
     * generate total taxable value
     * @returns {number}
     */
    SalesInvoiceComponent.prototype.generateTotalTaxableValue = function (txns) {
        var _this = this;
        var res = 0;
        _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["forEach"](txns, function (txn) {
            res += _this.checkForInfinity(txn.taxableValue);
        });
        return res;
    };
    /**
     * generate total tax amount
     * @returns {number}
     */
    SalesInvoiceComponent.prototype.generateTotalTaxAmount = function (entry, isCess) {
        if (isCess === void 0) { isCess = false; }
        var taxes = entry.taxes;
        var totalApplicableTax = 0;
        var taxableValue = 0;
        if (isCess) {
            taxes = taxes.filter(function (f) { return f.type === 'gstcess'; });
        }
        else {
            taxes = taxes.filter(function (f) { return f.type !== 'gstcess'; });
        }
        totalApplicableTax = taxes.reduce(function (pv, cv) {
            return pv + cv.amount;
        }, 0);
        taxableValue = entry.transactions.reduce(function (pv, cv) { return (cv.taxableValue); }, 0);
        return ((taxableValue * totalApplicableTax) / 100) || 0;
    };
    /**
     * generate total amounts of entries
     * @returns {number}
     */
    SalesInvoiceComponent.prototype.generateTotalAmount = function (txns) {
        var _this = this;
        var res = 0;
        _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["forEach"](txns, function (txn) {
            if (txn.quantity && txn.rate) {
                res += _this.checkForInfinity(txn.rate) * _this.checkForInfinity(txn.quantity);
            }
            else {
                res += Number(_this.checkForInfinity(txn.amount));
            }
        });
        return res;
    };
    /**
     * generate grand total
     * @returns {number}
     */
    SalesInvoiceComponent.prototype.generateGrandTotal = function (txns) {
        return txns.reduce(function (pv, cv) {
            return cv.total ? pv + cv.total : pv;
        }, 0);
    };
    SalesInvoiceComponent.prototype.txnChangeOccurred = function (disc) {
        var _this = this;
        if (disc) {
            disc.change();
        }
        var DISCOUNT = 0;
        var GST_TAX = 0;
        var AMOUNT = 0;
        var TAXABLE_VALUE = 0;
        var GRAND_TOTAL = 0;
        var TCS_TOTAL = 0;
        var TDS_TOTAL = 0;
        var CESS = 0;
        setTimeout(function () {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["forEach"](_this.invFormData.entries, function (entry, index) {
                // get discount
                DISCOUNT += Number(entry.discountSum);
                // get total amount of entries
                AMOUNT += Number(_this.generateTotalAmount(entry.transactions));
                // get taxable value
                TAXABLE_VALUE += Number(_this.generateTotalTaxableValue(entry.transactions));
                // generate total tax amount
                GST_TAX += Number(_this.generateTotalTaxAmount(entry));
                CESS += Number(_this.generateTotalTaxAmount(entry, true));
                if (entry.isOtherTaxApplicable) {
                    _this.calculateOtherTaxes(entry.otherTaxModal, index);
                }
                TCS_TOTAL += entry.otherTaxType === 'tcs' ? entry.otherTaxSum : 0;
                TDS_TOTAL += entry.otherTaxType === 'tds' ? entry.otherTaxSum : 0;
                // generate Grand Total
                GRAND_TOTAL += Number(_this.generateGrandTotal(entry.transactions));
            });
            _this.invFormData.voucherDetails.subTotal = Number(AMOUNT);
            _this.invFormData.voucherDetails.totalDiscount = Number(DISCOUNT);
            _this.invFormData.voucherDetails.totalTaxableValue = Number(TAXABLE_VALUE);
            _this.invFormData.voucherDetails.gstTaxesTotal = Number(GST_TAX);
            _this.invFormData.voucherDetails.cessTotal = Number(CESS);
            _this.invFormData.voucherDetails.tcsTotal = Number(TCS_TOTAL);
            _this.invFormData.voucherDetails.tdsTotal = Number(TDS_TOTAL);
            _this.invFormData.voucherDetails.grandTotal = Number(GRAND_TOTAL);
            // due amount
            _this.invFormData.voucherDetails.balanceDue = Number((GRAND_TOTAL + TCS_TOTAL) - (TDS_TOTAL)) - Number(_this.depositAmountAfterUpdate);
            if (_this.depositAmount) {
                _this.invFormData.voucherDetails.balanceDue = Number((GRAND_TOTAL + TCS_TOTAL) - (TDS_TOTAL)) - Number(_this.depositAmount) - Number(_this.depositAmountAfterUpdate);
            }
        }, 700);
    };
    SalesInvoiceComponent.prototype.onSelectSalesAccount = function (selectedAcc, txn, entryIdx, entry) {
        var _this = this;
        if (selectedAcc.value && selectedAcc.additional.uniqueName) {
            var itm_1 = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["cloneDeep"](selectedAcc.additional);
            this.salesAccounts$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (idata) {
                idata.map(function (fa) {
                    if (fa.value === selectedAcc.value) {
                        _this.accountService.GetAccountDetailsV2(selectedAcc.additional.uniqueName).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(_this.destroyed$)).subscribe(function (data) {
                            if (data.status === 'success') {
                                var o = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["cloneDeep"](data.body);
                                txn.applicableTaxes = [];
                                txn.sku_and_customfields = null;
                                // description with sku and custom fields
                                if ((itm_1.stock) && (_this.isCashInvoice || _this.isSalesInvoice || _this.isPurchaseInvoice)) {
                                    var description = [];
                                    var skuCodeHeading = itm_1.stock.skuCodeHeading ? itm_1.stock.skuCodeHeading : 'SKU Code';
                                    if (itm_1.stock.skuCode) {
                                        description.push(skuCodeHeading + ':' + itm_1.stock.skuCode);
                                    }
                                    var customField1Heading = itm_1.stock.customField1Heading ? itm_1.stock.customField1Heading : 'Custom field 1';
                                    if (itm_1.stock.customField1Value) {
                                        description.push(customField1Heading + ':' + itm_1.stock.customField1Value);
                                    }
                                    var customField2Heading = itm_1.stock.customField2Heading ? itm_1.stock.customField2Heading : 'Custom field 2';
                                    if (itm_1.stock.customField2Value) {
                                        description.push(customField2Heading + ':' + itm_1.stock.customField2Value);
                                    }
                                    txn.sku_and_customfields = description.join(', ');
                                }
                                //------------------------
                                txn.quantity = null;
                                entry.otherTaxModal.itemLabel = fa.label;
                                if (selectedAcc.additional.stock && selectedAcc.additional.stock.stockTaxes) {
                                    var companyTaxes_2 = [];
                                    _this.companyTaxesList$.subscribe(function (taxes) { return companyTaxes_2 = taxes; });
                                    selectedAcc.additional.currency = selectedAcc.additional.currency || _this.companyCurrency;
                                    selectedAcc.additional.stock.stockTaxes.forEach(function (t) {
                                        var tax = companyTaxes_2.find(function (f) { return f.uniqueName === t; });
                                        if (tax) {
                                            switch (tax.taxType) {
                                                case 'tcsrc':
                                                case 'tcspay':
                                                case 'tdsrc':
                                                case 'tdspay':
                                                    entry.otherTaxModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
                                                    break;
                                                default:
                                                    txn.applicableTaxes.push(t);
                                            }
                                        }
                                    });
                                    // txn.applicableTaxes = selectedAcc.additional.stock.stockTaxes;
                                }
                                if (entry.otherTaxModal.appliedOtherTax && entry.otherTaxModal.appliedOtherTax.uniqueName) {
                                    entry.isOtherTaxApplicable = true;
                                }
                                txn.accountName = o.name;
                                txn.accountUniqueName = o.uniqueName;
                                // if (o.hsnNumber) {
                                //   txn.hsnNumber = o.hsnNumber;
                                //   txn.hsnOrSac = 'hsn';
                                // } else {
                                //   txn.hsnNumber = null;
                                // }
                                // if (o.sacNumber) {
                                //   txn.sacNumber = o.sacNumber;
                                //   txn.hsnOrSac = 'sac';
                                // } else {
                                //   txn.sacNumber = null;
                                // }
                                if (o.stocks || (selectedAcc.additional && selectedAcc.additional.stock)) {
                                    // console.log('stockUnit..',selectedAcc.additional);
                                    // set rate auto
                                    txn.rate = null;
                                    var obj = {
                                        id: selectedAcc.additional.stock.stockUnit.code,
                                        text: selectedAcc.additional.stock.stockUnit.name
                                    };
                                    txn.stockList = [];
                                    if (selectedAcc.additional.stock && selectedAcc.additional.stock.accountStockDetails.unitRates.length) {
                                        txn.stockList = _this.prepareUnitArr(selectedAcc.additional.stock.accountStockDetails.unitRates);
                                        txn.stockUnit = txn.stockList[0].id;
                                        txn.rate = txn.stockList[0].rate;
                                    }
                                    else {
                                        txn.stockList.push(obj);
                                        if (selectedAcc.additional.stock.accountStockDetails && selectedAcc.additional.stock.accountStockDetails.unitRates && selectedAcc.additional.stock.accountStockDetails.unitRates.length > 0) {
                                            txn.rate = selectedAcc.additional.stock.accountStockDetails.unitRates[0].rate;
                                        }
                                        txn.stockUnit = selectedAcc.additional.stock.stockUnit.code;
                                    }
                                    txn.stockDetails = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["omit"](selectedAcc.additional.stock, ['accountStockDetails', 'stockUnit']);
                                    txn.isStockTxn = true;
                                }
                                else {
                                    txn.isStockTxn = false;
                                    txn.stockUnit = null;
                                    txn.stockDetails = null;
                                    txn.stockList = [];
                                    // reset fields
                                    txn.rate = null;
                                    txn.quantity = null;
                                    txn.amount = null;
                                    txn.taxableValue = null;
                                }
                                // toggle stock related fields
                                _this.toggleStockFields(txn);
                                txn.sacNumber = null;
                                txn.hsnNumber = null;
                                if (txn.stockDetails && txn.stockDetails.hsnNumber) {
                                    txn.hsnNumber = txn.stockDetails.hsnNumber;
                                    txn.hsnOrSac = 'hsn';
                                }
                                if (txn.stockDetails && txn.stockDetails.sacNumber) {
                                    txn.sacNumber = txn.stockDetails.sacNumber;
                                    txn.hsnOrSac = 'sac';
                                }
                                if (!selectedAcc.additional.stock && o.hsnNumber) {
                                    txn.hsnNumber = o.hsnNumber;
                                    txn.hsnOrSac = 'hsn';
                                }
                                if (!selectedAcc.additional.stock && o.sacNumber) {
                                    txn.sacNumber = o.sacNumber;
                                    txn.hsnOrSac = 'sac';
                                }
                                return txn;
                            }
                            else {
                                txn.isStockTxn = false;
                                _this.toggleStockFields(txn);
                            }
                        });
                    }
                    else {
                        txn.isStockTxn = false;
                        _this.toggleStockFields(txn);
                    }
                });
            });
            if (selectedAcc.additional.stock) {
                if (selectedAcc.additional.stock.stockTaxes && selectedAcc.additional.stock.stockTaxes.length) {
                    this.stockTaxList = selectedAcc.additional.stock.stockTaxes;
                }
                else {
                    this.stockTaxList = [];
                }
            }
            else if (selectedAcc.additional.parentGroups && selectedAcc.additional.parentGroups.length) {
                var parentAcc = selectedAcc.additional.parentGroups[0].uniqueName;
                var incomeAccArray = ['revenuefromoperations', 'otherincome'];
                var expensesAccArray = ['operatingcost', 'indirectexpenses'];
                var incomeAndExpensesAccArray = incomeAccArray.concat(expensesAccArray);
                if (incomeAndExpensesAccArray.indexOf(parentAcc) > -1) {
                    var appTaxes_1 = [];
                    this.activeAccount$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (acc) {
                        if (acc && acc.applicableTaxes) {
                            acc.applicableTaxes.forEach(function (app) { return appTaxes_1.push(app.uniqueName); });
                            _this.stockTaxList = appTaxes_1;
                        }
                    });
                }
            }
            else {
                this.stockTaxList = [];
            }
        }
        else {
            txn.isStockTxn = false;
            this.toggleStockFields(txn);
            txn.amount = null;
            txn.accountName = null;
            txn.accountUniqueName = null;
            txn.hsnOrSac = 'hsn';
            txn.total = null;
            txn.rate = null;
            txn.sacNumber = null;
            txn.taxableValue = 0;
            txn.applicableTaxes = [];
            return txn;
        }
        this.selectedAcc = true;
    };
    SalesInvoiceComponent.prototype.onClearSalesAccount = function (txn) {
        txn.applicableTaxes = [];
        txn.quantity = null;
        txn.isStockTxn = false;
        txn.stockUnit = null;
        txn.stockDetails = null;
        txn.stockList = [];
        txn.rate = null;
        txn.quantity = null;
        txn.amount = null;
        txn.taxableValue = null;
        txn.sacNumber = null;
        txn.hsnNumber = null;
    };
    SalesInvoiceComponent.prototype.toggleStockFields = function (txn) {
        var _this = this;
        var breakFunc = false;
        // check if any transaction is stockTxn then return false
        if (this.invFormData.entries.length > 1) {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["forEach"](this.invFormData.entries, function (entry) {
                var idx = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["findIndex"](entry.transactions, { isStockTxn: true });
                if (idx !== -1) {
                    _this.allKindOfTxns = true;
                    breakFunc = true;
                    return false;
                }
                else {
                    breakFunc = false;
                    _this.allKindOfTxns = false;
                }
            });
        }
        if (breakFunc) {
            // show all optional labels due to all kind of txn
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["map"](this.theadArrOpt, function (item) {
                item.display = breakFunc;
            });
        }
        else {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["map"](this.theadArrOpt, function (item) {
                // show labels related to stock entry
                if (_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["indexOf"](STOCK_OPT_FIELDS, item.label) !== -1) {
                    item.display = txn.isStockTxn;
                }
                // hide amount label
                if (item.label === 'Amount') {
                    item.display = !txn.isStockTxn;
                }
                return item;
            });
        }
    };
    SalesInvoiceComponent.prototype.noResultsForCustomer = function (e) {
        this.typeaheadNoResultsOfCustomer = e;
    };
    SalesInvoiceComponent.prototype.onSelectCustomer = function (item) {
        var _this = this;
        this.typeaheadNoResultsOfCustomer = false;
        if (item.value) {
            this.invFormData.voucherDetails.customerName = item.label;
            this.getAccountDetails(item.value);
            this.isCustomerSelected = true;
            this.invFormData.accountDetails.name = '';
            if (item.additional && item.additional.currency && item.additional.currency !== this.companyCurrency && this.isMultiCurrencyAllowed) {
                this._ledgerService.GetCurrencyRate(this.companyCurrency, item.additional.currency)
                    .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (err) {
                    _this.fetchedConvertedRate = 0;
                    return err;
                }))
                    .subscribe(function (res) {
                    var rate = res.body;
                    if (rate) {
                        _this.fetchedConvertedRate = rate;
                    }
                }, (function (error1) {
                    _this.fetchedConvertedRate = 0;
                }));
            }
        }
    };
    SalesInvoiceComponent.prototype.onSelectBankCash = function (item) {
        if (item.value) {
            this.invFormData.accountDetails.name = item.label;
            this.getAccountDetails(item.value);
        }
    };
    SalesInvoiceComponent.prototype.getAccountDetails = function (accountUniqueName) {
        this.store.dispatch(this.salesAction.getAccountDetailsForSales(accountUniqueName));
    };
    SalesInvoiceComponent.prototype.toggleAccountAsidePane = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    SalesInvoiceComponent.prototype.toggleRecurringAsidePane = function (toggle) {
        if (toggle) {
            if (toggle === 'out' && this.asideMenuStateForRecurringEntry !== 'out') {
                this.router.navigate(['/pages', 'invoice', 'recurring']);
            }
            this.asideMenuStateForRecurringEntry = toggle;
        }
        else {
            this.asideMenuStateForRecurringEntry = this.asideMenuStateForRecurringEntry === 'out' ? 'in' : 'out';
        }
        this.toggleBodyClass();
    };
    SalesInvoiceComponent.prototype.toggleOtherTaxesAsidePane = function (modalBool, index, isClosing) {
        if (index === void 0) { index = null; }
        if (isClosing === void 0) { isClosing = false; }
        if (!modalBool) {
            this.selectedSalesAccLabel = '';
            var entry = this.invFormData.entries[this.activeIndx];
            if (entry) {
                entry.otherTaxModal = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["SalesOtherTaxesModal"]();
                entry.otherTaxSum = 0;
            }
            return;
        }
        else {
            if (index !== null) {
                this.selectedEntry = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["cloneDeep"])(this.invFormData.entries[index]);
            }
        }
        if (isClosing) {
            this.selectedSalesAccLabel = '';
        }
        this.asideMenuStateForOtherTaxes = this.asideMenuStateForOtherTaxes === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    };
    SalesInvoiceComponent.prototype.addBlankRow = function (txn) {
        var _this = this;
        if (!txn) {
            var entry = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["SalesEntryClass"]();
            if (this.isUpdateMode) {
                entry.entryDate = this.invFormData.entries[0] ? this.invFormData.entries[0].entryDate : this.universalDate || new Date();
                entry.isNewEntryInUpdateMode = true;
            }
            else {
                entry.entryDate = this.universalDate || new Date();
            }
            this.invFormData.entries.push(entry);
            this.activeIndx = ++this.activeIndx || 0;
        }
        else {
            // if transaction is valid then add new row else show toasty
            if (!txn.isValid()) {
                this._toasty.warningToast('Product/Service can\'t be empty');
                return;
            }
            var entry = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["SalesEntryClass"]();
            this.invFormData.entries.push(entry);
            setTimeout(function () {
                _this.activeIndx = _this.invFormData.entries.length ? _this.invFormData.entries.length - 1 : 0;
            }, 10);
        }
    };
    SalesInvoiceComponent.prototype.removeTransaction = function (entryIdx) {
        if (this.invFormData.entries.length > 1) {
            // (this.invFormData as any).transfers = _.remove(this.invFormData.entries, (entry, index) => {
            //   return index !== entryIdx;
            // });
            this.invFormData.entries.splice(entryIdx, 1);
        }
        else {
            this._toasty.warningToast('Unable to delete a single transaction');
        }
    };
    SalesInvoiceComponent.prototype.taxAmountEvent = function (tax) {
        if (!this.activeIndx && this.activeIndx !== 0) {
            return;
        }
        var entry = this.invFormData.entries[this.activeIndx];
        if (!entry) {
            return;
        }
        var txn = entry.transactions[0];
        txn.total = Number(txn.getTransactionTotal(tax, entry));
        this.txnChangeOccurred();
        entry.taxSum = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["sumBy"](entry.taxes, function (o) {
            return o.amount;
        });
        entry.cessSum = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["sumBy"]((entry.taxes), function (o) {
            return o.type === 'gstcess' ? o.amount : 0;
        });
    };
    SalesInvoiceComponent.prototype.selectedTaxEvent = function (arr) {
        var entry = this.invFormData.entries[this.activeIndx];
        if (!entry) {
            return;
        }
        this.selectedTaxes = arr;
        // entry.taxList = arr;
        entry.taxes = [];
        if (this.selectedTaxes.length > 0) {
            this.companyTaxesList$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (data) {
                data.map(function (item) {
                    if (_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["indexOf"](arr, item.uniqueName) !== -1 && item.accounts.length > 0) {
                        var o = {
                            // accountName: item.accounts[0].name,
                            // accountUniqueName: item.accounts[0].uniqueName,
                            // rate: item.taxDetail[0].taxValue,
                            name: item.name,
                            amount: item.taxDetail[0].taxValue,
                            uniqueName: item.uniqueName,
                            type: item.taxType,
                            isChecked: true,
                            isDisabled: false
                        };
                        entry.taxes.push(o);
                        entry.taxSum += o.amount;
                    }
                });
            });
        }
    };
    SalesInvoiceComponent.prototype.selectedDiscountEvent = function (txn, entry) {
        // call taxableValue method
        txn.setAmount(entry);
        this.txnChangeOccurred();
        // entry.discountSum = _.sumBy(entry.discounts, (o) => {
        //   return o.amount;
        // });
    };
    // get action type from aside window and open respective modal
    SalesInvoiceComponent.prototype.getActionFromAside = function (e) {
        var _this = this;
        if (e.type === 'groupModal') {
            this.showCreateGroupModal = true;
            // delay just for ng cause
            setTimeout(function () {
                _this.createGroupModal.show();
            }, 1000);
        }
        else {
            this.showCreateAcModal = true;
            this.createAcCategory = e.type;
            // delay just for ng cause
            setTimeout(function () {
                _this.createAcModal.show();
            }, 1000);
        }
    };
    SalesInvoiceComponent.prototype.closeCreateGroupModal = function (e) {
        this.createGroupModal.hide();
    };
    SalesInvoiceComponent.prototype.customMoveGroupFilter = function (term, item) {
        var newItem = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, item);
        if (!newItem.additional) {
            newItem.additional = { email: '', mobileNo: '' };
        }
        else {
            newItem.additional.email = newItem.additional.email || '';
            newItem.additional.mobileNo = newItem.additional.mobileNo || '';
        }
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1 || item.additional.email.toLocaleLowerCase().indexOf(term) > -1 || item.additional.mobileNo.toLocaleLowerCase().indexOf(term) > -1);
    };
    SalesInvoiceComponent.prototype.closeCreateAcModal = function () {
        this.createAcModal.hide();
    };
    SalesInvoiceComponent.prototype.closeDiscountPopup = function () {
        if (this.discountComponent) {
            this.discountComponent.hideDiscountMenu();
        }
    };
    SalesInvoiceComponent.prototype.setActiveIndx = function (event, indx, setFocus) {
        // let focusEl = $('.focused');
        // if (setFocus && focusEl && focusEl[indx]) {
        //   setTimeout(function () {
        //     $('.focused')[indx].focus();
        //   });
        // }
        // let lastIndx = this.invFormData.entries.length - 1;
        this.activeIndx = indx;
        var entry = this.invFormData.entries[indx];
        entry.taxList = entry.taxes.map(function (m) { return m.uniqueName; });
        this.selectedEntry = Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["cloneDeep"])(this.invFormData.entries[indx]);
        // if (indx === lastIndx) {
        //   this.addBlankRow(null);
        // }
        this.stockTaxList = [];
        if (this.invFormData.entries[this.activeIndx].taxList) {
            this.stockTaxList = this.invFormData.entries[this.activeIndx].taxList;
        }
    };
    SalesInvoiceComponent.prototype.doAction = function (action) {
        switch (action) {
            case 1: // Generate & Close
                this.toggleActionText = '& Close';
                break;
            case 2: // Generate & Recurring
                this.toggleActionText = '& Recurring';
                break;
            case 3: // Generate Invoice
                this.toggleActionText = '';
                break;
            default:
                break;
        }
    };
    SalesInvoiceComponent.prototype.postResponseAction = function () {
        if (this.toggleActionText.includes('Close')) {
            this.router.navigate(['/pages', 'invoice', 'preview', this.selectedPage.toLowerCase()]);
        }
        else if (this.toggleActionText.includes('Recurring')) {
            this.toggleRecurringAsidePane();
        }
    };
    SalesInvoiceComponent.prototype.resetCustomerName = function (event) {
        // console.log(event);
        if (event) {
            if (!event.target.value) {
                // this.forceClear$ = observableOf({status: true});
                this.invFormData.voucherDetails.customerName = null;
                this.invFormData.voucherDetails.tempCustomerName = null;
                this.isCustomerSelected = false;
                this.invFormData.accountDetails = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["AccountDetailsClass"]();
                this.invFormData.accountDetails.uniqueName = 'cash';
                // if we are in update mode and someone changes customer name then we should reset the voucher details
                if (this.isUpdateMode) {
                    this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
                }
            }
        }
        else {
            this.invFormData.voucherDetails.customerName = null;
            this.invFormData.voucherDetails.tempCustomerName = null;
            this.isCustomerSelected = false;
            this.invFormData.accountDetails = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["AccountDetailsClass"]();
            this.invFormData.accountDetails.uniqueName = 'cash';
            // if we are in update mode and someone changes customer name then we should reset the voucher details
            if (this.isUpdateMode) {
                this.store.dispatch(this.invoiceReceiptActions.ResetVoucherDetails());
            }
        }
    };
    SalesInvoiceComponent.prototype.ngOnChanges = function (s) {
        if (s && s['isPurchaseInvoice'] && s['isPurchaseInvoice'].currentValue) {
            this.pageChanged('Purchase', 'Purchase');
        }
        if (s && s['isDebitNote'] && s['isDebitNote'].currentValue) {
            this.pageChanged('Debit Note', 'Debit Note');
        }
        if (s && s['isCreditNote'] && s['isCreditNote'].currentValue) {
            this.pageChanged('Credit Note', 'Credit Note');
        }
        // if (s && s['accountUniqueName'] && s['accountUniqueName'].currentValue) {
        //   this.makeCustomerList();
        // }
    };
    SalesInvoiceComponent.prototype.onSelectPaymentMode = function (event) {
        if (event && event.value) {
            this.invFormData.accountDetails.name = event.label;
            this.invFormData.accountDetails.uniqueName = event.value;
            this.depositAccountUniqueName = event.value;
        }
        else {
            this.depositAccountUniqueName = '';
        }
    };
    SalesInvoiceComponent.prototype.clickedInside = function ($event) {
        $event.preventDefault();
        $event.stopPropagation(); // <- that will stop propagation on lower layers
    };
    SalesInvoiceComponent.prototype.calculateAmount = function (txn, entry) {
        txn.amount = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_34__["giddhRoundOff"])(((Number(txn.total) + entry.discountSum) - entry.taxSum), 2);
        if (txn.accountUniqueName) {
            if (txn.stockDetails) {
                txn.rate = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_34__["giddhRoundOff"])((txn.amount / txn.quantity), 2);
            }
        }
        this.txnChangeOccurred();
    };
    SalesInvoiceComponent.prototype.clickedOutside = function (event) {
        if (event.target.id === 'depositBoxTrigger') {
            this.dropdownisOpen = !this.dropdownisOpen;
        }
        else {
            this.dropdownisOpen = false;
        }
    };
    /**
     * prepareUnitArr
     */
    SalesInvoiceComponent.prototype.prepareUnitArr = function (unitArr) {
        var unitArray = [];
        _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["forEach"](unitArr, function (item) {
            unitArray.push({ id: item.stockUnitCode, text: item.stockUnitCode, rate: item.rate });
        });
        return unitArray;
    };
    /**
     * onChangeUnit
     */
    SalesInvoiceComponent.prototype.onChangeUnit = function (txn, selectedUnit) {
        if (!event) {
            return;
        }
        _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["find"](txn.stockList, function (o) {
            if (o.id === selectedUnit) {
                return txn.rate = o.rate;
            }
        });
    };
    SalesInvoiceComponent.prototype.onUploadOutput = function (output) {
        if (output.type === 'allAddedToQueue') {
            var sessionKey_1 = null;
            var companyUniqueName_1 = null;
            this.sessionKey$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (a) { return sessionKey_1 = a; });
            this.companyName$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (a) { return companyUniqueName_1 = a; });
            var event_1 = {
                type: 'uploadAll',
                url: _app_constant__WEBPACK_IMPORTED_MODULE_25__["Configuration"].ApiUrl + _services_apiurls_ledger_api__WEBPACK_IMPORTED_MODULE_24__["LEDGER_API"].UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName_1),
                method: 'POST',
                fieldName: 'file',
                data: { company: companyUniqueName_1 },
                headers: { 'Session-Id': sessionKey_1 },
            };
            this.uploadInput.emit(event_1);
        }
        else if (output.type === 'start') {
            this.isFileUploading = true;
            // this._loaderService.show();
        }
        else if (output.type === 'done') {
            // this._loaderService.hide();
            if (output.file.response.status === 'success') {
                this.isFileUploading = false;
                this.invFormData.entries[0].attachedFile = output.file.response.body.uniqueName;
                this.invFormData.entries[0].attachedFileName = output.file.response.body.name;
                // this.blankLedger.attachedFile = output.file.response.body.uniqueName;
                // this.blankLedger.attachedFileName = output.file.response.body.name;
                this._toasty.successToast('file uploaded successfully');
            }
            else {
                this.isFileUploading = false;
                // this.blankLedger.attachedFile = '';
                // this.blankLedger.attachedFileName = '';
                this.invFormData.entries[0].attachedFile = '';
                this.invFormData.entries[0].attachedFileName = '';
                this._toasty.errorToast(output.file.response.message);
            }
        }
    };
    SalesInvoiceComponent.prototype.cancelUpdate = function () {
        this.router.navigate(['/pages', 'invoice', 'preview', this.invoiceType]);
    };
    SalesInvoiceComponent.prototype.onFileChange = function (file) {
        this.file = file.item(0);
        if (this.file) {
            this.selectedFileName = this.file.name;
        }
        else {
            this.selectedFileName = '';
        }
    };
    SalesInvoiceComponent.prototype.submitUpdateForm = function (f) {
        var _this = this;
        var result = this.prepareDataForApi(f);
        if (!result) {
            return;
        }
        this.salesService.updateVoucher(result).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$))
            .subscribe(function (response) {
            if (response.status === 'success') {
                // reset form and other
                _this.resetInvoiceForm(f);
                if (typeof response.body === 'string') {
                    _this._toasty.successToast(response.body);
                    _this.router.navigate(['/pages', 'invoice', 'preview', _this.selectedPage.toLowerCase()]);
                }
                else {
                    try {
                        _this._toasty.successToast("Voucher updated successfully..");
                        _this.router.navigate(['/pages', 'invoice', 'preview', _this.selectedPage.toLowerCase()]);
                        // // don't know what to do about this line
                        // // this.router.navigate(['/pages', 'invoice', 'preview']);
                        // this.voucherNumber = response.body.voucherDetails.voucherNumber;
                        // this.postResponseAction();
                    }
                    catch (error) {
                        _this._toasty.successToast('Voucher updated Successfully');
                    }
                }
                _this.depositAccountUniqueName = '';
                _this.depositAmount = 0;
                _this.isUpdateMode = false;
            }
            else {
                _this._toasty.errorToast(response.message, response.code);
            }
            _this.updateAccount = false;
        });
    };
    SalesInvoiceComponent.prototype.prepareDataForApi = function (f) {
        var _this = this;
        var data = _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["cloneDeep"](this.invFormData);
        if (this.isSalesInvoice || this.isPurchaseInvoice) {
            if (moment_moment__WEBPACK_IMPORTED_MODULE_5__(data.voucherDetails.dueDate, 'DD-MM-YYYY').isBefore(moment_moment__WEBPACK_IMPORTED_MODULE_5__(data.voucherDetails.voucherDate, 'DD-MM-YYYY'), 'd')) {
                this._toasty.errorToast('Due date cannot be less than Invoice Date');
                return;
            }
        }
        else {
            delete data.voucherDetails.dueDate;
        }
        data.entries = data.entries.filter(function (entry, indx) {
            if (!entry.transactions[0].accountUniqueName && indx !== 0) {
                _this.invFormData.entries.splice(indx, 1);
            }
            return entry.transactions[0].accountUniqueName;
        });
        // filter active discounts
        data.entries = data.entries.map(function (entry) {
            entry.discounts = entry.discounts.filter(function (dis) { return dis.isActive; });
            return entry;
        });
        var txnErr;
        // before submit request making some validation rules
        // check for account uniqueName
        if (data.accountDetails) {
            if (!data.accountDetails.uniqueName) {
                if (this.typeaheadNoResultsOfCustomer) {
                    this._toasty.warningToast('Need to select Bank/Cash A/c or Customer Name');
                }
                else {
                    this._toasty.warningToast('Customer Name can\'t be empty');
                }
                return;
            }
            if (data.accountDetails.email) {
                if (!apps_web_giddh_src_app_shared_helpers_universalValidations__WEBPACK_IMPORTED_MODULE_20__["EMAIL_REGEX_PATTERN"].test(data.accountDetails.email)) {
                    this._toasty.warningToast('Invalid Email Address.');
                    return;
                }
            }
        }
        // replace /n to br for (shipping and billing)
        if (data.accountDetails.shippingDetails.address && data.accountDetails.shippingDetails.address.length && data.accountDetails.shippingDetails.address[0].length > 0) {
            data.accountDetails.shippingDetails.address[0] = data.accountDetails.shippingDetails.address[0].replace(/\n/g, '<br />');
            data.accountDetails.shippingDetails.address = data.accountDetails.shippingDetails.address[0].split('<br />');
        }
        if (data.accountDetails.billingDetails.address && data.accountDetails.billingDetails.address.length && data.accountDetails.billingDetails.address[0].length > 0) {
            data.accountDetails.billingDetails.address[0] = data.accountDetails.billingDetails.address[0].replace(/\n/g, '<br />');
            data.accountDetails.billingDetails.address = data.accountDetails.billingDetails.address[0].split('<br />');
        }
        // convert date object
        data.voucherDetails.voucherDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
        data.voucherDetails.dueDate = this.convertDateForAPI(data.voucherDetails.dueDate);
        data.templateDetails.other.shippingDate = this.convertDateForAPI(data.templateDetails.other.shippingDate);
        // check for valid entries and transactions
        if (data.entries) {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["forEach"](data.entries, function (entry) {
                _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["forEach"](entry.transactions, function (txn) {
                    // convert date object
                    // txn.date = this.convertDateForAPI(txn.date);
                    entry.entryDate = moment_moment__WEBPACK_IMPORTED_MODULE_5__(entry.entryDate, _shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_17__["GIDDH_DATE_FORMAT"]).format(_shared_helpers_defaultDateFormat__WEBPACK_IMPORTED_MODULE_17__["GIDDH_DATE_FORMAT"]);
                    // we need to remove # from account uniqueName because we are appending # to stock for uniqueNess
                    if (txn.stockList && txn.stockList.length) {
                        txn.accountUniqueName = txn.accountUniqueName.indexOf('#') > -1 ? txn.accountUniqueName.slice(0, txn.accountUniqueName.indexOf('#')) : txn.accountUniqueName;
                        txn.fakeAccForSelect2 = txn.fakeAccForSelect2.indexOf('#') > -1 ? txn.fakeAccForSelect2.slice(0, txn.fakeAccForSelect2.indexOf('#')) : txn.fakeAccForSelect2;
                    }
                    // will get errors of string and if not error then true boolean
                    if (!txn.isValid()) {
                        _this._toasty.warningToast('Product/Service can\'t be empty');
                        txnErr = true;
                        return false;
                    }
                    else {
                        txnErr = false;
                    }
                });
            });
        }
        else {
            this._toasty.warningToast('At least a single entry needed to generate sales-invoice');
            return;
        }
        // if txn has errors
        if (txnErr) {
            return null;
        }
        // set voucher type
        data.entries = data.entries.map(function (entry) {
            entry.voucherType = _this.pageList.find(function (p) { return p.value === _this.selectedPage; }).label;
            entry.taxList = entry.taxes.map(function (m) { return m.uniqueName; }).slice();
            entry.tcsCalculationMethod = entry.otherTaxModal.tcsCalculationMethod;
            if (entry.isOtherTaxApplicable) {
                entry.taxList.push(entry.otherTaxModal.appliedOtherTax.uniqueName);
            }
            if (entry.otherTaxType === 'tds') {
                delete entry['tcsCalculationMethod'];
            }
            return entry;
        });
        var obj = {
            voucher: data,
            entryUniqueNames: data.entries.map(function (m) { return m.uniqueName; }),
            updateAccountDetails: this.updateAccount
        };
        if (this.depositAmount && this.depositAmount > 0) {
            obj.paymentAction = {
                action: 'paid',
                amount: this.depositAmount + this.depositAmountAfterUpdate
            };
            if (this.isCustomerSelected) {
                obj.depositAccountUniqueName = this.depositAccountUniqueName;
            }
            else {
                obj.depositAccountUniqueName = data.accountDetails.uniqueName;
            }
        }
        else {
            obj.depositAccountUniqueName = '';
        }
        // set voucher type
        obj.voucher.voucherDetails.voucherType = this.selectedPage.toLowerCase();
        return obj;
    };
    SalesInvoiceComponent.prototype.getEntryTotalDiscount = function (discountArr) {
        var count = 0;
        if (discountArr.length > 0) {
            _lodash_optimized__WEBPACK_IMPORTED_MODULE_4__["forEach"](discountArr, function (item) {
                count += Math.abs(item.amount);
            });
        }
        if (count > 0) {
            // this.tx_discount = count;
            return count;
        }
        else {
            return null;
        }
    };
    SalesInvoiceComponent.prototype.calculateOtherTaxes = function (modal, index) {
        if (index === void 0) { index = null; }
        var entry;
        if (index !== null) {
            entry = this.invFormData.entries[index];
        }
        else {
            entry = this.invFormData.entries[this.activeIndx];
        }
        var taxableValue = 0;
        var companyTaxes = [];
        var totalTaxes = 0;
        this.companyTaxesList$.subscribe(function (taxes) { return companyTaxes = taxes; });
        if (!entry) {
            return;
        }
        if (modal.appliedOtherTax && modal.appliedOtherTax.uniqueName) {
            var tax = companyTaxes.find(function (ct) { return ct.uniqueName === modal.appliedOtherTax.uniqueName; });
            if (['tcsrc', 'tcspay'].includes(tax.taxType)) {
                if (modal.tcsCalculationMethod === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["SalesOtherTaxesCalculationMethodEnum"].OnTaxableAmount) {
                    taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                }
                else if (modal.tcsCalculationMethod === _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["SalesOtherTaxesCalculationMethodEnum"].OnTotalAmount) {
                    var rawAmount = Number(entry.transactions[0].amount) - entry.discountSum;
                    taxableValue = (rawAmount + ((rawAmount * entry.taxSum) / 100));
                }
                entry.otherTaxType = 'tcs';
                entry.tdsTaxList = [];
            }
            else {
                taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                entry.otherTaxType = 'tds';
                entry.tcsTaxList = [];
            }
            totalTaxes += tax.taxDetail[0].taxValue;
            entry.otherTaxSum = Object(_shared_helpers_helperFunctions__WEBPACK_IMPORTED_MODULE_34__["giddhRoundOff"])(((taxableValue * totalTaxes) / 100), 2);
            entry.otherTaxModal = modal;
        }
        else {
            entry.otherTaxSum = 0;
            entry.isOtherTaxApplicable = false;
            entry.tcsTaxList = [];
            entry.tdsTaxList = [];
            entry.otherTaxModal = new _models_api_models_Sales__WEBPACK_IMPORTED_MODULE_8__["SalesOtherTaxesModal"]();
        }
        this.selectedEntry = null;
    };
    SalesInvoiceComponent.prototype.calculateAffectedThingsFromOtherTaxChanges = function () {
        var _this = this;
        var tcsSum = 0;
        var tdsSum = 0;
        var grandTotal = 0;
        this.invFormData.entries.forEach(function (entry) {
            tcsSum += entry.otherTaxType === 'tcs' ? entry.otherTaxSum : 0;
            tdsSum += entry.otherTaxType === 'tds' ? entry.otherTaxSum : 0;
            grandTotal += Number(_this.generateGrandTotal(entry.transactions));
        });
        this.invFormData.voucherDetails.tcsTotal = Number(tcsSum);
        this.invFormData.voucherDetails.tdsTotal = Number(tdsSum);
        this.invFormData.voucherDetails.grandTotal = Number(grandTotal);
        this.invFormData.voucherDetails.balanceDue = Number((grandTotal + tcsSum) - (tdsSum)) - Number(this.depositAmountAfterUpdate);
        if (this.depositAmount) {
            this.invFormData.voucherDetails.balanceDue = Number((grandTotal + tcsSum) - (tdsSum)) - Number(this.depositAmount) - Number(this.depositAmountAfterUpdate);
        }
    };
    SalesInvoiceComponent.prototype.parseDiscountFromResponse = function (entry) {
        var discountArray = [];
        var defaultDiscountIndex = entry.tradeDiscounts.findIndex(function (f) { return !f.discount.uniqueName; });
        if (defaultDiscountIndex > -1) {
            discountArray.push({
                discountType: entry.tradeDiscounts[defaultDiscountIndex].discount.discountType,
                amount: entry.tradeDiscounts[defaultDiscountIndex].discount.discountValue,
                discountValue: entry.tradeDiscounts[defaultDiscountIndex].discount.discountValue,
                discountUniqueName: entry.tradeDiscounts[defaultDiscountIndex].discount.uniqueName,
                name: entry.tradeDiscounts[defaultDiscountIndex].discount.name,
                particular: entry.tradeDiscounts[defaultDiscountIndex].account.uniqueName,
                isActive: true
            });
        }
        else {
            discountArray.push({
                discountType: 'FIX_AMOUNT',
                amount: 0,
                name: '',
                particular: '',
                isActive: true,
                discountValue: 0
            });
        }
        entry.tradeDiscounts.forEach(function (f, ind) {
            if (ind !== defaultDiscountIndex) {
                discountArray.push({
                    discountType: f.discount.discountType,
                    amount: f.discount.discountValue,
                    name: f.discount.name,
                    particular: f.account.uniqueName,
                    isActive: true,
                    discountValue: f.discount.discountValue,
                    discountUniqueName: f.discount.uniqueName
                });
            }
        });
        return discountArray;
    };
    SalesInvoiceComponent.prototype.getDiscountSum = function (discounts, amount) {
        if (amount === void 0) { amount = 0; }
        var percentageListTotal = discounts.filter(function (f) { return f.isActive; })
            .filter(function (s) { return s.discountType === 'PERCENTAGE'; })
            .reduce(function (pv, cv) {
            return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
        }, 0) || 0;
        var fixedListTotal = discounts.filter(function (f) { return f.isActive; })
            .filter(function (s) { return s.discountType === 'FIX_AMOUNT'; })
            .reduce(function (pv, cv) {
            return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
        }, 0) || 0;
        var perFromAmount = ((percentageListTotal * amount) / 100);
        return perFromAmount + fixedListTotal;
    };
    SalesInvoiceComponent.prototype.isValidGstIn = function (no) {
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]$/g.test(no);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesInvoiceComponent.prototype, "isPurchaseInvoice", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesInvoiceComponent.prototype, "isCreditNote", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesInvoiceComponent.prototype, "isDebitNote", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], SalesInvoiceComponent.prototype, "accountUniqueName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])(_shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_10__["ElementViewContainerRef"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _shared_helpers_directives_elementViewChild_element_viewchild_directive__WEBPACK_IMPORTED_MODULE_10__["ElementViewContainerRef"])
    ], SalesInvoiceComponent.prototype, "elementViewContainerRef", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('createGroupModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_16__["ModalDirective"])
    ], SalesInvoiceComponent.prototype, "createGroupModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('createAcModal'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_16__["ModalDirective"])
    ], SalesInvoiceComponent.prototype, "createAcModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('invoiceForm'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_forms__WEBPACK_IMPORTED_MODULE_6__["NgForm"])
    ], SalesInvoiceComponent.prototype, "invoiceForm", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])('discountComponent'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _discount_list_discountList_component__WEBPACK_IMPORTED_MODULE_27__["DiscountListComponent"])
    ], SalesInvoiceComponent.prototype, "discountComponent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChild"])("cashInvoiceInput"),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ElementRef"])
    ], SalesInvoiceComponent.prototype, "cashInvoiceInput", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChildren"])(_theme_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_32__["ShSelectComponent"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["QueryList"])
    ], SalesInvoiceComponent.prototype, "allShSelect", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ViewChildren"])(_theme_sales_ng_virtual_select_sh_select_component__WEBPACK_IMPORTED_MODULE_29__["SalesShSelectComponent"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["QueryList"])
    ], SalesInvoiceComponent.prototype, "allSalesShSelect", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["HostListener"])('document:click', ['$event']),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Object]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], SalesInvoiceComponent.prototype, "clickedOutside", null);
    SalesInvoiceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            template: __webpack_require__(/*! ./sales.invoice.component.html */ "./src/app/sales/create/sales.invoice.component.html"),
            selector: 'sales-invoice',
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["trigger"])('slideInOut', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["state"])('in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["style"])({
                        transform: 'translate3d(0, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["state"])('out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["style"])({
                        transform: 'translate3d(100%, 0, 0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["transition"])('in => out', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["animate"])('400ms ease-in-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["transition"])('out => in', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_23__["animate"])('400ms ease-in-out'))
                ]),
            ],
            styles: [__webpack_require__(/*! ./sales.invoice.component.scss */ "./src/app/sales/create/sales.invoice.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_28__["BsModalService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_7__["Store"],
            _services_account_service__WEBPACK_IMPORTED_MODULE_9__["AccountService"],
            _actions_sales_sales_action__WEBPACK_IMPORTED_MODULE_11__["SalesActions"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_12__["CompanyActions"],
            _angular_router__WEBPACK_IMPORTED_MODULE_22__["Router"],
            _actions_ledger_ledger_actions__WEBPACK_IMPORTED_MODULE_13__["LedgerActions"],
            _services_sales_service__WEBPACK_IMPORTED_MODULE_14__["SalesService"],
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_15__["ToasterService"],
            apps_web_giddh_src_app_actions_general_general_actions__WEBPACK_IMPORTED_MODULE_18__["GeneralActions"],
            _actions_invoice_invoice_actions__WEBPACK_IMPORTED_MODULE_21__["InvoiceActions"],
            _actions_settings_discount_settings_discount_action__WEBPACK_IMPORTED_MODULE_26__["SettingsDiscountActions"],
            _angular_router__WEBPACK_IMPORTED_MODULE_22__["ActivatedRoute"],
            _actions_invoice_receipt_receipt_actions__WEBPACK_IMPORTED_MODULE_30__["InvoiceReceiptActions"],
            _actions_settings_profile_settings_profile_action__WEBPACK_IMPORTED_MODULE_31__["SettingsProfileActions"],
            _services_ledger_service__WEBPACK_IMPORTED_MODULE_33__["LedgerService"],
            _actions_sales_sales_action__WEBPACK_IMPORTED_MODULE_11__["SalesActions"],
            _angular_core__WEBPACK_IMPORTED_MODULE_3__["ChangeDetectorRef"]])
    ], SalesInvoiceComponent);
    return SalesInvoiceComponent;
}());



/***/ }),

/***/ "./src/app/sales/sales-aside-menu-account/sales.aside.menu.account.component.html":
/*!****************************************************************************************!*\
  !*** ./src/app/sales/sales-aside-menu-account/sales.aside.menu.account.component.html ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"aside-pane\">\n\n  <button id=\"close\" class=\"btn btn-sm btn-primary\" (click)=\"closeAsidePane($event)\">X</button>\n\n  <div class=\"aside-header\">\n    <h3 class=\"aside-title\">{{selectedAccountUniqueName ? 'Update' : 'Create'}} Account</h3>\n  </div>\n\n  <div class=\"aside-body\">\n\n    <div class=\"form-group pdT2\">\n\n      <label class=\"mrB1\">Select Group</label>\n\n      <div class=\"ng-select-wrap liq\">\n\n        <ng-select placeholder=\"Select Group\" filterPlaceholder=\"Type to search...\" name=\"activeGroupUniqueName\"\n                   [(ngModel)]=\"activeGroupUniqueName\" [options]=\"flatAccountWGroupsList$ | async\" style=\"width:100%\">\n          <ng-template #optionTemplate let-option=\"option\">\n            <div class=\"account-list-item\">{{option?.label}}</div>\n            <div class=\"account-list-item fs12\">{{option?.value}}</div>\n          </ng-template>\n        </ng-select>\n\n      </div>\n    </div>\n\n\n    <ng-container *ngIf=\"!selectedAccountUniqueName && activeGroupUniqueName\">\n      <account-add-new [activeGroupUniqueName]=\"activeGroupUniqueName\"\n                       [fetchingAccUniqueName$]=\"fetchingAccUniqueName$\"\n                       [isAccountNameAvailable$]=\"isAccountNameAvailable$\"\n                       [createAccountInProcess$]=\"createAccountInProcess$\" (submitClicked)=\"addNewAcSubmit($event)\"\n                       [isGstEnabledAcc]=\"isGstEnabledAcc\" [isHsnSacEnabledAcc]=\"isHsnSacEnabledAcc\">\n      </account-add-new>\n    </ng-container>\n\n    <ng-container *ngIf=\"selectedAccountUniqueName && activeGroupUniqueName\">\n      <account-update-new [activeGroupUniqueName]=\"activeGroupUniqueName\"\n                          [fetchingAccUniqueName$]=\"fetchingAccUniqueName$\"\n                          [createAccountInProcess$]=\"createAccountInProcess$\"\n                          [updateAccountInProcess$]=\"updateAccountInProcess$\"\n                          [isGstEnabledAcc]=\"isGstEnabledAcc\" [isHsnSacEnabledAcc]=\"isHsnSacEnabledAcc\"\n                          [showDeleteButton]=\"false\" (submitClicked)=\"updateAccount($event)\"\n      >\n      </account-update-new>\n    </ng-container>\n\n  </div>\n</div>\n\n"

/***/ }),

/***/ "./src/app/sales/sales-aside-menu-account/sales.aside.menu.account.component.ts":
/*!**************************************************************************************!*\
  !*** ./src/app/sales/sales-aside-menu-account/sales.aside.menu.account.component.ts ***!
  \**************************************************************************************/
/*! exports provided: SalesAsideMenuAccountComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesAsideMenuAccountComponent", function() { return SalesAsideMenuAccountComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../actions/accounts.actions */ "./src/app/actions/accounts.actions.ts");
/* harmony import */ var _services_group_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/group.service */ "./src/app/services/group.service.ts");







var SalesAsideMenuAccountComponent = /** @class */ (function () {
    function SalesAsideMenuAccountComponent(store, groupService, accountsAction) {
        this.store = store;
        this.groupService = groupService;
        this.accountsAction = accountsAction;
        this.isPurchaseInvoice = false;
        this.closeAsideEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"](true);
        this.addEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.updateEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
        this.isGstEnabledAcc = true;
        this.isHsnSacEnabledAcc = false;
        // private below
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["ReplaySubject"](1);
        // account-add component's property
        this.flattenGroups$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.general.flattenGroups; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.fetchingAccUniqueName$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.groupwithaccounts.fetchingAccUniqueName; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.isAccountNameAvailable$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.groupwithaccounts.isAccountNameAvailable; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.createAccountInProcess$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.sales.createAccountInProcess; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
        this.updateAccountInProcess$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (state) { return state.sales.updateAccountInProcess; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroyed$));
    }
    SalesAsideMenuAccountComponent.prototype.ngOnInit = function () {
        //
    };
    SalesAsideMenuAccountComponent.prototype.addNewAcSubmit = function (accRequestObject) {
        this.addEvent.emit(accRequestObject);
    };
    SalesAsideMenuAccountComponent.prototype.updateAccount = function (accRequestObject) {
        this.updateEvent.emit(accRequestObject);
    };
    SalesAsideMenuAccountComponent.prototype.closeAsidePane = function (event) {
        this.closeAsideEvent.emit(event);
    };
    SalesAsideMenuAccountComponent.prototype.getGroups = function (parentGrp, findItem) {
        var flattenGroups = [];
        this.flattenGroups$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1)).subscribe(function (data) { return flattenGroups = data || []; });
        var items = flattenGroups.filter(function (grps) {
            return grps.groupUniqueName === findItem || grps.parentGroups.some(function (s) { return s.uniqueName === findItem; });
        });
        var flatGrps = items.map(function (m) {
            return { label: m.groupName, value: m.groupUniqueName };
        });
        this.flatAccountWGroupsList$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(flatGrps);
        this.activeGroupUniqueName = findItem;
    };
    SalesAsideMenuAccountComponent.prototype.ngOnChanges = function (s) {
        if (s && s['isPurchaseInvoice'] && s['isPurchaseInvoice'].currentValue) {
            this.getGroups('currentliabilities', 'sundrycreditors');
        }
        else if (s && s['isPurchaseInvoice'] && !s['isPurchaseInvoice'].currentValue) {
            this.getGroups('currentassets', 'sundrydebtors');
        }
        if ('selectedAccountUniqueName' in s) {
            var value = s.selectedAccountUniqueName;
            if (value.currentValue && value.currentValue !== value.previousValue) {
                this.store.dispatch(this.accountsAction.getAccountDetails(s.selectedAccountUniqueName.currentValue));
            }
        }
    };
    SalesAsideMenuAccountComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesAsideMenuAccountComponent.prototype, "isPurchaseInvoice", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], SalesAsideMenuAccountComponent.prototype, "selectedAccountUniqueName", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], SalesAsideMenuAccountComponent.prototype, "closeAsideEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], SalesAsideMenuAccountComponent.prototype, "addEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"])
    ], SalesAsideMenuAccountComponent.prototype, "updateEvent", void 0);
    SalesAsideMenuAccountComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'sales-aside-menu-account',
            template: __webpack_require__(/*! ./sales.aside.menu.account.component.html */ "./src/app/sales/sales-aside-menu-account/sales.aside.menu.account.component.html"),
            styles: ["\n    :host {\n      position: fixed;\n      left: auto;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      width: 480px;\n      z-index: 1045;\n    }\n\n    #close {\n      display: none;\n    }\n\n    :host.in #close {\n      display: block;\n      position: fixed;\n      left: -41px;\n      top: 0;\n      z-index: 5;\n      border: 0;\n      border-radius: 0;\n    }\n\n    :host .container-fluid {\n      padding-left: 0;\n      padding-right: 0;\n    }\n\n    :host .aside-pane {\n      width: 480px;\n    }\n\n    .aside-body {\n      margin-bottom: 80px;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _services_group_service__WEBPACK_IMPORTED_MODULE_6__["GroupService"],
            _actions_accounts_actions__WEBPACK_IMPORTED_MODULE_5__["AccountsAction"]])
    ], SalesAsideMenuAccountComponent);
    return SalesAsideMenuAccountComponent;
}());



/***/ }),

/***/ "./src/app/sales/sales.component.html":
/*!********************************************!*\
  !*** ./src/app/sales/sales.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"sales-invoiceBGwhite\">\n  <sales-invoice [isPurchaseInvoice]=\"isPurchaseInvoice\" [isCreditNote]=\"isCreditNote\"\n                 [isDebitNote]=\"isDebitNote\" [accountUniqueName]=\"accountUniqueName\"></sales-invoice>\n</section>\n"

/***/ }),

/***/ "./src/app/sales/sales.component.ts":
/*!******************************************!*\
  !*** ./src/app/sales/sales.component.ts ***!
  \******************************************/
/*! exports provided: SalesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesComponent", function() { return SalesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _models_api_models_Company__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../models/api-models/Company */ "./src/app/models/api-models/Company.ts");
/* harmony import */ var _actions_company_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../actions/company.actions */ "./src/app/actions/company.actions.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");








var SalesComponent = /** @class */ (function () {
    function SalesComponent(router, store, companyActions, route) {
        this.router = router;
        this.store = store;
        this.companyActions = companyActions;
        this.route = route;
        this.isPurchaseInvoice = false;
        this.isCreditNote = false;
        this.isDebitNote = false;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_7__["ReplaySubject"](1);
    }
    SalesComponent.prototype.ngOnInit = function () {
        var _this = this;
        var companyUniqueName = null;
        this.store.select(function (c) { return c.session.companyUniqueName; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (s) { return companyUniqueName = s; });
        var stateDetailsRequest = new _models_api_models_Company__WEBPACK_IMPORTED_MODULE_5__["StateDetailsRequest"]();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'sales';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
        this.isPurchaseInvoice = this.router.routerState.snapshot.url.includes('purchase');
        this.isCreditNote = this.router.routerState.snapshot.url.includes('credit');
        this.isDebitNote = this.router.routerState.snapshot.url.includes('debit');
        this.route.params.subscribe(function (parmas) {
            if (parmas['accUniqueName']) {
                _this.accountUniqueName = parmas['accUniqueName'];
            }
        });
    };
    SalesComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    SalesComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            template: __webpack_require__(/*! ./sales.component.html */ "./src/app/sales/sales.component.html"),
            styles: ["\n    .grey-bg {\n      background-color: #f4f5f8;\n      padding: 20px;\n    }\n\n    section.sales-invoiceBGwhite {\n      background-color: #fff;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"],
            _actions_company_actions__WEBPACK_IMPORTED_MODULE_6__["CompanyActions"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"]])
    ], SalesComponent);
    return SalesComponent;
}());



/***/ }),

/***/ "./src/app/sales/sales.module.ts":
/*!***************************************!*\
  !*** ./src/app/sales/sales.module.ts ***!
  \***************************************/
/*! exports provided: FIXED_CATEGORY_OF_GROUPS, SalesModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FIXED_CATEGORY_OF_GROUPS", function() { return FIXED_CATEGORY_OF_GROUPS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesModule", function() { return SalesModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-bootstrap/datepicker */ "../../node_modules/ngx-bootstrap/datepicker/index.js");
/* harmony import */ var ngx_bootstrap_tooltip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-bootstrap/tooltip */ "../../node_modules/ngx-bootstrap/tooltip/index.js");
/* harmony import */ var ngx_bootstrap_collapse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-bootstrap/collapse */ "../../node_modules/ngx-bootstrap/collapse/index.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap/modal */ "../../node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-bootstrap/typeahead */ "../../node_modules/ngx-bootstrap/typeahead/index.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _sales_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./sales.component */ "./src/app/sales/sales.component.ts");
/* harmony import */ var _create_sales_invoice_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./create/sales.invoice.component */ "./src/app/sales/create/sales.invoice.component.ts");
/* harmony import */ var _discount_list_discountList_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./discount-list/discountList.component */ "./src/app/sales/discount-list/discountList.component.ts");
/* harmony import */ var _sales_routing_module__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./sales.routing.module */ "./src/app/sales/sales.routing.module.ts");
/* harmony import */ var _theme_tax_control_tax_control_module__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../theme/tax-control/tax-control.module */ "./src/app/theme/tax-control/tax-control.module.ts");
/* harmony import */ var _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../theme/ng-select/ng-select */ "./src/app/theme/ng-select/ng-select.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/fesm5/angular2-ladda.js");
/* harmony import */ var _shared_helpers_directives_digitsOnly_digitsOnly_module__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../shared/helpers/directives/digitsOnly/digitsOnly.module */ "./src/app/shared/helpers/directives/digitsOnly/digitsOnly.module.ts");
/* harmony import */ var _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../shared/helpers/directives/decimalDigits/decimalDigits.module */ "./src/app/shared/helpers/directives/decimalDigits/decimalDigits.module.ts");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var _theme_sales_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../theme/sales-ng-virtual-select/sh-select.module */ "./src/app/theme/sales-ng-virtual-select/sh-select.module.ts");
/* harmony import */ var apps_web_giddh_src_app_shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! apps/web-giddh/src/app/shared/helpers/directives/elementViewChild/elementViewChild.module */ "./src/app/shared/helpers/directives/elementViewChild/elementViewChild.module.ts");
/* harmony import */ var apps_web_giddh_src_app_theme_quick_account_component_quickAccount_module__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! apps/web-giddh/src/app/theme/quick-account-component/quickAccount.module */ "./src/app/theme/quick-account-component/quickAccount.module.ts");
/* harmony import */ var apps_web_giddh_src_app_sales_tax_list_sales_tax_list_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! apps/web-giddh/src/app/sales/tax-list/sales.tax.list.component */ "./src/app/sales/tax-list/sales.tax.list.component.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _shared_aside_menu_recurring_entry_aside_menu_recurringEntry_module__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module */ "./src/app/shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module.ts");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ng-click-outside */ "../../node_modules/ng-click-outside/lib/index.js");
/* harmony import */ var ng_click_outside__WEBPACK_IMPORTED_MODULE_26___default = /*#__PURE__*/__webpack_require__.n(ng_click_outside__WEBPACK_IMPORTED_MODULE_26__);
/* harmony import */ var ngx_uploader__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ngx-uploader */ "../../node_modules/ngx-uploader/fesm5/ngx-uploader.js");
/* harmony import */ var _sales_aside_menu_account_sales_aside_menu_account_component__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./sales-aside-menu-account/sales.aside.menu.account.component */ "./src/app/sales/sales-aside-menu-account/sales.aside.menu.account.component.ts");
/* harmony import */ var _aside_menu_sales_other_taxes_aside_menu_sales_other_taxes__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./aside-menu-sales-other-taxes/aside-menu-sales-other-taxes */ "./src/app/sales/aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.ts");


// import { TooltipModule, TypeaheadModule, CollapseModule } from 'ngx-bootstrap';


// import { PaginationModule  } from 'ngx-bootstrap/pagination';


// import { TabsModule } from 'ngx-bootstrap/tabs';
























var FIXED_CATEGORY_OF_GROUPS = ['currentassets', 'fixedassets', 'noncurrentassets', 'indirectexpenses', 'operatingcost', 'otherincome', 'revenuefromoperations', 'shareholdersfunds', 'currentliabilities', 'noncurrentliabilities'];
var SalesModule = /** @class */ (function () {
    function SalesModule() {
    }
    SalesModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _sales_component__WEBPACK_IMPORTED_MODULE_9__["SalesComponent"],
                _create_sales_invoice_component__WEBPACK_IMPORTED_MODULE_10__["SalesInvoiceComponent"],
                _sales_aside_menu_account_sales_aside_menu_account_component__WEBPACK_IMPORTED_MODULE_28__["SalesAsideMenuAccountComponent"],
                _discount_list_discountList_component__WEBPACK_IMPORTED_MODULE_11__["DiscountListComponent"],
                apps_web_giddh_src_app_sales_tax_list_sales_tax_list_component__WEBPACK_IMPORTED_MODULE_23__["SalesTaxListComponent"],
                _aside_menu_sales_other_taxes_aside_menu_sales_other_taxes__WEBPACK_IMPORTED_MODULE_29__["AsideMenuSalesOtherTaxes"]
            ],
            imports: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormsModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_7__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_8__["ReactiveFormsModule"],
                _theme_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_14__["SelectModule"].forRoot(),
                apps_web_giddh_src_app_shared_helpers_directives_elementViewChild_elementViewChild_module__WEBPACK_IMPORTED_MODULE_21__["ElementViewChildModule"],
                // Select2Module.forRoot(),
                _theme_tax_control_tax_control_module__WEBPACK_IMPORTED_MODULE_13__["TaxControlModule"].forRoot(),
                _sales_routing_module__WEBPACK_IMPORTED_MODULE_12__["SalesRoutingModule"],
                ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_5__["ModalModule"],
                ngx_bootstrap_tooltip__WEBPACK_IMPORTED_MODULE_3__["TooltipModule"],
                ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_6__["TypeaheadModule"],
                ngx_bootstrap_collapse__WEBPACK_IMPORTED_MODULE_4__["CollapseModule"],
                ngx_bootstrap_datepicker__WEBPACK_IMPORTED_MODULE_2__["BsDatepickerModule"].forRoot(),
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_15__["SharedModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_16__["LaddaModule"],
                _shared_helpers_directives_digitsOnly_digitsOnly_module__WEBPACK_IMPORTED_MODULE_17__["DigitsOnlyModule"],
                _shared_helpers_directives_decimalDigits_decimalDigits_module__WEBPACK_IMPORTED_MODULE_18__["DecimalDigitsModule"],
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_19__["ShSelectModule"],
                _theme_sales_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_20__["SalesShSelectModule"],
                apps_web_giddh_src_app_theme_quick_account_component_quickAccount_module__WEBPACK_IMPORTED_MODULE_22__["QuickAccountModule"].forRoot(),
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_24__["BsDropdownModule"],
                _shared_aside_menu_recurring_entry_aside_menu_recurringEntry_module__WEBPACK_IMPORTED_MODULE_25__["AsideMenuRecurringEntryModule"],
                ng_click_outside__WEBPACK_IMPORTED_MODULE_26__["ClickOutsideModule"],
                ngx_uploader__WEBPACK_IMPORTED_MODULE_27__["NgxUploaderModule"]
            ],
            exports: [
                ngx_bootstrap_tooltip__WEBPACK_IMPORTED_MODULE_3__["TooltipModule"],
                _discount_list_discountList_component__WEBPACK_IMPORTED_MODULE_11__["DiscountListComponent"],
                apps_web_giddh_src_app_sales_tax_list_sales_tax_list_component__WEBPACK_IMPORTED_MODULE_23__["SalesTaxListComponent"],
                _sales_aside_menu_account_sales_aside_menu_account_component__WEBPACK_IMPORTED_MODULE_28__["SalesAsideMenuAccountComponent"],
                _aside_menu_sales_other_taxes_aside_menu_sales_other_taxes__WEBPACK_IMPORTED_MODULE_29__["AsideMenuSalesOtherTaxes"]
            ],
            entryComponents: [],
            providers: []
        })
    ], SalesModule);
    return SalesModule;
}());



/***/ }),

/***/ "./src/app/sales/sales.routing.module.ts":
/*!***********************************************!*\
  !*** ./src/app/sales/sales.routing.module.ts ***!
  \***********************************************/
/*! exports provided: SalesRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesRoutingModule", function() { return SalesRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../decorators/needsAuthentication */ "./src/app/decorators/needsAuthentication.ts");
/* harmony import */ var _sales_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./sales.component */ "./src/app/sales/sales.component.ts");





var SalesRoutingModule = /** @class */ (function () {
    function SalesRoutingModule() {
    }
    SalesRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild([
                    {
                        path: '', component: _sales_component__WEBPACK_IMPORTED_MODULE_4__["SalesComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_3__["NeedsAuthentication"]],
                        children: [
                            { path: 'purchase', component: _sales_component__WEBPACK_IMPORTED_MODULE_4__["SalesComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_3__["NeedsAuthentication"]] },
                            { path: 'credit-note', component: _sales_component__WEBPACK_IMPORTED_MODULE_4__["SalesComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_3__["NeedsAuthentication"]] },
                            { path: 'debit-note', component: _sales_component__WEBPACK_IMPORTED_MODULE_4__["SalesComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_3__["NeedsAuthentication"]] },
                        ]
                    },
                    { path: ':accUniqueName', component: _sales_component__WEBPACK_IMPORTED_MODULE_4__["SalesComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_3__["NeedsAuthentication"]] },
                    { path: ':accUniqueName/:invoiceNo/:invoiceType', component: _sales_component__WEBPACK_IMPORTED_MODULE_4__["SalesComponent"], canActivate: [_decorators_needsAuthentication__WEBPACK_IMPORTED_MODULE_3__["NeedsAuthentication"]] }
                ])
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], SalesRoutingModule);
    return SalesRoutingModule;
}());



/***/ }),

/***/ "./src/app/sales/tax-list/sales.tax.list.component.html":
/*!**************************************************************!*\
  !*** ./src/app/sales/tax-list/sales.tax.list.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"pr\" [ngClass]=\"{'open': showTaxPopup}\" [attachOutsideOnClick]=\"true\" (clickOutside)=\"toggleTaxPopup(false)\">\n    <a id=\"tax\" (click)=\"toggleTaxPopup(true)\" class=\"clearfix\">\n        <div class=\"multi-select adjust\">\n            <input type=\"number\" (blur)=\"taxInputBlur($event)\"\n                   (focus)=\"toggleTaxPopup(true)\" readonly name=\"sum\" class=\"form-control cursor-pointer taxInput\"\n                   [(ngModel)]=\"taxSum\" />\n            <span class=\"caret\"></span>\n        </div>\n    </a>\n    <ul #taxListUl class=\"dropdown-menu dropdown-menu-right\" *ngIf=\"showTaxPopup\" (click)=\"$event.stopPropagation()\" [style.max-height.px]=\"102\" [style.min-height.px]=\"40\">\n        <li *ngIf=\"taxList.length === 0\">\n            <p class=\"pd1 alC\">No Taxes Found</p>\n        </li>\n        <li *ngFor=\"let tax of taxList;trackBy: trackByFn; let idx = index\">\n            <label class=\"checkbox oh width100 bdrB pdB taxItem\" (click)=\"$event.stopPropagation()\">\n        <input (blur)=\"taxInputBlur($event)\" class=\"pull-left\" name=\"tax_{{idx}}\"\n               type=\"checkbox\" [(ngModel)]=\"tax.isChecked\" (ngModelChange)=\"reCalculate()\"\n               (click)=\"$event.stopPropagation()\"\n        />\n        <span class=\"pull-left ellp\">{{tax.name}}</span>\n      </label>\n    </li>\n  </ul>\n</div>\n"

/***/ }),

/***/ "./src/app/sales/tax-list/sales.tax.list.component.ts":
/*!************************************************************!*\
  !*** ./src/app/sales/tax-list/sales.tax.list.component.ts ***!
  \************************************************************/
/*! exports provided: SalesTaxListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SalesTaxListComponent", function() { return SalesTaxListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _lodash_optimized__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../lodash-optimized */ "./src/app/lodash-optimized.ts");







var SalesTaxListComponent = /** @class */ (function () {
    function SalesTaxListComponent(store) {
        //
        var _this = this;
        this.store = store;
        this.showTaxPopup = false;
        this.customTaxTypesForTaxFilter = [];
        this.exceptTaxTypes = [];
        this.allowedSelection = 0;
        this.selectedTaxEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.taxAmountSumEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.closeOtherPopupEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.taxList = [];
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["ReplaySubject"](1);
        // get tax list and assign values to local vars
        this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["select"])(function (p) { return p.company.taxes; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroyed$)).subscribe(function (o) {
            if (o) {
                _this.taxes = o;
                _this.makeTaxList();
            }
            else {
                _this.taxes = [];
            }
        });
    }
    SalesTaxListComponent.prototype.ngOnDestroy = function () {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    SalesTaxListComponent.prototype.ngOnInit = function () {
    };
    SalesTaxListComponent.prototype.ngOnChanges = function (changes) {
        if ('applicableTaxes' in changes && changes.applicableTaxes.currentValue !== changes.applicableTaxes.previousValue) {
            this.applicableTaxesFn();
        }
        if ('totalAmount' in changes && (changes.totalAmount.currentValue !== changes.totalAmount.previousValue && !changes.totalAmount.isFirstChange())) {
            // this.sum = this.calculateSum();
            this.taxAmountSumEvent.emit(this.taxSum);
        }
        if ('customTaxTypesForTaxFilter' in changes && changes.customTaxTypesForTaxFilter.currentValue !== changes.customTaxTypesForTaxFilter.previousValue) {
            this.makeTaxList();
        }
        if ('exceptTaxTypes' in changes && changes.exceptTaxTypes.currentValue !== changes.exceptTaxTypes.previousValue) {
            this.makeTaxList();
        }
    };
    /**
     * imp to use multiple elements
     */
    SalesTaxListComponent.prototype.trackByFn = function (index) {
        return index;
    };
    SalesTaxListComponent.prototype.reCalculate = function () {
        this.distendFn();
    };
    SalesTaxListComponent.prototype.taxInputBlur = function (event) {
        if (event && event.relatedTarget && !this.taxListUl.nativeElement.contains(event.relatedTarget)) {
            this.toggleTaxPopup(false);
        }
    };
    /**
     * hide menus on outside click of span
     */
    SalesTaxListComponent.prototype.toggleTaxPopup = function (action) {
        this.closeOtherPopupEvent.emit(true);
        this.showTaxPopup = action;
    };
    SalesTaxListComponent.prototype.distendFn = function () {
        // set values
        this.allowedSelectionChecker();
        // this.sum = this.calculateSum();
        this.selectedTaxEvent.emit(this.getSelectedTaxes());
        this.taxAmountSumEvent.emit(this.taxSum);
    };
    SalesTaxListComponent.prototype.applicableTaxesFn = function () {
        var _this = this;
        if (this.applicableTaxes && this.applicableTaxes.length > 0) {
            this.taxList.forEach(function (item) {
                item.isChecked = _this.applicableTaxes.some(function (s) { return item.uniqueName === s; });
                item.isDisabled = false;
                return item;
            });
        }
        else {
            this.taxList.forEach(function (item) {
                item.isChecked = false;
                item.isDisabled = false;
                return item;
            });
        }
        this.distendFn();
    };
    /**
     * generate an array of string, contains selected tax uniqueNames
     * @returns {string[]}
     */
    SalesTaxListComponent.prototype.getSelectedTaxes = function () {
        return this.taxList.filter(function (p) { return p.isChecked; }).map(function (p) { return p.uniqueName; });
    };
    SalesTaxListComponent.prototype.isTaxApplicable = function (tax) {
        var today = moment__WEBPACK_IMPORTED_MODULE_2__(moment__WEBPACK_IMPORTED_MODULE_2__().format('DD-MM-YYYY'), 'DD-MM-YYYY', true).valueOf();
        var isApplicable = false;
        Object(_lodash_optimized__WEBPACK_IMPORTED_MODULE_6__["each"])(tax.taxDetail, function (det) {
            if (today >= moment__WEBPACK_IMPORTED_MODULE_2__(det.date, 'DD-MM-YYYY', true).valueOf()) {
                return isApplicable = true;
            }
        });
        return isApplicable;
    };
    SalesTaxListComponent.prototype.allowedSelectionChecker = function () {
        var _this = this;
        if (this.allowedSelection > 0) {
            // if (this.selectedTax.length >= this.allowedSelection) {
            //   this.taxList = this.taxList.map(m => {
            //     m.isDisabled = !m.isChecked;
            //     return m;
            //   });
            // } else {
            //   this.taxList = this.taxList.map(m => {
            //     m.isDisabled = m.isDisabled ? false : m.isDisabled;
            //     return m;
            //   });
            // }
        }
        if (this.allowedSelectionOfAType && this.allowedSelectionOfAType.length) {
            this.allowedSelectionOfAType.forEach(function (ast) {
                var selectedTaxes = _this.taxList.filter(function (f) { return f.isChecked; }).filter(function (t) { return ast.type.includes(t.type); });
                if (selectedTaxes.length >= ast.count) {
                    _this.taxList = _this.taxList.map((function (m) {
                        if (ast.type.includes(m.type) && !m.isChecked) {
                            m.isDisabled = true;
                        }
                        return m;
                    }));
                }
                else {
                    _this.taxList = _this.taxList.map((function (m) {
                        if (ast.type.includes(m.type) && m.isDisabled) {
                            m.isDisabled = false;
                        }
                        return m;
                    }));
                }
            });
        }
    };
    /**
     * make tax list
     */
    SalesTaxListComponent.prototype.makeTaxList = function () {
        var _this = this;
        this.taxList = [];
        if (this.taxes && this.taxes.length > 0) {
            if (this.customTaxTypesForTaxFilter && this.customTaxTypesForTaxFilter.length) {
                this.taxes = this.taxes.filter(function (f) { return _this.customTaxTypesForTaxFilter.includes(f.taxType); });
            }
            if (this.exceptTaxTypes && this.exceptTaxTypes.length) {
                this.taxes = this.taxes.filter(function (f) { return !_this.exceptTaxTypes.includes(f.taxType); });
            }
            this.taxes.forEach(function (tax) {
                var item = {
                    name: tax.name,
                    uniqueName: tax.uniqueName,
                    isChecked: false,
                    amount: tax.taxDetail[0].taxValue,
                    isDisabled: false,
                    type: tax.taxType
                };
                _this.taxList.push(item);
            });
            this.allowedSelectionChecker();
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], SalesTaxListComponent.prototype, "applicableTaxes", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Boolean)
    ], SalesTaxListComponent.prototype, "showTaxPopup", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], SalesTaxListComponent.prototype, "date", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], SalesTaxListComponent.prototype, "taxSum", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], SalesTaxListComponent.prototype, "customTaxTypesForTaxFilter", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], SalesTaxListComponent.prototype, "exceptTaxTypes", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], SalesTaxListComponent.prototype, "TaxSum", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Number)
    ], SalesTaxListComponent.prototype, "allowedSelection", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Array)
    ], SalesTaxListComponent.prototype, "allowedSelectionOfAType", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], SalesTaxListComponent.prototype, "selectedTaxEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], SalesTaxListComponent.prototype, "taxAmountSumEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"])
    ], SalesTaxListComponent.prototype, "closeOtherPopupEvent", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('taxListUl'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], SalesTaxListComponent.prototype, "taxListUl", void 0);
    SalesTaxListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'sales-tax-list',
            template: __webpack_require__(/*! ./sales.tax.list.component.html */ "./src/app/sales/tax-list/sales.tax.list.component.html"),
            providers: [],
            styles: ["\n      :host .dropdown-menu {\n          min-width: 200px;\n          height: inherit;\n          padding: 0;\n          overflow: auto;\n      }\n\n      :host .fake-disabled-label {\n          cursor: not-allowed;\n          opacity: .5;\n      }\n\n      .multi-select input.form-control {\n          background-image: unset !important;\n      }\n\n      .multi-select .caret {\n          display: block !important;\n      }\n\n      .multi-select.adjust .caret {\n          right: -2px !important;\n          top: 14px !important;\n      }\n\n      :host {\n          -moz-user-select: none;\n          -webkit-user-select: none;\n          -ms-user-select: none;\n          user-select: none;\n      }\n      .taxItem {\n      margin: 0;\n      float: left;\n      padding: 6px;\n      text-transform: capitalize;\n    }\n  "]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"]])
    ], SalesTaxListComponent);
    return SalesTaxListComponent;
}());



/***/ }),

/***/ "./src/app/shared/helpers/pipes/numberToWords/numberToWords.module.ts":
/*!****************************************************************************!*\
  !*** ./src/app/shared/helpers/pipes/numberToWords/numberToWords.module.ts ***!
  \****************************************************************************/
/*! exports provided: NumberToWordsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NumberToWordsModule", function() { return NumberToWordsModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _numberToWords_pipe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./numberToWords.pipe */ "./src/app/shared/helpers/pipes/numberToWords/numberToWords.pipe.ts");



var NumberToWordsModule = /** @class */ (function () {
    function NumberToWordsModule() {
    }
    NumberToWordsModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [],
            exports: [_numberToWords_pipe__WEBPACK_IMPORTED_MODULE_2__["NumberToWordsPipe"]],
            declarations: [_numberToWords_pipe__WEBPACK_IMPORTED_MODULE_2__["NumberToWordsPipe"]],
        })
    ], NumberToWordsModule);
    return NumberToWordsModule;
}());



/***/ }),

/***/ "./src/app/shared/helpers/pipes/numberToWords/numberToWords.pipe.ts":
/*!**************************************************************************!*\
  !*** ./src/app/shared/helpers/pipes/numberToWords/numberToWords.pipe.ts ***!
  \**************************************************************************/
/*! exports provided: NumberToWordsPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NumberToWordsPipe", function() { return NumberToWordsPipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");


var NumberToWordsPipe = /** @class */ (function () {
    function NumberToWordsPipe() {
        //
    }
    NumberToWordsPipe.prototype.transform = function (value) {
        var fraction = Math.round((value % 1) * 100);
        var fText = '';
        if (fraction > 0) {
            fText = "AND " + this.convertNumber(fraction) + " PAISE";
        }
        var convertNumber = this.convertNumber(value);
        if (convertNumber === '') {
            return '';
        }
        else {
            return convertNumber + ' ' + fText + ' ONLY';
        }
    };
    NumberToWordsPipe.prototype.convertNumber = function (no) {
        var ones = Array('', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN');
        var tens = Array('', '', 'TWENTY', 'THIRTY', 'FOURTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY');
        if ((no < 0) || (no > 999999999)) {
            return 'NUMBER OUT OF RANGE!';
        }
        var Gn = Math.floor(no / 10000000);
        /* Crore */
        no -= Gn * 10000000;
        var kn = Math.floor(no / 100000);
        /* lakhs */
        no -= kn * 100000;
        var Hn = Math.floor(no / 1000);
        /* thousand */
        no -= Hn * 1000;
        var Dn = Math.floor(no / 100);
        /* Tens (deca) */
        no = no % 100;
        /* Ones */
        var tn = Math.floor(no / 10);
        var one = Math.floor(no % 10);
        var res = '';
        if (Gn > 0) {
            res += this.convertNumber(Gn) + ' CRORE';
        }
        if (kn > 0) {
            res += (res === '' ? '' : ' ') + this.convertNumber(kn) + ' LAKH';
        }
        if (Hn > 0) {
            res += (res === '' ? '' : ' ') + this.convertNumber(Hn) + ' THOUSAND';
        }
        if (Dn) {
            res += (res === '' ? '' : ' ') + this.convertNumber(Dn) + ' HUNDRED';
        }
        if ((tn > 0) || (one > 0)) {
            if (!(res === '')) {
                res += ' ';
            }
            if (tn < 2) {
                res += ones[(tn * 10) + one];
            }
            else {
                res += tens[tn];
                if (one > 0) {
                    res += " " + ones[one];
                }
            }
        }
        return res;
    };
    NumberToWordsPipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({
            name: 'myNumberToWordsPipe',
            pure: true
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], NumberToWordsPipe);
    return NumberToWordsPipe;
}());



/***/ })

}]);