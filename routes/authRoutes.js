import {Router} from 'express'
import {check} from 'express-validator'
import { registerUser, login } from '../controllers/auth/authController.js'
import upload from '../middlewares/fileUpload.js'

const authRoutes = Router()

authRoutes.post('/register', upload.single('image'), [
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

authRoutes.post('/', [
    check("email").isEmail().withMessage("Email is required"),
    check("password").notEmpty().withMessage("Password is required"),
]  ,login)

export default authRoutes