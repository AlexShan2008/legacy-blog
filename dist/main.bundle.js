webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(126);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(undefined);
// imports


// module
exports.push([module.i, "/*\r\nPublic CSS\r\n*/\n/**clear margin & padding**/\nbody, div, h1, h2, h3, h4, h5, h6, hr, p,\nblockquote,\ndl, dt, dd, ul, ol, li,\npre,\nform, fieldset, legend, button, input, textarea,\nth, td,\nimg {\n  border: medium none;\n  margin: 0;\n  padding: 0; }\n\n/**setting default style**/\nbody, button, input, select, textarea {\n  font: 12px/1.5 arial, sans-serif; }\n\ninput {\n  padding-top: 0;\n  padding-bottom: 0;\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box; }\n\nh1, h2, h3, h4, h5, h6 {\n  font-weight: normal;\n  font-size: 100%; }\n\naddress, caption, cite, code, dfn, em, strong, th, var {\n  font-weight: normal;\n  font-style: normal; }\n\n/**Reset list style**/\nul, ol {\n  list-style: none; }\n\n/**Reset hyperlink**/\na {\n  text-decoration: none;\n  color: #333; }\n  a:hover {\n    text-decoration: none;\n    color: #333; }\n\n/**Reset img border**/\ntable, img {\n  border: 0; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\n.clearfix {\n  display: inline-block; }\n  .clearfix:after {\n    content: \".\";\n    display: block;\n    height: 0;\n    clear: both;\n    visibility: hidden; }\n  * html .clearfix {\n    height: 1px; }\n\n.float-l {\n  float: left; }\n\n.float-r {\n  float: right; }\n\n.dis_i {\n  display: inline-block; }\n\n.text-center {\n  text-align: center; }\n\n/*\r\nPage index\r\n*/\n.content {\n  width: 1200px;\n  margin: 0 auto; }\n\n.main {\n  padding-top: 64px; }\n\n.article {\n  background-color: #f1f1f1; }\n  .article:hover .readArticle_link {\n    color: #3367d6; }\n  .article h1 {\n    font-size: 32px; }\n  .article h2 {\n    font-size: 18px; }\n\n.show {\n  display: block; }\n\n.hide {\n  display: none; }\n", ""]);

// exports


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(undefined);
// imports


// module
exports.push([module.i, "h1 {\n  color: red; }\n\n.header-wrap {\n  height: 64px;\n  width: 100%;\n  background-color: #fff;\n  -webkit-box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.12), inset 0 -1px 0 0 #e6e6e6;\n     -moz-box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.12), inset 0 -1px 0 0 #e6e6e6;\n          box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.12), inset 0 -1px 0 0 #e6e6e6;\n  position: fixed;\n  z-index: 10; }\n  .header-wrap .header {\n    height: 64px;\n    width: 1200px;\n    margin: 0 auto; }\n    .header-wrap .header ul li {\n      float: left; }\n    .header-wrap .header .logo {\n      float: left;\n      height: 100%;\n      display: table; }\n      .header-wrap .header .logo a {\n        display: table-cell;\n        vertical-align: middle; }\n        .header-wrap .header .logo a img {\n          width: 125px; }\n    .header-wrap .header .nav {\n      float: left;\n      margin-left: 15px;\n      height: 100%; }\n      .header-wrap .header .nav ul {\n        height: 100%; }\n        .header-wrap .header .nav ul li {\n          margin: 0 10px;\n          height: 100%;\n          display: table; }\n          .header-wrap .header .nav ul li a {\n            display: table-cell;\n            vertical-align: middle;\n            color: #757575;\n            font-size: 16px;\n            font-family: \"-webkit-pictograph\"; }\n            .header-wrap .header .nav ul li a:hover {\n              padding-top: 2px;\n              border-bottom: 2px solid #3367d6;\n              color: #000; }\n            .header-wrap .header .nav ul li a.active {\n              padding-top: 2px;\n              border-bottom: 2px solid #3367d6;\n              color: #000; }\n    .header-wrap .header .signin {\n      float: right;\n      height: 100%; }\n      .header-wrap .header .signin ul {\n        height: 100%; }\n        .header-wrap .header .signin ul li {\n          height: 100%;\n          display: table;\n          margin: 0 10px; }\n          .header-wrap .header .signin ul li a {\n            display: table-cell;\n            vertical-align: middle;\n            color: #757575;\n            font-size: 16px;\n            font-family: \"-webkit-pictograph\";\n            color: #000; }\n", ""]);

// exports


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(undefined);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n.layer-wrap {\n  position: fixed;\n  z-index: 200 !important;\n  left: 0;\n  top: 0;\n  display: none;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n     -moz-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n     -moz-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, 0.75); }\n  .layer-wrap .layer-container {\n    background-color: #fff;\n    padding: 30px 50px 50px;\n    width: 400px;\n    height: 400px;\n    -webkit-transition: all .3s ease;\n    -o-transition: all .3s ease;\n    -moz-transition: all .3s ease;\n    transition: all .3s ease; }\n    .layer-wrap .layer-container .layer-content {\n      width: 400px; }\n      .layer-wrap .layer-container .layer-content .closeBtn-wrap {\n        width: 400px;\n        height: 30px; }\n        .layer-wrap .layer-container .layer-content .closeBtn-wrap .closeBtn {\n          float: right;\n          background-color: transparent !important;\n          cursor: pointer; }\n          .layer-wrap .layer-container .layer-content .closeBtn-wrap .closeBtn svg {\n            width: 16px;\n            height: 16px;\n            display: block;\n            fill: #767676; }\n      .layer-wrap .layer-container .layer-content .row {\n        width: 100%;\n        color: #484848;\n        background-color: #ffffff;\n        position: relative;\n        margin-bottom: 25px; }\n        .layer-wrap .layer-container .layer-content .row .input-row.focus {\n          border: 2px solid #3367d6;\n          -webkit-transition: all .3s ease;\n          -o-transition: all .3s ease;\n          -moz-transition: all .3s ease;\n          transition: all .3s ease; }\n        .layer-wrap .layer-container .layer-content .row .input-row {\n          border: 2px solid #DBDBDB;\n          -webkit-border-radius: 2px;\n             -moz-border-radius: 2px;\n                  border-radius: 2px;\n          height: 46px;\n          position: relative;\n          -webkit-transition: all .3s ease;\n          -o-transition: all .3s ease;\n          -moz-transition: all .3s ease;\n          transition: all .3s ease; }\n          .layer-wrap .layer-container .layer-content .row .input-row .input-text {\n            overflow: hidden;\n            float: left;\n            width: 90%; }\n            .layer-wrap .layer-container .layer-content .row .input-row .input-text input {\n              display: block;\n              font-size: 19px;\n              font-family: \"Hiragino Sans GB\", \"\\534E\\6587\\7EC6\\9ED1\", \"STHeiti\", \"\\5FAE\\8F6F\\96C5\\9ED1\", \"Microsoft YaHei\", SimHei, \"Helvetica Neue\", Helvetica, Arial, sans-serif !important;\n              line-height: 24px;\n              border: 0px;\n              outline: none;\n              padding: 11px;\n              width: 100%; }\n          .layer-wrap .layer-container .layer-content .row .input-row .input-icon {\n            width: 10%;\n            float: left;\n            overflow: hidden; }\n            .layer-wrap .layer-container .layer-content .row .input-row .input-icon .email-icon {\n              width: 19px;\n              height: 19px;\n              display: block;\n              position: absolute;\n              padding-top: 11px;\n              right: 12px; }\n        .layer-wrap .layer-container .layer-content .row .input-row.warning {\n          border: 2px solid #FF5A5F; }\n        .layer-wrap .layer-container .layer-content .row .tip-text {\n          position: absolute;\n          top: 53px;\n          left: 13px; }\n\n.layer-wrap.show {\n  display: -webkit-box !important;\n  display: -webkit-flex !important;\n  display: -moz-box !important;\n  display: -ms-flexbox !important;\n  display: flex !important; }\n", ""]);

// exports


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(undefined);
// imports


// module
exports.push([module.i, ".showPassword-btn {\n  display: block;\n  text-align: right;\n  margin-top: 20px; }\n  .showPassword-btn button {\n    cursor: pointer;\n    outline: none;\n    background-color: transparent;\n    font-size: 16px;\n    color: #3367d6; }\n    .showPassword-btn button:hover {\n      text-decoration: underline;\n      color: #0754f8; }\n\n.signin-btn {\n  border: none;\n  width: 400px; }\n  .signin-btn button {\n    -webkit-border-radius: 4px !important;\n       -moz-border-radius: 4px !important;\n            border-radius: 4px !important;\n    width: 100%;\n    -webkit-transition: background 0.3s, border-color 0.3s !important;\n    -o-transition: background 0.3s, border-color 0.3s !important;\n    -moz-transition: background 0.3s, border-color 0.3s !important;\n    transition: background 0.3s, border-color 0.3s !important;\n    font-size: 19px;\n    padding: 12px 24px;\n    background-color: #3367d6;\n    text-align: center;\n    cursor: pointer;\n    color: #fff;\n    font-weight: 700; }\n    .signin-btn button:hover {\n      background-color: #0754f8; }\n\n.sepLine-wrap {\n  overflow: hidden;\n  text-align: center; }\n  .sepLine-wrap .sepLine-text:before, .sepLine-wrap .sepLine-text:after {\n    content: '';\n    position: absolute;\n    border-bottom: 1px solid #e4e4e4;\n    top: 50%;\n    width: 5000px; }\n  .sepLine-wrap .sepLine-text:before {\n    right: 100%; }\n  .sepLine-wrap .sepLine-text {\n    position: relative;\n    font-weight: normal;\n    font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif !important;\n    font-size: 15px !important;\n    word-wrap: break-word;\n    line-height: 18px;\n    letter-spacing: 0.2px;\n    padding: 0 16px 0 16px;\n    color: #767676;\n    display: inline; }\n  .sepLine-wrap .sepLine-text:after {\n    left: 100%; }\n\n.reg-warp {\n  width: 400px;\n  height: 50px;\n  margin-top: 20px;\n  display: table; }\n  .reg-warp .reg-left, .reg-warp .reg-btn {\n    display: table-cell;\n    vertical-align: middle; }\n  .reg-warp .reg-left {\n    font-size: 16px; }\n  .reg-warp .reg-btn {\n    float: right;\n    margin-top: 2px;\n    padding: 10px;\n    background: none;\n    outline: none;\n    cursor: pointer;\n    -webkit-border-radius: 5px;\n       -moz-border-radius: 5px;\n            border-radius: 5px;\n    border: 1px solid #3367d6;\n    text-align: center;\n    color: #3367d6;\n    font-size: 16px;\n    -webkit-transition: all .3s ease;\n    -o-transition: all .3s ease;\n    -moz-transition: all .3s ease;\n    transition: all .3s ease; }\n    .reg-warp .reg-btn:hover {\n      background-color: #3367d6;\n      color: #fff;\n      -webkit-transition: all .3s ease;\n      -o-transition: all .3s ease;\n      -moz-transition: all .3s ease;\n      transition: all .3s ease; }\n", ""]);

// exports


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(undefined);
// imports


// module
exports.push([module.i, ".footer {\n  margin-top: 50px;\n  width: 100%;\n  height: 100px;\n  line-height: 100px;\n  color: #586069 !important;\n  font-size: 12px;\n  vertical-align: middle; }\n  .footer .content {\n    border-top: 1px #e1e4e8 solid !important;\n    height: 100%; }\n    .footer .content .copy {\n      float: left; }\n    .footer .content .icon {\n      width: 30px;\n      vertical-align: middle; }\n    .footer .content .ICP {\n      float: right;\n      margin-left: 20px; }\n", ""]);

// exports


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(undefined);
// imports


// module
exports.push([module.i, "@media screen and (min-width: 1200px) {\n  .pic {\n    width: 800px;\n    height: 480px;\n    overflow: hidden; }\n    .pic img {\n      width: 100%;\n      -webkit-transition: all 2s ease;\n      -o-transition: all 2s ease;\n      -moz-transition: all 2s ease;\n      transition: all 2s ease; }\n      .pic img:hover {\n        -webkit-transform: scale(1.2);\n           -moz-transform: scale(1.2);\n            -ms-transform: scale(1.2);\n             -o-transform: scale(1.2);\n                transform: scale(1.2);\n        -webkit-transition: all 3s ease;\n        -o-transition: all 3s ease;\n        -moz-transition: all 3s ease;\n        transition: all 3s ease; } }\n", ""]);

// exports


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(undefined);
// imports


// module
exports.push([module.i, ".text {\n  width: 350px;\n  height: 430px;\n  padding: 25px; }\n  .text .readArticle_topic {\n    font-size: 14px;\n    letter-spacing: 1.5px;\n    line-height: 22px;\n    display: block;\n    font-weight: 500;\n    margin-bottom: 10px; }\n  .text h3 {\n    letter-spacing: -.5px;\n    font-family: \"-webkit-pictograph\";\n    font-size: 38px;\n    color: #414141;\n    line-height: 45px;\n    margin-bottom: 25px; }\n  .text .readArticle_content {\n    font-size: 18px;\n    font-weight: 300;\n    line-height: 28px;\n    color: #888;\n    height: 100px;\n    overflow: hidden;\n    -o-text-overflow: ellipsis;\n       text-overflow: ellipsis;\n    margin-bottom: 20px; }\n  .text .readArticle_link {\n    line-height: 18px;\n    font-weight: 700;\n    font-size: 16px;\n    font-family: \"-webkit-pictograph\";\n    color: #414141; }\n    .text .readArticle_link:hover {\n      color: #3367d6; }\n", ""]);

// exports


/***/ }),
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(26);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(7)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(26, function() {
			var newContent = __webpack_require__(26);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(33);

var _reactDom2 = _interopRequireDefault(_reactDom);

__webpack_require__(125);

var _reactRouterDom = __webpack_require__(52);

var _reactRedux = __webpack_require__(46);

var _index = __webpack_require__(127);

var _index2 = _interopRequireDefault(_index);

var _wrap = __webpack_require__(130);

var _wrap2 = _interopRequireDefault(_wrap);

var _Header = __webpack_require__(146);

var _Header2 = _interopRequireDefault(_Header);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// /*引入组件*/
/**
 * Created by ShanGuo on 2017/12/18.
 */
var UsersPage = function UsersPage() {
    return _react2.default.createElement(
        'div',
        null,
        'Users Page'
    );
};

var App = function App() {
    return _react2.default.createElement(
        _reactRedux.Provider,
        { store: _index2.default },
        _react2.default.createElement(
            _reactRouterDom.BrowserRouter,
            null,
            _react2.default.createElement(
                _reactRouterDom.Switch,
                null,
                _react2.default.createElement(_reactRouterDom.Route, { path: '/', exact: true, component: _wrap2.default }),
                _react2.default.createElement(_reactRouterDom.Route, { path: '/article', component: _Header2.default }),
                _react2.default.createElement(_reactRouterDom.Route, { path: '/article/post', component: UsersPage }),
                _react2.default.createElement(_reactRouterDom.Route, { path: '/article/post', component: UsersPage }),
                _react2.default.createElement(_reactRouterDom.Route, { path: '/topics', component: UsersPage }),
                _react2.default.createElement(_reactRouterDom.Redirect, { to: '/' })
            )
        )
    );
};

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('root'));

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(7)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(25, function() {
			var newContent = __webpack_require__(25);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 126 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = __webpack_require__(13);

var _index = __webpack_require__(128);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// let store = createStore(allReducer,window.STATE_FROM_SERVER);
var store = (0, _redux.createStore)(_index2.default);

exports.default = store;

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _actionTypes = __webpack_require__(129);

var CONSTANTS = _interopRequireWildcard(_actionTypes);

var _redux = __webpack_require__(13);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// import { routerReducer } from 'react-router-redux';
// import {toggle} from '../actions/index';

var initialState = {
    show: true,
    hide: true
};

var toggleLogin = function toggleLogin() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    switch (action.type) {
        case CONSTANTS.SHOW_LOGIN:
            return Object.assign({}, state, {
                type: action.type,
                show: state.show
            });
        case CONSTANTS.HIDE_LOGIN:
            return Object.assign({}, state, {
                type: action.type,
                hide: state.hide
            });
        default:
            return state;
    }
};

exports.default = (0, _redux.combineReducers)({
    toggleLogin: toggleLogin
    // routing: routerReducer
});

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SHOW_LOGIN = exports.SHOW_LOGIN = 'show_login'; // 显示login窗口；
var HIDE_LOGIN = exports.HIDE_LOGIN = 'hide_login'; // 显示login窗口；
var MY_INFO = exports.MY_INFO = 'my_info'; // 获取我的个人信息
var GET_UP_TIME = exports.GET_UP_TIME = 'get_up_time'; // 起床时间
var SET_MY_INFO = exports.SET_MY_INFO = 'set_my_info'; // 设置个人信息

var MY_LIST = exports.MY_LIST = 'my_list'; // 获取我的列表
var MY_LIST_LOADING = exports.MY_LIST_LOADING = 'my_list_loading'; // 我的列表读取状态

var TODAY_LIST = exports.TODAY_LIST = 'toady_list'; // 获取今日列表信息
var TODAY_LIST_LOADING = exports.TODAY_LIST_LOADING = 'today_list_loading'; // 获取今日列表信息状态

var RANK_LIST = exports.RANK_LIST = 'rank_list'; // 获取排行列表

var DETAIL_INFO = exports.DETAIL_INFO = 'detail_info'; // 获取详情

var OTHER_USER = exports.OTHER_USER = 'other_user'; // 获取其他人的信息

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Header = __webpack_require__(131);

var _Header2 = _interopRequireDefault(_Header);

var _Footer = __webpack_require__(139);

var _Footer2 = _interopRequireDefault(_Footer);

var _Pic = __webpack_require__(141);

var _Pic2 = _interopRequireDefault(_Pic);

var _Text = __webpack_require__(143);

var _Text2 = _interopRequireDefault(_Text);

var _Clock = __webpack_require__(145);

var _Clock2 = _interopRequireDefault(_Clock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Wrap = function (_Component) {
    _inherits(Wrap, _Component);

    function Wrap(props) {
        _classCallCheck(this, Wrap);

        var _this = _possibleConstructorReturn(this, (Wrap.__proto__ || Object.getPrototypeOf(Wrap)).call(this, props));

        _this.state = {};
        return _this;
    }

    _createClass(Wrap, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'app-container' },
                _react2.default.createElement(_Header2.default, null),
                _react2.default.createElement(
                    'div',
                    { className: 'content main text-center' },
                    _react2.default.createElement(
                        'a',
                        { href: '/article-01', className: 'article clearfix' },
                        _react2.default.createElement(_Pic2.default, { url: '/img/banner/banner-01_small.jpg', name: 'beijing' }),
                        _react2.default.createElement(_Text2.default, null)
                    )
                ),
                _react2.default.createElement(_Footer2.default, null)
            );
        }
    }]);

    return Wrap;
}(_react.Component);

exports.default = Wrap;

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(60);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Sign = __webpack_require__(132);

var _Sign2 = _interopRequireDefault(_Sign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function Logo() {
    return _react2.default.createElement(
        'div',
        { className: 'logo' },
        _react2.default.createElement(
            'a',
            { href: '/' },
            _react2.default.createElement('img', { src: '/img/logo.png', alt: 'AlexShan' })
        )
    );
}

function Nav() {
    return _react2.default.createElement(
        'nav',
        { className: 'nav' },
        _react2.default.createElement(
            'ul',
            { className: 'clearfix' },
            _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                    'a',
                    { className: 'active', href: '/' },
                    'Home'
                )
            ),
            _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                    'a',
                    { href: '/article' },
                    'Latest Stories'
                )
            ),
            _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                    'a',
                    { href: '/article/post' },
                    'Post Stories'
                )
            ),
            _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                    'a',
                    { href: '/topics' },
                    'Topics'
                )
            )
        )
    );
}

var Header = function (_Component) {
    _inherits(Header, _Component);

    function Header(props) {
        _classCallCheck(this, Header);

        var _this = _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, props));

        _this.state = {
            showFlag: "layer-wrap"
        };
        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }

    _createClass(Header, [{
        key: 'handleClick',
        value: function handleClick() {
            this.setState({});
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'header-wrap' },
                _react2.default.createElement(
                    'header',
                    { className: 'header' },
                    _react2.default.createElement(Logo, null),
                    _react2.default.createElement(Nav, null),
                    _react2.default.createElement(_Sign2.default, null)
                )
            );
        }
    }]);

    return Header;
}(_react.Component);

exports.default = Header;

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Layer = __webpack_require__(133);

var _Layer2 = _interopRequireDefault(_Layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Signin = function (_Component) {
    _inherits(Signin, _Component);

    function Signin(props) {
        _classCallCheck(this, Signin);

        var _this = _possibleConstructorReturn(this, (Signin.__proto__ || Object.getPrototypeOf(Signin)).call(this, props));

        _this.state = {
            showClassName: "layer-wrap"
        };
        _this.handleClick = _this.handleClick.bind(_this);
        _this.toggleShow = _this.toggleShow.bind(_this);
        return _this;
    }

    _createClass(Signin, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'handleClick',
        value: function handleClick(e) {
            e.preventDefault();
            this.setState({
                showClassName: "layer-wrap show"
            });
        }

        //处理子函数传回来的state,改变自身的state

    }, {
        key: 'toggleShow',
        value: function toggleShow() {
            this.setState({
                showClassName: 'layer-wrap'
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'signin' },
                _react2.default.createElement(
                    'ul',
                    { className: 'clearfix' },
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'a',
                            { onClick: this.handleClick, href: 'javascript:void(0)' },
                            'Sign in'
                        )
                    ),
                    _react2.default.createElement(
                        'li',
                        null,
                        _react2.default.createElement(
                            'a',
                            { href: '/user/signout' },
                            'Sign out'
                        )
                    )
                ),
                _react2.default.createElement(_Layer2.default, {
                    showClassName: this.state.showClassName,
                    toggleShow: this.toggleShow })
            );
        }
    }]);

    return Signin;
}(_react.Component);

exports.default = Signin;

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(134);

__webpack_require__(135);

var _Email = __webpack_require__(136);

var _Email2 = _interopRequireDefault(_Email);

var _Password = __webpack_require__(137);

var _Password2 = _interopRequireDefault(_Password);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function Signbtn(props) {
    return _react2.default.createElement(
        'div',
        { className: 'row signin-btn' },
        _react2.default.createElement(
            'button',
            { type: 'submit', onClick: props.handleSignin },
            'Sign in'
        )
    );
}

function SeparatorLine() {
    return _react2.default.createElement(
        'div',
        { className: 'sepLine-wrap' },
        _react2.default.createElement(
            'span',
            { className: 'sepLine-text' },
            _react2.default.createElement(
                'span',
                null,
                'Or'
            )
        )
    );
}

function RegBtn() {
    return _react2.default.createElement(
        'div',
        { className: 'reg-warp' },
        _react2.default.createElement(
            'span',
            { className: 'reg-left' },
            'No account yet?'
        ),
        _react2.default.createElement(
            'button',
            { className: 'reg-btn' },
            'Create Account'
        )
    );
}

function CloseIcon() {
    return _react2.default.createElement(
        'svg',
        { viewBox: '0 0 24 24', role: 'img', 'aria-label': '\u5173\u95ED', focusable: 'false' },
        _react2.default.createElement('path', {
            d: 'm23.25 24c-.19 0-.38-.07-.53-.22l-10.72-10.72-10.72 10.72c-.29.29-.77.29-1.06 0s-.29-.77 0-1.06l10.72-10.72-10.72-10.72c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l10.72 10.72 10.72-10.72c.29-.29.77-.29 1.06 0s .29.77 0 1.06l-10.72 10.72 10.72 10.72c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22' })
    );
}

var Layer = function (_Component) {
    _inherits(Layer, _Component);

    function Layer(props) {
        _classCallCheck(this, Layer);

        var _this = _possibleConstructorReturn(this, (Layer.__proto__ || Object.getPrototypeOf(Layer)).call(this, props));

        _this.state = {
            email: '',
            password: '',
            checkInput: '',
            emailClassName: '',
            tipClass: '',
            tipText: 'Please input Email 11111111 Address'

        };
        _this.handleEmail = _this.handleEmail.bind(_this);
        _this.handlePassword = _this.handlePassword.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.closeLayer = _this.closeLayer.bind(_this);
        _this.checkEmail = _this.checkEmail.bind(_this);
        _this.resetCheckEmail = _this.resetCheckEmail.bind(_this);
        _this.checkPwd = _this.checkPwd.bind(_this);
        return _this;
    }

    _createClass(Layer, [{
        key: 'handleEmail',
        value: function handleEmail(e) {
            this.setState({
                email: e.target.value
            });
        }
    }, {
        key: 'handlePassword',
        value: function handlePassword(e) {
            this.setState({
                password: e.target.value
            });
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(e) {
            e.preventDefault();

            this.checkEmail();

            this.setState({
                checkInput: true
            });
            var data = {
                email: this.state.email,
                password: this.state.password
            };

            console.log(data);
        }
    }, {
        key: 'closeLayer',
        value: function closeLayer() {
            this.props.toggleShow();
            this.setState({
                checkInput: false
            });
        }
    }, {
        key: 'checkEmail',
        value: function checkEmail() {
            var email = this.state.email;
            if (!email) {
                this.setState({
                    emailClassName: 'input-row warning',
                    tipClass: 'show',
                    tipText: this.state.tipText

                });
            }
            if (!_checkEmail(email)) {
                this.setState({
                    tipClass: 'show',
                    className: 'input-row warning',
                    tipText: 'Please input Correct Email Address'
                });
            } else {
                this.setState({
                    className: 'input-row',
                    tipClass: ''
                });
            }
        }
    }, {
        key: 'resetCheckEmail',
        value: function resetCheckEmail() {
            this.setState({
                emailClassName: '',
                tipClass: ''
            });
        }
    }, {
        key: 'checkPwd',
        value: function checkPwd() {
            this.setState({
                checkInput: false
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var showClassName = this.props.showClassName;
            return _react2.default.createElement(
                'div',
                { className: showClassName },
                _react2.default.createElement(
                    'div',
                    { className: 'layer-container' },
                    _react2.default.createElement(
                        'div',
                        { className: 'layer-content' },
                        _react2.default.createElement(
                            'div',
                            { className: 'closeBtn-wrap clearfix' },
                            _react2.default.createElement(
                                'button',
                                { type: 'button', className: 'closeBtn', onClick: this.closeLayer },
                                _react2.default.createElement(CloseIcon, null)
                            )
                        ),
                        _react2.default.createElement(_Email2.default, {
                            handleEmail: this.handleEmail,
                            email: this.state.email,
                            className: this.state.emailClassName,
                            resetCheckEmail: this.resetCheckEmail,
                            tipClass: this.state.tipClass }),
                        _react2.default.createElement(_Password2.default, {
                            handlePassword: this.handlePassword,
                            checkPwd: this.checkPwd }),
                        _react2.default.createElement(Signbtn, { handleSignin: this.handleSubmit }),
                        _react2.default.createElement(SeparatorLine, null),
                        _react2.default.createElement(RegBtn, null)
                    )
                )
            );
        }
    }]);

    return Layer;
}(_react.Component);

exports.default = Layer;


function _checkEmail(email) {
    var reg = /^(\w)+@[\w\.]+$/;
    return reg.test(email);
}
function checkPassword(password) {
    var reg = /^[0-9a-zA-Z_]{6,8}$/;
    return reg.test(password);
}

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(7)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(27, function() {
			var newContent = __webpack_require__(27);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(28);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(7)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(28, function() {
			var newContent = __webpack_require__(28);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Email = function (_Component) {
    _inherits(Email, _Component);

    function Email(props) {
        _classCallCheck(this, Email);

        var _this = _possibleConstructorReturn(this, (Email.__proto__ || Object.getPrototypeOf(Email)).call(this, props));

        _this.state = {
            value: '',
            className: 'input-row',
            showError: 'hide',
            showErrorText: 'Please input Email Address'
        };
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    _createClass(Email, [{
        key: 'componentWillMount',
        value: function componentWillMount() {}
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'handleFocus',
        value: function handleFocus(e) {
            this.props.resetCheckEmail();
            this.setState({
                className: 'input-row focus'
            });
            if (!e.target.value) {
                this.setState({
                    showErrorText: 'Please input Email Address',
                    showError: 'show'
                });
            }
        }
    }, {
        key: 'handleBlur',
        value: function handleBlur(e) {
            if (!e.target.value) {
                this.setState({
                    className: 'input-row',
                    showError: 'hide'
                });
                return;
            }
            if (!checkEmail(e.target.value)) {
                this.setState({
                    showError: 'show',
                    className: 'input-row warning'
                });
            } else {
                this.setState({
                    className: 'input-row'
                });
            }
        }
    }, {
        key: 'handleChange',
        value: function handleChange(e) {
            var email = e.target.value;
            if (!email) {
                this.setState({
                    showErrorText: 'Please input Email Address'
                });
                return;
            }
            if (email && !checkEmail(email)) {
                this.setState({
                    showError: 'show',
                    className: 'input-row warning',
                    showErrorText: 'Please input Correct Email Address'
                });
            }
            if (checkEmail(email)) {
                this.setState({
                    showError: 'hide',
                    className: 'input-row focus'
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var className = this.props.className;
            var handleEmail = this.props.handleEmail;
            var tipClass = this.props.tipClass;
            var tipText = this.props.tipText;

            return _react2.default.createElement(
                'div',
                { className: 'row' },
                _react2.default.createElement(
                    'div',
                    { className: className ? className : this.state.className },
                    _react2.default.createElement(
                        'div',
                        { className: 'input-text' },
                        _react2.default.createElement('input', { className: 'email', name: 'email', type: 'email', placeholder: 'Email Address',
                            onFocus: this.handleFocus,
                            onBlur: this.handleBlur,
                            onKeyUp: this.handleChange,
                            onChange: handleEmail })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'input-icon' },
                        _react2.default.createElement(EmailIcon, null)
                    )
                ),
                _react2.default.createElement(TipText, {
                    showError: tipClass ? tipClass : this.state.showError,
                    showErrorText: this.state.showErrorText })
            );
        }
    }]);

    return Email;
}(_react.Component);

exports.default = Email;

var TipText = function (_Component2) {
    _inherits(TipText, _Component2);

    function TipText(props) {
        _classCallCheck(this, TipText);

        return _possibleConstructorReturn(this, (TipText.__proto__ || Object.getPrototypeOf(TipText)).call(this, props));
    }

    _createClass(TipText, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'tip-text' },
                _react2.default.createElement(
                    'p',
                    { className: this.props.showError },
                    this.props.showErrorText
                )
            );
        }
    }]);

    return TipText;
}(_react.Component);

function checkEmail(email) {
    var reg = /^(\w)+@[\w\.]+$/;
    return reg.test(email);
}
function EmailIcon() {
    return _react2.default.createElement(
        'svg',
        { className: 'email-icon', viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' },
        _react2.default.createElement('path', {
            d: 'm22.5 4h-21c-.83 0-1.5.67-1.5 1.51v12.99c0 .83.67 1.5 1.5 1.5h20.99a1.5 1.5 0 0 0 1.51-1.51v-12.98c0-.84-.67-1.51-1.5-1.51zm.5 14.2-6.14-7.91 6.14-4.66v12.58zm-.83-13.2-9.69 7.36c-.26.2-.72.2-.98 0l-9.67-7.36h20.35zm-21.17.63 6.14 4.67-6.14 7.88zm.63 13.37 6.3-8.1 2.97 2.26c.62.47 1.57.47 2.19 0l2.97-2.26 6.29 8.1z' })
    );
}

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Showpassword = __webpack_require__(138);

var _Showpassword2 = _interopRequireDefault(_Showpassword);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Password = function (_Component) {
    _inherits(Password, _Component);

    function Password(props) {
        _classCallCheck(this, Password);

        var _this = _possibleConstructorReturn(this, (Password.__proto__ || Object.getPrototypeOf(Password)).call(this, props));

        _this.state = {
            className: 'input-row',
            passwordType: 'password',
            showText: 'Show Password',
            showError: 'hide',
            showErrorText: 'Please input Password'
        };
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        _this.showPassword = _this.showPassword.bind(_this);
        return _this;
    }

    _createClass(Password, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'handleFocus',
        value: function handleFocus(e) {
            this.setState({
                className: 'input-row focus'
            });
            if (!e.target.value) {
                this.setState({
                    showErrorText: 'Please input Password',
                    showError: 'show'
                });
            }
        }
    }, {
        key: 'handleBlur',
        value: function handleBlur(e) {
            if (!e.target.value && !this.props.checkStatus) {
                this.setState({
                    className: 'input-row',
                    showError: 'hide'
                });
                return;
            }
            if (!checkPassword(e.target.value)) {
                this.setState({
                    showError: 'show',
                    className: 'input-row warning'
                });
            } else {
                this.setState({
                    className: 'input-row'
                });
            }
        }
    }, {
        key: 'handleChange',
        value: function handleChange(e) {
            var password = e.target.value;
            /* 未输入时*/
            if (!password) {
                this.setState({
                    showErrorText: 'Please input Password'
                });
                return;
            }
            /* 输入时温馨提醒*/
            if (password && !checkPassword(password)) {
                this.setState({
                    showError: 'show',
                    className: 'input-row warning',
                    showErrorText: 'The password consists of 6-8 alphanumeric or underscore'
                });
            }
            /* 输入的值不符合正则匹配时*/
            if (checkPassword(password)) {
                this.setState({
                    showError: 'hide',
                    className: 'input-row focus'
                });
            }
        }
    }, {
        key: 'showPassword',
        value: function showPassword() {
            this.setState({
                passwordType: this.state.passwordType === 'password' ? 'text' : 'password',
                showText: this.state.passwordType === 'password' ? 'Hide Password' : 'Show Password'
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var handlePassword = this.props.handlePassword;
            return _react2.default.createElement(
                'div',
                { className: 'row' },
                _react2.default.createElement(
                    'div',
                    { className: this.state.className },
                    _react2.default.createElement(
                        'div',
                        { className: 'input-text' },
                        _react2.default.createElement('input', { className: 'password', name: 'password', type: this.state.passwordType, placeholder: 'Password',
                            onFocus: this.handleFocus,
                            onBlur: this.handleBlur,
                            onKeyUp: this.handleChange,
                            onChange: handlePassword })
                    ),
                    _react2.default.createElement('div', { className: 'input-icon' })
                ),
                _react2.default.createElement(TipText, { showError: this.state.showError,
                    showErrorText: this.state.showErrorText }),
                _react2.default.createElement(_Showpassword2.default, { showpassword: this.showPassword, showText: this.state.showText })
            );
        }
    }]);

    return Password;
}(_react.Component);

exports.default = Password;

var TipText = function (_Component2) {
    _inherits(TipText, _Component2);

    function TipText(props) {
        _classCallCheck(this, TipText);

        return _possibleConstructorReturn(this, (TipText.__proto__ || Object.getPrototypeOf(TipText)).call(this, props));
    }

    _createClass(TipText, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'tip-text' },
                _react2.default.createElement(
                    'p',
                    { className: this.props.showError },
                    this.props.showErrorText
                )
            );
        }
    }]);

    return TipText;
}(_react.Component);

function checkPassword(password) {
    var reg = /^[0-9a-zA-Z_]{6,8}$/;
    return reg.test(password);
}

function LockIocn() {
    return _react2.default.createElement(
        'svg',
        { className: 'email-icon', viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' },
        _react2.default.createElement('path', {
            d: 'm19.5 9h-.5v-2a7 7 0 1 0 -14 0v2h-.5c-.78 0-1.5.72-1.5 1.5v12c0 .78.72 1.5 1.5 1.5h15c .78 0 1.5-.72 1.5-1.5v-12c0-.78-.72-1.5-1.5-1.5zm.5 13.5c0 .22-.28.5-.5.5h-15c-.22 0-.5-.28-.5-.5v-12c0-.22.28-.5.5-.5h1a .5.5 0 0 0 .5-.5v-2.5a6 6 0 1 1 12 0v2.5a.5.5 0 0 0 .5.5h1c .22 0 .5.28.5.5zm-8-10.5a3 3 0 0 0 -3 3c0 .83.36 1.59.94 2.15l-.9 2.16a.5.5 0 0 0 .46.69h5a .5.5 0 0 0 .46-.69l-.87-2.19c.56-.55.91-1.31.91-2.13a3 3 0 0 0 -3-3zm1.04 5.19.72 1.81h-3.51l.74-1.79a.5.5 0 0 0 -.17-.6 2 2 0 1 1 3.18-1.61c0 .64-.31 1.24-.8 1.6a.5.5 0 0 0 -.17.59zm-1.04-14.19a4 4 0 0 0 -4 4v2.5a.5.5 0 0 0 .5.5h7a .5.5 0 0 0 .5-.5v-2.5a4 4 0 0 0 -4-4zm3 6h-6v-2a3 3 0 1 1 6 0z' })
    );
}

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TogglePassword = function (_Component) {
    _inherits(TogglePassword, _Component);

    function TogglePassword(props) {
        _classCallCheck(this, TogglePassword);

        return _possibleConstructorReturn(this, (TogglePassword.__proto__ || Object.getPrototypeOf(TogglePassword)).call(this, props));
    }

    _createClass(TogglePassword, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: "showPassword-btn" },
                _react2.default.createElement(
                    "button",
                    { onClick: this.props.showpassword },
                    this.props.showText
                )
            );
        }
    }]);

    return TogglePassword;
}(_react.Component);

exports.default = TogglePassword;

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(140);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function ICP() {
    return _react2.default.createElement(
        'div',
        { className: 'ICP dis_i' },
        '\u4EACICP\u5907 17040738\u53F7-1'
    );
}

function Icon() {
    return _react2.default.createElement('img', { className: 'icon dis_i', src: '/img/logo-icon-gray-round.png', alt: '\u6570\u636E\u53EF\u89C6\u5316-AlexShan' });
}

function Copy() {
    return _react2.default.createElement(
        'div',
        { className: 'copy dis_i' },
        '\xA9\xA02018 Shan&Guo'
    );
}

var Footer = function (_Component) {
    _inherits(Footer, _Component);

    function Footer() {
        _classCallCheck(this, Footer);

        return _possibleConstructorReturn(this, (Footer.__proto__ || Object.getPrototypeOf(Footer)).apply(this, arguments));
    }

    _createClass(Footer, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'footer',
                { className: 'footer' },
                _react2.default.createElement(
                    'div',
                    { className: 'content text-center' },
                    _react2.default.createElement(Copy, null),
                    _react2.default.createElement(Icon, null),
                    _react2.default.createElement(ICP, null)
                )
            );
        }
    }]);

    return Footer;
}(_react.Component);

exports.default = Footer;

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(29);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(7)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(29, function() {
			var newContent = __webpack_require__(29);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(142);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pic = function (_Component) {
    _inherits(Pic, _Component);

    function Pic(props) {
        _classCallCheck(this, Pic);

        return _possibleConstructorReturn(this, (Pic.__proto__ || Object.getPrototypeOf(Pic)).call(this, props));
    }

    _createClass(Pic, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'pic float-l' },
                _react2.default.createElement('img', {
                    src: this.props.url,
                    alt: this.props.name
                })
            );
        }
    }]);

    return Pic;
}(_react.Component);

exports.default = Pic;

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(30);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(7)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(30, function() {
			var newContent = __webpack_require__(30);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(144);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by ShanGuo on 2017/12/21.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var articleData = [{
    "id": 1,
    "topic": "Front End",
    "title": "The #MyFutureMe winner is often the only girl—but she’s going to change that",
    "content": "After you became a finalist, you attended TEDWomen. What was that like?"
}, {
    "id": 2,
    "topic": "Full Stack",
    "title": "02The #MyFutureMe winner is often the only girl—but she’s going to change that",
    "content": "02After you became a finalist, you attended TEDWomen. What was that like?"
}];

function Topic(props) {
    return _react2.default.createElement(
        'span',
        { className: 'readArticle_topic' },
        props.topic
    );
}

function Title(props) {
    return _react2.default.createElement(
        'h3',
        { className: 'readArticle_title' },
        props.title
    );
}

function Paragraph(props) {
    return _react2.default.createElement(
        'p',
        { className: 'readArticle_content' },
        props.content
    );
}

function ReadArticle() {
    return _react2.default.createElement(
        'p',
        { className: 'readArticle_link' },
        'READ ARTICLE'
    );
}

var Text = function (_Component) {
    _inherits(Text, _Component);

    function Text(props) {
        _classCallCheck(this, Text);

        return _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, props));
    }

    _createClass(Text, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'text float-r' },
                _react2.default.createElement(Topic, { topic: articleData[0].topic }),
                _react2.default.createElement(Title, { title: articleData[0].title }),
                _react2.default.createElement(Paragraph, { content: articleData[0].content }),
                _react2.default.createElement(ReadArticle, null)
            );
        }
    }]);

    return Text;
}(_react.Component);

exports.default = Text;

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(31);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(7)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(31, function() {
			var newContent = __webpack_require__(31);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by ShanGuo on 2017/12/18.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Clock = function (_Component) {
    _inherits(Clock, _Component);

    function Clock(props) {
        _classCallCheck(this, Clock);

        var _this = _possibleConstructorReturn(this, (Clock.__proto__ || Object.getPrototypeOf(Clock)).call(this, props));

        _this.state = { date: new Date() };
        return _this;
    }

    /*lifecycle hooks interval*/

    /*We want to set up a timer whenever the Clock is rendered to the DOM for the first time.
     This is called “mounting” in React.
     The componentDidMount() hook runs after the component output has been rendered to the DOM. This is a good place to set up a timer:*/


    _createClass(Clock, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            this.timerID = setInterval(function () {
                return _this2.tick();
            }, 1000);
        }

        /*We can declare special methods on the component class to run some code when a component mounts and unmounts:*/

    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            clearInterval(this.timerID);
        }
    }, {
        key: "tick",
        value: function tick() {
            this.setState({
                date: new Date()
            });
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: "content" },
                _react2.default.createElement(
                    "div",
                    { className: "content" },
                    _react2.default.createElement(
                        "h1",
                        null,
                        "Hello, world!"
                    ),
                    _react2.default.createElement(
                        "h2",
                        null,
                        "It is ",
                        this.state.date.toLocaleTimeString()
                    )
                )
            );
        }
    }]);

    return Clock;
}(_react.Component);

exports.default = Clock;

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(60);
var React = __webpack_require__(0);
exports.Header = function (props) { return React.createElement("h1", null,
    "Hello from ",
    props.compiler,
    " and ",
    props.framework,
    "!"); };


/***/ })
],[124]);
//# sourceMappingURL=main.bundle.js.map