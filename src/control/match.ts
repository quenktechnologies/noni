import { Pattern, isTypeOf } from '../data/type';

/**
 * Result represents the state of applying pattern matching to a value.
 *
 * It is either matched or unmatched.
 */
export interface Result<V> {

    caseOf<A, B>(t: Pattern, f: (a: A | V) => B): Result<V | B>

    orElse<A, B>(f: (a: A | V) => B): Result<V | B>;

    end(): V;

}

/**
 * UnMatchedResult represents a yet to be matched pattern.
 */
export class UnMatchedResult<V> implements Result<V> {

    constructor(public value: V) { }

    caseOf<A, B>(p: Pattern, f: (a: A | V) => B): Result<V | B> {

        return isTypeOf(this.value, p) ?
            new MatchedResult<B>(f(this.value)) : this;

    }

    orElse<B>(f: (a: V) => B): Result<B> {

        return new MatchedResult<B>(f(this.value));

    }

    end(): V {

        throw new Error(`The pattern '${this.value}' was not matched!`);

    }

}

/**
 * MatchedResult indicates a successful pattern match.
 */
export class MatchedResult<V> implements Result<V> {

    constructor(public value: V) { }

    caseOf<A, B>(_p: Pattern, _f: (x: A | V) => B): Result<V> {

        return this;

    }

    orElse<A, B>(_f: (x: V | A) => B): Result<V> {

        return this;

    }

    end(): V {

        return this.value;

    }

}

/**
 * match expression.
 */
export const match = <V>(value: any): Result<V> => new UnMatchedResult<V>(value);
