import * as must from 'must/register';
import { match } from '../../src/control/match';

class ClassA { }
class ClassB { }
class ClassC { }

describe('match', function() {

    it('it should work', function() {

        let result =
            match(12)
                .caseOf(ClassA, (a: ClassA) => a)
                .caseOf(ClassB, (b: ClassB) => b)
                .caseOf(ClassC, (c: ClassC) => c)
                .caseOf('12', (n: number) => n)
                .caseOf({ n: 1 }, (n: object) => n)
                .caseOf(12, () => new Array(12))
                .orElse(() => new Date())
                .end();

        must(result).eql(new Array(12));

    });

    it('should return orElse if no match and specified', function() {

        let result =
            match({})
                .caseOf(ClassA, (a: ClassA) => a)
                .caseOf('12', (n: number) => n)
                .orElse(() => Date)
                .end();

        must(result).be(Date);

    });

    it('should throw if no match found', function() {

        let f = () => match({}).caseOf(ClassA, () => 12).end();

        must(f).throw();

    });

});
