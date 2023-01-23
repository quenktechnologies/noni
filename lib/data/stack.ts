import { fromNullable, Maybe } from "./maybe";

/**
 * @internal
 */
abstract class GenericStack<T> {

    constructor(public data: T[] = []) { }

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
    push(item: T): this {

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
export class UnsafeStack<T> extends GenericStack<T> {

    /**
     * peek returns the item at the top of the stack or undefined if the stack is
     * empty.
     */
    peek(): T | undefined {

        return this.data[this.data.length - 1];

    }

    /**
     * pop an item off the stack, if the stack is empty, undefined is returned.
     */
    pop(): T | undefined {

        return this.data.pop();

    }

}

/**
 * SafeStack is a type safe stack that uses Maybe for pops() and peek().
 */
export class SafeStack<T> extends GenericStack<T> {

    /**
     * peek returns the item at the top of the stack.
     */
    peek(): Maybe<T> {

        return fromNullable(this.data[this.data.length - 1]);

    }

    /**
     * pop an item off the stack.
     */
    pop(): Maybe<T> {

        return fromNullable(this.data.pop());

    }

}
