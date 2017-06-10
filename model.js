/**
 * Created by ShanGuo on 2017/6/10.
 */
//1.引入mongoose
let mongoose = require('mongoose');
let config =require('./config');

//
mongoose.connect(config.dbUrl);

let UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String
});

let User = mongoose.model("User", UserSchema);

exports.User = User;
