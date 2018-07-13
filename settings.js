const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const credentials = require('./credentials');

module.exports = {
    config: (app) => {
        
        app.use(require('morgan')('dev'));
        app.use(require('body-parser')());
        app.use(require('body-parser').urlencoded({
            extended: false
        }));
        app.use(require('cookie-parser')());
        app.use(session({
            secret: credentials.session.init.secret,
            cookie: credentials.session.init.cookie,
            resave: credentials.session.init.resave,
            saveUninitialized: credentials.session.init.saveUninitialized,
            store: new MongoStore({
                mongooseConnection: require('mongoose').connection,
                db: app.get('env') === 'development' ? 'getphysicaltestdb' : ''
            })
        }));
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        });
    }
}