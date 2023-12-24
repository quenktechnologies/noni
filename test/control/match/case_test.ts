import { assert } from '@quenk/test/lib/assert';

import {
    Case,
    CaseFunction,
    Default,
    TypeCase
} from '../../../lib/control/match/case';
import { noop } from '../../../lib/data/function';
import { Value } from '../../../src/data/json';

class GPat<T> {
    constructor(public value: T) {}
}

class Pat {
    constructor(public value: string) {}
}

describe('case', () => {
    describe('Case', () => {
        describe('new', () => {
            it('should have multiple patterns', () => {
                assert(
                    () => new Case(String, (value: string) => value)
                ).not.throw();
                assert(
                    () => new Case(Boolean, (value: boolean) => value)
                ).not.throw();
                assert(
                    () => new Case(Number, (value: number) => value)
                ).not.throw();
                assert(
                    () => new Case(Pat, (value: Pat) => value.value)
                ).not.throw();
                assert(
                    () => new Case('a', (value: string) => value)
                ).not.throw();
                assert(() => new Case(1, (value: number) => value)).not.throw();
                assert(
                    () => new Case(true, (value: boolean) => value)
                ).not.throw();
                assert(
                    () =>
                        new Case(
                            <typeof GPat<number>>GPat,
                            (value: GPat<number>) => value.value
                        )
                ).not.throw();
                assert(
                    () =>
                        new Case(
                            { a: String, b: 'b', c: 1 },
                            ({
                                a,
                                b,
                                c
                            }: {
                                a: string;
                                b: string;
                                c: number;
                            }) => {
                                return [a, b, c];
                            }
                        )
                ).not.throw();
            });
        });

        describe('test', () => {
            it('should work', () => {
                let kase = new Case(12, (value: number) => value);
                assert(kase.test('12')).equal(false);
                assert(kase.test(12)).equal(true);
            });
        });

        describe('apply', () => {
            it('should work', () => {
                let stringCase = new Case(String, (value: string) => value);
                assert(stringCase.apply('12')).equal('12');

                let booleanCase = new Case(Boolean, (value: boolean) => value);
                assert(booleanCase.apply(true)).equal(true);

                let numberCase = new Case(Number, (value: number) => value);
                assert(numberCase.apply(12)).equal(12);

                let objectCase = new Case(
                    { a: String, b: 'b', c: 1 },
                    ({ a, b, c }: { a: string; b: string; c: number }) => {
                        return [a, b, c];
                    }
                );
                assert(objectCase.apply({ a: 'a', b: 'b', c: 1 })).equate([
                    'a',
                    'b',
                    1
                ]);

                let patCase = new Case(Pat, (value: Pat) => value.value);
                assert(patCase.apply(new Pat('a'))).equal('a');

                let gpatCase = new Case(
                    <typeof GPat<number>>GPat,
                    (value: GPat<number>) => value.value
                );
                assert(gpatCase.apply(new GPat(1))).equal(1);

                let rawStringCase = new Case('a', (value: string) => value);
                assert(rawStringCase.apply('a')).equal('a');

                let rawBooleanCase = new Case(true, (value: boolean) => value);
                assert(rawBooleanCase.apply(true)).equal(true);

                let rawNumberCase = new Case(1, (value: number) => value);
                assert(rawNumberCase.apply(1)).equal(1);
            });
        });
    });

    describe('Default', () => {
        describe('test', () => {
            it('should always match', () => {
                let kase = new Default(noop);
                assert(kase.test(1)).equal(true);
                assert(kase.test('12')).equal(true);
                assert(kase.test({})).equal(true);
            });
        });

        describe('apply', () => {
            it('should work', () => {
                let kase = new Default(
                    (value: number | string | boolean) => String(value) + 2
                );
                assert(kase.apply(12)).equal('122');
                assert(kase.apply('12')).equal('122');
                assert(kase.apply(true)).equal('true2');
            });
        });
    });

    describe('CaseFunction', () => {
        let kase = new CaseFunction(<TypeCase<Value, Value>[]>[
            new Case(String, (value: string) => value),
            new Case(Boolean, (value: boolean) => value),
            new Case(Number, (value: number) => value)
        ]);

        describe('test', () => {
            it('should call test on each', () => {
                assert(kase.test(1)).equal(true);
                assert(kase.test('12')).equal(true);
                assert(kase.test(true)).equal(true);
                assert(kase.test({})).equal(false);
            });
        });

        describe('apply', () => {
            it('should apply the first match', () => {
                assert(kase.apply(1)).equal(1);
                assert(kase.apply('12')).equal('12');
                assert(kase.apply(true)).equal(true);
            });

            it('should throw if no patterns match', () => {
                assert(() => kase.apply([])).throw();
            });
        });
    });
});
