module.exports.init = (app) => {
    app.get('/api/users/:user_id');
    app.post('/api/users/create');
    app.put('/api/users/:user_id/edit');
    app.get('/api/users');
}