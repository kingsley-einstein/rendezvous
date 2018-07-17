// Use mocha framework for tests. To avoid the ambiguity associated with running mocha from command line, in package.json file, edit the "test" option to:
// mocha -r tests/helper.js - R spec tests/**/*.test.js -- Note: This command depends on local work space
// To put to test, run npm test in the root of your project folder
       
 


var response = require('../../api/response');
var settings = require('../../settings');
var environment = require('../../exports');

describe('CALLS', () => {
    const app = {
        get: sinon.spy(),
        post: sinon.spy(),
        put: sinon.spy(),
        use: sinon.spy()
    };
    beforeEach(() => {
        settings.config(app);
        settings.routeApp(app);
    });
    describe('RESPONSES', () => {
        describe('GET', () => {
            it('should handle /api/users/:user_id/'+environment.secret, () => {
                expect(app.get).to.be.calledWith('/api/users/:user_id/'+environment.secret, response.getSpecific);
            });
            it('should handle /api/users/'+environment.secret, () => {
                expect(app.get).to.be.calledWith('/api/users/'+environment.secret, response.getAll);
            });
            it('should handle /api/users/:user_id/match/'+environment.secret, () => {
                expect(app.get).to.be.calledWith('/api/users/:user_id/match/'+environment.secret, response.listMatch);
            });
            
        });
        describe('POST', () => {
            it('should handle /api/users/create/'+environment.secret, () => {
                expect(app.post).to.be.calledWith('/api/users/create/'+environment.secret, response.create);
            });
        });
        describe('PUT', () => {
            it('should handle /api/users/:user_id/edit/'+environment.secret, () => {
                expect(app.put).to.be.calledWith('/api/users/:user_id/edit/'+environment.secret, response.edit);
            });
        });
    });
    /*describe('USE', () => {
        it('should use', () => {
            expect(app.use).to.be.equal(app.use(require('body-parser')()));
        });
    });*/
});