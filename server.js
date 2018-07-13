const express = require('express');
const app = express();
const settings = require('./settings');

app.set('port', process.env.PORT || 4000);

settings.config(app);

app.listen(app.get('port'), () => {
    console.log('Express server listening on port %d', app.get('port'));
});