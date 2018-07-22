/**require('dotenv')
.config();
*/

//Export environment variables to be used by other modules. The secret token is to be used in tests and for the configuration of routes
module.exports = {
    env: process.env.NODE_ENV,
    mongoProd: process.env.MONGO_PROD,
    mongoDev: process.env.MONGO_DEV,
    secret: process.env.SECRET_TOKEN,
    port: process.env.PORT,
    cloudinarySecret: process.env.CLOUDINARY_SECRET,
    cloudinaryKey: process.env.CLOUDINARY_KEY,
    cloudinaryName: process.env.CLOUDINARY_CLOUDNAME,
    cloudinaryUrl: process.env.CLOUDINARY_URL
}