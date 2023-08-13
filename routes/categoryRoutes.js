const express = require('express')
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware')
const { createCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteCategoryController } = require('../controllers/categoryContoller')

const router = express.Router()

//cretae category
router.post('/create-category', requireSignIn, isAdmin, createCategoryController)

//update category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)

//get all category
router.get('/get-category', categoryController)

//get single category
router.get('/get-category/:slug', singleCategoryController)

//delete category
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController)

module.exports = router