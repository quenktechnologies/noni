import { assert } from '@quenk/test/lib/assert';
import { Nothing } from '../../../src/data/maybe';
import {
    tokenize,
    get,
    set,
    escape,
    escapeRecord,
    unescape,
    flatten,
    unflatten,
    unescapeRecord,
    intersect,
  difference,
  map
} from '../../../src/data/record/path';
import { Record } from '../../../src/data/record';

describe('path', () => {

    describe('tokenize', () => {

        it('should work with a single path', () => {

            assert(tokenize('single')).equate(['single']);

        });

        it('should work with a double path', () => {

            assert(tokenize('single.double')).equate(['single', 'double']);

        });

        it('should work with a third path', () => {

            assert(tokenize('single.double.tripple'))
                .equate(['single', 'double', 'tripple']);

        });

        it('should work with brackets', () => {

            assert(tokenize('[single]')).equate(['single']);

        });

        it('should work with double brackets', () => {

            assert(tokenize('[single][double]')).equate(['single', 'double']);

        });

        it('should work with tripple brackets', () => {

            assert(tokenize('[single][double][tripple]'))
                .equate(['single', 'double', 'tripple']);

        });

        it('should work with mixed paths', () => {

            assert(tokenize('path[to].some["thing"].that[some].find.interesting'))
                .equate([
                    'path', 'to', 'some', '"thing"',
                    'that', 'some', 'find', 'interesting']);

        });

        it('should work with mixed paths (dot first)', () => {

            assert(tokenize('path.to[some].thing[that].some[find][interesting]'))
                .equate([
                    'path', 'to', 'some', 'thing',
                    'that', 'some', 'find', 'interesting']);

        });

        it('should work with paths begining with dot', () => {

            assert(tokenize('.[path][be].something.valuable'))
                .equate(['path', 'be', 'something', 'valuable']);

        });

        it('should recognize escapeded dots', () => {

            assert(tokenize('path.that.has.the.\\.'))
                .equate(['path', 'that', 'has', 'the', '.']);

        });

        it('should recognize escaped dots anywhere', () => {

            assert(tokenize('path.that\\..has.nothing'))
                .equate(['path', 'that.', 'has', 'nothing']);

        });

        it('should recognize escaped dots at the start', () => {

            assert(tokenize('\\..files.are.a.real.thing\\.\\.\\....'))
                .equate(['.', 'files', 'are', 'a', 'real', 'thing...']);

        });

        it('should recognize escaped brackets', () => {

            assert(tokenize('path.that[has].the\\['))
                .equate(['path', 'that', 'has', 'the[']);

        });

        it('should recognize escaped brackets anyway', () => {

            assert(tokenize('path.that\\[has[nothing]'))
                .equate(['path', 'that[has', 'nothing']);

        });

        it('should recognize escaped brackets at the start', () => {

            assert(tokenize('\\[is[escaped][you].know'))
                .equate(['[is', 'escaped', 'you', 'know']);

        });

        it('should properly recover from unclosed brackets', () => {

            assert(tokenize('[is not closed')).equate(['[is not closed']);

        });

        it('should properly recover from unclosed brackets anywhere', () => {

            assert(tokenize('path[unclosed')).equate(['path[unclosed']);

        });

        it('should properly recover from unclosed brackets at the end', () => {

            assert(tokenize('path[')).equate(['path[']);

        });

        it('should properly recover from unclosed backets with dot', () => {

            assert(tokenize('path[some.thing[split'))
                .equate(['path[some', 'thing[split']);

        });

        it('should handle a single dot', () => {

            assert(tokenize('.')).equate([]);

        });

        it('should handle two dots', () => {

            assert(tokenize('\\..')).equate(['.']);

        });

        it('should handle a bracket', () => {

            assert(tokenize('[')).equate(['[']);

        });

        it('should handle two brackets', () => {

            assert(tokenize('[]')).equate([]);

        });

        it('should allow brackets to contain dots', () => {

            assert(tokenize('path[.dot.dot.dut.dottydut]'))
                .equate(['path', '.dot.dot.dut.dottydut']);

        });

        it('should not nest brackets', () => {

            assert(tokenize('path\\[with nested]]'))
                .equate(['path[with nested]]']);

            assert(tokenize('path[do.do[with nested].value]'))
                .equate(['path', 'do.do[with nested', 'value]']);

        });

    })

    describe('get', () => {

        let user: any;

        beforeEach(() => {

            user = {
                name: {
                    first: 'Joe',
                    last: 'M',
                    'dot.name': 'Joe.M',
                },
                'dot.value': '...',
                meta: {
                    status: {
                        banned: true
                    }
                }
            };
        });

        it('should return get the correct value', () => {

            assert(get('name', user).get()).be.object();
            assert(get('name.first', user).get()).equal('Joe');
            assert(get('name.last', user).get()).equal('M');
            assert(get('meta.status.banned', user).get()).equal(true);
            assert(get('meta[status][banned]', user).get()).equal(true);
            assert(get('dot\\.value', user).get()).equal('...');
            assert(get('name[dot.name]', user).get()).equal('Joe.M');
            assert(get('nam', user)).be.instance.of(Nothing);

        });

        it('should not mistreat zeros', () => {

            assert(get('the.zero.value', {
                the: {
                    zero: {
                        value: 0
                    }
                }
            }).get()).equal(0);

            assert(get('the.zero.value', {
                the: {
                    zero: {
                        value: '0'
                    }
                }
            }).get()).equal('0');

        });

    });

    describe('set', () => {

        let user: any;

        beforeEach(() => {

            user = {
                name: {
                    first: 'Joe',
                    last: 'M',
                    'dot.name': 'Joe.M',
                },
                'dot.value': '...',
                meta: {
                    status: {
                        banned: true
                    }
                }
            };
        });

        it('should set single values', () => {

            assert(set('name', 'sana', {})).equate({
                name: 'sana'
            });

        });

        it('should set nested (1) values', () => {

            let o = set('name.first', 'Bob', user);

            assert(o).equate({
                name: {
                    first: 'Bob',
                    last: 'M',
                    'dot.name': 'Joe.M',
                },
                'dot.value': '...',
                meta: {
                    status: {
                        banned: true
                    }
                }
            });

        });

        it('should set nested (2) values', () => {

            let o = set('meta.status.banned', false, user);

            assert(o).equate({
                name: {
                    first: 'Joe',
                    last: 'M',
                    'dot.name': 'Joe.M',
                },
                'dot.value': '...',
                meta: {
                    status: {
                        banned: false
                    }
                }
            });

        });

        it('should set new nested values', () => {

            let o = set('points', 0, user);

            assert(o).equate({
                name: {
                    first: 'Joe',
                    last: 'M',
                    'dot.name': 'Joe.M',
                },
                'dot.value': '...',
                meta: {
                    status: {
                        banned: true
                    }
                },
                points: 0
            });

        });

        it('should not mangle arrays', () => {

            assert(set('flag', true, <any>{ n: 1, b: { d: [1, 2, 3] }, items: [12] }))
                .equate({ n: 1, b: { d: [1, 2, 3] }, items: [12], flag: true });

        });

    });

    describe('escape', () => {

        it('should escape dots', () => {

            assert(escape('dot.dot.dots')).equal('dot\\.dot\\.dots');

        });

    });

    describe('escapeRecord', () => {

        it('should work', () => {

            assert(escapeRecord({
                'a.one': 1,
                b: 'c',
                'd.e': {
                    a: 1,
                    'b[two]': 3,
                    c: { 'n.': 1 }
                }
            }))
                .equate({
                    'a\\.one': 1,
                    b: 'c',
                    'd\\.e':
                    {
                        a: 1,
                        'b[two]': 3,
                        c: {
                            'n\\.': 1
                        }
                    }
                })

        });

    });

    describe('unescape', () => {

        it('should unescape dots', () => {

            assert(unescape('dot\.dot\.dots')).equal('dot.dot.dots');

        });

    });

    describe('unescapeRecord', () => {

        it('should work', () => {

            assert(unescapeRecord(
                {
                    'a\\.one': 1,
                    b: 'c',
                    d: ['d'],
                    'd\\.e':
                    {
                        a: 1,
                        'b[two]': [3],
                        c: {
                            'n\\.': 1
                        }
                    }
                }))
                .equate({
                    'a.one': 1,
                    b: 'c',
                    d: ['d'],
                    'd.e': {
                        a: 1,
                        'b[two]': [3],
                        c: { 'n.': 1 }
                    }
                })

        });

    });

    describe('flatten', () => {

        it('should work', () => {

            assert(flatten({

                'name.first': 'Lasana',
                name: { last: 'Murray' },
                'name.middle': 'K',
                'options.flags.enabled': [0, 1, 2],
                options: { flags: { version: 'v22' } },
                level: 'master'

            })).equate({

                'name\\.first': 'Lasana',
                'name.last': 'Murray',
                'name\\.middle': 'K',
                'options\\.flags\\.enabled': [0, 1, 2],
                'options.flags.version': 'v22',
                'level': 'master'

            })
        })
    })

    describe('unflatten', () => {

        it('should work', () => {

            let b4 = {

                'name\\.first': 'Lasana',
                'name.last': 'Murray',
                'name\\.middle': 'K',
                'options\\.flags\\.enabled': [0, 1, 2],
                'options.flags.version': 'v22',
                'level': 'master'

            };

            let after = {

                'name.first': 'Lasana',
                name: { last: 'Murray' },
                'name.middle': 'K',
                'options.flags.enabled': [0, 1, 2],
                options: { flags: { version: 'v22' } },
                level: 'master'

            };

            assert(unflatten(b4)).equate(after)

        })
    })

    describe('intersect', () => {

        it('should retain the left', () => {

            let l: Record<number> = { a: 1, b: 2, c: 3 };
            let r: Record<number> = { e: 4, b: 5, c: 6 };

            assert(intersect(l, r)).equate({ b: 2, c: 3 });

        });

    });

    describe('difference', () => {

        it('should retain the ones without matches only', () => {

            let l: Record<number> = { a: 1, b: 2, c: 3 };
            let r: Record<number> = { e: 4, b: 5, c: 6 };

            assert(difference(l, r)).equate({ a: 1 });

        })

    });

    describe('map', () => {

        it('should work', () => {

            let o: Record<number> = { a: 1, b: 2, c: 3 };

          assert(map(o, p => `n${p}`)).equate({ na: 1, nb:2, nc:3 });

        })

    });

});
