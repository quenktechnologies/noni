"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeStack = exports.UnsafeStack = void 0;
const maybe_1 = require("./maybe");
/**
 * @internal
 */
class GenericStack {
    constructor(data = []) {
        this.data = data;
    }
    /**
     * length of the stack.
     */
    get length() {
        return this.data.length;
    }
    /**
     * isEmpty indicates whether the stack is empty or not.
     */
    isEmpty() {
        return this.data.length === 0;
    }
    /**
     * push an item onto the stack
     */
    push(item) {
        this.data.push(item);
        return this;
    }
}
/**
 * UnsafeStack is a generic implementation of a stack data structure using a
 * JS array.
 *
 * Peeked and popped items are not wrapped in a Maybe.
 */
class UnsafeStack extends GenericStack {
    /**
     * peek returns the item at the top of the stack or undefined if the stack is
     * empty.
     */
    peek() {
        return this.data[this.data.length - 1];
    }
    /**
     * pop an item off the stack, if the stack is empty, undefined is returned.
     */
    pop() {
        return this.data.pop();
    }
}
exports.UnsafeStack = UnsafeStack;
/**
 * SafeStack is a type safe stack that uses Maybe for pops() and peek().
 */
class SafeStack extends GenericStack {
    /**
     * peek returns the item at the top of the stack.
     */
    peek() {
        return (0, maybe_1.fromNullable)(this.data[this.data.length - 1]);
    }
    /**
     * pop an item off the stack.
     */
    pop() {
        return (0, maybe_1.fromNullable)(this.data.pop());
    }
}
exports.SafeStack = SafeStack;
//# sourceMappingURL=stack.js.map