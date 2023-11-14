(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;
                    if (!f && c) return c(i, !0);
                    if (u) return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw ((a.code = "MODULE_NOT_FOUND"), a);
                }
                var p = (n[i] = { exports: {} });
                e[i][0].call(
                    p.exports,
                    function (r) {
                        var n = e[i][1][r];
                        return o(n || r);
                    },
                    p,
                    p.exports,
                    r,
                    e,
                    n,
                    t
                );
            }
            return n[i].exports;
        }
        for (
            var u = "function" == typeof require && require, i = 0;
            i < t.length;
            i++
        )
            o(t[i]);
        return o;
    }
    return r;
})()(
    {
        1: [
            function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.webGenerateV4 = exports.generateV4 = void 0;
                const platform_1 = require("../platform");
                const rnds8 = new Uint8Array(16);
                const byteToHex = [];
                /**
                 * generateV4 generates a string based on the 4th version of the RFC.
                 */
                const generateV4 = (noDash = false) => {
                    // Assumes NodeJS
                    if (!platform_1.isBrowser) {
                        let result = require("crypto").randomUUID();
                        return noDash ? result.split("-").join("") : result;
                    }
                    return (0, exports.webGenerateV4)(noDash);
                };
                exports.generateV4 = generateV4;
                /**
                 * @private
                 */
                const webGenerateV4 = (noDash = false) => {
                    let rnds = crypto.getRandomValues(rnds8);
                    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
                    rnds[6] = (rnds[6] & 0x0f) | 0x40;
                    rnds[8] = (rnds[8] & 0x3f) | 0x80;
                    if (byteToHex.length === 0)
                        for (let i = 0; i < 256; ++i)
                            byteToHex.push((i + 0x100).toString(16).slice(1));
                    let offset = 0;
                    let dash = noDash ? "" : "-";
                    // Note: Be careful editing this code!  It's been tuned for performance
                    // and works in ways you may not expect.
                    // See https://github.com/uuidjs/uuid/pull/434
                    return (
                        byteToHex[rnds[offset + 0]] +
                        byteToHex[rnds[offset + 1]] +
                        byteToHex[rnds[offset + 2]] +
                        byteToHex[rnds[offset + 3]] +
                        dash +
                        byteToHex[rnds[offset + 4]] +
                        byteToHex[rnds[offset + 5]] +
                        dash +
                        byteToHex[rnds[offset + 6]] +
                        byteToHex[rnds[offset + 7]] +
                        dash +
                        byteToHex[rnds[offset + 8]] +
                        byteToHex[rnds[offset + 9]] +
                        dash +
                        byteToHex[rnds[offset + 10]] +
                        byteToHex[rnds[offset + 11]] +
                        byteToHex[rnds[offset + 12]] +
                        byteToHex[rnds[offset + 13]] +
                        byteToHex[rnds[offset + 14]] +
                        byteToHex[rnds[offset + 15]]
                    );
                };
                exports.webGenerateV4 = webGenerateV4;
            },
            { "../platform": 2, crypto: undefined },
        ],
        2: [
            function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.isBrowser = void 0;
                exports.isBrowser = typeof window !== "undefined";
            },
            {},
        ],
        3: [
            function (require, module, exports) {
                "use strict";
                var __extends =
                    (this && this.__extends) ||
                    (function () {
                        var extendStatics = function (d, b) {
                            extendStatics =
                                Object.setPrototypeOf ||
                                ({ __proto__: [] } instanceof Array &&
                                    function (d, b) {
                                        d.__proto__ = b;
                                    }) ||
                                function (d, b) {
                                    for (var p in b)
                                        if (
                                            Object.prototype.hasOwnProperty.call(
                                                b,
                                                p
                                            )
                                        )
                                            d[p] = b[p];
                                };
                            return extendStatics(d, b);
                        };
                        return function (d, b) {
                            if (typeof b !== "function" && b !== null)
                                throw new TypeError(
                                    "Class extends value " +
                                        String(b) +
                                        " is not a constructor or null"
                                );
                            extendStatics(d, b);
                            function __() {
                                this.constructor = d;
                            }
                            d.prototype =
                                b === null
                                    ? Object.create(b)
                                    : ((__.prototype = b.prototype), new __());
                        };
                    })();
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.assert =
                    exports.toString =
                    exports.Failed =
                    exports.Negative =
                    exports.Positive =
                        void 0;
                var stringify = require("json-stringify-safe");
                var deepEqual = require("deep-equal");
                /**
                 * Positive value matcher.
                 */
                var Positive = /** @class */ (function () {
                    function Positive(name, value, throwErrors) {
                        this.name = name;
                        this.value = value;
                        this.throwErrors = throwErrors;
                        this.prefix = "must";
                    }
                    Object.defineProperty(Positive.prototype, "be", {
                        get: function () {
                            return this;
                        },
                        enumerable: false,
                        configurable: true,
                    });
                    Object.defineProperty(Positive.prototype, "is", {
                        get: function () {
                            return this;
                        },
                        enumerable: false,
                        configurable: true,
                    });
                    Object.defineProperty(Positive.prototype, "not", {
                        get: function () {
                            return new Negative(
                                this.name,
                                this.value,
                                this.throwErrors
                            );
                        },
                        enumerable: false,
                        configurable: true,
                    });
                    Object.defineProperty(Positive.prototype, "instance", {
                        get: function () {
                            return this;
                        },
                        enumerable: false,
                        configurable: true,
                    });
                    Positive.prototype.assert = function (ok, condition) {
                        if (!ok) {
                            if (this.throwErrors)
                                throw new Error(
                                    this.name +
                                        " " +
                                        this.prefix +
                                        " " +
                                        condition +
                                        "!"
                                );
                            return new Failed(
                                this.name,
                                this.value,
                                this.throwErrors
                            );
                        }
                        return this;
                    };
                    Positive.prototype.of = function (cons) {
                        return this.assert(
                            this.value instanceof cons,
                            "be instanceof " + cons.name
                        );
                    };
                    Positive.prototype.object = function () {
                        return this.assert(
                            typeof this.value === "object" &&
                                this.value !== null,
                            "be typeof object"
                        );
                    };
                    Positive.prototype.array = function () {
                        return this.assert(
                            Array.isArray(this.value),
                            "be an array"
                        );
                    };
                    Positive.prototype.string = function () {
                        return this.assert(
                            typeof this.value === "string",
                            "be typeof string"
                        );
                    };
                    Positive.prototype.number = function () {
                        return this.assert(
                            typeof this.value === "number",
                            "be typeof number"
                        );
                    };
                    Positive.prototype.boolean = function () {
                        return this.assert(
                            typeof this.value === "boolean",
                            "be typeof boolean"
                        );
                    };
                    Positive.prototype.true = function () {
                        return this.assert(this.value === true, "be true");
                    };
                    Positive.prototype.false = function () {
                        return this.assert(this.value === false, "be false");
                    };
                    Positive.prototype.null = function () {
                        return this.assert(this.value === null, "be null");
                    };
                    Positive.prototype.undefined = function () {
                        return this.assert(
                            this.value === undefined,
                            "be undefined"
                        );
                    };
                    Positive.prototype.equal = function (b) {
                        return this.assert(
                            this.value === b,
                            "equal " + (0, exports.toString)(b)
                        );
                    };
                    Positive.prototype.equate = function (b) {
                        return this.assert(
                            deepEqual(this.value, b),
                            "equate " + (0, exports.toString)(b)
                        );
                    };
                    Positive.prototype.throw = function (message) {
                        var ok = false;
                        try {
                            this.value();
                        } catch (e) {
                            if (message != null) {
                                ok = e.message === message;
                            } else {
                                ok = true;
                            }
                        }
                        return this.assert(
                            ok,
                            "throw " + (message != null ? message : "")
                        );
                    };
                    return Positive;
                })();
                exports.Positive = Positive;
                /**
                 * Negative value matcher.
                 */
                var Negative = /** @class */ (function (_super) {
                    __extends(Negative, _super);
                    function Negative() {
                        var _this =
                            (_super !== null &&
                                _super.apply(this, arguments)) ||
                            this;
                        _this.prefix = "must not";
                        return _this;
                    }
                    Negative.prototype.assert = function (ok, condition) {
                        return _super.prototype.assert.call(
                            this,
                            !ok,
                            condition
                        );
                    };
                    Object.defineProperty(Negative.prototype, "not", {
                        get: function () {
                            // not not == true
                            return new Positive(
                                this.name,
                                this.value,
                                this.throwErrors
                            );
                        },
                        enumerable: false,
                        configurable: true,
                    });
                    return Negative;
                })(Positive);
                exports.Negative = Negative;
                /**
                 * Failed matcher.
                 */
                var Failed = /** @class */ (function (_super) {
                    __extends(Failed, _super);
                    function Failed() {
                        return (
                            (_super !== null &&
                                _super.apply(this, arguments)) ||
                            this
                        );
                    }
                    Failed.prototype.assert = function (_, __) {
                        return this;
                    };
                    return Failed;
                })(Positive);
                exports.Failed = Failed;
                /**
                 * @private
                 */
                var toString = function (value) {
                    if (typeof value === "function") {
                        return value.name;
                    } else if (value instanceof Date) {
                        return value.toISOString();
                    } else if (value instanceof RegExp) {
                        return value.toString();
                    } else if (typeof value === "object") {
                        if (
                            value != null &&
                            value.constructor !== Object &&
                            !Array.isArray(value)
                        )
                            return value.constructor.name;
                        else return stringify(value);
                    }
                    return stringify(value);
                };
                exports.toString = toString;
                /**
                 * assert turns a value into a Matcher so it can be tested.
                 *
                 * The Matcher returned is positive and configured to throw
                 * errors if any tests fail.
                 */
                var assert = function (value, name) {
                    if (name === void 0) {
                        name = "";
                    }
                    return new Positive(
                        name ? name : (0, exports.toString)(value),
                        value,
                        true
                    );
                };
                exports.assert = assert;
            },
            { "deep-equal": 6, "json-stringify-safe": 20 },
        ],
        4: [
            function (require, module, exports) {
                "use strict";

                var GetIntrinsic = require("get-intrinsic");

                var callBind = require("./");

                var $indexOf = callBind(
                    GetIntrinsic("String.prototype.indexOf")
                );

                module.exports = function callBoundIntrinsic(
                    name,
                    allowMissing
                ) {
                    var intrinsic = GetIntrinsic(name, !!allowMissing);
                    if (
                        typeof intrinsic === "function" &&
                        $indexOf(name, ".prototype.") > -1
                    ) {
                        return callBind(intrinsic);
                    }
                    return intrinsic;
                };
            },
            { "./": 5, "get-intrinsic": 11 },
        ],
        5: [
            function (require, module, exports) {
                "use strict";

                var bind = require("function-bind");
                var GetIntrinsic = require("get-intrinsic");

                var $apply = GetIntrinsic("%Function.prototype.apply%");
                var $call = GetIntrinsic("%Function.prototype.call%");
                var $reflectApply =
                    GetIntrinsic("%Reflect.apply%", true) ||
                    bind.call($call, $apply);

                var $gOPD = GetIntrinsic(
                    "%Object.getOwnPropertyDescriptor%",
                    true
                );
                var $defineProperty = GetIntrinsic(
                    "%Object.defineProperty%",
                    true
                );
                var $max = GetIntrinsic("%Math.max%");

                if ($defineProperty) {
                    try {
                        $defineProperty({}, "a", { value: 1 });
                    } catch (e) {
                        // IE 8 has a broken defineProperty
                        $defineProperty = null;
                    }
                }

                module.exports = function callBind(originalFunction) {
                    var func = $reflectApply(bind, $call, arguments);
                    if ($gOPD && $defineProperty) {
                        var desc = $gOPD(func, "length");
                        if (desc.configurable) {
                            // original length, plus the receiver, minus any additional arguments (after the receiver)
                            $defineProperty(func, "length", {
                                value:
                                    1 +
                                    $max(
                                        0,
                                        originalFunction.length -
                                            (arguments.length - 1)
                                    ),
                            });
                        }
                    }
                    return func;
                };

                var applyBind = function applyBind() {
                    return $reflectApply(bind, $apply, arguments);
                };

                if ($defineProperty) {
                    $defineProperty(module.exports, "apply", {
                        value: applyBind,
                    });
                } else {
                    module.exports.apply = applyBind;
                }
            },
            { "function-bind": 9, "get-intrinsic": 11 },
        ],
        6: [
            function (require, module, exports) {
                var objectKeys = require("object-keys");
                var isArguments = require("is-arguments");
                var is = require("object-is");
                var isRegex = require("is-regex");
                var flags = require("regexp.prototype.flags");
                var isDate = require("is-date-object");

                var getTime = Date.prototype.getTime;

                function deepEqual(actual, expected, options) {
                    var opts = options || {};

                    // 7.1. All identical values are equivalent, as determined by ===.
                    if (
                        opts.strict ? is(actual, expected) : actual === expected
                    ) {
                        return true;
                    }

                    // 7.3. Other pairs that do not both pass typeof value == 'object', equivalence is determined by ==.
                    if (
                        !actual ||
                        !expected ||
                        (typeof actual !== "object" &&
                            typeof expected !== "object")
                    ) {
                        return opts.strict
                            ? is(actual, expected)
                            : actual == expected;
                    }

                    /*
                     * 7.4. For all other Object pairs, including Array objects, equivalence is
                     * determined by having the same number of owned properties (as verified
                     * with Object.prototype.hasOwnProperty.call), the same set of keys
                     * (although not necessarily the same order), equivalent values for every
                     * corresponding key, and an identical 'prototype' property. Note: this
                     * accounts for both named and indexed properties on Arrays.
                     */
                    // eslint-disable-next-line no-use-before-define
                    return objEquiv(actual, expected, opts);
                }

                function isUndefinedOrNull(value) {
                    return value === null || value === undefined;
                }

                function isBuffer(x) {
                    if (
                        !x ||
                        typeof x !== "object" ||
                        typeof x.length !== "number"
                    ) {
                        return false;
                    }
                    if (
                        typeof x.copy !== "function" ||
                        typeof x.slice !== "function"
                    ) {
                        return false;
                    }
                    if (x.length > 0 && typeof x[0] !== "number") {
                        return false;
                    }
                    return true;
                }

                function objEquiv(a, b, opts) {
                    /* eslint max-statements: [2, 50] */
                    var i, key;
                    if (typeof a !== typeof b) {
                        return false;
                    }
                    if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) {
                        return false;
                    }

                    // an identical 'prototype' property.
                    if (a.prototype !== b.prototype) {
                        return false;
                    }

                    if (isArguments(a) !== isArguments(b)) {
                        return false;
                    }

                    var aIsRegex = isRegex(a);
                    var bIsRegex = isRegex(b);
                    if (aIsRegex !== bIsRegex) {
                        return false;
                    }
                    if (aIsRegex || bIsRegex) {
                        return a.source === b.source && flags(a) === flags(b);
                    }

                    if (isDate(a) && isDate(b)) {
                        return getTime.call(a) === getTime.call(b);
                    }

                    var aIsBuffer = isBuffer(a);
                    var bIsBuffer = isBuffer(b);
                    if (aIsBuffer !== bIsBuffer) {
                        return false;
                    }
                    if (aIsBuffer || bIsBuffer) {
                        // && would work too, because both are true or both false here
                        if (a.length !== b.length) {
                            return false;
                        }
                        for (i = 0; i < a.length; i++) {
                            if (a[i] !== b[i]) {
                                return false;
                            }
                        }
                        return true;
                    }

                    if (typeof a !== typeof b) {
                        return false;
                    }

                    try {
                        var ka = objectKeys(a);
                        var kb = objectKeys(b);
                    } catch (e) {
                        // happens when one is a string literal and the other isn't
                        return false;
                    }
                    // having the same number of owned properties (keys incorporates hasOwnProperty)
                    if (ka.length !== kb.length) {
                        return false;
                    }

                    // the same set of keys (although not necessarily the same order),
                    ka.sort();
                    kb.sort();
                    // ~~~cheap key test
                    for (i = ka.length - 1; i >= 0; i--) {
                        if (ka[i] != kb[i]) {
                            return false;
                        }
                    }
                    // equivalent values for every corresponding key, and ~~~possibly expensive deep test
                    for (i = ka.length - 1; i >= 0; i--) {
                        key = ka[i];
                        if (!deepEqual(a[key], b[key], opts)) {
                            return false;
                        }
                    }

                    return true;
                }

                module.exports = deepEqual;
            },
            {
                "is-arguments": 17,
                "is-date-object": 18,
                "is-regex": 19,
                "object-is": 22,
                "object-keys": 26,
                "regexp.prototype.flags": 29,
            },
        ],
        7: [
            function (require, module, exports) {
                "use strict";

                var keys = require("object-keys");
                var hasSymbols =
                    typeof Symbol === "function" &&
                    typeof Symbol("foo") === "symbol";

                var toStr = Object.prototype.toString;
                var concat = Array.prototype.concat;
                var origDefineProperty = Object.defineProperty;

                var isFunction = function (fn) {
                    return (
                        typeof fn === "function" &&
                        toStr.call(fn) === "[object Function]"
                    );
                };

                var hasPropertyDescriptors =
                    require("has-property-descriptors")();

                var supportsDescriptors =
                    origDefineProperty && hasPropertyDescriptors;

                var defineProperty = function (object, name, value, predicate) {
                    if (
                        name in object &&
                        (!isFunction(predicate) || !predicate())
                    ) {
                        return;
                    }
                    if (supportsDescriptors) {
                        origDefineProperty(object, name, {
                            configurable: true,
                            enumerable: false,
                            value: value,
                            writable: true,
                        });
                    } else {
                        object[name] = value; // eslint-disable-line no-param-reassign
                    }
                };

                var defineProperties = function (object, map) {
                    var predicates = arguments.length > 2 ? arguments[2] : {};
                    var props = keys(map);
                    if (hasSymbols) {
                        props = concat.call(
                            props,
                            Object.getOwnPropertySymbols(map)
                        );
                    }
                    for (var i = 0; i < props.length; i += 1) {
                        defineProperty(
                            object,
                            props[i],
                            map[props[i]],
                            predicates[props[i]]
                        );
                    }
                };

                defineProperties.supportsDescriptors = !!supportsDescriptors;

                module.exports = defineProperties;
            },
            { "has-property-descriptors": 12, "object-keys": 26 },
        ],
        8: [
            function (require, module, exports) {
                "use strict";

                /* eslint no-invalid-this: 1 */

                var ERROR_MESSAGE =
                    "Function.prototype.bind called on incompatible ";
                var slice = Array.prototype.slice;
                var toStr = Object.prototype.toString;
                var funcType = "[object Function]";

                module.exports = function bind(that) {
                    var target = this;
                    if (
                        typeof target !== "function" ||
                        toStr.call(target) !== funcType
                    ) {
                        throw new TypeError(ERROR_MESSAGE + target);
                    }
                    var args = slice.call(arguments, 1);

                    var bound;
                    var binder = function () {
                        if (this instanceof bound) {
                            var result = target.apply(
                                this,
                                args.concat(slice.call(arguments))
                            );
                            if (Object(result) === result) {
                                return result;
                            }
                            return this;
                        } else {
                            return target.apply(
                                that,
                                args.concat(slice.call(arguments))
                            );
                        }
                    };

                    var boundLength = Math.max(0, target.length - args.length);
                    var boundArgs = [];
                    for (var i = 0; i < boundLength; i++) {
                        boundArgs.push("$" + i);
                    }

                    bound = Function(
                        "binder",
                        "return function (" +
                            boundArgs.join(",") +
                            "){ return binder.apply(this,arguments); }"
                    )(binder);

                    if (target.prototype) {
                        var Empty = function Empty() {};
                        Empty.prototype = target.prototype;
                        bound.prototype = new Empty();
                        Empty.prototype = null;
                    }

                    return bound;
                };
            },
            {},
        ],
        9: [
            function (require, module, exports) {
                "use strict";

                var implementation = require("./implementation");

                module.exports = Function.prototype.bind || implementation;
            },
            { "./implementation": 8 },
        ],
        10: [
            function (require, module, exports) {
                "use strict";

                var functionsHaveNames = function functionsHaveNames() {
                    return typeof function f() {}.name === "string";
                };

                var gOPD = Object.getOwnPropertyDescriptor;
                if (gOPD) {
                    try {
                        gOPD([], "length");
                    } catch (e) {
                        // IE 8 has a broken gOPD
                        gOPD = null;
                    }
                }

                functionsHaveNames.functionsHaveConfigurableNames =
                    function functionsHaveConfigurableNames() {
                        if (!functionsHaveNames() || !gOPD) {
                            return false;
                        }
                        var desc = gOPD(function () {}, "name");
                        return !!desc && !!desc.configurable;
                    };

                var $bind = Function.prototype.bind;

                functionsHaveNames.boundFunctionsHaveNames =
                    function boundFunctionsHaveNames() {
                        return (
                            functionsHaveNames() &&
                            typeof $bind === "function" &&
                            function f() {}.bind().name !== ""
                        );
                    };

                module.exports = functionsHaveNames;
            },
            {},
        ],
        11: [
            function (require, module, exports) {
                "use strict";

                var undefined;

                var $SyntaxError = SyntaxError;
                var $Function = Function;
                var $TypeError = TypeError;

                // eslint-disable-next-line consistent-return
                var getEvalledConstructor = function (expressionSyntax) {
                    try {
                        return $Function(
                            '"use strict"; return (' +
                                expressionSyntax +
                                ").constructor;"
                        )();
                    } catch (e) {}
                };

                var $gOPD = Object.getOwnPropertyDescriptor;
                if ($gOPD) {
                    try {
                        $gOPD({}, "");
                    } catch (e) {
                        $gOPD = null; // this is IE 8, which has a broken gOPD
                    }
                }

                var throwTypeError = function () {
                    throw new $TypeError();
                };
                var ThrowTypeError = $gOPD
                    ? (function () {
                          try {
                              // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
                              arguments.callee; // IE 8 does not throw here
                              return throwTypeError;
                          } catch (calleeThrows) {
                              try {
                                  // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
                                  return $gOPD(arguments, "callee").get;
                              } catch (gOPDthrows) {
                                  return throwTypeError;
                              }
                          }
                      })()
                    : throwTypeError;

                var hasSymbols = require("has-symbols")();

                var getProto =
                    Object.getPrototypeOf ||
                    function (x) {
                        return x.__proto__;
                    }; // eslint-disable-line no-proto

                var needsEval = {};

                var TypedArray =
                    typeof Uint8Array === "undefined"
                        ? undefined
                        : getProto(Uint8Array);

                var INTRINSICS = {
                    "%AggregateError%":
                        typeof AggregateError === "undefined"
                            ? undefined
                            : AggregateError,
                    "%Array%": Array,
                    "%ArrayBuffer%":
                        typeof ArrayBuffer === "undefined"
                            ? undefined
                            : ArrayBuffer,
                    "%ArrayIteratorPrototype%": hasSymbols
                        ? getProto([][Symbol.iterator]())
                        : undefined,
                    "%AsyncFromSyncIteratorPrototype%": undefined,
                    "%AsyncFunction%": needsEval,
                    "%AsyncGenerator%": needsEval,
                    "%AsyncGeneratorFunction%": needsEval,
                    "%AsyncIteratorPrototype%": needsEval,
                    "%Atomics%":
                        typeof Atomics === "undefined" ? undefined : Atomics,
                    "%BigInt%":
                        typeof BigInt === "undefined" ? undefined : BigInt,
                    "%Boolean%": Boolean,
                    "%DataView%":
                        typeof DataView === "undefined" ? undefined : DataView,
                    "%Date%": Date,
                    "%decodeURI%": decodeURI,
                    "%decodeURIComponent%": decodeURIComponent,
                    "%encodeURI%": encodeURI,
                    "%encodeURIComponent%": encodeURIComponent,
                    "%Error%": Error,
                    "%eval%": eval, // eslint-disable-line no-eval
                    "%EvalError%": EvalError,
                    "%Float32Array%":
                        typeof Float32Array === "undefined"
                            ? undefined
                            : Float32Array,
                    "%Float64Array%":
                        typeof Float64Array === "undefined"
                            ? undefined
                            : Float64Array,
                    "%FinalizationRegistry%":
                        typeof FinalizationRegistry === "undefined"
                            ? undefined
                            : FinalizationRegistry,
                    "%Function%": $Function,
                    "%GeneratorFunction%": needsEval,
                    "%Int8Array%":
                        typeof Int8Array === "undefined"
                            ? undefined
                            : Int8Array,
                    "%Int16Array%":
                        typeof Int16Array === "undefined"
                            ? undefined
                            : Int16Array,
                    "%Int32Array%":
                        typeof Int32Array === "undefined"
                            ? undefined
                            : Int32Array,
                    "%isFinite%": isFinite,
                    "%isNaN%": isNaN,
                    "%IteratorPrototype%": hasSymbols
                        ? getProto(getProto([][Symbol.iterator]()))
                        : undefined,
                    "%JSON%": typeof JSON === "object" ? JSON : undefined,
                    "%Map%": typeof Map === "undefined" ? undefined : Map,
                    "%MapIteratorPrototype%":
                        typeof Map === "undefined" || !hasSymbols
                            ? undefined
                            : getProto(new Map()[Symbol.iterator]()),
                    "%Math%": Math,
                    "%Number%": Number,
                    "%Object%": Object,
                    "%parseFloat%": parseFloat,
                    "%parseInt%": parseInt,
                    "%Promise%":
                        typeof Promise === "undefined" ? undefined : Promise,
                    "%Proxy%": typeof Proxy === "undefined" ? undefined : Proxy,
                    "%RangeError%": RangeError,
                    "%ReferenceError%": ReferenceError,
                    "%Reflect%":
                        typeof Reflect === "undefined" ? undefined : Reflect,
                    "%RegExp%": RegExp,
                    "%Set%": typeof Set === "undefined" ? undefined : Set,
                    "%SetIteratorPrototype%":
                        typeof Set === "undefined" || !hasSymbols
                            ? undefined
                            : getProto(new Set()[Symbol.iterator]()),
                    "%SharedArrayBuffer%":
                        typeof SharedArrayBuffer === "undefined"
                            ? undefined
                            : SharedArrayBuffer,
                    "%String%": String,
                    "%StringIteratorPrototype%": hasSymbols
                        ? getProto(""[Symbol.iterator]())
                        : undefined,
                    "%Symbol%": hasSymbols ? Symbol : undefined,
                    "%SyntaxError%": $SyntaxError,
                    "%ThrowTypeError%": ThrowTypeError,
                    "%TypedArray%": TypedArray,
                    "%TypeError%": $TypeError,
                    "%Uint8Array%":
                        typeof Uint8Array === "undefined"
                            ? undefined
                            : Uint8Array,
                    "%Uint8ClampedArray%":
                        typeof Uint8ClampedArray === "undefined"
                            ? undefined
                            : Uint8ClampedArray,
                    "%Uint16Array%":
                        typeof Uint16Array === "undefined"
                            ? undefined
                            : Uint16Array,
                    "%Uint32Array%":
                        typeof Uint32Array === "undefined"
                            ? undefined
                            : Uint32Array,
                    "%URIError%": URIError,
                    "%WeakMap%":
                        typeof WeakMap === "undefined" ? undefined : WeakMap,
                    "%WeakRef%":
                        typeof WeakRef === "undefined" ? undefined : WeakRef,
                    "%WeakSet%":
                        typeof WeakSet === "undefined" ? undefined : WeakSet,
                };

                var doEval = function doEval(name) {
                    var value;
                    if (name === "%AsyncFunction%") {
                        value = getEvalledConstructor("async function () {}");
                    } else if (name === "%GeneratorFunction%") {
                        value = getEvalledConstructor("function* () {}");
                    } else if (name === "%AsyncGeneratorFunction%") {
                        value = getEvalledConstructor("async function* () {}");
                    } else if (name === "%AsyncGenerator%") {
                        var fn = doEval("%AsyncGeneratorFunction%");
                        if (fn) {
                            value = fn.prototype;
                        }
                    } else if (name === "%AsyncIteratorPrototype%") {
                        var gen = doEval("%AsyncGenerator%");
                        if (gen) {
                            value = getProto(gen.prototype);
                        }
                    }

                    INTRINSICS[name] = value;

                    return value;
                };

                var LEGACY_ALIASES = {
                    "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
                    "%ArrayPrototype%": ["Array", "prototype"],
                    "%ArrayProto_entries%": ["Array", "prototype", "entries"],
                    "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
                    "%ArrayProto_keys%": ["Array", "prototype", "keys"],
                    "%ArrayProto_values%": ["Array", "prototype", "values"],
                    "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
                    "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
                    "%AsyncGeneratorPrototype%": [
                        "AsyncGeneratorFunction",
                        "prototype",
                        "prototype",
                    ],
                    "%BooleanPrototype%": ["Boolean", "prototype"],
                    "%DataViewPrototype%": ["DataView", "prototype"],
                    "%DatePrototype%": ["Date", "prototype"],
                    "%ErrorPrototype%": ["Error", "prototype"],
                    "%EvalErrorPrototype%": ["EvalError", "prototype"],
                    "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
                    "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
                    "%FunctionPrototype%": ["Function", "prototype"],
                    "%Generator%": ["GeneratorFunction", "prototype"],
                    "%GeneratorPrototype%": [
                        "GeneratorFunction",
                        "prototype",
                        "prototype",
                    ],
                    "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
                    "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
                    "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
                    "%JSONParse%": ["JSON", "parse"],
                    "%JSONStringify%": ["JSON", "stringify"],
                    "%MapPrototype%": ["Map", "prototype"],
                    "%NumberPrototype%": ["Number", "prototype"],
                    "%ObjectPrototype%": ["Object", "prototype"],
                    "%ObjProto_toString%": ["Object", "prototype", "toString"],
                    "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
                    "%PromisePrototype%": ["Promise", "prototype"],
                    "%PromiseProto_then%": ["Promise", "prototype", "then"],
                    "%Promise_all%": ["Promise", "all"],
                    "%Promise_reject%": ["Promise", "reject"],
                    "%Promise_resolve%": ["Promise", "resolve"],
                    "%RangeErrorPrototype%": ["RangeError", "prototype"],
                    "%ReferenceErrorPrototype%": [
                        "ReferenceError",
                        "prototype",
                    ],
                    "%RegExpPrototype%": ["RegExp", "prototype"],
                    "%SetPrototype%": ["Set", "prototype"],
                    "%SharedArrayBufferPrototype%": [
                        "SharedArrayBuffer",
                        "prototype",
                    ],
                    "%StringPrototype%": ["String", "prototype"],
                    "%SymbolPrototype%": ["Symbol", "prototype"],
                    "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
                    "%TypedArrayPrototype%": ["TypedArray", "prototype"],
                    "%TypeErrorPrototype%": ["TypeError", "prototype"],
                    "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
                    "%Uint8ClampedArrayPrototype%": [
                        "Uint8ClampedArray",
                        "prototype",
                    ],
                    "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
                    "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
                    "%URIErrorPrototype%": ["URIError", "prototype"],
                    "%WeakMapPrototype%": ["WeakMap", "prototype"],
                    "%WeakSetPrototype%": ["WeakSet", "prototype"],
                };

                var bind = require("function-bind");
                var hasOwn = require("has");
                var $concat = bind.call(Function.call, Array.prototype.concat);
                var $spliceApply = bind.call(
                    Function.apply,
                    Array.prototype.splice
                );
                var $replace = bind.call(
                    Function.call,
                    String.prototype.replace
                );
                var $strSlice = bind.call(
                    Function.call,
                    String.prototype.slice
                );
                var $exec = bind.call(Function.call, RegExp.prototype.exec);

                /* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
                var rePropName =
                    /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
                var reEscapeChar =
                    /\\(\\)?/g; /** Used to match backslashes in property paths. */
                var stringToPath = function stringToPath(string) {
                    var first = $strSlice(string, 0, 1);
                    var last = $strSlice(string, -1);
                    if (first === "%" && last !== "%") {
                        throw new $SyntaxError(
                            "invalid intrinsic syntax, expected closing `%`"
                        );
                    } else if (last === "%" && first !== "%") {
                        throw new $SyntaxError(
                            "invalid intrinsic syntax, expected opening `%`"
                        );
                    }
                    var result = [];
                    $replace(
                        string,
                        rePropName,
                        function (match, number, quote, subString) {
                            result[result.length] = quote
                                ? $replace(subString, reEscapeChar, "$1")
                                : number || match;
                        }
                    );
                    return result;
                };
                /* end adaptation */

                var getBaseIntrinsic = function getBaseIntrinsic(
                    name,
                    allowMissing
                ) {
                    var intrinsicName = name;
                    var alias;
                    if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
                        alias = LEGACY_ALIASES[intrinsicName];
                        intrinsicName = "%" + alias[0] + "%";
                    }

                    if (hasOwn(INTRINSICS, intrinsicName)) {
                        var value = INTRINSICS[intrinsicName];
                        if (value === needsEval) {
                            value = doEval(intrinsicName);
                        }
                        if (typeof value === "undefined" && !allowMissing) {
                            throw new $TypeError(
                                "intrinsic " +
                                    name +
                                    " exists, but is not available. Please file an issue!"
                            );
                        }

                        return {
                            alias: alias,
                            name: intrinsicName,
                            value: value,
                        };
                    }

                    throw new $SyntaxError(
                        "intrinsic " + name + " does not exist!"
                    );
                };

                module.exports = function GetIntrinsic(name, allowMissing) {
                    if (typeof name !== "string" || name.length === 0) {
                        throw new $TypeError(
                            "intrinsic name must be a non-empty string"
                        );
                    }
                    if (
                        arguments.length > 1 &&
                        typeof allowMissing !== "boolean"
                    ) {
                        throw new $TypeError(
                            '"allowMissing" argument must be a boolean'
                        );
                    }

                    if ($exec(/^%?[^%]*%?$/, name) === null) {
                        throw new $SyntaxError(
                            "`%` may not be present anywhere but at the beginning and end of the intrinsic name"
                        );
                    }
                    var parts = stringToPath(name);
                    var intrinsicBaseName = parts.length > 0 ? parts[0] : "";

                    var intrinsic = getBaseIntrinsic(
                        "%" + intrinsicBaseName + "%",
                        allowMissing
                    );
                    var intrinsicRealName = intrinsic.name;
                    var value = intrinsic.value;
                    var skipFurtherCaching = false;

                    var alias = intrinsic.alias;
                    if (alias) {
                        intrinsicBaseName = alias[0];
                        $spliceApply(parts, $concat([0, 1], alias));
                    }

                    for (var i = 1, isOwn = true; i < parts.length; i += 1) {
                        var part = parts[i];
                        var first = $strSlice(part, 0, 1);
                        var last = $strSlice(part, -1);
                        if (
                            (first === '"' ||
                                first === "'" ||
                                first === "`" ||
                                last === '"' ||
                                last === "'" ||
                                last === "`") &&
                            first !== last
                        ) {
                            throw new $SyntaxError(
                                "property names with quotes must have matching quotes"
                            );
                        }
                        if (part === "constructor" || !isOwn) {
                            skipFurtherCaching = true;
                        }

                        intrinsicBaseName += "." + part;
                        intrinsicRealName = "%" + intrinsicBaseName + "%";

                        if (hasOwn(INTRINSICS, intrinsicRealName)) {
                            value = INTRINSICS[intrinsicRealName];
                        } else if (value != null) {
                            if (!(part in value)) {
                                if (!allowMissing) {
                                    throw new $TypeError(
                                        "base intrinsic for " +
                                            name +
                                            " exists, but the property is not available."
                                    );
                                }
                                return void undefined;
                            }
                            if ($gOPD && i + 1 >= parts.length) {
                                var desc = $gOPD(value, part);
                                isOwn = !!desc;

                                // By convention, when a data property is converted to an accessor
                                // property to emulate a data property that does not suffer from
                                // the override mistake, that accessor's getter is marked with
                                // an `originalValue` property. Here, when we detect this, we
                                // uphold the illusion by pretending to see that original data
                                // property, i.e., returning the value rather than the getter
                                // itself.
                                if (
                                    isOwn &&
                                    "get" in desc &&
                                    !("originalValue" in desc.get)
                                ) {
                                    value = desc.get;
                                } else {
                                    value = value[part];
                                }
                            } else {
                                isOwn = hasOwn(value, part);
                                value = value[part];
                            }

                            if (isOwn && !skipFurtherCaching) {
                                INTRINSICS[intrinsicRealName] = value;
                            }
                        }
                    }
                    return value;
                };
            },
            { "function-bind": 9, has: 16, "has-symbols": 13 },
        ],
        12: [
            function (require, module, exports) {
                "use strict";

                var GetIntrinsic = require("get-intrinsic");

                var $defineProperty = GetIntrinsic(
                    "%Object.defineProperty%",
                    true
                );

                var hasPropertyDescriptors = function hasPropertyDescriptors() {
                    if ($defineProperty) {
                        try {
                            $defineProperty({}, "a", { value: 1 });
                            return true;
                        } catch (e) {
                            // IE 8 has a broken defineProperty
                            return false;
                        }
                    }
                    return false;
                };

                hasPropertyDescriptors.hasArrayLengthDefineBug =
                    function hasArrayLengthDefineBug() {
                        // node v0.6 has a bug where array lengths can be Set but not Defined
                        if (!hasPropertyDescriptors()) {
                            return null;
                        }
                        try {
                            return (
                                $defineProperty([], "length", { value: 1 })
                                    .length !== 1
                            );
                        } catch (e) {
                            // In Firefox 4-22, defining length on an array throws an exception.
                            return true;
                        }
                    };

                module.exports = hasPropertyDescriptors;
            },
            { "get-intrinsic": 11 },
        ],
        13: [
            function (require, module, exports) {
                "use strict";

                var origSymbol = typeof Symbol !== "undefined" && Symbol;
                var hasSymbolSham = require("./shams");

                module.exports = function hasNativeSymbols() {
                    if (typeof origSymbol !== "function") {
                        return false;
                    }
                    if (typeof Symbol !== "function") {
                        return false;
                    }
                    if (typeof origSymbol("foo") !== "symbol") {
                        return false;
                    }
                    if (typeof Symbol("bar") !== "symbol") {
                        return false;
                    }

                    return hasSymbolSham();
                };
            },
            { "./shams": 14 },
        ],
        14: [
            function (require, module, exports) {
                "use strict";

                /* eslint complexity: [2, 18], max-statements: [2, 33] */
                module.exports = function hasSymbols() {
                    if (
                        typeof Symbol !== "function" ||
                        typeof Object.getOwnPropertySymbols !== "function"
                    ) {
                        return false;
                    }
                    if (typeof Symbol.iterator === "symbol") {
                        return true;
                    }

                    var obj = {};
                    var sym = Symbol("test");
                    var symObj = Object(sym);
                    if (typeof sym === "string") {
                        return false;
                    }

                    if (
                        Object.prototype.toString.call(sym) !==
                        "[object Symbol]"
                    ) {
                        return false;
                    }
                    if (
                        Object.prototype.toString.call(symObj) !==
                        "[object Symbol]"
                    ) {
                        return false;
                    }

                    // temp disabled per https://github.com/ljharb/object.assign/issues/17
                    // if (sym instanceof Symbol) { return false; }
                    // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
                    // if (!(symObj instanceof Symbol)) { return false; }

                    // if (typeof Symbol.prototype.toString !== 'function') { return false; }
                    // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

                    var symVal = 42;
                    obj[sym] = symVal;
                    for (sym in obj) {
                        return false;
                    } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
                    if (
                        typeof Object.keys === "function" &&
                        Object.keys(obj).length !== 0
                    ) {
                        return false;
                    }

                    if (
                        typeof Object.getOwnPropertyNames === "function" &&
                        Object.getOwnPropertyNames(obj).length !== 0
                    ) {
                        return false;
                    }

                    var syms = Object.getOwnPropertySymbols(obj);
                    if (syms.length !== 1 || syms[0] !== sym) {
                        return false;
                    }

                    if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
                        return false;
                    }

                    if (typeof Object.getOwnPropertyDescriptor === "function") {
                        var descriptor = Object.getOwnPropertyDescriptor(
                            obj,
                            sym
                        );
                        if (
                            descriptor.value !== symVal ||
                            descriptor.enumerable !== true
                        ) {
                            return false;
                        }
                    }

                    return true;
                };
            },
            {},
        ],
        15: [
            function (require, module, exports) {
                "use strict";

                var hasSymbols = require("has-symbols/shams");

                module.exports = function hasToStringTagShams() {
                    return hasSymbols() && !!Symbol.toStringTag;
                };
            },
            { "has-symbols/shams": 14 },
        ],
        16: [
            function (require, module, exports) {
                "use strict";

                var bind = require("function-bind");

                module.exports = bind.call(
                    Function.call,
                    Object.prototype.hasOwnProperty
                );
            },
            { "function-bind": 9 },
        ],
        17: [
            function (require, module, exports) {
                "use strict";

                var hasToStringTag = require("has-tostringtag/shams")();
                var callBound = require("call-bind/callBound");

                var $toString = callBound("Object.prototype.toString");

                var isStandardArguments = function isArguments(value) {
                    if (
                        hasToStringTag &&
                        value &&
                        typeof value === "object" &&
                        Symbol.toStringTag in value
                    ) {
                        return false;
                    }
                    return $toString(value) === "[object Arguments]";
                };

                var isLegacyArguments = function isArguments(value) {
                    if (isStandardArguments(value)) {
                        return true;
                    }
                    return (
                        value !== null &&
                        typeof value === "object" &&
                        typeof value.length === "number" &&
                        value.length >= 0 &&
                        $toString(value) !== "[object Array]" &&
                        $toString(value.callee) === "[object Function]"
                    );
                };

                var supportsStandardArguments = (function () {
                    return isStandardArguments(arguments);
                })();

                isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

                module.exports = supportsStandardArguments
                    ? isStandardArguments
                    : isLegacyArguments;
            },
            { "call-bind/callBound": 4, "has-tostringtag/shams": 15 },
        ],
        18: [
            function (require, module, exports) {
                "use strict";

                var getDay = Date.prototype.getDay;
                var tryDateObject = function tryDateGetDayCall(value) {
                    try {
                        getDay.call(value);
                        return true;
                    } catch (e) {
                        return false;
                    }
                };

                var toStr = Object.prototype.toString;
                var dateClass = "[object Date]";
                var hasToStringTag = require("has-tostringtag/shams")();

                module.exports = function isDateObject(value) {
                    if (typeof value !== "object" || value === null) {
                        return false;
                    }
                    return hasToStringTag
                        ? tryDateObject(value)
                        : toStr.call(value) === dateClass;
                };
            },
            { "has-tostringtag/shams": 15 },
        ],
        19: [
            function (require, module, exports) {
                "use strict";

                var callBound = require("call-bind/callBound");
                var hasToStringTag = require("has-tostringtag/shams")();
                var has;
                var $exec;
                var isRegexMarker;
                var badStringifier;

                if (hasToStringTag) {
                    has = callBound("Object.prototype.hasOwnProperty");
                    $exec = callBound("RegExp.prototype.exec");
                    isRegexMarker = {};

                    var throwRegexMarker = function () {
                        throw isRegexMarker;
                    };
                    badStringifier = {
                        toString: throwRegexMarker,
                        valueOf: throwRegexMarker,
                    };

                    if (typeof Symbol.toPrimitive === "symbol") {
                        badStringifier[Symbol.toPrimitive] = throwRegexMarker;
                    }
                }

                var $toString = callBound("Object.prototype.toString");
                var gOPD = Object.getOwnPropertyDescriptor;
                var regexClass = "[object RegExp]";

                module.exports = hasToStringTag
                    ? // eslint-disable-next-line consistent-return
                      function isRegex(value) {
                          if (!value || typeof value !== "object") {
                              return false;
                          }

                          var descriptor = gOPD(value, "lastIndex");
                          var hasLastIndexDataProperty =
                              descriptor && has(descriptor, "value");
                          if (!hasLastIndexDataProperty) {
                              return false;
                          }

                          try {
                              $exec(value, badStringifier);
                          } catch (e) {
                              return e === isRegexMarker;
                          }
                      }
                    : function isRegex(value) {
                          // In older browsers, typeof regex incorrectly returns 'function'
                          if (
                              !value ||
                              (typeof value !== "object" &&
                                  typeof value !== "function")
                          ) {
                              return false;
                          }

                          return $toString(value) === regexClass;
                      };
            },
            { "call-bind/callBound": 4, "has-tostringtag/shams": 15 },
        ],
        20: [
            function (require, module, exports) {
                exports = module.exports = stringify;
                exports.getSerialize = serializer;

                function stringify(obj, replacer, spaces, cycleReplacer) {
                    return JSON.stringify(
                        obj,
                        serializer(replacer, cycleReplacer),
                        spaces
                    );
                }

                function serializer(replacer, cycleReplacer) {
                    var stack = [],
                        keys = [];

                    if (cycleReplacer == null)
                        cycleReplacer = function (key, value) {
                            if (stack[0] === value) return "[Circular ~]";
                            return (
                                "[Circular ~." +
                                keys.slice(0, stack.indexOf(value)).join(".") +
                                "]"
                            );
                        };

                    return function (key, value) {
                        if (stack.length > 0) {
                            var thisPos = stack.indexOf(this);
                            ~thisPos
                                ? stack.splice(thisPos + 1)
                                : stack.push(this);
                            ~thisPos
                                ? keys.splice(thisPos, Infinity, key)
                                : keys.push(key);
                            if (~stack.indexOf(value))
                                value = cycleReplacer.call(this, key, value);
                        } else stack.push(value);

                        return replacer == null
                            ? value
                            : replacer.call(this, key, value);
                    };
                }
            },
            {},
        ],
        21: [
            function (require, module, exports) {
                "use strict";

                var numberIsNaN = function (value) {
                    return value !== value;
                };

                module.exports = function is(a, b) {
                    if (a === 0 && b === 0) {
                        return 1 / a === 1 / b;
                    }
                    if (a === b) {
                        return true;
                    }
                    if (numberIsNaN(a) && numberIsNaN(b)) {
                        return true;
                    }
                    return false;
                };
            },
            {},
        ],
        22: [
            function (require, module, exports) {
                "use strict";

                var define = require("define-properties");
                var callBind = require("call-bind");

                var implementation = require("./implementation");
                var getPolyfill = require("./polyfill");
                var shim = require("./shim");

                var polyfill = callBind(getPolyfill(), Object);

                define(polyfill, {
                    getPolyfill: getPolyfill,
                    implementation: implementation,
                    shim: shim,
                });

                module.exports = polyfill;
            },
            {
                "./implementation": 21,
                "./polyfill": 23,
                "./shim": 24,
                "call-bind": 5,
                "define-properties": 7,
            },
        ],
        23: [
            function (require, module, exports) {
                "use strict";

                var implementation = require("./implementation");

                module.exports = function getPolyfill() {
                    return typeof Object.is === "function"
                        ? Object.is
                        : implementation;
                };
            },
            { "./implementation": 21 },
        ],
        24: [
            function (require, module, exports) {
                "use strict";

                var getPolyfill = require("./polyfill");
                var define = require("define-properties");

                module.exports = function shimObjectIs() {
                    var polyfill = getPolyfill();
                    define(
                        Object,
                        { is: polyfill },
                        {
                            is: function testObjectIs() {
                                return Object.is !== polyfill;
                            },
                        }
                    );
                    return polyfill;
                };
            },
            { "./polyfill": 23, "define-properties": 7 },
        ],
        25: [
            function (require, module, exports) {
                "use strict";

                var keysShim;
                if (!Object.keys) {
                    // modified from https://github.com/es-shims/es5-shim
                    var has = Object.prototype.hasOwnProperty;
                    var toStr = Object.prototype.toString;
                    var isArgs = require("./isArguments"); // eslint-disable-line global-require
                    var isEnumerable = Object.prototype.propertyIsEnumerable;
                    var hasDontEnumBug = !isEnumerable.call(
                        { toString: null },
                        "toString"
                    );
                    var hasProtoEnumBug = isEnumerable.call(function () {},
                    "prototype");
                    var dontEnums = [
                        "toString",
                        "toLocaleString",
                        "valueOf",
                        "hasOwnProperty",
                        "isPrototypeOf",
                        "propertyIsEnumerable",
                        "constructor",
                    ];
                    var equalsConstructorPrototype = function (o) {
                        var ctor = o.constructor;
                        return ctor && ctor.prototype === o;
                    };
                    var excludedKeys = {
                        $applicationCache: true,
                        $console: true,
                        $external: true,
                        $frame: true,
                        $frameElement: true,
                        $frames: true,
                        $innerHeight: true,
                        $innerWidth: true,
                        $onmozfullscreenchange: true,
                        $onmozfullscreenerror: true,
                        $outerHeight: true,
                        $outerWidth: true,
                        $pageXOffset: true,
                        $pageYOffset: true,
                        $parent: true,
                        $scrollLeft: true,
                        $scrollTop: true,
                        $scrollX: true,
                        $scrollY: true,
                        $self: true,
                        $webkitIndexedDB: true,
                        $webkitStorageInfo: true,
                        $window: true,
                    };
                    var hasAutomationEqualityBug = (function () {
                        /* global window */
                        if (typeof window === "undefined") {
                            return false;
                        }
                        for (var k in window) {
                            try {
                                if (
                                    !excludedKeys["$" + k] &&
                                    has.call(window, k) &&
                                    window[k] !== null &&
                                    typeof window[k] === "object"
                                ) {
                                    try {
                                        equalsConstructorPrototype(window[k]);
                                    } catch (e) {
                                        return true;
                                    }
                                }
                            } catch (e) {
                                return true;
                            }
                        }
                        return false;
                    })();
                    var equalsConstructorPrototypeIfNotBuggy = function (o) {
                        /* global window */
                        if (
                            typeof window === "undefined" ||
                            !hasAutomationEqualityBug
                        ) {
                            return equalsConstructorPrototype(o);
                        }
                        try {
                            return equalsConstructorPrototype(o);
                        } catch (e) {
                            return false;
                        }
                    };

                    keysShim = function keys(object) {
                        var isObject =
                            object !== null && typeof object === "object";
                        var isFunction =
                            toStr.call(object) === "[object Function]";
                        var isArguments = isArgs(object);
                        var isString =
                            isObject &&
                            toStr.call(object) === "[object String]";
                        var theKeys = [];

                        if (!isObject && !isFunction && !isArguments) {
                            throw new TypeError(
                                "Object.keys called on a non-object"
                            );
                        }

                        var skipProto = hasProtoEnumBug && isFunction;
                        if (
                            isString &&
                            object.length > 0 &&
                            !has.call(object, 0)
                        ) {
                            for (var i = 0; i < object.length; ++i) {
                                theKeys.push(String(i));
                            }
                        }

                        if (isArguments && object.length > 0) {
                            for (var j = 0; j < object.length; ++j) {
                                theKeys.push(String(j));
                            }
                        } else {
                            for (var name in object) {
                                if (
                                    !(skipProto && name === "prototype") &&
                                    has.call(object, name)
                                ) {
                                    theKeys.push(String(name));
                                }
                            }
                        }

                        if (hasDontEnumBug) {
                            var skipConstructor =
                                equalsConstructorPrototypeIfNotBuggy(object);

                            for (var k = 0; k < dontEnums.length; ++k) {
                                if (
                                    !(
                                        skipConstructor &&
                                        dontEnums[k] === "constructor"
                                    ) &&
                                    has.call(object, dontEnums[k])
                                ) {
                                    theKeys.push(dontEnums[k]);
                                }
                            }
                        }
                        return theKeys;
                    };
                }
                module.exports = keysShim;
            },
            { "./isArguments": 27 },
        ],
        26: [
            function (require, module, exports) {
                "use strict";

                var slice = Array.prototype.slice;
                var isArgs = require("./isArguments");

                var origKeys = Object.keys;
                var keysShim = origKeys
                    ? function keys(o) {
                          return origKeys(o);
                      }
                    : require("./implementation");

                var originalKeys = Object.keys;

                keysShim.shim = function shimObjectKeys() {
                    if (Object.keys) {
                        var keysWorksWithArguments = (function () {
                            // Safari 5.0 bug
                            var args = Object.keys(arguments);
                            return args && args.length === arguments.length;
                        })(1, 2);
                        if (!keysWorksWithArguments) {
                            Object.keys = function keys(object) {
                                // eslint-disable-line func-name-matching
                                if (isArgs(object)) {
                                    return originalKeys(slice.call(object));
                                }
                                return originalKeys(object);
                            };
                        }
                    } else {
                        Object.keys = keysShim;
                    }
                    return Object.keys || keysShim;
                };

                module.exports = keysShim;
            },
            { "./implementation": 25, "./isArguments": 27 },
        ],
        27: [
            function (require, module, exports) {
                "use strict";

                var toStr = Object.prototype.toString;

                module.exports = function isArguments(value) {
                    var str = toStr.call(value);
                    var isArgs = str === "[object Arguments]";
                    if (!isArgs) {
                        isArgs =
                            str !== "[object Array]" &&
                            value !== null &&
                            typeof value === "object" &&
                            typeof value.length === "number" &&
                            value.length >= 0 &&
                            toStr.call(value.callee) === "[object Function]";
                    }
                    return isArgs;
                };
            },
            {},
        ],
        28: [
            function (require, module, exports) {
                "use strict";

                var functionsHaveConfigurableNames =
                    require("functions-have-names").functionsHaveConfigurableNames();

                var $Object = Object;
                var $TypeError = TypeError;

                module.exports = function flags() {
                    if (this != null && this !== $Object(this)) {
                        throw new $TypeError(
                            "RegExp.prototype.flags getter called on non-object"
                        );
                    }
                    var result = "";
                    if (this.hasIndices) {
                        result += "d";
                    }
                    if (this.global) {
                        result += "g";
                    }
                    if (this.ignoreCase) {
                        result += "i";
                    }
                    if (this.multiline) {
                        result += "m";
                    }
                    if (this.dotAll) {
                        result += "s";
                    }
                    if (this.unicode) {
                        result += "u";
                    }
                    if (this.sticky) {
                        result += "y";
                    }
                    return result;
                };

                if (functionsHaveConfigurableNames && Object.defineProperty) {
                    Object.defineProperty(module.exports, "name", {
                        value: "get flags",
                    });
                }
            },
            { "functions-have-names": 10 },
        ],
        29: [
            function (require, module, exports) {
                "use strict";

                var define = require("define-properties");
                var callBind = require("call-bind");

                var implementation = require("./implementation");
                var getPolyfill = require("./polyfill");
                var shim = require("./shim");

                var flagsBound = callBind(getPolyfill());

                define(flagsBound, {
                    getPolyfill: getPolyfill,
                    implementation: implementation,
                    shim: shim,
                });

                module.exports = flagsBound;
            },
            {
                "./implementation": 28,
                "./polyfill": 30,
                "./shim": 31,
                "call-bind": 5,
                "define-properties": 7,
            },
        ],
        30: [
            function (require, module, exports) {
                "use strict";

                var implementation = require("./implementation");

                var supportsDescriptors =
                    require("define-properties").supportsDescriptors;
                var $gOPD = Object.getOwnPropertyDescriptor;

                module.exports = function getPolyfill() {
                    if (supportsDescriptors && /a/gim.flags === "gim") {
                        var descriptor = $gOPD(RegExp.prototype, "flags");
                        if (
                            descriptor &&
                            typeof descriptor.get === "function" &&
                            typeof RegExp.prototype.dotAll === "boolean" &&
                            typeof RegExp.prototype.hasIndices === "boolean"
                        ) {
                            /* eslint getter-return: 0 */
                            var calls = "";
                            var o = {};
                            Object.defineProperty(o, "hasIndices", {
                                get: function () {
                                    calls += "d";
                                },
                            });
                            Object.defineProperty(o, "sticky", {
                                get: function () {
                                    calls += "y";
                                },
                            });
                            if (calls === "dy") {
                                return descriptor.get;
                            }
                        }
                    }
                    return implementation;
                };
            },
            { "./implementation": 28, "define-properties": 7 },
        ],
        31: [
            function (require, module, exports) {
                "use strict";

                var supportsDescriptors =
                    require("define-properties").supportsDescriptors;
                var getPolyfill = require("./polyfill");
                var gOPD = Object.getOwnPropertyDescriptor;
                var defineProperty = Object.defineProperty;
                var TypeErr = TypeError;
                var getProto = Object.getPrototypeOf;
                var regex = /a/;

                module.exports = function shimFlags() {
                    if (!supportsDescriptors || !getProto) {
                        throw new TypeErr(
                            "RegExp.prototype.flags requires a true ES5 environment that supports property descriptors"
                        );
                    }
                    var polyfill = getPolyfill();
                    var proto = getProto(regex);
                    var descriptor = gOPD(proto, "flags");
                    if (!descriptor || descriptor.get !== polyfill) {
                        defineProperty(proto, "flags", {
                            configurable: true,
                            enumerable: false,
                            get: polyfill,
                        });
                    }
                    return polyfill;
                };
            },
            { "./polyfill": 30, "define-properties": 7 },
        ],
        32: [
            function (require, module, exports) {
                const { assert } = require("@quenk/test/lib/assert");

                const { webGenerateV4 } = require("../../../lib/crypto/uuid");

                describe("uuid", () => {
                    describe("webGenerateV4", () => {
                        it("should generate a v4 string", () => {
                            let strs = webGenerateV4().split("-");
                            assert(strs.length).equal(5);
                            assert(strs[0].length).equal(8);
                            assert(strs[1].length).equal(4);
                            assert(strs[2].length).equal(4);
                            assert(strs[3].length).equal(4);
                            assert(strs[4].length).equal(12);
                        });

                        it("should generate without dashses", () => {
                            let str = webGenerateV4(true);
                            assert(str.indexOf("-")).equal(-1);
                            assert(str.length).equal(32);
                        });

                        it("should be unique for 10K rounds", () => {
                            let output = [];

                            for (let i = 0; i <= 10000; i++) {
                                let str = webGenerateV4();
                                let idx = output.indexOf(str);
                                output.push(str);

                                if (idx !== -1)
                                    throw new Error(
                                        `Found collision for "${str}" ` +
                                            `prev=${i} curr=${i}.`
                                    );
                            }
                        });
                    });
                });
            },
            { "../../../lib/crypto/uuid": 1, "@quenk/test/lib/assert": 3 },
        ],
    },
    {},
    [32]
);
