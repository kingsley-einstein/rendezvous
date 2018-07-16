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