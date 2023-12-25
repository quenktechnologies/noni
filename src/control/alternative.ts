import { Applicative } from './applicative';
import { Plus } from './plus';

/**
 * Alternative
 */
export interface Alternative<A> extends Applicative<A>, Plus<A> {}
