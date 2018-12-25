import { Alt } from './alt';
/**
 * Plus
 */
export interface Plus<A> extends Alt<A> {
    empty(): Plus<A>;
}
