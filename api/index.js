const response = require('./response');
const environment = require('../exports');

module.exports.init = (app) => {

    /*
        Get a specific user based on passed parameter. After making a call to this route, ensure to redirect to user's profile page or to avoid possible request conflict from client's end, make the call on the user's profile page using parameterised routes
        This returns the whole user details (excluding the hashed passcode and the fbProvider details) which can be found in model/user.js file. Manipulating the data is up to the client side.
        For arrays, it is necessary to loop to get clean data.
        Request should be made to the route in this format: domain/api/users/:user_id .... The :user_id parameter is the parameter passed from the route. If client side framework or language is React Native, try to maintain this parameter as a state and then pass on initialisation of user's profile page and then store response as a variable and then manipulate to get data.
        For Angular as client side, the ActivatedRoute stores the parameters of a path to a component, subscribe to this and store in a variable... Example below
        Say you configured a route in this format:
         const routes: Routes = [
            {path: 'domain/api/users/:id', component: UserProfileComponent}
        ];



        export class UserProfileComponent implements OnInit {
            response: any;
            user_id: any;
            err: any;
            
            constructor(private route: ActivatedRoute, private http: HttpClient) {
                route.params.subscribe(params => {
                    this.user_id = params['id'];
                });
            }

            ngOnInit() {

                this.http
                .get('domain/api/users/'+this.user_id)
                .subscribe(data => {
                    this.response = data
                },
            (err) => this.err = err)
            }

        }  

        The ngOnInit() block tells Angular to make call on initialisation and then maps the response from call (i.e 'data') to the response variable which can then be used
    */
    app.get('/api/users/:user_id/'+environment.secret+'.json', response.getSpecific);

    /*
        Creates a new user.
        Body parameters to be passed from client side to server side includes the following:
        - email: For email
        - phone: For user's phone number
        - first: For user's first name
        - last: For user's last name
        - interests: For user's interests. Indicate that the user separates all interests properly with a comma for meaningful persistence. For instance: reading, writing, playing e.t.c.
     */
    app.post('/api/users/create/'+environment.secret+'.json', response.create);

    /*
        Edits user's detail. Required body parameters to be sent to server side includes:
        - first: For first name
        - last: For last name
        - phone: For phone number
        - interests: For interests
    */
    app.put('/api/users/:user_id/edit/'+environment.secret+'.json', response.edit);

    /*
        Get's all users. This sends an array to the client side which should perform a looping of some sort to get the data properly.
        The :list_number parameter is used to sort the array.. useful for pagination
    */
    app.get('/api/users/'+environment.secret+'.json', response.getAll);

    /**
     * Find users that match logged user's interests
     */
    app.get('/api/users/:user_id/match/'+environment.secret+'.json', response.listMatch);

    /**
     * Log user in
     */
    app.post('/api/login/'+environment.secret+'.json', response.login);

    /**
     * Search for a particular user based on specified interest
     */
    app.post('/api/users/search/'+environment.secret+'.json', response.search);

    /**
     * Request to connect with a user
     */
    app.get('/api/users/:user_id/:match_id/request/'+environment.secret+'.json', response.requestConnection);
    
    /**
     * Accept user's connection request
     */
    app.get('/api/users/:user_id/:match_id/accept/'+environment.secret+'.json', response.acceptConnection);

    /**
     * Reject user's connection request
     */
    app.get('/api/users/:user_id/:match_id/reject/'+environment.secret+'.json', response.rejectConnection);

    /**
     * Change user's location as user moves
     */
    app.put('/api/users/:user_id/changeloc/'+environment.secret+'.json', response.changeGeoLoc);

    /**
     * Persist if data is coming from an FB background. If user exists, sends data
     */
    app.post('/api/users/login/fb/'+environment.secret+'.json', response.fbPersist);
}