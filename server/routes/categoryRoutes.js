import express from 'express'
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from '../controllers/categoryController.js'

const router = express.Router()

//routes
//create  category
router.post(
    "/create-category",
    requireSignIn,
    isAdmin,
    createCategoryController
);

//update category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)

//get All categories-->no need of middle ware as both(user/admin) can see
router.get('/get-category', categoryController)

//get single
//we will get from slug-name
router.get('/single-category/:slug', singleCategoryController)

//delete-category
router.delete(
    "/delete-category/:id",
    requireSignIn,
    isAdmin,
    deleteCategoryController
);

export default router


