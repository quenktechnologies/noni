import { must } from '@quenk/must';
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
    unescapeRecord
} from '../../../src/data/record/path';

describe('path', () => {

    describe('tokenize', () => {

        it('should work with a single path', () => {

            must(tokenize('single')).equate(['single']);

        });

        it('should work with a double path', () => {

            must(tokenize('single.double')).equate(['single', 'double']);

        });

        it('should work with a third path', () => {

            must(tokenize('single.double.tripple')).equate(['single', 'double', 'tripple']);

        });

        it('should work with brackets', () => {

            must(tokenize('[single]')).equate(['single']);

        });

        it('should work with double brackets', () => {

            must(tokenize('[single][double]')).equate(['single', 'double']);

        });

        it('should work with tripple brackets', () => {

            must(tokenize('[single][double][tripple]'))
                .equate(['single', 'double', 'tripple']);

        });

        it('should work with mixed paths', () => {

            must(tokenize('path[to].some["thing"].that[some].find.interesting'))
                .equate([
                    'path', 'to', 'some', '"thing"',
                    'that', 'some', 'find', 'interesting']);

        });

        it('should work with mixed paths (dot first)', () => {

            must(tokenize('path.to[some].thing[that].some[find][interesting]'))
                .equate([
                    'path', 'to', 'some', 'thing',
                    'that', 'some', 'find', 'interesting']);

        });

        it('should work with paths begining with dot', () => {

            must(tokenize('.[path][be].something.valuable'))
                .equate(['path', 'be', 'something', 'valuable']);

        });

        it('should recognize escapeded dots', () => {

            must(tokenize('path.that.has.the..'))
                .equate(['path', 'that', 'has', 'the.']);

        });

        it('should recognize escaped dots anywhere', () => {

            must(tokenize('path.that..has.nothing'))
                .equate(['path', 'that.has', 'nothing']);

        });

        it('should recognize escaped dots at the start', () => {

            must(tokenize('..files.are.a.real.thing......'))
                .equate(['.files', 'are', 'a', 'real', 'thing...']);

        });

        it('should recognize escaped brackets', () => {

            must(tokenize('path.that[has].the[['))
                .equate(['path', 'that', 'has', 'the[']);

        });

        it('should recognize escaped brackets anyway', () => {

            must(tokenize('path.that[[has[nothing]'))
                .equate(['path', 'that[has', 'nothing']);

        });

        it('should recognize escaped brackets at the start', () => {

            must(tokenize('[[is[escaped][you].know'))
                .equate(['[is', 'escaped', 'you', 'know']);

        });

        it('should properly recover from unclosed brackets', () => {

            must(tokenize('[is not closed')).equate(['[is not closed']);

        });

        it('should properly recover from unclosed brackets anywhere', () => {

            must(tokenize('path[unclosed')).equate(['path[unclosed']);

        });

        it('should properly recover from unclosed brackets at the end', () => {

            must(tokenize('path[')).equate(['path[']);

        });

        it('should properly recover from unclosed backets with dot', () => {

            must(tokenize('path[some.thing[split'))
                .equate(['path[some', 'thing[split']);

        });

        it('should handle a single dot', () => {

            must(tokenize('.')).equate([]);

        });

        it('should handle two dots', () => {

            must(tokenize('..')).equate(['.']);

        });

        it('should handle a bracket', () => {

            must(tokenize('[')).equate(['[']);

        });

        it('should handle two brackets', () => {

            must(tokenize('[]')).equate([]);

        });

        it('should allow brackets to contain dots', () => {

            must(tokenize('path[.dot.dot.dut.dottydut]'))
                .equate(['path', '.dot.dot.dut.dottydut']);

        });

        it('should not nest brackets', () => {

            must(tokenize('path[[with nested]]'))
                .equate(['path[with nested]]']);

            must(tokenize('path[do.do[with nested].value]'))
                .equate(['path', 'do.do[with nested', 'value]']);

        });

        it('should allow backslash escape sequences', () => {

            must(tokenize('\\..\\.'))
                .equate(['.', '.']);

            must(tokenize('\\.'))
                .equate(['.']);

            must(tokenize('imports\\.'))
                .equate(['imports.']);

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

            must(get('name', user).get()).be.object();
            must(get('name.first', user).get()).equal('Joe');
            must(get('name.last', user).get()).equal('M');
            must(get('meta.status.banned', user).get()).equal(true);
            must(get('meta[status][banned]', user).get()).equal(true);
            must(get('dot..value', user).get()).equal('...');
            must(get('name[dot.name]', user).get()).equal('Joe.M');
            must(get('nam', user)).be.instance.of(Nothing);

        });

        it('should not mistreat zeros', () => {

            must(get('the.zero.value', {
                the: {
                    zero: {
                        value: 0
                    }
                }
            }).get()).equal(0);

            must(get('the.zero.value', {
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

            must(set('name', 'sana', {})).equate({
                name: 'sana'
            });

        });

        it('should set nested (1) values', () => {

            let o = set('name.first', 'Bob', user);

            must(o).equate({
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

            must(o).equate({
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

            must(o).equate({
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

            must(set('flag', true, <any>{ n: 1, b: { d: [1, 2, 3] }, items: [12] }))
                .equate({ n: 1, b: { d: [1, 2, 3] }, items: [12], flag: true });

        });

    });

    describe('escape', () => {

        it('should escape dots', () => {

            must(escape('dot.dot.dots')).equal('dot\\.dot\\.dots');

        });

    });

    describe('escapeRecord', () => {

        it('should work', () => {

            must(escapeRecord({
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

            must(unescape('dot\.dot\.dots')).equal('dot.dot.dots');

        });

    });

    describe('unescapeRecord', () => {

        it('should work', () => {

            must(unescapeRecord(
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

            must(flatten({

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

            must(unflatten(b4)).equate(after)

        })
    })

});
