import mongoose from "mongoose";
import HttpError from "../middlewares/httpError.js";
import User from "../models/userModel.js";
import { validationResult } from "express-validator";

//view profile 
export const viewProfile = async (req, res, next) => {
    try{
       const {userid } = req.userdata

        const userViewProfile = await User.findById(userid).select("-password")

        if (!userViewProfile) {
            return next(new HttpError('no data found',404))
        } else {
            return res.status(200).json({
                status:true,
                message: "",
                data: userViewProfile
            })
        }
    } catch {
        return next(new HttpError('server error',500))
    }
}


//edit profile
export const editProfile = async (req, res, next) => {
  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
     return next(new HttpError("Invalid data inputs passed, please try again", 422))
    } else {
      
    const { username, email } = req.body;
    const { userid } = req.userdata;
    const imagePath = req.file ? req.file.path : null;

    const updatedData = {
      username,
      email
    }

    if(imagePath){
      updatedData.image = imagePath  //it work only when we add a img
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userid },
      updatedData,
      { new: true }
    );

    if (!updatedUser) {
      return next(new HttpError('User not found', 404));
    } else {
      return res.status(200).json({
        status: true,
        message: 'Profile updated successfully',
        data: null
      });
    }
  }
  } catch (error) {
    return next(new HttpError('Server error', 500));
  }
};

