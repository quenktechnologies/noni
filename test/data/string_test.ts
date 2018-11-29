import {must} from '@quenk/must';
import {camelCase} from '../../src/data/string';

  describe('string', () => {

      describe('camelCase', () => {

          it('should turn remove underscores and dashes', () => {

            must(camelCase('this_is_our-camel'))
            .equal('ThisIsOurCamel')
            
          });
        
      });
    
  });
