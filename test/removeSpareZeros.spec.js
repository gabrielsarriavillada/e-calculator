import { expect } from "chai";
import { removeSpareZeros } from '../src/calc.methods';

const value1 = '0005';
const value2 = '0.5000';

describe('removeSpaceZeros function', function(){
    it('should remove spare 0s on the left',function(){
        expect('5').to.equal(removeSpareZeros(value1));
    });
    it('should remove spare 0s on the right',function(){
        expect('0.5').to.equal(removeSpareZeros(value2));
    });
});
