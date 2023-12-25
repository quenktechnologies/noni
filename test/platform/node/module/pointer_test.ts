import { assert } from '@quenk/test/lib/assert';
import {
    tokenize,
    compile,
    compileList,
    interp,
    Module,
    Member
} from '../../../../src/platform/node/module/pointer';

describe('pointer', () => {
    describe('tokenize', () => {
        it('should reject an empty pointer', () => {
            let eTokes = tokenize('');
            assert(eTokes.isLeft()).true();
        });

        it('should reject a single hash', () => {
            let eTokes = tokenize('#');
            assert(eTokes.isLeft()).true();
        });

        it('should reject when module is missing', () => {
            let eTokes = tokenize('#somevalue');
            assert(eTokes.isLeft()).true();
        });

        it('should reject when member is missing', () => {
            let eTokes = tokenize('path/to/nothing');
            assert(eTokes.isLeft()).true();
        });

        it('should work', () => {
            let eTokes = tokenize('@quenk/test#assert');

            assert(eTokes.isRight()).true();

            let str = eTokes
                .takeRight()
                .map(t => {
                    if (t instanceof Module) {
                        return t.path;
                    } else if (t instanceof Member) {
                        return t.name;
                    }
                })
                .join('#');

            assert(str).equal('@quenk/test#assert');
        });
    });

    describe('compile', () => {
        it('should compile a Pointer', () => {
            let eResult = compile('@quenk/test#assert');

            assert(eResult.isRight()).true();

            let result = eResult.takeRight();

            assert(result.module).equal('@quenk/test');
            assert(result.member).equal('assert');
        });
    });

    describe('compileList', () => {
        it('should compile a list of Pointers', () => {
            let eResult = compileList([
                '@quenk/test#assert',
                '@quenk/test#must',
                '@quenk/test#should'
            ]);

            assert(eResult.isRight()).true();

            let result = eResult.takeRight();

            assert(result[0].module).equal('@quenk/test');
            assert(result[0].member).equal('assert');
            assert(result[1].module).equal('@quenk/test');
            assert(result[1].member).equal('must');
            assert(result[2].module).equal('@quenk/test');
            assert(result[2].member).equal('should');
        });
    });

    describe('interp', () => {
        it('should load a Pointer', () => {
            let eResult = interp('./amodule.js#location', require);

            assert(eResult.isRight()).true();

            let result = eResult.takeRight();

            assert(result).equal('Arouca');
        });
    });
});
