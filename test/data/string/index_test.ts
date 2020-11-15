import { assert } from '@quenk/test/lib/assert';
import {
    camelCase,
    classCase,
    capitalize,
    uncapitalize,
    interpolate,
    propercase,
    alpha,
    numeric,
    alphaNumeric
} from '../../../src/data/string';

describe('string', () => {

    describe('camelCase', () => {

        it('should turn remove underscores and dashes', () => {

            assert(camelCase('this_is_our-camel'))
                .equal('thisIsOurCamel')

        });

        it('should not throw on empty strings', () => {

            assert(camelCase('')).equal('');

        });

        it('should not throw on one character', () => {

            assert(camelCase('a')).equal('a');

        });

        it('should recognize dashes,underscores,dots,spaces', () => {

            assert(
                camelCase(
                    'This_haS-Dashes_and__underscores sPaces  even.dots... !'
                ))
                .equal('thisHasDashesAndUnderscoresSpacesEvenDots!');

        });

    });

    describe('classCase', () => {

        it('should turn remove underscores and dashes', () => {

            assert(classCase('this_is_our-camel'))
                .equal('ThisIsOurCamel')

        });

        it('should not throw on empty strings', () => {

            assert(classCase('')).equal('');

        });

        it('should not throw on one character', () => {

            assert(classCase('a')).equal('A');

        });

        it('should recognize dashes,underscores,dots,spaces', () => {

            assert(
                classCase(
                    'This_haS-Dashes_and__underscores sPaces  even.dots... !'
                ))
                .equal('ThisHasDashesAndUnderscoresSpacesEvenDots!');

        });

    });

    describe('capitalize', () => {

        it('should work', () => {

            assert(capitalize('this is capitalized'))
                .equal('This is capitalized');

        });

        it('should not throw on empty strings', () => {

            assert(capitalize('')).equal('');

        });

    });

    describe('uncapitalize', () => {

        it('should work', () => {

            assert(uncapitalize('This is uncapitalized'))
                .equal('this is uncapitalized');
        });

        it('should not throw on empty strings', () => {

            assert(uncapitalize('')).equal('');

        });

    });

    describe('interpolate', () => {

        it('interpolates a string', function() {

            assert(interpolate('My name is {name}', { name: 'Kissoon' }))
                .equal('My name is Kissoon');

        });

        it('handles dot notation', function() {

            assert(interpolate('My name is {user.name.first}.',
                { user: { name: { first: 'Oz', last: 'Pu' } } }))
                .equal('My name is Oz.');

        });

        it('handles multi line strings', function() {

            assert(interpolate(`This string is about {n} characters long
     maybe not so much but {you} get the point right?
     It's ok if you don't, this is kind of nonsense
     but it {end}`, { n: 1e7, you: 'he', end: 'the end' }))
                .equal(`This string is about 10000000 characters long
     maybe not so much but he get the point right?
     It's ok if you don't, this is kind of nonsense
     but it the end`);

        });

        it('is able to apply functions', function() {

            assert(interpolate(`1 + 1 is {result}.`, { result: () => 1 + 1 },
                { applyFunctions: true }))
                .equal(`1 + 1 is 2.`);

        });

    })

    describe('propercase', () => {

        it('should work', () => {

            assert(propercase('this is pRoPer')).equal('This Is Proper');

        })

        it('should work with empty strings', () => {

            assert(propercase('')).equal('');

        })

        it('should not change numbers etc', () => {

            assert(propercase('Abun 353-$pg and huiXsa !70'))
                .equal('Abun 353-$pg And Huixsa !70');

        })

    })

    describe('alhpa', () => {

        it('should omit non alphabetic characters', () => {

            assert(alpha('omega22 fiber_glass')).equate('omegafiberglass');

        });

    });

    describe('numeric', () => {

        it('should omit non numeric characters', () => {

            assert(numeric('omega22 fiber_glass')).equate('22');

        });

    });

    describe('alhpanumeric', () => {

        it('should omit non alpha-numeric characters', () => {

            assert(alphaNumeric('omega22 fiber_glass'))
            .equate('omega22fiberglass');

        });

    });

})
