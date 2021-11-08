const chai = window.chai
const expect = chai.expect

describe('MockAPi Tests', ()=> {
    it('Verify it is possible to get MockApi Json', () => {
        var promise = getTheUsers();
        promise.then(function (result) {
            var da = JSON.stringify(result);
            console.log(da)
            expect(da.length > 0).to.be.true;
        })
    })
});
