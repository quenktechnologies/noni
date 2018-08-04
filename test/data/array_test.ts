import * as must from 'must/register';
import {head,tail} from '../../src/data/array';

  describe('array', () => {

      describe('head', () => {

          it('should return the first element', () => {

            must(head([9,4,3,29,9,8])).be(9);
            
          });
        
      });

      describe('tail', () => {

          it('should return the last element', () => {

            must(tail([349,434,1341,2,12])).be(12);
            
          });
        
      });
    
  });
