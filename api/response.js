const User = require('../model/user');
const regex = require('email-regex');
const _ = require('underscore');
const env = require('../exports');
//const fs = require('fs');
const cloudinary = require('cloudinary');
//const formidable = require('formidable');
const DataUri = require('datauri');

//var randomEmail = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var allusers = [];
var matchusers = [];
var search = [];
//var matchusersInSameLocation = [];

cloudinary.config({
    cloud_name: env.cloudinaryName,
    api_key: env.cloudinaryKey,
    api_secret: env.cloudinarySecret,
    file: 'image/jpg'
});


module.exports = {
    getAll : (req, res) => {
        if (req.headers.token === env.secret) {
            User.find({}, {}, {limit: 14, /*skip: Math.floor(Math.random() * 14)*/}, (err, users) => {
                if (err) res.send(err);
                _.each(users, (elem, index) => {
                    //allusers.pop();
                    allusers.push(elem);
                });
                res
                .status(200)
                .json(allusers);
                allusers = [];
            });
        }
        else {
            res
            .status(500)
            .send('Invalid token! Unable to connect to server side');
        }
    },
    getSpecific : (req, res) => {
        if (req.headers.token === env.secret) {
            User.findOne({_id: req.params.user_id}, (err, user) => {
                if (err) res.send(err);
                res
                .status(200)
                .json(user);
            });
        }
        else {
            res
            .status(500)
            .send('Invalid token! Unable to connect to server side');
        }
    },
    loginOrCreate : (req, res) => {
        if (req.headers.token === env.secret) {

            User.findOne({phone_number: req.body.phone}, {}, (err, user) => {
                if (user) {
                    if (user.isValidPassword(req.body.password)) {
                        res
                        .status(200)
                        .json(user);
                    }
                    else {
                        res
                        .status(500)
                        .send('Incorrect Password');
                    }
                }
                else {
                    var newuser = new User({
                       phone_number: req.body.phone,
                       email: require('faker').internet.email() || ' ',
                       name: req.body.firstname ? req.body.firstname: require('faker').name.firstName(),
                       lastname: require('faker').name.lastName()
                    });
                    newuser.createPassword(req.body.password);

                    newuser.validate((err) => {
                        if (err) {
                            res
                            .status(500)
                            .send(err);
                        }
                        else {
                            
                            newuser.save();
                            res
                            .status(200)
                            .json(newuser);
                        }
                    });
                }
            });
        }
        else {
            res
            .status(500)
            .send('Invalid token! Unable to connect to server side');
        }    
    },
    edit : (req, res) => {
        if (req.headers.token === env.secret) {
            if (req.body.lastname && req.body.email) {
                User.findOne({_id: req.params.user_id}, (err, user) => {
                    user.email = req.body.email;
                    user.lastname = req.body.lastname;
                    user.phone_number = req.body.phone_number;
                    user.bio = req.body.bio;
                    //user.name = req.body.name;
                    user.gravatar = require('md5')(req.body.email ? req.body.email : user.email);
                    if (req.body.interests) {
                        _.each(req.body.interests.split(', '), (interest, index) => {
                            if (user.interests.indexOf(interest) === -1) {
                                user.interests.push(interest);
                            }
                        });
                    }
                    user.save();
                    res
                    .status(200)
                    .json(user);
                });
            }
            else {
                res
                .status(500)
                .send('Fields cannot be left empty')
            }
        }
        else {
            res
            .status(500)
            .send('Invalid token! Unable to connect to server side');
        }
    },
    uploadPhoto: (req, res, next) => {
        if (req.headers.token === env.secret) {
            User.findOne({_id: req.params.user_id}, {}, (err, user) => {
                var datauri = new DataUri();
                datauri.format(require('path').extname(req.file.name).toString(), req.file.buffer);
                cloudinary.uploader.upload(datauri.content, (err, res) => {
                    
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(res);
                    }

                    
                    user.photo = datauri.content;
                    user.save();
                });
            });
        }
        else {
            res
            .status(500)
            .send('Invalid token! Unable to connect to server side');
        }
    },
    listMatch : (req, res) => {
         
       if (req.headers.token === env.secret) {
        User.findOne({_id: req.params.user_id}, (err, user) => {
        
            User.find({}, (err, users) => {
                if(matchusers.length <= 0) {
                    _.each(users, (elem, index) => {
                        if (elem.email != user.email) {
                         if (matchusers.indexOf(elem) === -1) {
                             for (var i = 0; i < user.interests.length; i++) {
                                 if (elem.interests.toString().toLowerCase().indexOf(user.interests[i].toLowerCase()) != -1 && elem.position.lat === user.position.lat && elem.position.long === user.position.long && (elem.position.posInKilometers - user.position.posInKilometers <= 1)) {
                                     matchusers.push(elem);
                                     break;
                                 }
                             }
                         }
                        }
                    });
                } 
                res
                .status(200)
                .json(matchusers);
 
                matchusers = [];
            });
         
        });
       }
       else {
           res
           .status(500)
           .send('Invalid token! Unable to connect to server side');
       }
       
    },
    search : (req, res) => {
        if (req.headers.token === env.secret) {
            if (req.body.search) {
                User.find({}, {}, {}, (err, items) => {
                    _.each(items, (item, index) => {
                        if (item.interests.toString().toLowerCase().indexOf(req.body.search.toLowerCase()) != -1) {
                            search.push(item);
                        }
                    });
                    res
                    .status(200)
                    .json(search);
                    search = [];
                });
            }
            else {
                res
                .status(500)
                .send('Field cannot be left empty');
            }
        }
        else {
            res
            .status(500)
            .send('Invalid token! Unable to connect to server side');
        }
    },
    requestConnection : (req, res) => {
        if (req.headers.token === env.secret) {
            User.findOne({_id: req.params.user_id}, (err, user) => {
                User.findOne({_id: req.params.match_id}, (err, match) => {
                    req.session.message = user.name+' wants to connect with you';
                    match.notification = req.session.message;
                    if (match.requestid.indexOf(user._id) === -1) {
                        match.requestid.push(user._id);
                    }
                    match.save();
                    delete req.session.message;
                    res
                    .status(200)
                    .send('Connection Request Made');
                });
            });
        }
        else {
            res
            .status(500)
            .send('Invalid token! Unable to connect to server side');
        }
    },
    acceptConnection : (req, res) => {
        if (req.headers.token === env.secret) {
            User.findOne({_id: req.params.user_id}, (err, user) => {
                User.findOne({_id: req.params.match_id}, (err, match) => {
                    req.session.message = user.name+' accepted your request to connect. Make a call now';
                    match.notification = req.session.message;
                    match.requestphone.push(user.phone_number);
                    user.requestphone.push(match.phone_number);
                    user.requestid.splice(user.requestid.indexOf(match._id), 1);
                    user.notification = '';
                    match.save();
                    user.save();
                    delete req.session.message;
                    res
                    .status(200)
                    .send('Request Accepted');
                });
            });
        }
        else {
            res
            .status(500)
            .send('Invalid token! Unable to connect to server side');
        }
    },
    rejectConnection: (req, res) => {
       if (req.headers.token === env.secret) {
        User.findOne({_id: req.params.user_id}, (err, user) => {
            User.findOne({_id: req.params.match_id}, (err, match) => {
                match.notification = '';
                user.notification = '';
                user.requestid.splice(user.requestid.indexOf(match._id), 1);
                match.save();
                user.save();
                res
                .status(200)
                .send('Request Rejected');
            });
        });
       }
       else {
           res
           .status(500)
           .send('Invalid token! Unable to connect to server side');
       }
    },
    changeGeoLoc: (req, res) => {
        if (req.headers.token === env.secret) {
            User.findOne({_id: req.params.user_id}, (err, user) => {
                user.position.lat = req.body.lat;
                user.position.long = req.body.long;
                user.position.posInKilometers = req.body.kilometers;
                user.save();
                res
                .status(200)
                .send('Geolocation Changed');
            });
        }
        else {
            res
            .status(500)
            .send('Invalid token! Unable to connect to server side');
        }
    },
    clearData: (req, res) => {
        if (req.headers.token === env.secret) {
            User.findOne({_id: req.params.user_id}, (err, user) => {
                user.requestid = [];
                user.requestphone = [];
                user.save();
            });
        }
        else {
            res
            .status(500)
            .send('Invalid token! Unable to connect to server side');
        }
    },
    fbPersist: (req, res) => {
        if (req.headers.token === env.secret) {
            User.findOne({email: regex().test(req.body.email) ? req.body.email : req.body.displayName+'@facebook.com'}, (err, user) => {
                if (user) {
                    res
                    .status(200)
                    .json(user);
                }
                else {
                    var newuser = new User({
                        email: regex().test(req.body.email) ? req.body.email : require('faker').internet.email(),
                        name: req.body.displayName,
                        interests: ['?'],
                        phone_number: req.body.phone ? req.body.phone : 'None',
                        gravatar: require('md5')(regex().test(req.body.email) ? req.body.email : require('faker').internet.email())
    
                    });
                    newuser.validate((err) => {
                        if (err) {
                            res
                            .status(500)
                            .send(err);
                        }
                        else {
                            newuser.createPassword(new Buffer('encrypted', 'utf8'));
                            newuser.save();
                            res
                            .status(200)
                            .json(newuser);
    
                        }
                    });
                }
            });
        }
        else {
            res
            .status(500)
            .send('Invalid token! Unable to connect to server side');
        }
    }
}