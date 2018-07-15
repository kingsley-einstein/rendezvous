const response = require('./response');

module.exports.init = (app) => {

    /*
        Get a specific user based on passed parameter. After making a call to this route, ensure to redirect to user's profile page
        This returns the whole user details (excluding the hashed passcode and the fbProvider details) which can be found in model/user.js file. Manipulating the data is up to the client side.
        For arrays, it is necessary to loop to get clean data
    */
    app.get('/api/users/:user_id', response.getSpecific);

    /*
        Creates a new user
     */
    app.post('/api/users/create', response.create);
    app.put('/api/users/:user_id/edit', response.edit);
    app.get('/api/users', response.getAll);
}