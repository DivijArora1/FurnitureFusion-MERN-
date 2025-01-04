import express from 'express'
import { rejisterController, loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController } from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'

const router = express.Router()

//routing
//rejistter || post method
router.post('/rejister', rejisterController)//validation check 

//login || post
router.post('/login', loginController)

//forgot password
router.post('/forgot-password', forgotPasswordController)

//test Route ->to check the token authorization
router.get('/test', requireSignIn, isAdmin, testController)
//..................tokencheck , admincheck.............

//protected route auth for user 
//private dashboard page
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})

//protected route auth for ADMIN
//private dashboard page
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
})

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// // order status update
router.put(
    "/order-status/:orderId",
    requireSignIn,
    isAdmin,
    orderStatusController
);



export default router