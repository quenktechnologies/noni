/**
 * This module provides classes for mimicking type level pattern matching
 * commonly found in functional programming languages in JavaScript.
 *
 * JavaScript already provides the "case" statement which allows for c
 * onditional execution of a block based on a value. The API allows for the
 * same except the *type* of the value is used instead.
 */
import { test, Type } from '../../data/type';

export { Type };

/*
 * TypeCase is an interface for mimicking type based pattern matching usually
 * found in functional programming languages.
 */
export interface TypeCase<T> {
    /**
     * test a value to determine whether it matches the TypeCase's pattern.
     */
    test(value: Type): boolean;

    /**
     * apply the TypeCase's action to a value.
     *
     * NOTE: This should only be called if test() returns true.
     */
    apply(value: Type): T;
}

/**
 * MatchedValue is the actual type of a value that has been pattern matched by a
 * Case class.
 *
 * When using String,Boolean or Number to pattern match, the value has the type
 * of string,boolean or number respectively.
 *
 * When using a constructor function to pattern match, the value has the type
 * constructed by the constructor function.
 *
 * When using an object to pattern match, the value's type is an object
 * with corresponding keys each of which following the previous rules
 * recursively.
 */
export type MatchedValue<A> = A extends StringConstructor
    ? string
    : A extends BooleanConstructor
      ? boolean
      : A extends NumberConstructor
        ? number
        : A extends new (...args: Type[]) => infer T
          ? T
          : { [K in keyof A]: MatchedValue<A[K]> };

/**
 * Case is provided for situations where it is better to extend
 * the Case class instead of creating new instances.
 */
export class Case<A, B> implements TypeCase<B> {
    constructor(
        public pattern: A,
        public handler: (value: MatchedValue<A>) => B
    ) {}

    /**
     * test a value to determine whether this Case class can handle it.
     */
    test(value: Type): boolean {
        return test(this.pattern, value);
    }

    /**
     * apply the handler with a value.
     *
     * NOTE: This should not be called if test() fails for the value.
     */
    apply(value: Type): B {
        return this.handler(value);
    }
}

/**
 * Default is used to match any value.
 *
 * Use it as a catch-all when other TypeCase classes fail to match.
 */
export class Default<T> implements TypeCase<T> {
    constructor(public handler: (value: Type) => T) {}

    test(): boolean {
        return true;
    }

    apply(value: Type): T {
        return this.handler(value);
    }
}

/**
 * CaseFunction is a composite class for TypeCases.
 *
 * When using this TypeCase it may be necessary to cast the cases value
 * to a single type the compiler understands.
 */
export class CaseFunction<T> implements TypeCase<T> {
    constructor(public cases: TypeCase<T>[] = []) {}

    test(value: Type): boolean {
        return this.cases.some(kase => kase.test(value));
    }

    apply(value: Type): T {
        let kase = this.cases.find(kase => kase.test(value));

        if (!kase)
            throw new Error(
                `CaseFunction: apply(): unable to find matching TypeCase!`
            );

        return kase.apply(value);
    }
}
