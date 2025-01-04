//schema
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true//1id 1 user
    },
    password: {
        type: String,
        required: true,

    },
    phone: {
        type: String,
        required: true,

    },
    address: {
        type: {},
        required: true,

    },
    answer: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        default: 0//0(user)1(admin)

    }

}, { timestamps: true })//whenever a new user is created a time stamp is added
export default mongoose.model('users', userSchema)//tableName,reference