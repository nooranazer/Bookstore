import express from 'express'
import cors from 'cors'
import dotenv, { config } from 'dotenv'
import connectDB from './data/connectDB.js'
import bookRoutes from './routes/bookRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;

connectDB()



//middlewares
app.use('/uploads', express.static('uploads'))
app.use(express.json())
app.use(cors())
app.use('/api/books', bookRoutes )
app.use('/api/user',userRoutes)



// Custom error handler
app.use((error, req, res, next) => {
  res.status(error.code || 500).json({
    message: error.message || "An unknown error occurred!",
    status: false
  });
});


// starting server
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})




export default app