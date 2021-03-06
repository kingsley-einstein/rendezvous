//Require mongoose. An ideal package for a server-side connection to mongodb using Express. It's ideal as it enforces a schema on a NoSQL database such as mongodb

const mongoose = require('mongoose'),
Schema = mongoose.Schema;

//Require crypto for password hashing. Another middleware/package, 'bcrypt' can be used..

var crypto = require('crypto');

//Create schema 

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
    },
    lastname: {
        type: String,
        maxlength: 80
    },
    email: {
        type: String,
        required: true,
       // unique: true,
    },
    bio: {
        type: String,
        maxlength: 2000
    },
    hashedPassCode: String,
    phone_number: String,
    photo: String,
    interests: [String],
    position: {
        lat: Number,
        long: Number,
        posInKilometers: Number
    },
    gravatar: String,
    notification: String,
    requestid: [String],
    requestphone: [String],
    acceptedNumber: [String]
    
});

//Create password and hash. This is a security measure just in case database is compromised

userSchema.methods.createPassword = (password) => {
    //var salt = crypto.randomBytes(16).toString('base64');
    this.hashedPassCode = crypto.pbkdf2Sync(password, new Buffer('secret', 'utf8'), 1000, 86, 'sha512').toString('hex');
};

//Password validity check

userSchema.methods.isValidPassword = (password) => {
    //var salt = crypto.randomBytes(16).toString('base64');
    var hashedPassCode = crypto.pbkdf2Sync(password, new Buffer('secret', 'utf8'), 1000, 86, 'sha512').toString('hex');

    return hashedPassCode === this.hashedPassCode;
};

//Export data to be used by other modules

module.exports = mongoose.model('User', userSchema);