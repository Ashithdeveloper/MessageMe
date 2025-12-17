import { profile } from 'console';
import mongoose from 'mongoose'



const UserSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    profilepic : {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
})

const User = mongoose.model('User', UserSchema) || mongoose.model('User');

export default User