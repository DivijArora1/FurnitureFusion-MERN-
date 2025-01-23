import userModel from "../models/userModel.js"
import orderModel from "../models/orderModel.js"

import { comparePassword, hashPassword } from "../helpers/authHelper.js"
import JWT from "jsonwebtoken"//security

export const rejisterController = async (req, res) => {
    try {

        const { name, email, password, phone, address, answer } = req.body
        //validation
        if (!name) return res.send({ message: "Name required" })
        if (!email) return res.send({ message: "email required" })
        if (!password) return res.send({ message: "password required" })
        if (!phone) return res.send({ message: "Phone required" })
        if (!address) return res.send({ message: "address required" })
        if (!answer) return res.send({ message: "Answer required" })

        //check user
        const existingUser = await userModel.findOne({ email })
        //existing user check
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "User Already rejistered please Login"
            })
        }

        //rejister user
        const hashedPassword = await hashPassword(password)//pass the password that we are getting from request.body

        //save
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            answer
        }).save()

        res.status(201).send({
            success: true,
            message: "User Rejistered successfully",
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Rejistration,",
            error
        })

    }

}

//post login 
export const loginController = async (req, res) => {
    //we get email and pass -->check these 
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Enter userName or password"
            })
        }
        //check user..on the basis of email
        const user = await userModel.findOne({ email })
        if (!user) {
            //if we dont get user we will return 
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            })
        }
        //compare password with hashed pass
        const match = await comparePassword(password, user.password)
        if (!match) {
            //if we dont get user we will return 
            return res.status(200).send({
                success: false,
                message: "incorrect password"
            })
        }
        //now if correct -> token create //security(protect our routes and then we compare the tokens)
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })//this is the object id that was created by mongo db and added with database

        res.status(200).send({
            success: true,
            message: "Login successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,

            },
            token,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in login",
            error//passing error object as it is 
        })
    }

}

//forgotPasswordController
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body
        if (!email) {
            res.status(400).send({ message: "Email is required " })
        }
        if (!answer) {
            res.status(400).send({ message: "answer is required " })
        }
        if (!newPassword) {
            res.status(400).send({ message: "newPassword is required" })
        }
        //check 
        const user = await userModel.findOne({ email, answer })

        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "wrong email or password"
            })
        }
        //hashing new password
        const hashed = await hashPassword(newPassword);
        //send equest and update
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'something went wrong',
            error
        })

    }
}

//testController
export const testController = (req, res) => {
    try {

        res.send("Protected route")
    } catch (error) {
        console.log(error)
        res.send({ error })
    }
}

//update profile
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);

        //password check 
        if (password && password.length < 6) {
            return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
    }
};

//orders
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products", "-photo")
            .populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};
//orders
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};

//order status
export const orderStatusController = async (req, res) => {
    try {
        // update in our querry
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            error,
        });
    }
};