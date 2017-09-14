import * as must from 'must/register';
import * as util from '../src/util';

describe('util', () => {

    describe('fuse', () =>
        it('should merge objects deeply', () =>
            must(util.fuse<object, object>(
                { a: 1, b: '2', c: { d: 3, e: { f: '4' }, g: '5', h:[1] } },
                { c: { e: { e1: 6 } } },
                { c: { c1: 'c1' } },
                { c: { h: [2, 3, 4, 5, 6] } },
                { b: { bv: 'b2' } },
                { a: {} })).eql(
                {
                    a: {},
                    b: { 0: "2", bv: 'b2' }, // the 2 appears to be the result of Object.assign with a non object
                    c: {
                        h: [1, 2, 3, 4, 5, 6],
                        c1: 'c1',
                        d: 3,
                        e: { f: '4', e1: 6 },
                        g: '5'
                    }
                })));

})
