const mongoose = require('mongoose');

const userRole = [
    'teacher',
    'doctor',
    'student',
    'pacient',
    'admin'
];

const userSchema = new mongoose.Schema({
    //_Id: String,
    role: { type: String, enum: userRole },
    name: String,
    email: String,//is used as a login
    password: String
});

mongoose.model('User', userSchema);