import { must } from '@quenk/must';
import { camelCase, capitalize, uncapitalize } from '../../src/data/string';

describe('string', () => {

    describe('camelCase', () => {

        it('should turn remove underscores and dashes', () => {

            must(camelCase('this_is_our-camel'))
                .equal('ThisIsOurCamel')

        });

    });

    describe('capitalize', () => {

        it('should work', () => {

            must(capitalize('this is capitalized'))
                .equal('This is capitalized');

        });

    });

    describe('uncapitalize', () => {

        it('should work', () => {

            must(uncapitalize('This is uncapitalized'))
                .equal('this is uncapitalized');
        });

    });

});
