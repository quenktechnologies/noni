import { assert } from '@quenk/test/lib/assert';
import {
    intersect,
    difference,
    map,
    project
} from '../../../src/data/record/key';
import { Record } from '../../../src/data/record';

describe('path', () => {
    describe('intersect', () => {
        it('should retain the left', () => {
            let l: Record<number> = { a: 1, b: 2, c: 3 };
            let r: Record<number> = { e: 4, b: 5, c: 6 };

            assert(intersect(l, r)).equate({ b: 2, c: 3 });
        });

        it('should not overwrite Object#prototype', () => {
            let rec1 = JSON.parse(`{
                "__proto__": { "admin": true }
            }`);

            let rec2 = JSON.parse(`{ "__proto__": { } }`);
            let result = intersect(rec1, rec2);

            assert(result.admin).undefined();
        });
    });

    describe('difference', () => {
        it('should retain the ones without matches only', () => {
            let l: Record<number> = { a: 1, b: 2, c: 3 };
            let r: Record<number> = { e: 4, b: 5, c: 6 };

            assert(difference(l, r)).equate({ a: 1 });
        });

        it('should not overwrite Object#prototype', () => {
            let rec = JSON.parse(`{
                "__proto__": { "admin": true }
            }`);

            let result = difference(rec, {});

            assert(result.admin).undefined();
        });
    });

    describe('map', () => {
        it('should work', () => {
            let o: Record<number> = { a: 1, b: 2, c: 3 };

            assert(map(o, p => `n${p}`)).equate({ na: 1, nb: 2, nc: 3 });
        });

        it('should not overwrite Object#prototype', () => {
            let rec = JSON.parse(`{
             "__proto__": { "admin": true } 
            }`);

            let result = map(rec, p => p);

            assert(result.admin).undefined();
        });
    });

    describe('project', () => {
        const src = { a: 1, b: 2, c: [3], d: { a: 1, b: 2, c: 3 } };

        it('should take no prisoners', () => {
            assert(project({ a: true, c: true }, src)).equate({ a: 1, c: [3] });
        });

        it('should negate', () => {
            assert(
                project({ a: false, b: false, c: true, d: false }, src)
            ).equate({
                c: [3]
            });
        });
    });
});
