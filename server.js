const express = require('express');
const app = express();
const settings = require('./settings');
const credentials = require('./credentials');
const mongoose = require('mongoose');
require('dotenv')
.config();

app.set('port', process.env.PORT || 4000);
app.set('env', process.env.NODE_ENV);



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
            mongoose.connect(process.env.MONGO_DEV, options, (err) => {
                if (err) throw err;
                console.log('Mongoose connected');
            });
            break;
        case 'production' : 
            mongoose.connect(process.env.MONGO_PROD, options, (err) => {
                if (err) throw err;
                console.log('Mongoose connected to cloud server');
            });
            break;
    }
});