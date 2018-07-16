const express = require('express');
const app = express();
const settings = require('./settings');
const credentials = require('./credentials');
const mongoose = require('mongoose');
const environment = require('./exports');

app.set('port', environment.port);
app.set('env', environment.env);



settings.config(app);
settings.routeApp(app);

var options = {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
};

app.listen(app.get('port'), () => {
    console.log('Express server listening on port %d and running on %s environment', app.get('port'), app.get('env'));
    //console.log(process.env.NODE_ENV);
    
    switch(app.get('env')) {
        case 'development' : 
            mongoose.connect(environment.mongoDev, options, (err) => {
                if (err) throw err;
                console.log('Mongoose connected');
            });
            break;
        case 'production' : 
            mongoose.connect(environment.mongoProd, options, (err) => {
                if (err) throw err;
                console.log('Mongoose connected to cloud server');
            });
            break;
    }
});