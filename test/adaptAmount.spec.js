import { expect } from "chai";
import { adaptAmount } from '../src/calc.methods';

const value = '1111111111.11111';

describe('adaptAmount function', function(){
    it('should adapt given value to correct amount',function(){
        expect('1111111111.11').to.equal(adaptAmount(value));
    })
});
