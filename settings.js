const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
//const credentials = require('./credentials');
const api = require('./api');

module.exports = {
    config: (app) => {
        
        app.use(require('morgan')('dev'));
        app.use(require('body-parser')());
        app.use(require('body-parser').urlencoded({
            extended: false
        }));
        app.use(require('cookie-parser')());
        app.use(session({
            secret: 'sh',
            cookie: {signed: true, secure: false, maxAge: 900000},
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({
                mongooseConnection: require('mongoose').connection,
                db: app.get('env') === 'development' ? 'rendezvoustestdb' : 'rendezvousclouddb'
            })
        }));
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Methods', 'GET, POST');
            next();
        });
        app.set('json spaces', 4);
        app.use(require('express-fileupload')());
       // app.use(require('multer')().single());
        /*app.use((req, res, next) => {
            res.locals.flash = req.session.flash;
            delete req.session.flash;
            next();
        });*/

        console.log('App configured');
    },
    routeApp: (app) => {
        api.init(app);
        console.log('App routed');
    }
}