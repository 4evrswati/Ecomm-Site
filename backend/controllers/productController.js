const productModel = require('../models/productModel')
const categoryModel = require('../models/categoryModel')
const fs = require('fs')
const slugify = require('slugify')

const createProductController = async(req, res) => {
    try {
        const {name, slug, description, price, category, quantity, shipping} = req.fields;
        const {photo} = req.files;

        if(!name || !description || !price || !category || !quantity || !photo)
        {
            return res.status(500).send({error: "Please, Provide complete details."})
        }

        const products = new productModel({...req.fields, slug: slugify(name)})
        if(photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        await products.save()
        res.status(201).send({
            success: true,
            message: 'Product created successfully',
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in creating Product'
        })
    }
}

const getProductController = async(req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt: -1})
        res.status(200).send({
            success: true,
            message: 'Products getting successfully',
            countTotal: products.length,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in getting Products'
        })
    }
}

const getSingleProductController = async(req, res) => {
    try {
        const product = await productModel.findOne({slug: req.params.slug}).select('-photo').populate('category')
        res.status(200).send({
            success: true,
            message: 'Single Product getting successfully',
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in getting Product'
        })
    }
}

const productPhotoController = async(req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data) {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in getting photo'
        })
    }
}

const deleteProductController = async(req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: 'Product deleted successfully',
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in deleting product'
        })
    }
}

const updateProductController = async(req, res) => {
    try {
        const {name, slug, description, price, category, quantity, shipping} = req.fields;
        const {photo} = req.files;

        // if(!name || !description || !price || !category || !quantity || !photo)
        // {
        //     return res.status(500).send({error: "Please, Provide complete details."})
        // }

        const products = await productModel.findByIdAndUpdate(req.params.pid,
            {...req.fields, slug: slugify(name)}, {new: true}
        )
        if(photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        await products.save()
        res.status(201).send({
            success: true,
            message: 'Product updated successfully',
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in updating Product'
        })
    }
}

const productFilterController = async(req, res) => {
    try {
        const {checked, radio} = req.body
        let args = {}
        if(checked.length > 0) args.category = checked
        if(radio.length) args.price = {$gte: radio[0], $lte: radio[1]}

        const products = await productModel.find(args)
        res.status(201).send({
            success: true,
            message: 'Product filtered successfully',
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in filtering Product'
        })
    }
}

const productCountController = async(req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(201).send({
            success: true,
            total
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Product Count'
        })
    }
}

//product list based on page
const productListController = async(req, res) => {
    try {
        const perPage = 8
        const page = req.params.page ? req.params.page : 1
        const products = await productModel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt: -1})

        res.status(201).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: 'Error in per page control'
        })
    }
}

//search product controller
const searchProductController = async(req, res) => {
    try {
        const {keyword} = req.params
        const result = await productModel.find({
            $or: [
                {name: {$regex :keyword, $options: "i"}},
                {description: {$regex :keyword, $options: "i"}}
            ]
        }).select('-photo')
        res.json(result)
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: 'Error in searching products'
        })
    }
}

//similar products
const relatedProductController = async(req, res) => {
    try {
        const {pid, cid} = req.params
        const products = await productModel.find({
            category: cid,
            _id: {$ne: pid},
        }).select("-photo").limit(3).populate("category")
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: 'Error in getting related products'
        })
    }
}

//category wise product
const productCategoryController = async(req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug })
        const products = await productModel.find({category}).populate('category')
        res.status(200).send({
            success: true,
            category,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: 'Error in getting category wise products'
        })
    }
}

module.exports = {createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController, productFilterController, productCountController, productListController, searchProductController, relatedProductController, productCategoryController} 