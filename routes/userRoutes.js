import express from 'express'
import {check} from 'express-validator'
import { registerUser, login } from '../controllers/auth/authController.js'
import { editProfile, viewProfile } from '../controllers/userController.js'
import userAuthCheck from '../middlewares/userAuthCheck.js'
import upload from '../middlewares/fileUpload.js'

const userRoutes = express.Router()

userRoutes.post('/register', upload.single('image'), [
    check("username").notEmpty().withMessage("username is required"),
    check("email").isEmail().withMessage("Email is required"),
    check("role").notEmpty().withMessage("Role is required"),
    check("password").notEmpty().withMessage("Password is required"),
    check("image")
    .custom((value, { req }) => {
        if (!req.file) {
            throw new Error('image file is required')
        }
        return true
    })
    // .notEmpty().withMessage("Image is required")
] ,registerUser)

userRoutes.post('/login', [
    check("email").isEmail().withMessage("Email is required"),
    check("password").notEmpty().withMessage("Password is required"),
]  ,login)

userRoutes.use(userAuthCheck) //accessing middleware

userRoutes.get('/viewprofile/:id', viewProfile)
userRoutes.patch('/editprofile/:id', upload.single('image'),[
    check("username").optional().notEmpty().withMessage("name is required"),
    check("email").optional().isEmail().withMessage("Email is required"),
    check("image")
    .optional()
    .custom((value, { req }) => {
        if (!req.file) {
            throw new Error('image file is required')
        }
        return true
    })
    // .notEmpty().withMessage("Image is required")
] ,editProfile)


export default userRoutes