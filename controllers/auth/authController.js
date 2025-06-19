import User from "../../models/userModel.js";
import HttpError from "../../middlewares/httpError.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// registration
export const registerUser = async (req , res, next) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return next(new HttpError("Invalid data inputs passed:" +errors.array()[0].msg, 422))
        } else {

            const {username, password , image, email  , role} = req.body
    
            const existedUser = await User.findOne({email: email})

            if (existedUser) {
                return next(new HttpError('user already exist',400))
            } else {

                const hashedPassword = await bcrypt.hash(password, 12)
                const imagePath = req.file.path

                const newUser = await new User({
                    username:username,
                    email:email,
                    role:role,
                    image:imagePath,
                    password:hashedPassword
                }).save()

                if (!newUser) {
                    return next(new HttpError('registration failed',500))
                } else {
                    res.status(200).json({
                        status: true,
                        message: 'registration successful',
                        data: null
                    })
                }
            }
        }
    } catch {
        return next(new HttpError('server error',500))
    }
}

// login
export const login = async (req, res, next) => {
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()){
             return next(new HttpError("Invalid data inputs: " +errors.array()[0].msg, 422))
        } else {
       
            const {email, password} = req.body;

            const user = await User.findOne({email: email})

            if (!user) {
                 return next(new HttpError('user not found',404))
            } else {

                const isValidPassword = await bcrypt.compare(password, user.password)

                if (!isValidPassword) {
                     return next(new HttpError('invalid password',404))
                } else {
                    const token = jwt.sign(
                        {id:user._id, role:user.role}, //data to fetch
                        process.env.JWT_SECRET,
                        {expiresIn: process.env.JWT_TOKEN_EXPIRY}
                    )

                    if(!token){
                        return next(new HttpError('token generation failed', 403))
                    } else {
                        res.status(200).json({
                            status: true,
                            message: "Login successful",
                            data: {
                                id: user._id,
                                username: user.username,
                                email: user.email,
                                role: user.role,
                                image: user.image
                            },
                            token
                        });
                    }
                }
            }
        
    }
    } catch {
         return next(new HttpError('server error',500))
    }
}