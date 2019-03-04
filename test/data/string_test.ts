import { assert } from '@quenk/test/lib/assert';
import { camelCase, capitalize, uncapitalize } from '../../src/data/string';

describe('string', () => {

    describe('camelCase', () => {

        it('should turn remove underscores and dashes', () => {

            assert(camelCase('this_is_our-camel'))
                .equal('ThisIsOurCamel')

        });

    });

    describe('capitalize', () => {

        it('should work', () => {

            assert(capitalize('this is capitalized'))
                .equal('This is capitalized');

        });

    });

    describe('uncapitalize', () => {

        it('should work', () => {

            assert(uncapitalize('This is uncapitalized'))
                .equal('this is uncapitalized');
        });

    });

});
