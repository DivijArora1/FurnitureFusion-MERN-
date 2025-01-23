import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js';

//protected routes token base 
//middle ware self created

export const requireSignIn = async (req, res, next) => {
    try {

        //we had encoded our info with jwt..now we need to decode and verify 
        const decode = JWT.verify(
            req.headers.authorization, process.env.JWT_SECRET
        )//our token is in authorization,compare with secretcode

        req.user = decode;//decrypt
        next();

    } catch (error) {
        console.log(error)
    }
}

//admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)
        if (user.role != 1) {
            return res.status(401).send({
                success: false,
                message: "UnAuthorized Admin access"
            })
        } else {
            next()//else user can access 
        }
    } catch (error) {
        console.log(error)
        res.status(401).send({
            success: false,
            error,
            message: "Error in admin middleware"
        })

    }
}