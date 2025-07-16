import { Router } from 'express'
import { addNewBook, listBooks, deleteBooks, updateBooks, getOneBook } from '../controllers/bookController.js';
import userAuthCheck from '../middlewares/userAuthCheck.js';
import { check } from 'express-validator';
import upload from '../middlewares/fileUpload.js';


const bookRoutes = Router();

bookRoutes.use(userAuthCheck)

bookRoutes.get('/list', listBooks )
bookRoutes.get('/view/:id', getOneBook)
// bookRoutes.get('/list/:id', getOneBook)

bookRoutes.post('/add',upload.single('image'), [
    check("title")
         .notEmpty().withMessage("Title is required"),
    check("authorname")
         .notEmpty().withMessage("Author name is required"),
    check("image")
    .custom((value, { req }) => {
            if (!req.file) {
                throw new Error("Image file is required");
            }
            return true;
        }),
        //  .notEmpty().withMessage("Image is required"),
    check("description")
         .notEmpty().withMessage("Description is required"),
    check("price")
        .notEmpty().withMessage("Price is required")
        .isNumeric().withMessage("Price must be a number"),
    check("stock")
        .notEmpty().withMessage("Stock is required")
        .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
    check("rating")
        .optional()
        .isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),
    check("category").notEmpty().withMessage("Category is required"),
] ,addNewBook)

bookRoutes.patch('/update/:id', upload.single('image'), [
    check("title").optional().notEmpty().withMessage('title is required'),
    check("image")
    .optional()
    .custom((value, { req}) => {
        if (!req.file) {
            throw new console.error('image is required');
     
        }
    }),
    // .notEmpty().withMessage("image is required"),
    check("authorname").optional().notEmpty().withMessage("authorname is required"),
    check("description").optional().notEmpty().withMessage("description is required"),
    check("price").optional().notEmpty().withMessage("price is required"),
    check("stock").optional().notEmpty().withMessage("stock is required"),
    check("rating")
    .optional()
    .notEmpty().withMessage("Rating is required ")
    .isFloat({ min: 1, max: 5 }).withMessage("Rating must be a number between 1 and 5"),
    check("category").notEmpty().withMessage("category is required"),
],updateBooks)

bookRoutes.delete('/delete/:id', deleteBooks)
// bookRoutes.get('/listsellerbook', listSellerBook)
// bookRoutes.get('/sellerview/:id', getSingleBook)

export  default bookRoutes;