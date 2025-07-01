import express from 'express'
import {check} from 'express-validator'
import { editProfile, viewProfile } from '../controllers/userController.js'
import userAuthCheck from '../middlewares/userAuthCheck.js'
import upload from '../middlewares/fileUpload.js'

const userRoutes = express.Router()

userRoutes.use(userAuthCheck) //accessing middleware

userRoutes.get('/viewprofile', viewProfile)
userRoutes.patch('/editprofile', upload.single('image'),[
    check("username").optional().notEmpty().withMessage("name is required"),
    check("email").optional().isEmail().withMessage("Email is required"),
     check("image")
    .optional()
    // .custom((value, { req}) => {
    //     if (!req.file) {
    //         throw new console.error('image is required');
     
    //     }
    // }),
    // .notEmpty().withMessage("Image is required")
] ,editProfile)


export default userRoutes