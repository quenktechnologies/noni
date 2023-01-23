import { Maybe } from "./maybe";
/**
 * @internal
 */
declare abstract class GenericStack<T> {
    data: T[];
    constructor(data?: T[]);
    /**
     * length of the stack.
     */
    get length(): number;
    /**
     * isEmpty indicates whether the stack is empty or not.
     */
    isEmpty(): boolean;
    /**
     * push an item onto the stack
     */
    push(item: T): this;
}
/**
 * UnsafeStack is a generic implementation of a stack data structure using a
 * JS array.
 *
 * Peeked and popped items are not wrapped in a Maybe.
 */
export declare class UnsafeStack<T> extends GenericStack<T> {
    /**
     * peek returns the item at the top of the stack or undefined if the stack is
     * empty.
     */
    peek(): T | undefined;
    /**
     * pop an item off the stack, if the stack is empty, undefined is returned.
     */
    pop(): T | undefined;
}
/**
 * SafeStack is a type safe stack that uses Maybe for pops() and peek().
 */
export declare class SafeStack<T> extends GenericStack<T> {
    /**
     * peek returns the item at the top of the stack.
     */
    peek(): Maybe<T>;
    /**
     * pop an item off the stack.
     */
    pop(): Maybe<T>;
}
export {};
