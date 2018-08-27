import * as must from 'must/register';
import {
    Record,
    keys,
    map,
    reduce,
    merge,
    rmerge,
    exclude,
    flatten,
    partition,
    group
} from '../../src/data/record';

describe('record', () => {

    describe('keys', () => {

        it('should provide a list of a Record keys', () => {

            must(keys({ a: 1, b: 2, c: { d: 1, e: { f: 'g' } } })).eql(['a', 'b', 'c']);

        })
    })

    describe('map', () => {

        it('should transform the properties of a Record', () => {

            must(map({ a: 1, b: 2, c: 3 },
                (value: number, key: string, rec: Record<number>) =>
                    `${key}-${value}-${keys(rec).length}`))
                .eql({ a: 'a-1-3', b: 'b-2-3', c: 'c-3-3' });

        })
    })

    describe('reduce', () => {

        it('should reduce to a single value', () => {

            must(reduce({ a: 1, b: 2, c: 3 }, 0,
                (p: number, c: number, _: string) => p + c))
                .eql(6);

        })
    })

    describe('merge', () => {

        it('should shallow merge two Records', () => {

            let r: { a: number, b: number, c: number, e: { f: 'g' } | number } =
                merge({ a: 1, b: 2, c: 3, e: { f: 'g' } }, { c: 4, e: 4 });

            must(r).eql({ a: 1, b: 2, c: 4, e: 4 });

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
                })
        })
    })

    describe('fling', () => {

        it('should remove unwanted keys', () => {

            must(exclude({ one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 }, 'one', 'two', 'three'))
                .eql({ four: 4, five: 5, six: 6 });

        })
    })

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
                'name.middle': 'K',
                'options.flags.enabled': [0, 1, 2],
                'options.flags.version': 'v22',
                'level': 'master'

            })
        })
    })

    describe('partition', () => {

        it('should partition records', () => {

            let m = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 };
            let f = (n: number) => ((n % 2) === 0)
            let r = [{ b: 2, d: 4, f: 6, h: 8, j: 10 }, { a: 1, c: 3, e: 5, g: 7, i: 9 }];

            must(partition<number, Record<number>>(m)(f)).eql(r);

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
            h: 12 };

            let f = (n: number | string | object) => typeof (n);

          let r = { 
            number: { 
              a: 1,
              c: 22,
              h: 12 },
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

            must(group(m)(f)).eql(r);

        });

    });
});

