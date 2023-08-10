const express = require('express')
const router = express.Router()

const formidable = require('express-formidable');

const { requireSignIn, isAdmin } = require('../middleware/authMiddleware')

const { 
    createProductController, 
    getProductController, 
    getSingleProductController, 
    productPhotoController, 
    deleteProductController, 
    updateProductController, 
    productFilterController, 
    productCountController, 
    productListController, 
    searchProductController, 
    relatedProductController, 
    productCategoryController
} = require('../controllers/productController')

//create-product
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

//get products
router.get('/get-product', getProductController)

//single product
router.get('/get-product/:slug', getSingleProductController)

//get photo
router.get('/product-photo/:pid', productPhotoController)

//delete photo
router.delete('/delete-product/:pid', deleteProductController)

//update product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

//filters
router.post('/filter-products', productFilterController)

//product count
router.get('/product-count', productCountController)

//product per page
router.get('/product-list/:page', productListController)

//search product
router.get('/search/:keyword', searchProductController)

//similar product
router.get('/related-product/:pid/:cid', relatedProductController)

//category wise product
router.get('/product-category/:slug', productCategoryController)

module.exports = router