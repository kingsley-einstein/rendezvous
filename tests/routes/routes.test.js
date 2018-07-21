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
        //put: sinon.spy(),
        use: sinon.spy(),
        set: sinon.spy()
    };
    beforeEach(() => {
        settings.config(app);
        settings.routeApp(app);
    });
    afterEach(() => {
        console.log('Test carried out successfully at this point');
    });
    describe('RESPONSES', () => {
        describe('GET', () => {
            it('should handle /api/users/:user_id', () => {
                expect(app.get).to.be.calledWith('/api/users/:user_id', response.getSpecific);
            });
            it('should handle /api/users/', () => {
                expect(app.get).to.be.calledWith('/api/users', response.getAll);
            });
            it('should handle /api/users/:user_id/match', () => {
                expect(app.get).to.be.calledWith('/api/users/:user_id/match', response.listMatch);
            });
            it('should handle /api/users/:user_id/:match_id/request', () => {
                expect(app.get).to.be.calledWith('/api/users/:user_id/:match_id/request', response.requestConnection);
            });
            it('should handle /api/users/:user_id/:match_id/accept/', () => {
                expect(app.get).to.be.calledWith('/api/users/:user_id/:match_id/accept', response.acceptConnection);
            });
            it('should handle /api/users/:user_id/:match_id/reject', () => {
                expect(app.get).to.be.calledWith('/api/users/:user_id/:match_id/reject', response.rejectConnection);
            });
            it('should handle /api/:user_id/clear', () => {
                expect(app.get).to.be.calledWith('/api/:user_id/clear', response.clearData);
            });

            
        });
        describe('POST', () => {
            it('should handle /api/users/create', () => {
                expect(app.post).to.be.calledWith('/api/users/logorcreate', response.loginOrCreate);
            });
           /** 
            * it('should handle /api/login/'+environment.secret, () => {
                expect(app.post).to.be.calledWith('/api/login/'+environment.secret, response.login);
            });
            */
            it('should handle /api/users/search', () => {
                expect(app.post).to.be.calledWith('/api/users/search', response.search);
            });
            it('should handle /api/users/login/fb', () => {
                expect(app.post).to.be.calledWith('/api/users/login/fb', response.fbPersist);
            });
           /** it('should handle /api/:user_id/upload', () => {
                expect(app.post).to.be.calledWith('/api/:user_id/upload', response.uploadPhoto);
            });**/
            
        });
        
    });
    /*describe('USE', () => {
        it('should use', () => {
            expect(app.use).to.be.equal(app.use(require('body-parser')()));
        });
    });*/
});