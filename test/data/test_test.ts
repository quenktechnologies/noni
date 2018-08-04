import * as must from 'must/register';
import * as test from '../../src/data/test';
import { Record } from '../../src/data/record';

describe('test', () => {

    describe('isRecord', () => {

        it('should fail for arrays.', () => {

            must(test.isRecord([])).be(false);

        });

        it('should work for other object', () => {

            must(test.isRecord({})).be(true);
            must(test.isRecord(new Date())).be(true);

        });

    });

    describe('isString', ()=> {

      it('should work', () => {

        must(test.isString('string')).be(true);
        must(test.isString({})).be(false);

      });

    });

    describe('isBoolean', ()=> {

      it('should work', () => {

        must(test.isBoolean(false)).be(true);
        must(test.isBoolean(true)).be(true);
        must(test.isBoolean('true')).be(false);

      });

    });

    describe('isNumber', () => {

        it('should fail NaN', () => {

            must(test.isNumber(NaN)).be(false);

        });

        it('should pass numbers', () => {

            must(test.isNumber(1e2)).be(true);

        })

    });

});
