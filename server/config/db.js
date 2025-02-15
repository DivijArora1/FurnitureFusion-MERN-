import mongoose from 'mongoose'
import colors from 'colors'
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Server connected to mangoDb ${conn.connection.host}  `.bgMagenta.white)
    } catch (error) {
        console.log(`error in MongoDb ${error} `.bgRed.white)
    }

}
export default connectDB