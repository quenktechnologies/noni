"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMember = exports.getPath = exports.isPointer = exports.interp = exports.compileList = exports.compile = exports.tokenize = exports.Import = exports.Failure = exports.Member = exports.Module = exports.STATE_FINISHED = exports.STATE_MEMBER = exports.STATE_PATH = exports.TOKEN_HASH = void 0;
/**
 * Provides an API for working with module pointers.
 */
var either_1 = require("../../../data/either");
exports.TOKEN_HASH = '#';
exports.STATE_PATH = 1;
exports.STATE_MEMBER = 2;
exports.STATE_FINISHED = 3;
/**
 * Module part of the pointer.
 */
var Module = /** @class */ (function () {
    function Module(path, position) {
        this.path = path;
        this.position = position;
        this.type = 'module';
    }
    Module.prototype.toString = function () {
        return this.path;
    };
    return Module;
}());
exports.Module = Module;
/**
 * Member part of the pointer.
 */
var Member = /** @class */ (function () {
    function Member(name, position) {
        this.name = name;
        this.position = position;
        this.type = 'member';
    }
    Member.prototype.toString = function () {
        return this.name;
    };
    return Member;
}());
exports.Member = Member;
/**
 * Failure indicates some error occured during lexing.
 */
var Failure = /** @class */ (function () {
    function Failure(message, text, position) {
        this.message = message;
        this.text = text;
        this.position = position;
    }
    return Failure;
}());
exports.Failure = Failure;
/**
 * Import represents a pointer compiled into a single object that contains
 * the information about the desired module and its export.
 */
var Import = /** @class */ (function () {
    function Import(module, member) {
        this.module = module;
        this.member = member;
    }
    return Import;
}());
exports.Import = Import;
/**
 * tokenize a Pointer into its useful lexical parts.
 */
var tokenize = function (ptr) {
    var toks = [];
    var state = exports.STATE_PATH;
    var i = 0;
    var curr = '';
    var next = '';
    var buf = '';
    if (ptr.length === 0)
        return (0, either_1.left)(new Failure("Unexpected EOF!", ptr, 0));
    while (i < ptr.length) {
        curr = ptr[i];
        next = ptr[i + 1];
        if ((state === exports.STATE_PATH) &&
            (curr === exports.TOKEN_HASH) &&
            (buf.length === 0)) {
            return (0, either_1.left)(new Failure("Expected \"module\" but found #!", curr, i));
        }
        else if ((state === exports.STATE_PATH) && (curr === exports.TOKEN_HASH)) {
            toks.push(new Module(buf, i - buf.length));
            buf = '';
            next = '';
            state = exports.STATE_MEMBER;
        }
        else if ((state === exports.STATE_PATH) && (next == null)) {
            return (0, either_1.left)(new Failure("Expecting \"#\" but found EOF!", curr, i));
        }
        else if ((state === exports.STATE_MEMBER) && (next == null)) {
            buf = (curr == null) ? '' : "".concat(buf).concat(curr);
            if (buf.length === 0)
                return (0, either_1.left)(new Failure('Unexpected EOF!', curr, i));
            toks.push(new Member(buf, i - buf.length));
            buf = '';
            next = '';
        }
        else {
            buf = "".concat(buf).concat(curr);
        }
        i++;
    }
    return (0, either_1.right)(toks);
};
exports.tokenize = tokenize;
/**
 * compile a Pointer into an Import object.
 */
var compile = function (ptr) {
    var eToks = (0, exports.tokenize)(ptr);
    if (eToks.isLeft())
        return (0, either_1.left)(new Error(eToks.takeLeft().message));
    var toks = eToks.takeRight();
    if (toks.length !== 2)
        return (0, either_1.left)(new Error('Source string lacks enough information ' +
            'to compile!'));
    return (0, either_1.right)(new Import(toks[0].toString(), toks[1].toString()));
};
exports.compile = compile;
/**
 * compileList compiles a list of pointers.
 *
 * If any of the compilations fail the whole process is considered failed.
 */
var compileList = function (ptrs) {
    return ptrs.reduce(function (p, c) { return p.chain(function (l) { return (0, exports.compile)(c).map(function (i) { return l.concat(i); }); }); }, (0, either_1.right)([]));
};
exports.compileList = compileList;
/**
 * iterp a Pointer as a module import returning the exported member from
 * the specified module.
 */
var interp = function (ptr, loader) {
    if (loader === void 0) { loader = require; }
    var eImp = (0, exports.compile)(ptr);
    if (eImp.isLeft())
        return eImp;
    var imp = eImp.takeRight();
    try {
        return (0, either_1.right)(loader(imp.module)[imp.member]);
    }
    catch (e) {
        return (0, either_1.left)(e);
    }
};
exports.interp = interp;
/**
 * isPointer tests whether a string can be used as a valid
 * pointer.
 */
var isPointer = function (ptr) {
    return (0, exports.compile)(ptr).isRight();
};
exports.isPointer = isPointer;
/**
 * getPath retrieves the module path of a valid Pointer.
 *
 * If the ptr is not valid an empty string is returned.
 */
var getPath = function (ptr) {
    var eM = (0, exports.compile)(ptr);
    return eM.isLeft() ? '' : eM.takeRight().module;
};
exports.getPath = getPath;
/**
 * getMember retrieves the member part of a valid Pointer.
 *
 * If the ptr is not valid an empty string is returned.
 */
var getMember = function (ptr) {
    var eM = (0, exports.compile)(ptr);
    return eM.isLeft() ? '' : eM.takeRight().member;
};
exports.getMember = getMember;
//# sourceMappingURL=pointer.js.map