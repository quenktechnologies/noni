import { assert } from '@quenk/test/lib/assert';
import {
    Record,
    keys,
    map,
    mapTo,
    reduce,
    merge,
    merge3,
    merge4,
    merge5,
    rmerge,
    rmerge3,
    rmerge4,
    rmerge5,
    exclude,
    partition,
    group,
    values,
    contains,
    clone,
    count,
    empty,
    filter,
    isRecord,
    some,
    every
} from '../../../src/data/record';

type A = { a: number };
type B = { b: number };
type C = { c: number };
type D = { d: number };
type E = { e: { f: string } };

type RA = {
    a: number,
    b: string,
    c: {
        d: number,
        e: { f: string },
        g: string,
        h: number[]
    }
};

type RB = {
    c: {
        e: { e1: number }
    }
};

type RC = {
    c: {
        c1: string
    }
};

type RD = {
    c: {
        h: number[]
    }
};

type RE = {
    b: {
        bv: string
    }
};

class RecType { }

const a = { a: 1 };
const b = { b: 2 };
const c = { c: 3 };
const d = { d: 4 };
const e = { e: { f: 'g' } };

const ra: RA = {
    a: 1,
    b: '2',
    c: {
        d: 3,
        e: { f: '4' },
        g: '5',
        h: [1]
    }
};

const rb: RB = {
    c: {
        e: { e1: 6 }
    }
};

const rc: RC = {
    c: {
        c1: 'c1'
    }
};

const rd: RD = {
    c: {
        h: [2, 3, 4, 5, 6]
    }
};

const re: RE = {
    b: {
        bv: 'b2'
    }
};

describe('record', () => {

    describe('keys', () => {

        it('should provide a list of a Record keys', () => {

            assert(keys({ a: 1, b: 2, c: { d: 1, e: { f: 'g' } } })).equate(['a', 'b', 'c']);

        })
    })

    describe('map', () => {

        it('should transform the properties of a Record', () => {

            assert(map({ a: 1, b: 2, c: 3 },
                (value: number, key: string, rec: Record<number>) =>
                    `${key}-${value}-${keys(rec).length}`))
                .equate({ a: 'a-1-3', b: 'b-2-3', c: 'c-3-3' });

        })
    })

    describe('mapTo', () => {

        it('should produce an array', () => {

            assert(mapTo({ a: 1, b: 2, c: 3 },
                (value: number, key: string, rec: Record<number>) =>
                    `${key}-${value}-${keys(rec).length}`))
                .equate(['a-1-3', 'b-2-3', 'c-3-3']);

        })
    })


    describe('reduce', () => {

        it('should reduce to a single value', () => {

            assert(reduce({ a: 1, b: 2, c: 3 }, 0,
                (p: number, c: number, _: string) => p + c))
                .equate(6);

        })
    })

    describe('merge', () => {

        it('should shallow merge two Records', () => {

            let r: { a: number, b: number, c: number, e: { f: 'g' } | number } =
                merge({ a: 1, b: 2, c: 3, e: { f: 'g' } }, { c: 4, e: 4 });

            assert(r).equate({ a: 1, b: 2, c: 4, e: 4 });

        })
    })

    describe('merge3', () => {

        it('should shallow merge 3 Records', () => {

            let r: A & B & C = merge3(a, b, c);

            assert(r).equate({ a: 1, b: 2, c: 3 });

        });

    });

    describe('merge4', () => {

        it('should shallow merge 4 Records', () => {

            let r: A & B & C & D = merge4(a, b, c, d);

            assert(r).equate({ a: 1, b: 2, c: 3, d: 4 });

        });

    });

    describe('merge5', () => {

        it('should shallow merge 5 Records', () => {

            let r: A & B & C & D & E = merge5(a, b, c, d, e);

            assert(r).equate({ a: 1, b: 2, c: 3, d: 4, e: { f: 'g' } });

        });

    });

    describe('rmerge', () => {

        it('should merge deeply', () => {

            let r: RA & RB = rmerge(ra, rb);

            assert(r).equate(
                {
                    a: 1,
                    b: '2',
                    c: {
                        d: 3,
                        e: { f: '4', e1: 6 },
                        g: '5',
                        h: [1]
                    }
                });
        })
    })

    describe('rmerge3', () => {

        it('should merge deeply', () => {

            let r: RA & RB & RC = rmerge3(ra, rb, rc);

            assert(r).equate(
                {
                    a: 1,
                    b: '2',
                    c: {
                        c1: 'c1',
                        d: 3,
                        e: { f: '4', e1: 6 },
                        g: '5',
                        h: [1]
                    }
                });
        })
    })

    describe('rmerge4', () => {

        it('should merge deeply', () => {

            let r: RA & RB & RC & RD = rmerge4(ra, rb, rc, rd);

            assert(r).equate(
                {
                    a: 1,
                    b: '2',
                    c: {
                        c1: 'c1',
                        d: 3,
                        e: { f: '4', e1: 6 },
                        g: '5',
                        h: [2, 3, 4, 5, 6]

                    }
                });
        })
    })

    describe('rmerge5', () => {

        it('should merge deeply', () => {

            let r: RA & RB & RC & RD & RE = rmerge5(ra, rb, rc, rd, re);

            assert(r).equate(
                {
                    a: 1,
                    b: {
                        bv: 'b2'
                    },
                    c: {
                        c1: 'c1',
                        d: 3,
                        e: { f: '4', e1: 6 },
                        g: '5',
                        h: [2, 3, 4, 5, 6]

                    }
                });
        })
    })

    describe('rmerge', () => {

        it('should merge objects deeply', () => {

            let r = rmerge(rmerge(rmerge(rmerge(rmerge({
                a: 1,
                b: '2',
                c: {
                    d: 3,
                    e: { f: '4' },
                    g: '5',
                    h: [1]
                }
            }, {
                c: {
                    e: { e1: 6 }
                }
            }), {
                c: {
                    c1: 'c1'
                }
            }), {
                c: {
                    h: [2, 3, 4, 5, 6]
                }
            }), {
                b: {
                    bv: 'b2'
                }
            }), {
                a: {}
            });

            assert(r).equate(
                {
                    a: {},
                    b: { bv: 'b2' },
                    c: {
                        h: [2, 3, 4, 5, 6],
                        c1: 'c1',
                        d: 3,
                        e: { f: '4', e1: 6 },
                        g: '5'
                    }
                })
        })
    })

    describe('fling', () => {

        it('should remove unwanted keys', () => {

            assert(exclude({ one: 1, two: 2, three: 3 }, 'two'))
                .equate({ one: 1, three: 3 });

            assert(exclude({ one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 },
                ['one', 'two', 'three']))
                .equate({ four: 4, five: 5, six: 6 });

        })
    })

    describe('partition', () => {

        it('should partition records', () => {

            let m = {
                a: 1, b: 2, c: 3, d: 4, e: 5, f: 6,
                g: 7, h: 8, i: 9, j: 10
            };
            let f = (n: number) => ((n % 2) === 0)
            let r = [{ b: 2, d: 4, f: 6, h: 8, j: 10 },
            { a: 1, c: 3, e: 5, g: 7, i: 9 }];

            assert(partition<number, Record<number>>(m, f)).equate(r);

        });
    })

    describe('group', () => {

        it('should group properties', () => {

            let m = {
                a: 1,
                b: 'b',
                c: 22,
                d: 'e',
                f: { n: 'o' },
                g: [1, 2, 3],
                h: 12
            };

            let f = (n: number | string | object) => typeof (n);

            let r = {
                number: {
                    a: 1,
                    c: 22,
                    h: 12
                },
                string: {
                    b: 'b',
                    d: 'e'
                },
                object: {
                    f: {
                        n: 'o'
                    },
                    g: [1, 2, 3]
                }
            }

            assert(group(m, f)).equate(r);

        });

    });

    describe('values', () => {

        it('should return a shallow array', () => {

            assert(values({ a: 1, b: [22], c: { n: 1 }, d: 'e' }))
                .equate([1, [22], { n: 1 }, 'e']);

        });

    });

    describe('contains', () => {

        it('should work', () => {

            let foo = { n: 12 };

            assert(contains(foo, 'n')).equal(true);
            assert(contains(foo, 'x')).equal(false);

        });

    });

    describe('clone', () => {

        it('should break refs', () => {

            let c = { n: 1 }
            let a = { b: c };

            assert(clone(a)).equate(a);
            assert(clone(a).b).not.equal(c);

        });

        it('should not mess up arrays', () => {

            let o = {
                n: 1, b: 12, d: [0, 2, 3]
            };

            assert(clone(o)).equate({ n: 1, b: 12, d: [0, 2, 3] });

        });

        it('should not try to treat null like an object', () => {

            assert(clone({ a: null })).equate({ a: null });

        });

    });

    describe('filter', () => {

        it('it should filter the keys of an object', () => {

            let o = { a: 1, b: 2, c: 1, d: 2 };
            let isTwo = (n: number) => n === 2;

            assert(filter(o, isTwo)).equate({ b: 2, d: 2 });

        });

    });

    describe('isRecord', () => {

        it('should fail arrays', () => {

            assert(isRecord([])).false();

        });

        it('should fail dates', () => {

            assert(isRecord(new Date())).false();

        });

        it('should fail regular expressions', () => {

            assert(isRecord(/^/)).false();
            assert(isRecord(new RegExp('a'))).false();

        });

        it('should pass objects', () => {

            assert(isRecord({})).true();
            assert(isRecord(new RecType())).true();

        });

        it('should fail null', () => {

            assert(isRecord(null)).false();

        });

    });

    describe('count', function() {

        it('should work', () => {

            assert(count({})).equal(0);
            assert(count({ '1': 1, '2': 2, '3': 3 })).equal(3);

        });

    });

    describe('empty', () => {

        it('should work', () => {

            assert(empty({})).true();
            assert(empty({ a: 1, b: 2, c: 3 })).false();

        });

    });

    describe('some', () => {

        it('should work', () => {

            assert(some({ a: 1, b: 2, c: 3 }, v => v === 2)).true();

            assert(some({ a: 1, b: 2, c: 3 }, v => v === 9)).false();

        });

    });

    describe('every', () => {

        it('should work', () => {

            assert(every({ a: 2, b: 2, c: 2 }, v => v === 2)).true();

            assert(every({ a: 1, b: 2, c: 3 }, v => v === 2)).false();

        });

    });

});
