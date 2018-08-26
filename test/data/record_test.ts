import * as must from 'must/register';
import {
    Record,
    keys,
    map,
    reduce,
    merge,
    rmerge,
    exclude,
    flatten
} from '../../src/data/record';

describe('record', () => {

    describe('keys', () => {

        it('should provide a list of a Record keys', () => {

            must(keys({ a: 1, b: 2, c: { d: 1, e: { f: 'g' } } })).eql(['a', 'b', 'c']);

        });

    });

    describe('map', () => {

        it('should transform the properties of a Record', () => {

            must(map({ a: 1, b: 2, c: 3 },
                (value: number, key: string, rec: Record<number>) =>
                    `${key}-${value}-${keys(rec).length}`))
                .eql({ a: 'a-1-3', b: 'b-2-3', c: 'c-3-3' });

        });

    });

    describe('reduce', () => {

        it('should reduce to a single value', () => {

            must(reduce({ a: 1, b: 2, c: 3 }, 0,
                (p: number, c: number, _: string) => p + c))
                .eql(6);

        });

    });

    describe('merge', () => {

        it('should shallow merge two Records', () => {

            let r: { a: number, b: number, c: number, e: { f: 'g' } | number } =
                merge({ a: 1, b: 2, c: 3, e: { f: 'g' } }, { c: 4, e: 4 });

            must(r).eql({ a: 1, b: 2, c: 4, e: 4 });

        });

    });

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

            must(r).eql(
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
                });

        });

    });

    describe('fling', () => {

        it('should remove unwanted keys', () => {

            must(exclude({ one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 }, 'one', 'two', 'three'))
                .eql({ four: 4, five: 5, six: 6 });

        });
    });

    describe('flatten', () => {

        it('should work', () => {

            must(flatten({

                'name.first': 'Lasana',
                name: { last: 'Murray' },
              'name.middle': 'K',
                'options.flags.enabled': [0, 1, 2],
                'options.flags': { version: 'v22' },
                level: 'master'

            })).eql({

                'name.first': 'Lasana',
                'name.last': 'Murray',
                'options.flags.enabled': [0, 1, 2],
                'options.flags.version': 'v22',
                'level': 'master'

            })
        })
    });
});

