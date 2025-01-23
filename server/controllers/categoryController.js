import slugify from "slugify"
import categoryModel from "../models/categoryModel.js"

//create 
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(401).send({ message: "Name is required" })
        }
        const existingCategory = await categoryModel.findOne({ name })
        if (existingCategory) {
            res.status(200).send({
                success: true,
                message: "category Alreay exist"

            })
        }
        //create new
        const category = await new categoryModel({ name, slug: slugify(name) }).save()
        res.status(201).send({
            success: true,
            message: "New category created",
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in category"
        })//send 

    }

}



//update

export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body //while entering
        const { id } = req.params //url

        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        //findinf by id and updating+slugifying + new=true(imp)
        res.status(200).send({
            success: true,
            message: "Category updated Successfully",
            category,

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error  while creating category'
        })
    }
}
//get all category
export const categoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({})//all
        res.status(200).send({
            success: true,
            message: "All Categories List",
            category,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting all category"
        })

    }

}
//get single category
export const singleCategoryController = async (req, res) => {
    try {
        const slug = req.params.slug
        const category = await categoryModel.findOne({ slug })//all

        res.status(200).send({
            success: true,
            message: "Required Category",
            category,
        })

    } catch (error) {
        console.log(error)
        res.status(500).response({
            success: false,
            error,
            message: "Error while getting single category"
        })

    }

}

export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Categry Deleted Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error while deleting category",
            error,
        });
    }
};
