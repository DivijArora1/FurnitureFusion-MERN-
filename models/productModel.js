import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,

    },
    slug: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    }
    ,
    price: {
        type: Number,
        require: true,
    }
    ,
    category: {
        type: mongoose.ObjectId,
        ref: 'Category',//this we have passed model name that we mentioned in category model
        require: true,
    }
    ,
    quantity: {
        type: Number,
        require: true,
    }
    ,
    photo: {
        data: Buffer,
        contentType: String,
        // require: true,
    }
    ,
    shipping: {
        type: Boolean,//status of shipping
    }


}, { timestamps: true })//time of creating the products
export default mongoose.model('Products', productSchema)