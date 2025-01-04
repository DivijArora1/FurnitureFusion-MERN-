import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";

import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields//not body ..coz we are using formidable()
        const { photo } = req.files
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in crearing product",
        });
    }
};

//get all product
export const getProductController = async (req, res) => {
    try {
        //multiple filters..as we dont want to rincrease our request size (that includes the all products with photos)
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            totalCount: products.length,
            success: true,
            messsage: "All Products ",
            products,

        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting the product",
            error: error.message
        })

    }
}

//get single product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel
            .findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category");
        res.status(200).send({
            success: true,
            message: "Single Product Fetched",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Eror while getitng single product",
            error,
        });
    }
};

//get photo
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        //conditionally check photo data
        if (product.photo.data) {
            //set content-type from,location
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in while getting product photo",
            error: error.message
        })

    }
}

//delete
export const deleteProductController = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        return res.status(200).send({
            success: true,
            message: "Product delete Successfully",

        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in while deleting product",
            error: error.message
        })

    }
}

//update

export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields//not body ..coz we are using formidable()
        const { photo } = req.files
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in crearing product",
        });
    }
};

//filters //category and prices filter ..both
export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body
        //operations on filter (storing in variable and passing in the function)
        //it depends on user whether he searches it by prices or category
        //we will make the querry for all the cases
        let args = {}
        //len of array
        if (checked.length > 0) args.category = checked//can select multiple
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }//only one selected ( greater than or less than eqal to)
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            products,
        })


    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error While filtering the products",
            error
        })

    }
}


//product count'

export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error in product count",
            error,
        })
    }
}

//product list base on page
export const productListController = async (req, res) => {
    try {
        const perPage = 3;//initial product per page
        const page = req.params.page ? req.params.page : 1 //dynamic page access getting from params (by default our page will ve 1)
        const products = await productModel
            .find({})//all
            .select("-photo")//deselect photo
            .skip((page - 1) * perPage)
            .limit(perPage)//6 products
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error in per page ctrl",
            error

        })

    }
}

//search product
export const searchProductController = async (req, res) => {
    try {
        //keyword from params
        const { keyword } = req.params
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },//caseInSensitive
                { description: { $regex: keyword, $options: 'i' } }//caseInSensitive

            ]


        }).select("-photo")
        res.json(results)

    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error in searching the product",
            error
        })

    }
}


// similar products
export const realtedProductController = async (req, res) => {
    try {//product and category id
        const { pid, cid } = req.params;
        //find on basis of category
        const products = await productModel
            .find({
                category: cid,
                _id: { $ne: pid },
            })
            .select("-photo")
            .limit(3)
            .populate("category");
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error while geting related product",
            error,
        });
    }
};

// get prdouct by catgory
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category }).populate("category");
        res.status(200).send({
            success: true,
            category,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error While Getting products",
        });
    }
};


//payment gateway api
//token(to verify user)
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

//payment
export const brainTreePaymentController = async (req, res) => {
    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,//getting buyer
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};