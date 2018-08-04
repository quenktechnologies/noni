import * as json from '../../src/data/json';

export const anObject: json.Object = {
    string: 'String',
    number: 1,
    boolean: false,
    object: {},
    array: [],
    null: null
}

export const anArray: json.Array = ['String', 1, false, {}, [], null];

export const aString: json.String = 'String';

export const aNumber: json.Number = 1;

export const aBoolean: json.Boolean = true;

export const aNull: json.Null = null;

describe('json', function() {

    it('should compile', function() {

    });

});
