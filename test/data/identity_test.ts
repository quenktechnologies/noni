import * as tests from '../checks';
import { Identity } from '../../src/data/indentity';

const eq =
    <A>(a: Identity<A>) =>
    (b: Identity<A>) =>
        a.eq(b);
const map = (n: number) => n + 1;
const value = 12;

describe('identity', () => {
    describe(
        'Identity',
        tests.isMonad({
            pure: <A>(a: A) => new Identity(a),
            eq,
            bind: (n: number) => new Identity(n + 1),
            map,
            value
        })
    );
});
