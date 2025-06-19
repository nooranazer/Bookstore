import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';
import HttpError from './httpError.js';

const userAuthCheck = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (! token) {
    //   throw new Error("Authentication Failed!", 403);
        return next(new HttpError("Authentication Failed", 403))
    } else {

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decodedToken.id, role: decodedToken.role })
  
      if (! user) {
        return next(new HttpError("Invalid credentials", 400))
      } else {
        req.userdata = { userid : decodedToken.id , role : decodedToken.role }; 
        next();
      }
    }
  } catch (err) {
    console.error(err)
    return next(new HttpError("Authentication failed", 403));
  }
};

export default userAuthCheck;