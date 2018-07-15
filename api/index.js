const response = require('./response');

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
    app.get('/api/users/:user_id', response.getSpecific);

    /*
        Creates a new user.
        Body parameters to be passed from client side to server side includes the following:
        - email: For email
        - phone: For user's phone number
        - first: For user's first name
        - last: For user's last name
        - interests: For user's interests. Indicate that the user separates all interests properly with a comma for meaningful persistence. For instance: reading, writing, playing e.t.c.
     */
    app.post('/api/users/create', response.create);

    /*
        Edits user's detail. Required body parameters to be sent to server side includes:
        - first: For first name
        - last: For last name
        - phone: For phone number
    */
    app.put('/api/users/:user_id/edit', response.edit);

    /*
        Get's all users. This sends an array to the client side which should perform a looping of some sort to get the data properly.
    */
    app.get('/api/users', response.getAll);
}