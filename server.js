const express = require('express');
const app = express();
const settings = require('./settings');
const credentials = require('./credentials');
const mongoose = require('mongoose');

app.set('port', process.env.PORT || 4000);

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
    console.log('Express server listening on port %d', app.get('port'));
    
    switch(app.get('env')) {
        case 'development' : 
            mongoose.connect(credentials.mongo.dev.connectionString, options, (err) => {
                if (err) throw err;
                console.log('Mongoose connected');
            });
            break;
        case 'production' : 
            mongoose.connect(credentials.mongo.prod.connectionString, options, (err) => {
                if (err) throw err;
                console.log('Mongoose connected to cloud server');
            });
            break;
    }
});