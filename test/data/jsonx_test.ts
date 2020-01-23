import * as json from '../../src/data/jsonx';

import { assert } from '@quenk/test/lib/assert';

export const anObject: json.Object = {
    string: 'String',
    number: 1,
    boolean: false,
    object: {},
    array: [],
    null: null,
    buffer: Buffer.alloc(1),
    date: new Date()
}

export const anArray: json.Array = ['String', 1, false, {}, [], null,
    Buffer.alloc(1), new Date()];

export const aBuffer: json.Buffer = Buffer.alloc(1);

export const aDate: json.Date = new Date();

export const aString: json.String = 'String';

export const aNumber: json.Number = 1;

export const aBoolean: json.Boolean = true;

export const aNull: json.Null = null;

describe('jsonx', () => {

    describe('types', () => {

        it('should compile', () => { })

    })

    describe('parse', () => {

        it('should be safe', () => {

            assert(json
                .parse('{"n":1, "b":2, "c":3}')
                .takeRight()).equate({ n: 1, b: 2, c: 3 });

            assert(
                json
                    .parse('{ vanku, []}^')
                    .takeLeft()).be.instance.of(Error);

        })

    })

})
