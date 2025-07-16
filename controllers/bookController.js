import { validationResult } from "express-validator";
import HttpError from "../middlewares/httpError.js";
import bookModel from "../models/bookModel.js";

//list all books
export const listBooks = async (req, res , next) => {
     try{
        const { userid: sellerID, role: tokenRole} = req.userdata;

        let books = []

        if (tokenRole === "buyer") {
          books = await bookModel.find({is_deleted: false})
          .populate({
            path: "seller",  //with which one add
            select: "username" //which is extra data
          })
        } else {
            books = await bookModel.find({is_deleted: false, seller: sellerID})
            .populate({
              path: "seller",
              select: "username"
            })
        }
          if (books ) {
            res.status(200).json({
              status: true,
              message: "",
              data: books 
            })
          }
        
    } catch (error) {
        return next(new HttpError('server error',500))
    }

}

// view sellers book
// export const listSellerBook = async (req, res, next) => {
//     const {userid: sellerID, role: tokenRole} = req.userdata;

//     if (tokenRole !== "seller") {
//         return next(new HttpError('Access denied',403))
//     }

//     try{
//             const sellerBook = await bookModel.find({is_deleted: false, seller: sellerID})
//              if (!sellerBook) {
//                  return next(new HttpError('no data found',404))
//              } else {
//                 return res.status(200).json({
//                     status:true,
//                     data:sellerBook
//                 })
//              }
        
//     } catch {
//             return next(new HttpError('server error',500))
//     }
// }


// view one book
export const getOneBook = async (req, res, next) => {
  const id = req.params.id;
  const {userid: sellerID, role: tokenRole} = req.userdata

  try {

    let foundBook

     if (tokenRole === "buyer") {
        foundBook = await bookModel.findOne({ _id: id, is_deleted: false })
        .populate({
        path: "seller",
        select: "username"
      })
      
    } else {
      foundBook = await bookModel.findOne({ _id: id, is_deleted: false, seller: sellerID })
      .populate({
        path: "seller",
        select: "username"
      })
    }

    if (!foundBook) {
      return next(new HttpError('Book not found', 404)); 
    } else {
      res.status(200).json({
        status: true,
        message: "",
        data: foundBook
      });
    }
    

  } catch (error) {
    return next(new HttpError('Server error', 500));
  }
};



// view one book for seller
// export const getSingleBook = async (req, res, next) => {
//   const id = req.params.id;
//   const { userid: sellerID, role: tokenRole } = req.userdata;

//   if (tokenRole !== "seller") {
//     return next(new HttpError("Access denied. Only sellers can view this book.", 403));
//   }

//   try {
//     const foundBook = await bookModel.findOne({
//       _id: id,
//       is_deleted: false,
//       seller: sellerID
//     });

//     if (!foundBook) {
//       return next(new HttpError("Book not found or access denied.", 404));
//     }

//     res.status(200).json({
//       status: true,
//       data: foundBook
//     });
//   } catch (error) {
//     return next(new HttpError("Server error while fetching the book.", 500));
//   }
// };


// add books
export const addNewBook = async (req, res, next) => {
    try{
       const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(new HttpError("Invalid data inputs passed:" +errors.array()[0].msg, 422))
            } else {
              const {
                      title,
                      authorname, 
                      description, 
                      price, 
                      stock,
                      rating,
                      category} = req.body;

                  const {userid: sellerID, role:tokenRole} = req.userdata;

                  if (tokenRole !== "seller"){
                      return next(new HttpError('invalid',404))
                  } else {
                  const imagePath = req.file.path
              
                  const newBook = await new bookModel(
                      {
                          title,
                          authorname, 
                          image:imagePath,
                          description,
                          price, 
                          stock, 
                          rating,
                          category,
                          seller:sellerID
                      }).save()
                      

                      if (!newBook) {
                          return next(new HttpError('no data found',400))
                      } else {
                          return res.status(200).json({
                              status: true,
                              message: 'product added successfully',
                              data: null
                          })
                      }
                  }
            }
    } catch (error) {
        return next(new HttpError('server error',500))
       
    }

};


// delete a product
export const deleteBooks = async (req, res, next) => {
    try {
      const id = req.params.id;
      const { userid: sellerID, role: tokenRole } = req.userdata;

      // Only sellers can delete
      if (tokenRole !== "seller") {
          return next(new HttpError("Access denied. Only sellers can delete books.", 403));
      } else {
        const deletedBook = await bookModel.findOneAndUpdate(
            { _id: id, is_deleted: false, seller: sellerID},
            {is_deleted: true},
            {new: true}
        )
    
        if (!deletedBook) {
            return next(new HttpError("Book not found or not owned by you", 404))
        } else {
            res.status(200).json({
              status: true,
              message:'Book deleted successfully ',
              data: null
            })
        }
      }
    } catch (error) {
        return next(new HttpError('server error',500))
    }
}

//update books
export const updateBooks = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { userid: sellerID, role: tokenRole } = req.userdata;
    const updateData = { ...req.body }
    
         if (req.file) {
          updateData.image = req.file.path; 
         }

    if (tokenRole !== "seller") {
      return next(new HttpError("Access denied. Only sellers can update books.", 403));
    } else {

      const updatedBook = await bookModel.findOneAndUpdate(
        { _id: id, is_deleted: false, seller: sellerID },
        updateData,
        { new: true }
      );
  
      if (!updatedBook) {
        return next(new HttpError("Book not found or not owned by you", 404));
      } else {
        res.status(200).json({
          status: true,
          message: "Book updated successfully",
          data: null
        });
      }
    }
  } catch (error) {
    return next(new HttpError("Server error", 500));
  }
};
