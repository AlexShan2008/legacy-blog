/**
 * Created by ShanGuo on 2017/12/28.
 */
let  add =require('../client/add');

it('should return 3',
    function () {
        let sum = add(1,2);
        (sum).should.equal(3)
    }
);
