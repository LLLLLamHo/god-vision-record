(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.godV = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var path = {};

	var aFunction = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	var wrapConstructor = function (NativeConstructor) {
	  var Wrapper = function (a, b, c) {
	    if (this instanceof NativeConstructor) {
	      switch (arguments.length) {
	        case 0: return new NativeConstructor();
	        case 1: return new NativeConstructor(a);
	        case 2: return new NativeConstructor(a, b);
	      } return new NativeConstructor(a, b, c);
	    } return NativeConstructor.apply(this, arguments);
	  };
	  Wrapper.prototype = NativeConstructor.prototype;
	  return Wrapper;
	};

	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var PROTO = options.proto;

	  var nativeSource = GLOBAL ? global_1 : STATIC ? global_1[TARGET] : (global_1[TARGET] || {}).prototype;

	  var target = GLOBAL ? path : path[TARGET] || (path[TARGET] = {});
	  var targetPrototype = target.prototype;

	  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
	  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

	  for (key in source) {
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contains in native
	    USE_NATIVE = !FORCED && nativeSource && has(nativeSource, key);

	    targetProperty = target[key];

	    if (USE_NATIVE) if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(nativeSource, key);
	      nativeProperty = descriptor && descriptor.value;
	    } else nativeProperty = nativeSource[key];

	    // export native or implementation
	    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

	    if (USE_NATIVE && typeof targetProperty === typeof sourceProperty) continue;

	    // bind timers to global for call from export context
	    if (options.bind && USE_NATIVE) resultProperty = functionBindContext(sourceProperty, global_1);
	    // wrap global constructors for prevent changs in this version
	    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
	    // make static versions for prototype methods
	    else if (PROTO && typeof sourceProperty == 'function') resultProperty = functionBindContext(Function.call, sourceProperty);
	    // default case
	    else resultProperty = sourceProperty;

	    // add a flag to not completely full polyfills
	    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(resultProperty, 'sham', true);
	    }

	    target[key] = resultProperty;

	    if (PROTO) {
	      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
	      if (!has(path, VIRTUAL_PROTOTYPE)) {
	        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
	      }
	      // export virtual prototype methods
	      path[VIRTUAL_PROTOTYPE][key] = sourceProperty;
	      // export real prototype methods
	      if (options.real && targetPrototype && !targetPrototype[key]) {
	        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
	      }
	    }
	  }
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var max = Math.max;
	var min = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min(integer, length);
	};

	var min$1 = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min$1(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.4',
	  mode:  'pure' ,
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var aFunction$1 = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction$1(path[namespace]) || aFunction$1(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var defineProperty = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');
	var USES_TO_LENGTH = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

	var max$1 = Math.max;
	var min$2 = Math.min;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	// `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject(this);
	    var len = toLength(O.length);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$2(max$1(toInteger(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }
	    A = arraySpeciesCreate(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	var entryVirtual = function (CONSTRUCTOR) {
	  return path[CONSTRUCTOR + 'Prototype'];
	};

	var splice = entryVirtual('Array').splice;

	var ArrayPrototype = Array.prototype;

	var splice_1 = function (it) {
	  var own = it.splice;
	  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.splice) ? splice : own;
	};

	var splice$1 = splice_1;

	var splice$2 = splice$1;

	var slice = [].slice;
	var MSIE = /MSIE .\./.test(engineUserAgent); // <- dirty ie9- check

	var wrap = function (scheduler) {
	  return function (handler, timeout /* , ...arguments */) {
	    var boundArgs = arguments.length > 2;
	    var args = boundArgs ? slice.call(arguments, 2) : undefined;
	    return scheduler(boundArgs ? function () {
	      // eslint-disable-next-line no-new-func
	      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
	    } : handler, timeout);
	  };
	};

	// ie9- setTimeout & setInterval additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
	_export({ global: true, bind: true, forced: MSIE }, {
	  // `setTimeout` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
	  setTimeout: wrap(global_1.setTimeout),
	  // `setInterval` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
	  setInterval: wrap(global_1.setInterval)
	});

	var setTimeout$1 = path.setTimeout;

	var setTimeout$2 = setTimeout$1;

	function on(type, fn, target) {
	    if (target === void 0) { target = document; }
	    var options = { capture: true, passive: true };
	    target.addEventListener(type, fn, options);
	    return function () { return target.removeEventListener(type, fn, options); };
	}
	var mirror = {
	    map: {},
	    getId: function (n) {
	        if (!n.__sn) {
	            return -1;
	        }
	        return n.__sn.id;
	    },
	    getNode: function (id) {
	        return mirror.map[id] || null;
	    },
	    removeNodeFromMap: function (n) {
	        var id = n.__sn && n.__sn.id;
	        delete mirror.map[id];
	        if (n.childNodes) {
	            n.childNodes.forEach(function (child) {
	                return mirror.removeNodeFromMap(child);
	            });
	        }
	    },
	    has: function (id) {
	        return mirror.map.hasOwnProperty(id);
	    },
	};
	function throttle(func, wait, options) {
	    if (options === void 0) { options = {}; }
	    var timeout = null;
	    var previous = 0;
	    return function (arg) {
	        var now = Date.now();
	        if (!previous && options.leading === false) {
	            previous = now;
	        }
	        var remaining = wait - (now - previous);
	        var context = this;
	        var args = arguments;
	        if (remaining <= 0 || remaining > wait) {
	            if (timeout) {
	                window.clearTimeout(timeout);
	                timeout = null;
	            }
	            previous = now;
	            func.apply(context, args);
	        }
	        else if (!timeout && options.trailing !== false) {
	            timeout = window.setTimeout(function () {
	                previous = options.leading === false ? 0 : Date.now();
	                timeout = null;
	                func.apply(context, args);
	            }, remaining);
	        }
	    };
	}
	function hookSetter(target, key, d, isRevoked, win) {
	    if (win === void 0) { win = window; }
	    var original = win.Object.getOwnPropertyDescriptor(target, key);
	    win.Object.defineProperty(target, key, isRevoked
	        ? d
	        : {
	            set: function (value) {
	                var _this = this;
	                setTimeout(function () {
	                    d.set.call(_this, value);
	                }, 0);
	                if (original && original.set) {
	                    original.set.call(this, value);
	                }
	            },
	        });
	    return function () { return hookSetter(target, key, original || {}, true); };
	}
	function getWindowHeight() {
	    return (window.innerHeight ||
	        (document.documentElement && document.documentElement.clientHeight) ||
	        (document.body && document.body.clientHeight));
	}
	function getWindowWidth() {
	    return (window.innerWidth ||
	        (document.documentElement && document.documentElement.clientWidth) ||
	        (document.body && document.body.clientWidth));
	}
	function isBlocked(node, blockClass) {
	    if (!node) {
	        return false;
	    }
	    if (node.nodeType === node.ELEMENT_NODE) {
	        var needBlock_1 = false;
	        if (typeof blockClass === 'string') {
	            needBlock_1 = node.classList.contains(blockClass);
	        }
	        else {
	            node.classList.forEach(function (className) {
	                if (blockClass.test(className)) {
	                    needBlock_1 = true;
	                }
	            });
	        }
	        return needBlock_1 || isBlocked(node.parentNode, blockClass);
	    }
	    return isBlocked(node.parentNode, blockClass);
	}
	function isAncestorRemoved(target) {
	    var id = mirror.getId(target);
	    if (!mirror.has(id)) {
	        return true;
	    }
	    if (target.parentNode &&
	        target.parentNode.nodeType === target.DOCUMENT_NODE) {
	        return false;
	    }
	    if (!target.parentNode) {
	        return true;
	    }
	    return isAncestorRemoved(target.parentNode);
	}
	function isTouchEvent(event) {
	    return Boolean(event.changedTouches);
	}
	function polyfill() {
	    if ('NodeList' in window && !NodeList.prototype.forEach) {
	        NodeList.prototype.forEach = Array.prototype
	            .forEach;
	    }
	}

	var EventType;
	(function (EventType) {
	    EventType[EventType["DomContentLoaded"] = 0] = "DomContentLoaded";
	    EventType[EventType["Load"] = 1] = "Load";
	    EventType[EventType["FullSnapshot"] = 2] = "FullSnapshot";
	    EventType[EventType["IncrementalSnapshot"] = 3] = "IncrementalSnapshot";
	    EventType[EventType["Meta"] = 4] = "Meta";
	    EventType[EventType["Custom"] = 5] = "Custom";
	})(EventType || (EventType = {}));
	var IncrementalSource;
	(function (IncrementalSource) {
	    IncrementalSource[IncrementalSource["Mutation"] = 0] = "Mutation";
	    IncrementalSource[IncrementalSource["MouseMove"] = 1] = "MouseMove";
	    IncrementalSource[IncrementalSource["MouseInteraction"] = 2] = "MouseInteraction";
	    IncrementalSource[IncrementalSource["Scroll"] = 3] = "Scroll";
	    IncrementalSource[IncrementalSource["ViewportResize"] = 4] = "ViewportResize";
	    IncrementalSource[IncrementalSource["Input"] = 5] = "Input";
	    IncrementalSource[IncrementalSource["TouchMove"] = 6] = "TouchMove";
	    IncrementalSource[IncrementalSource["MediaInteraction"] = 7] = "MediaInteraction";
	    IncrementalSource[IncrementalSource["StyleSheetRule"] = 8] = "StyleSheetRule";
	})(IncrementalSource || (IncrementalSource = {}));
	var MouseInteractions;
	(function (MouseInteractions) {
	    MouseInteractions[MouseInteractions["MouseUp"] = 0] = "MouseUp";
	    MouseInteractions[MouseInteractions["MouseDown"] = 1] = "MouseDown";
	    MouseInteractions[MouseInteractions["Click"] = 2] = "Click";
	    MouseInteractions[MouseInteractions["ContextMenu"] = 3] = "ContextMenu";
	    MouseInteractions[MouseInteractions["DblClick"] = 4] = "DblClick";
	    MouseInteractions[MouseInteractions["Focus"] = 5] = "Focus";
	    MouseInteractions[MouseInteractions["Blur"] = 6] = "Blur";
	    MouseInteractions[MouseInteractions["TouchStart"] = 7] = "TouchStart";
	    MouseInteractions[MouseInteractions["TouchMove_Departed"] = 8] = "TouchMove_Departed";
	    MouseInteractions[MouseInteractions["TouchEnd"] = 9] = "TouchEnd";
	})(MouseInteractions || (MouseInteractions = {}));
	var MediaInteractions;
	(function (MediaInteractions) {
	    MediaInteractions[MediaInteractions["Play"] = 0] = "Play";
	    MediaInteractions[MediaInteractions["Pause"] = 1] = "Pause";
	})(MediaInteractions || (MediaInteractions = {}));
	var ReplayerEvents;
	(function (ReplayerEvents) {
	    ReplayerEvents["Start"] = "start";
	    ReplayerEvents["Pause"] = "pause";
	    ReplayerEvents["Resume"] = "resume";
	    ReplayerEvents["Resize"] = "resize";
	    ReplayerEvents["Finish"] = "finish";
	    ReplayerEvents["FullsnapshotRebuilded"] = "fullsnapshot-rebuilded";
	    ReplayerEvents["LoadStylesheetStart"] = "load-stylesheet-start";
	    ReplayerEvents["LoadStylesheetEnd"] = "load-stylesheet-end";
	    ReplayerEvents["SkipStart"] = "skip-start";
	    ReplayerEvents["SkipEnd"] = "skip-end";
	    ReplayerEvents["MouseInteraction"] = "mouse-interaction";
	    ReplayerEvents["EventCast"] = "event-cast";
	    ReplayerEvents["CustomEvent"] = "custom-event";
	})(ReplayerEvents || (ReplayerEvents = {}));

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	function __values(o) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
	    if (m) return m.call(o);
	    return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	}

	function __read(o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	}

	function __spread() {
	    for (var ar = [], i = 0; i < arguments.length; i++)
	        ar = ar.concat(__read(arguments[i]));
	    return ar;
	}

	var NodeType;
	(function (NodeType) {
	    NodeType[NodeType["Document"] = 0] = "Document";
	    NodeType[NodeType["DocumentType"] = 1] = "DocumentType";
	    NodeType[NodeType["Element"] = 2] = "Element";
	    NodeType[NodeType["Text"] = 3] = "Text";
	    NodeType[NodeType["CDATA"] = 4] = "CDATA";
	    NodeType[NodeType["Comment"] = 5] = "Comment";
	})(NodeType || (NodeType = {}));

	var _id = 1;
	var symbolAndNumberRegex = RegExp('[^a-z1-6\-]');
	function genId() {
	    return _id++;
	}
	function getValidTagName(tagName) {
	    var processedTagName = tagName.toLowerCase().trim();
	    if (symbolAndNumberRegex.test(processedTagName)) {
	        return 'div';
	    }
	    return processedTagName;
	}
	function getCssRulesString(s) {
	    try {
	        var rules = s.rules || s.cssRules;
	        return rules
	            ? Array.from(rules).reduce(function (prev, cur) { return prev + getCssRuleString(cur); }, '')
	            : null;
	    }
	    catch (error) {
	        return null;
	    }
	}
	function getCssRuleString(rule) {
	    return isCSSImportRule(rule)
	        ? getCssRulesString(rule.styleSheet) || ''
	        : rule.cssText;
	}
	function isCSSImportRule(rule) {
	    return 'styleSheet' in rule;
	}
	function extractOrigin(url) {
	    var origin;
	    if (url.indexOf('//') > -1) {
	        origin = url
	            .split('/')
	            .slice(0, 3)
	            .join('/');
	    }
	    else {
	        origin = url.split('/')[0];
	    }
	    origin = origin.split('?')[0];
	    return origin;
	}
	var URL_IN_CSS_REF = /url\((?:'([^']*)'|"([^"]*)"|([^)]*))\)/gm;
	var RELATIVE_PATH = /^(?!www\.|(?:http|ftp)s?:\/\/|[A-Za-z]:\\|\/\/).*/;
	var DATA_URI = /^(data:)([\w\/\+\-]+);(charset=[\w-]+|base64).*,(.*)/i;
	function absoluteToStylesheet(cssText, href) {
	    return (cssText || '').replace(URL_IN_CSS_REF, function (origin, path1, path2, path3) {
	        var filePath = path1 || path2 || path3;
	        if (!filePath) {
	            return origin;
	        }
	        if (!RELATIVE_PATH.test(filePath)) {
	            return "url('" + filePath + "')";
	        }
	        if (DATA_URI.test(filePath)) {
	            return "url(" + filePath + ")";
	        }
	        if (filePath[0] === '/') {
	            return "url('" + (extractOrigin(href) + filePath) + "')";
	        }
	        var stack = href.split('/');
	        var parts = filePath.split('/');
	        stack.pop();
	        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
	            var part = parts_1[_i];
	            if (part === '.') {
	                continue;
	            }
	            else if (part === '..') {
	                stack.pop();
	            }
	            else {
	                stack.push(part);
	            }
	        }
	        return "url('" + stack.join('/') + "')";
	    });
	}
	function getAbsoluteSrcsetString(doc, attributeValue) {
	    if (attributeValue.trim() === '') {
	        return attributeValue;
	    }
	    var srcsetValues = attributeValue.split(',');
	    var resultingSrcsetString = srcsetValues
	        .map(function (srcItem) {
	        var trimmedSrcItem = srcItem.trimLeft().trimRight();
	        var urlAndSize = trimmedSrcItem.split(' ');
	        if (urlAndSize.length === 2) {
	            var absUrl = absoluteToDoc(doc, urlAndSize[0]);
	            return absUrl + " " + urlAndSize[1];
	        }
	        else if (urlAndSize.length === 1) {
	            var absUrl = absoluteToDoc(doc, urlAndSize[0]);
	            return "" + absUrl;
	        }
	        return '';
	    })
	        .join(',');
	    return resultingSrcsetString;
	}
	function absoluteToDoc(doc, attributeValue) {
	    if (!attributeValue || attributeValue.trim() === '') {
	        return attributeValue;
	    }
	    var a = doc.createElement('a');
	    a.href = attributeValue;
	    return a.href;
	}
	function isSVGElement(el) {
	    return el.tagName === 'svg' || el instanceof SVGElement;
	}
	function transformAttribute(doc, name, value) {
	    if (name === 'src' || (name === 'href' && value)) {
	        return absoluteToDoc(doc, value);
	    }
	    else if (name === 'srcset' && value) {
	        return getAbsoluteSrcsetString(doc, value);
	    }
	    else if (name === 'style' && value) {
	        return absoluteToStylesheet(value, location.href);
	    }
	    else {
	        return value;
	    }
	}
	function serializeNode(n, doc, blockClass, inlineStylesheet, maskAllInputs) {
	    switch (n.nodeType) {
	        case n.DOCUMENT_NODE:
	            return {
	                type: NodeType.Document,
	                childNodes: []
	            };
	        case n.DOCUMENT_TYPE_NODE:
	            return {
	                type: NodeType.DocumentType,
	                name: n.name,
	                publicId: n.publicId,
	                systemId: n.systemId
	            };
	        case n.ELEMENT_NODE:
	            var needBlock_1 = false;
	            if (typeof blockClass === 'string') {
	                needBlock_1 = n.classList.contains(blockClass);
	            }
	            else {
	                n.classList.forEach(function (className) {
	                    if (blockClass.test(className)) {
	                        needBlock_1 = true;
	                    }
	                });
	            }
	            var tagName = getValidTagName(n.tagName);
	            var attributes_1 = {};
	            for (var _i = 0, _a = Array.from(n.attributes); _i < _a.length; _i++) {
	                var _b = _a[_i], name = _b.name, value = _b.value;
	                attributes_1[name] = transformAttribute(doc, name, value);
	            }
	            if (tagName === 'link' && inlineStylesheet) {
	                var stylesheet = Array.from(doc.styleSheets).find(function (s) {
	                    return s.href === n.href;
	                });
	                var cssText = getCssRulesString(stylesheet);
	                if (cssText) {
	                    delete attributes_1.rel;
	                    delete attributes_1.href;
	                    attributes_1._cssText = absoluteToStylesheet(cssText, stylesheet.href);
	                }
	            }
	            if (tagName === 'style' &&
	                n.sheet &&
	                !(n.innerText ||
	                    n.textContent ||
	                    '').trim().length) {
	                var cssText = getCssRulesString(n.sheet);
	                if (cssText) {
	                    attributes_1._cssText = absoluteToStylesheet(cssText, location.href);
	                }
	            }
	            if (tagName === 'input' ||
	                tagName === 'textarea' ||
	                tagName === 'select') {
	                var value = n.value;
	                if (attributes_1.type !== 'radio' &&
	                    attributes_1.type !== 'checkbox' &&
	                    value) {
	                    attributes_1.value = maskAllInputs ? '*'.repeat(value.length) : value;
	                }
	                else if (n.checked) {
	                    attributes_1.checked = n.checked;
	                }
	            }
	            if (tagName === 'option') {
	                var selectValue = n.parentElement;
	                if (attributes_1.value === selectValue.value) {
	                    attributes_1.selected = n.selected;
	                }
	            }
	            if (tagName === 'canvas') {
	                attributes_1.rr_dataURL = n.toDataURL();
	            }
	            if (tagName === 'audio' || tagName === 'video') {
	                attributes_1.rr_mediaState = n.paused
	                    ? 'paused'
	                    : 'played';
	            }
	            if (needBlock_1) {
	                var _c = n.getBoundingClientRect(), width = _c.width, height = _c.height;
	                attributes_1.rr_width = width + "px";
	                attributes_1.rr_height = height + "px";
	            }
	            return {
	                type: NodeType.Element,
	                tagName: tagName,
	                attributes: attributes_1,
	                childNodes: [],
	                isSVG: isSVGElement(n) || undefined,
	                needBlock: needBlock_1
	            };
	        case n.TEXT_NODE:
	            var parentTagName = n.parentNode && n.parentNode.tagName;
	            var textContent = n.textContent;
	            var isStyle = parentTagName === 'STYLE' ? true : undefined;
	            if (isStyle && textContent) {
	                textContent = absoluteToStylesheet(textContent, location.href);
	            }
	            if (parentTagName === 'SCRIPT') {
	                textContent = 'SCRIPT_PLACEHOLDER';
	            }
	            return {
	                type: NodeType.Text,
	                textContent: textContent || '',
	                isStyle: isStyle
	            };
	        case n.CDATA_SECTION_NODE:
	            return {
	                type: NodeType.CDATA,
	                textContent: ''
	            };
	        case n.COMMENT_NODE:
	            return {
	                type: NodeType.Comment,
	                textContent: n.textContent || ''
	            };
	        default:
	            return false;
	    }
	}
	function serializeNodeWithId(n, doc, map, blockClass, skipChild, inlineStylesheet, maskAllInputs) {
	    if (skipChild === void 0) { skipChild = false; }
	    if (inlineStylesheet === void 0) { inlineStylesheet = true; }
	    if (maskAllInputs === void 0) { maskAllInputs = false; }
	    var _serializedNode = serializeNode(n, doc, blockClass, inlineStylesheet, maskAllInputs);
	    if (!_serializedNode) {
	        console.warn(n, 'not serialized');
	        return null;
	    }
	    var id;
	    if ('__sn' in n) {
	        id = n.__sn.id;
	    }
	    else {
	        id = genId();
	    }
	    var serializedNode = Object.assign(_serializedNode, { id: id });
	    n.__sn = serializedNode;
	    map[id] = n;
	    var recordChild = !skipChild;
	    if (serializedNode.type === NodeType.Element) {
	        recordChild = recordChild && !serializedNode.needBlock;
	        delete serializedNode.needBlock;
	    }
	    if ((serializedNode.type === NodeType.Document ||
	        serializedNode.type === NodeType.Element) &&
	        recordChild) {
	        for (var _i = 0, _a = Array.from(n.childNodes); _i < _a.length; _i++) {
	            var childN = _a[_i];
	            var serializedChildNode = serializeNodeWithId(childN, doc, map, blockClass, skipChild, inlineStylesheet, maskAllInputs);
	            if (serializedChildNode) {
	                serializedNode.childNodes.push(serializedChildNode);
	            }
	        }
	    }
	    return serializedNode;
	}
	function snapshot(n, blockClass, inlineStylesheet, maskAllInputs) {
	    if (blockClass === void 0) { blockClass = 'rr-block'; }
	    if (inlineStylesheet === void 0) { inlineStylesheet = true; }
	    if (maskAllInputs === void 0) { maskAllInputs = false; }
	    var idNodeMap = {};
	    return [
	        serializeNodeWithId(n, n, idNodeMap, blockClass, false, inlineStylesheet, maskAllInputs),
	        idNodeMap,
	    ];
	}

	var moveKey = function (id, parentId) { return id + "@" + parentId; };
	function isINode(n) {
	    return '__sn' in n;
	}
	var MutationBuffer = (function () {
	    function MutationBuffer(cb, blockClass, inlineStylesheet, maskAllInputs) {
	        var _this = this;
	        this.texts = [];
	        this.attributes = [];
	        this.removes = [];
	        this.adds = [];
	        this.movedMap = {};
	        this.addedSet = new Set();
	        this.movedSet = new Set();
	        this.droppedSet = new Set();
	        this.processMutations = function (mutations) {
	            var e_1, _a, e_2, _b;
	            mutations.forEach(_this.processMutation);
	            var addQueue = [];
	            var pushAdd = function (n) {
	                var parentId = mirror.getId(n.parentNode);
	                var nextId = n.nextSibling && mirror.getId(n.nextSibling);
	                if (parentId === -1 || nextId === -1) {
	                    return addQueue.push(n);
	                }
	                _this.adds.push({
	                    parentId: parentId,
	                    nextId: nextId,
	                    node: serializeNodeWithId(n, document, mirror.map, _this.blockClass, true, _this.inlineStylesheet, _this.maskAllInputs),
	                });
	            };
	            try {
	                for (var _c = __values(_this.movedSet), _d = _c.next(); !_d.done; _d = _c.next()) {
	                    var n = _d.value;
	                    pushAdd(n);
	                }
	            }
	            catch (e_1_1) { e_1 = { error: e_1_1 }; }
	            finally {
	                try {
	                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
	                }
	                finally { if (e_1) throw e_1.error; }
	            }
	            try {
	                for (var _e = __values(_this.addedSet), _f = _e.next(); !_f.done; _f = _e.next()) {
	                    var n = _f.value;
	                    if (!isAncestorInSet(_this.droppedSet, n) &&
	                        !isParentRemoved(_this.removes, n)) {
	                        pushAdd(n);
	                    }
	                    else if (isAncestorInSet(_this.movedSet, n)) {
	                        pushAdd(n);
	                    }
	                    else {
	                        _this.droppedSet.add(n);
	                    }
	                }
	            }
	            catch (e_2_1) { e_2 = { error: e_2_1 }; }
	            finally {
	                try {
	                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
	                }
	                finally { if (e_2) throw e_2.error; }
	            }
	            while (addQueue.length) {
	                if (addQueue.every(function (n) { return mirror.getId(n.parentNode) === -1; })) {
	                    break;
	                }
	                pushAdd(addQueue.shift());
	            }
	            _this.emit();
	        };
	        this.processMutation = function (m) {
	            switch (m.type) {
	                case 'characterData': {
	                    var value = m.target.textContent;
	                    if (!isBlocked(m.target, _this.blockClass) && value !== m.oldValue) {
	                        _this.texts.push({
	                            value: value,
	                            node: m.target,
	                        });
	                    }
	                    break;
	                }
	                case 'attributes': {
	                    var value = m.target.getAttribute(m.attributeName);
	                    if (isBlocked(m.target, _this.blockClass) || value === m.oldValue) {
	                        return;
	                    }
	                    var item = _this.attributes.find(function (a) { return a.node === m.target; });
	                    if (!item) {
	                        item = {
	                            node: m.target,
	                            attributes: {},
	                        };
	                        _this.attributes.push(item);
	                    }
	                    item.attributes[m.attributeName] = transformAttribute(document, m.attributeName, value);
	                    break;
	                }
	                case 'childList': {
	                    m.addedNodes.forEach(function (n) { return _this.genAdds(n, m.target); });
	                    m.removedNodes.forEach(function (n) {
	                        var nodeId = mirror.getId(n);
	                        var parentId = mirror.getId(m.target);
	                        if (isBlocked(n, _this.blockClass)) {
	                            return;
	                        }
	                        if (_this.addedSet.has(n)) {
	                            deepDelete(_this.addedSet, n);
	                            _this.droppedSet.add(n);
	                        }
	                        else if (_this.addedSet.has(m.target) && nodeId === -1) ;
	                        else if (isAncestorRemoved(m.target)) ;
	                        else if (_this.movedSet.has(n) &&
	                            _this.movedMap[moveKey(nodeId, parentId)]) {
	                            deepDelete(_this.movedSet, n);
	                        }
	                        else {
	                            _this.removes.push({
	                                parentId: parentId,
	                                id: nodeId,
	                            });
	                        }
	                        mirror.removeNodeFromMap(n);
	                    });
	                    break;
	                }
	            }
	        };
	        this.genAdds = function (n, target) {
	            if (isBlocked(n, _this.blockClass)) {
	                return;
	            }
	            if (isINode(n)) {
	                _this.movedSet.add(n);
	                var targetId = null;
	                if (target && isINode(target)) {
	                    targetId = target.__sn.id;
	                }
	                if (targetId) {
	                    _this.movedMap[moveKey(n.__sn.id, targetId)] = true;
	                }
	            }
	            else {
	                _this.addedSet.add(n);
	                _this.droppedSet.delete(n);
	            }
	            n.childNodes.forEach(function (childN) { return _this.genAdds(childN); });
	        };
	        this.emit = function () {
	            var payload = {
	                texts: _this.texts
	                    .map(function (text) { return ({
	                    id: mirror.getId(text.node),
	                    value: text.value,
	                }); })
	                    .filter(function (text) { return mirror.has(text.id); }),
	                attributes: _this.attributes
	                    .map(function (attribute) { return ({
	                    id: mirror.getId(attribute.node),
	                    attributes: attribute.attributes,
	                }); })
	                    .filter(function (attribute) { return mirror.has(attribute.id); }),
	                removes: _this.removes,
	                adds: _this.adds,
	            };
	            if (!payload.texts.length &&
	                !payload.attributes.length &&
	                !payload.removes.length &&
	                !payload.adds.length) {
	                return;
	            }
	            _this.emissionCallback(payload);
	            _this.texts = [];
	            _this.attributes = [];
	            _this.removes = [];
	            _this.adds = [];
	            _this.addedSet = new Set();
	            _this.movedSet = new Set();
	            _this.droppedSet = new Set();
	            _this.movedMap = {};
	        };
	        this.blockClass = blockClass;
	        this.inlineStylesheet = inlineStylesheet;
	        this.maskAllInputs = maskAllInputs;
	        this.emissionCallback = cb;
	    }
	    return MutationBuffer;
	}());
	function deepDelete(addsSet, n) {
	    addsSet.delete(n);
	    n.childNodes.forEach(function (childN) { return deepDelete(addsSet, childN); });
	}
	function isParentRemoved(removes, n) {
	    var parentNode = n.parentNode;
	    if (!parentNode) {
	        return false;
	    }
	    var parentId = mirror.getId(parentNode);
	    if (removes.some(function (r) { return r.id === parentId; })) {
	        return true;
	    }
	    return isParentRemoved(removes, parentNode);
	}
	function isAncestorInSet(set, n) {
	    var parentNode = n.parentNode;
	    if (!parentNode) {
	        return false;
	    }
	    if (set.has(parentNode)) {
	        return true;
	    }
	    return isAncestorInSet(set, parentNode);
	}

	function initMutationObserver(cb, blockClass, inlineStylesheet, maskAllInputs) {
	    var mutationBuffer = new MutationBuffer(cb, blockClass, inlineStylesheet, maskAllInputs);
	    var observer = new MutationObserver(mutationBuffer.processMutations);
	    observer.observe(document, {
	        attributes: true,
	        attributeOldValue: true,
	        characterData: true,
	        characterDataOldValue: true,
	        childList: true,
	        subtree: true,
	    });
	    return observer;
	}
	function initMoveObserver(cb, mousemoveWait) {
	    var positions = [];
	    var timeBaseline;
	    var wrappedCb = throttle(function (isTouch) {
	        var totalOffset = Date.now() - timeBaseline;
	        cb(positions.map(function (p) {
	            p.timeOffset -= totalOffset;
	            return p;
	        }), isTouch ? IncrementalSource.TouchMove : IncrementalSource.MouseMove);
	        positions = [];
	        timeBaseline = null;
	    }, 500);
	    var updatePosition = throttle(function (evt) {
	        var target = evt.target;
	        var _a = isTouchEvent(evt)
	            ? evt.changedTouches[0]
	            : evt, clientX = _a.clientX, clientY = _a.clientY;
	        if (!timeBaseline) {
	            timeBaseline = Date.now();
	        }
	        positions.push({
	            x: clientX,
	            y: clientY,
	            id: mirror.getId(target),
	            timeOffset: Date.now() - timeBaseline,
	        });
	        wrappedCb(isTouchEvent(evt));
	    }, mousemoveWait, {
	        trailing: false,
	    });
	    var handlers = [
	        on('mousemove', updatePosition),
	        on('touchmove', updatePosition),
	    ];
	    return function () {
	        handlers.forEach(function (h) { return h(); });
	    };
	}
	function initMouseInteractionObserver(cb, blockClass) {
	    var handlers = [];
	    var getHandler = function (eventKey) {
	        return function (event) {
	            if (isBlocked(event.target, blockClass)) {
	                return;
	            }
	            var id = mirror.getId(event.target);
	            var _a = isTouchEvent(event)
	                ? event.changedTouches[0]
	                : event, clientX = _a.clientX, clientY = _a.clientY;
	            cb({
	                type: MouseInteractions[eventKey],
	                id: id,
	                x: clientX,
	                y: clientY,
	            });
	        };
	    };
	    Object.keys(MouseInteractions)
	        .filter(function (key) { return Number.isNaN(Number(key)) && !key.endsWith('_Departed'); })
	        .forEach(function (eventKey) {
	        var eventName = eventKey.toLowerCase();
	        var handler = getHandler(eventKey);
	        handlers.push(on(eventName, handler));
	    });
	    return function () {
	        handlers.forEach(function (h) { return h(); });
	    };
	}
	function initScrollObserver(cb, blockClass) {
	    var updatePosition = throttle(function (evt) {
	        if (!evt.target || isBlocked(evt.target, blockClass)) {
	            return;
	        }
	        var id = mirror.getId(evt.target);
	        if (evt.target === document) {
	            var scrollEl = (document.scrollingElement || document.documentElement);
	            cb({
	                id: id,
	                x: scrollEl.scrollLeft,
	                y: scrollEl.scrollTop,
	            });
	        }
	        else {
	            cb({
	                id: id,
	                x: evt.target.scrollLeft,
	                y: evt.target.scrollTop,
	            });
	        }
	    }, 100);
	    return on('scroll', updatePosition);
	}
	function initViewportResizeObserver(cb) {
	    var updateDimension = throttle(function () {
	        var height = getWindowHeight();
	        var width = getWindowWidth();
	        cb({
	            width: Number(width),
	            height: Number(height),
	        });
	    }, 200);
	    return on('resize', updateDimension, window);
	}
	var INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];
	var MASK_TYPES = [
	    'color',
	    'date',
	    'datetime-local',
	    'email',
	    'month',
	    'number',
	    'range',
	    'search',
	    'tel',
	    'text',
	    'time',
	    'url',
	    'week',
	];
	var lastInputValueMap = new WeakMap();
	function initInputObserver(cb, blockClass, ignoreClass, maskAllInputs) {
	    function eventHandler(event) {
	        var target = event.target;
	        if (!target ||
	            !target.tagName ||
	            INPUT_TAGS.indexOf(target.tagName) < 0 ||
	            isBlocked(target, blockClass)) {
	            return;
	        }
	        var type = target.type;
	        if (type === 'password' ||
	            target.classList.contains(ignoreClass)) {
	            return;
	        }
	        var text = target.value;
	        var isChecked = false;
	        var hasTextInput = MASK_TYPES.includes(type) || target.tagName === 'TEXTAREA';
	        if (type === 'radio' || type === 'checkbox') {
	            isChecked = target.checked;
	        }
	        else if (hasTextInput && maskAllInputs) {
	            text = '*'.repeat(text.length);
	        }
	        cbWithDedup(target, { text: text, isChecked: isChecked });
	        var name = target.name;
	        if (type === 'radio' && name && isChecked) {
	            document
	                .querySelectorAll("input[type=\"radio\"][name=\"" + name + "\"]")
	                .forEach(function (el) {
	                if (el !== target) {
	                    cbWithDedup(el, {
	                        text: el.value,
	                        isChecked: !isChecked,
	                    });
	                }
	            });
	        }
	    }
	    function cbWithDedup(target, v) {
	        var lastInputValue = lastInputValueMap.get(target);
	        if (!lastInputValue ||
	            lastInputValue.text !== v.text ||
	            lastInputValue.isChecked !== v.isChecked) {
	            lastInputValueMap.set(target, v);
	            var id = mirror.getId(target);
	            cb(__assign(__assign({}, v), { id: id }));
	        }
	    }
	    var handlers = [
	        'input',
	        'change',
	    ].map(function (eventName) { return on(eventName, eventHandler); });
	    var propertyDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
	    var hookProperties = [
	        [HTMLInputElement.prototype, 'value'],
	        [HTMLInputElement.prototype, 'checked'],
	        [HTMLSelectElement.prototype, 'value'],
	        [HTMLTextAreaElement.prototype, 'value'],
	    ];
	    if (propertyDescriptor && propertyDescriptor.set) {
	        handlers.push.apply(handlers, __spread(hookProperties.map(function (p) {
	            return hookSetter(p[0], p[1], {
	                set: function () {
	                    eventHandler({ target: this });
	                },
	            });
	        })));
	    }
	    return function () {
	        handlers.forEach(function (h) { return h(); });
	    };
	}
	function initStyleSheetObserver(cb) {
	    var insertRule = CSSStyleSheet.prototype.insertRule;
	    CSSStyleSheet.prototype.insertRule = function (rule, index) {
	        var id = mirror.getId(this.ownerNode);
	        if (id !== -1) {
	            cb({
	                id: id,
	                adds: [{ rule: rule, index: index }],
	            });
	        }
	        return insertRule.apply(this, arguments);
	    };
	    var deleteRule = CSSStyleSheet.prototype.deleteRule;
	    CSSStyleSheet.prototype.deleteRule = function (index) {
	        var id = mirror.getId(this.ownerNode);
	        if (id !== -1) {
	            cb({
	                id: id,
	                removes: [{ index: index }],
	            });
	        }
	        return deleteRule.apply(this, arguments);
	    };
	    return function () {
	        CSSStyleSheet.prototype.insertRule = insertRule;
	        CSSStyleSheet.prototype.deleteRule = deleteRule;
	    };
	}
	function initMediaInteractionObserver(mediaInteractionCb, blockClass) {
	    var handler = function (type) { return function (event) {
	        var target = event.target;
	        if (!target || isBlocked(target, blockClass)) {
	            return;
	        }
	        mediaInteractionCb({
	            type: type === 'play' ? MediaInteractions.Play : MediaInteractions.Pause,
	            id: mirror.getId(target),
	        });
	    }; };
	    var handlers = [on('play', handler('play')), on('pause', handler('pause'))];
	    return function () {
	        handlers.forEach(function (h) { return h(); });
	    };
	}
	function mergeHooks(o, hooks) {
	    var mutationCb = o.mutationCb, mousemoveCb = o.mousemoveCb, mouseInteractionCb = o.mouseInteractionCb, scrollCb = o.scrollCb, viewportResizeCb = o.viewportResizeCb, inputCb = o.inputCb, mediaInteractionCb = o.mediaInteractionCb, styleSheetRuleCb = o.styleSheetRuleCb;
	    o.mutationCb = function () {
	        var p = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            p[_i] = arguments[_i];
	        }
	        if (hooks.mutation) {
	            hooks.mutation.apply(hooks, __spread(p));
	        }
	        mutationCb.apply(void 0, __spread(p));
	    };
	    o.mousemoveCb = function () {
	        var p = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            p[_i] = arguments[_i];
	        }
	        if (hooks.mousemove) {
	            hooks.mousemove.apply(hooks, __spread(p));
	        }
	        mousemoveCb.apply(void 0, __spread(p));
	    };
	    o.mouseInteractionCb = function () {
	        var p = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            p[_i] = arguments[_i];
	        }
	        if (hooks.mouseInteraction) {
	            hooks.mouseInteraction.apply(hooks, __spread(p));
	        }
	        mouseInteractionCb.apply(void 0, __spread(p));
	    };
	    o.scrollCb = function () {
	        var p = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            p[_i] = arguments[_i];
	        }
	        if (hooks.scroll) {
	            hooks.scroll.apply(hooks, __spread(p));
	        }
	        scrollCb.apply(void 0, __spread(p));
	    };
	    o.viewportResizeCb = function () {
	        var p = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            p[_i] = arguments[_i];
	        }
	        if (hooks.viewportResize) {
	            hooks.viewportResize.apply(hooks, __spread(p));
	        }
	        viewportResizeCb.apply(void 0, __spread(p));
	    };
	    o.inputCb = function () {
	        var p = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            p[_i] = arguments[_i];
	        }
	        if (hooks.input) {
	            hooks.input.apply(hooks, __spread(p));
	        }
	        inputCb.apply(void 0, __spread(p));
	    };
	    o.mediaInteractionCb = function () {
	        var p = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            p[_i] = arguments[_i];
	        }
	        if (hooks.mediaInteaction) {
	            hooks.mediaInteaction.apply(hooks, __spread(p));
	        }
	        mediaInteractionCb.apply(void 0, __spread(p));
	    };
	    o.styleSheetRuleCb = function () {
	        var p = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            p[_i] = arguments[_i];
	        }
	        if (hooks.styleSheetRule) {
	            hooks.styleSheetRule.apply(hooks, __spread(p));
	        }
	        styleSheetRuleCb.apply(void 0, __spread(p));
	    };
	}
	function initObservers(o, hooks) {
	    if (hooks === void 0) { hooks = {}; }
	    mergeHooks(o, hooks);
	    var mutationObserver = initMutationObserver(o.mutationCb, o.blockClass, o.inlineStylesheet, o.maskAllInputs);
	    var mousemoveHandler = initMoveObserver(o.mousemoveCb, o.mousemoveWait);
	    var mouseInteractionHandler = initMouseInteractionObserver(o.mouseInteractionCb, o.blockClass);
	    var scrollHandler = initScrollObserver(o.scrollCb, o.blockClass);
	    var viewportResizeHandler = initViewportResizeObserver(o.viewportResizeCb);
	    var inputHandler = initInputObserver(o.inputCb, o.blockClass, o.ignoreClass, o.maskAllInputs);
	    var mediaInteractionHandler = initMediaInteractionObserver(o.mediaInteractionCb, o.blockClass);
	    var styleSheetObserver = initStyleSheetObserver(o.styleSheetRuleCb);
	    return function () {
	        mutationObserver.disconnect();
	        mousemoveHandler();
	        mouseInteractionHandler();
	        scrollHandler();
	        viewportResizeHandler();
	        inputHandler();
	        mediaInteractionHandler();
	        styleSheetObserver();
	    };
	}

	function wrapEvent(e) {
	    return __assign(__assign({}, e), { timestamp: Date.now() });
	}
	var wrappedEmit;
	function record(options) {
	    if (options === void 0) { options = {}; }
	    var emit = options.emit, checkoutEveryNms = options.checkoutEveryNms, checkoutEveryNth = options.checkoutEveryNth, _a = options.blockClass, blockClass = _a === void 0 ? 'rr-block' : _a, _b = options.ignoreClass, ignoreClass = _b === void 0 ? 'rr-ignore' : _b, _c = options.inlineStylesheet, inlineStylesheet = _c === void 0 ? true : _c, _d = options.maskAllInputs, maskAllInputs = _d === void 0 ? false : _d, hooks = options.hooks, _e = options.mousemoveWait, mousemoveWait = _e === void 0 ? 50 : _e, packFn = options.packFn;
	    if (!emit) {
	        throw new Error('emit function is required');
	    }
	    polyfill();
	    var lastFullSnapshotEvent;
	    var incrementalSnapshotCount = 0;
	    wrappedEmit = function (e, isCheckout) {
	        emit((packFn ? packFn(e) : e), isCheckout);
	        if (e.type === EventType.FullSnapshot) {
	            lastFullSnapshotEvent = e;
	            incrementalSnapshotCount = 0;
	        }
	        else if (e.type === EventType.IncrementalSnapshot) {
	            incrementalSnapshotCount++;
	            var exceedCount = checkoutEveryNth && incrementalSnapshotCount >= checkoutEveryNth;
	            var exceedTime = checkoutEveryNms &&
	                e.timestamp - lastFullSnapshotEvent.timestamp > checkoutEveryNms;
	            if (exceedCount || exceedTime) {
	                takeFullSnapshot(true);
	            }
	        }
	    };
	    function takeFullSnapshot(isCheckout) {
	        var _a, _b, _c, _d;
	        if (isCheckout === void 0) { isCheckout = false; }
	        wrappedEmit(wrapEvent({
	            type: EventType.Meta,
	            data: {
	                href: window.location.href,
	                width: getWindowWidth(),
	                height: getWindowHeight(),
	            },
	        }), isCheckout);
	        var _e = __read(snapshot(document, blockClass, inlineStylesheet, maskAllInputs), 2), node = _e[0], idNodeMap = _e[1];
	        if (!node) {
	            return console.warn('Failed to snapshot the document');
	        }
	        mirror.map = idNodeMap;
	        wrappedEmit(wrapEvent({
	            type: EventType.FullSnapshot,
	            data: {
	                node: node,
	                initialOffset: {
	                    left: window.pageXOffset !== undefined
	                        ? window.pageXOffset
	                        : (document === null || document === void 0 ? void 0 : document.documentElement.scrollLeft) || ((_b = (_a = document === null || document === void 0 ? void 0 : document.body) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.scrollLeft) || (document === null || document === void 0 ? void 0 : document.body.scrollLeft) ||
	                            0,
	                    top: window.pageYOffset !== undefined
	                        ? window.pageYOffset
	                        : (document === null || document === void 0 ? void 0 : document.documentElement.scrollTop) || ((_d = (_c = document === null || document === void 0 ? void 0 : document.body) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.scrollTop) || (document === null || document === void 0 ? void 0 : document.body.scrollTop) ||
	                            0,
	                },
	            },
	        }));
	    }
	    try {
	        var handlers_1 = [];
	        handlers_1.push(on('DOMContentLoaded', function () {
	            wrappedEmit(wrapEvent({
	                type: EventType.DomContentLoaded,
	                data: {},
	            }));
	        }));
	        var init_1 = function () {
	            takeFullSnapshot();
	            handlers_1.push(initObservers({
	                mutationCb: function (m) {
	                    return wrappedEmit(wrapEvent({
	                        type: EventType.IncrementalSnapshot,
	                        data: __assign({ source: IncrementalSource.Mutation }, m),
	                    }));
	                },
	                mousemoveCb: function (positions, source) {
	                    return wrappedEmit(wrapEvent({
	                        type: EventType.IncrementalSnapshot,
	                        data: {
	                            source: source,
	                            positions: positions,
	                        },
	                    }));
	                },
	                mouseInteractionCb: function (d) {
	                    return wrappedEmit(wrapEvent({
	                        type: EventType.IncrementalSnapshot,
	                        data: __assign({ source: IncrementalSource.MouseInteraction }, d),
	                    }));
	                },
	                scrollCb: function (p) {
	                    return wrappedEmit(wrapEvent({
	                        type: EventType.IncrementalSnapshot,
	                        data: __assign({ source: IncrementalSource.Scroll }, p),
	                    }));
	                },
	                viewportResizeCb: function (d) {
	                    return wrappedEmit(wrapEvent({
	                        type: EventType.IncrementalSnapshot,
	                        data: __assign({ source: IncrementalSource.ViewportResize }, d),
	                    }));
	                },
	                inputCb: function (v) {
	                    return wrappedEmit(wrapEvent({
	                        type: EventType.IncrementalSnapshot,
	                        data: __assign({ source: IncrementalSource.Input }, v),
	                    }));
	                },
	                mediaInteractionCb: function (p) {
	                    return wrappedEmit(wrapEvent({
	                        type: EventType.IncrementalSnapshot,
	                        data: __assign({ source: IncrementalSource.MediaInteraction }, p),
	                    }));
	                },
	                styleSheetRuleCb: function (r) {
	                    return wrappedEmit(wrapEvent({
	                        type: EventType.IncrementalSnapshot,
	                        data: __assign({ source: IncrementalSource.StyleSheetRule }, r),
	                    }));
	                },
	                blockClass: blockClass,
	                ignoreClass: ignoreClass,
	                maskAllInputs: maskAllInputs,
	                inlineStylesheet: inlineStylesheet,
	                mousemoveWait: mousemoveWait,
	            }, hooks));
	        };
	        if (document.readyState === 'interactive' ||
	            document.readyState === 'complete') {
	            init_1();
	        }
	        else {
	            handlers_1.push(on('load', function () {
	                wrappedEmit(wrapEvent({
	                    type: EventType.Load,
	                    data: {},
	                }));
	                init_1();
	            }, window));
	        }
	        return function () {
	            handlers_1.forEach(function (h) { return h(); });
	        };
	    }
	    catch (error) {
	        console.warn(error);
	    }
	}
	record.addCustomEvent = function (tag, payload) {
	    if (!wrappedEmit) {
	        throw new Error('please add custom event after start recording');
	    }
	    wrappedEmit(wrapEvent({
	        type: EventType.Custom,
	        data: {
	            tag: tag,
	            payload: payload,
	        },
	    }));
	};

	function uuid() {
	  var d = new Date().getTime();

	  if (window.performance && typeof window.performance.now === "function") {
	    d += performance.now();
	  }

	  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	    var r = (d + Math.random() * 16) % 16 | 0;
	    d = Math.floor(d / 16);
	    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
	  });
	  return uuid;
	}

	var GodV = function () {
	  function GodV(props) {
	    this.uuid = null;
	    this.maxLength = 10;
	    this.interval = 3000;
	    this.stopRecordFn = null;
	    this.events = [];
	    this.isStart = false;
	    this.fetchUrl = props.fetchUrl;
	    this.maxLength = props.maxLength || this.maxLength;
	    this.interval = props.interval || this.interval;
	    this.uuid = uuid();
	  }

	  GodV.prototype.record = function () {
	    var _this = this;

	    try {
	      if (!this.fetchUrl) {
	        throw new Error('必须指定fetchUrl');
	      }

	      if (this.interval <= 1000) {
	        throw new Error('interval不能少于1000毫秒');
	      }

	      if (this.maxLength < 5) {
	        throw new Error('maxLength最少设置为5');
	      }

	      if (this.isStart) {
	        throw new Error('记录已开启，请勿重复记录，可以先进行关闭后再重新开启！');
	      }

	      this.stopRecordFn = record({
	        emit: function emit(event) {
	          _this.addEvent(event);
	        }
	      });
	      this.setUploadInterval();
	      this.isStart = true;
	    } catch (err) {
	      this.isStart = false;
	      console.error(err.message);
	    }
	  };

	  GodV.prototype.stopRecord = function () {
	    if (this.stopRecordFn && this.isStart) {
	      this.stopRecordFn();
	      this.isStart = false;
	    }
	  };

	  GodV.prototype.setUploadInterval = function () {
	    var _this = this;

	    setTimeout$2(function () {
	      var _context;

	      _this.events.length != 0 && _this.uploadEvent(splice$2(_context = _this.events).call(_context, 0));

	      _this.setUploadInterval();
	    }, this.interval);
	  };

	  GodV.prototype.addEvent = function (event) {
	    this.checkEventIsOverMaxLength();
	    this.events.push(event);
	  };

	  GodV.prototype.checkEventIsOverMaxLength = function () {
	    if (this.events.length >= this.maxLength) {
	      var _context2;

	      this.uploadEvent(splice$2(_context2 = this.events).call(_context2, 0));
	    }
	  };

	  GodV.prototype.uploadEvent = function (uploadEvents) {
	    console.log(this.uuid);
	    console.log(uploadEvents);
	  };

	  return GodV;
	}();

	return GodV;

})));
//# sourceMappingURL=index.js.map
