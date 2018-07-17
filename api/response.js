const User = require('../model/user');
const regex = require('email-regex');
const _ = require('underscore');

var allusers = [];
var matchusers = [];


module.exports = {
    getAll : (req, res) => {
        User.find({}, {}, {limit: 14, skip: Math.floor(Math.random() * 14)}, (err, users) => {
            if (err) res.send(err);
            _.each(users, (elem, index) => {
                //allusers.pop();
                allusers.push(elem);
            });
            res
            .status(302)
            .send(allusers);
            allusers = [];
        });
    },
    getSpecific : (req, res) => {
        User.findOne({_id: req.params.user_id}, (err, user) => {
            if (err) res.send(err);
            res
            .status(302)
            .send(user);
        });
    },
    create : (req, res) => {
        User.findOne({email: req.body.email}, (err, user) => {
            if (err) res.send(err);
            if (user) {
                res
                .status(500)
                .send('User with given e-mail exists');
            }
            else {
                var newuser = new User({
                    email: req.body.email,
                    first_name: req.body.first,
                    last_name: req.body.last,
                    phone_number: req.body.phone,
                    interests: req.body.interests.split(', '),
                    gravatar: require('md5')(req.body.email)
                   /* location: {
                        lat: req.body.lat,
                        long: req.body.long
                    }*/
                });

                if (!regex().test(req.body.email)) {
                    req.session.flash = {
                        message: 'Invalid E-mail'
                    };
                }
                else {
                    newuser.validate((err) => {
                        if (err) {
                            res
                            .status(500)
                            .send(err);
                        }
                        else {
                        newuser.createPassword(req.body.pass);
                        newuser.save();
                        res
                        .status(302)
                        .send('User created');
                        }
                        

                    });
                }
                
            }
        });    
    },
    edit : (req, res) => {
        if (req.body.first && req.body.last && req.body.phone) {
            User.findOne({_id: req.params.user_id}, (err, user) => {
                user.first_name = req.body.first;
                user.last_name = req.body.last;
                user.phone_number = req.body.phone;
                user.save();
                /*res
                .status(302)
                .redirect('/api/users/'+req.params.user_id);
                */
            });
        }
    },
    listMatch : (req, res) => {
         
       User.findOne({_id: req.params.user_id}, (err, user) => {
        
           User.find({}, (err, users) => {
               if(matchusers.length <= 0) {
                   _.each(users, (elem, index) => {
                       if (elem.email != user.email) {
                        if (matchusers.indexOf(elem) === -1) {
                            for (var i = 0; i < user.interests.length; i++) {
                                if (elem.interests.indexOf(user.interests[i]) != -1) {
                                    matchusers.push(elem);
                                    break;
                                }
                            }
                        }
                       }
                   });
               } 
               res
               .status(302)
               .send(matchusers);

               matchusers = [];
           });
        
       });
       
    }
}