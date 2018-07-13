const User = require('../model/user');

module.exports = {
    getAll : (req, res) => {
        User.find({}, {}, {limit: 14}, (err, users) => {
            if (err) res.send(err);
            res
            .status(302)
            .send(users);
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

    },
    edit: (req, res) => {

    }
}