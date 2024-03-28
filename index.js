const express = require("express")
const app = express()
const mongoose = require ("mongoose")
const dotenv = require('dotenv')
dotenv.config()
const authRoutes = require("./routes/auth")
const roomRoutes = require("./routes/room")
const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 4000
const cors = require("cors");
app.use(cors());
app.use(express.json())
app.use("/auth",authRoutes)
app.use("/room",roomRoutes)

mongoose.connect(MONGODB_URI).then(()=>{
    console.log('Connected to MongoDb')
    app.listen(PORT,()=>{
       console.log(`server is running on port ${PORT}`)
    })
}).catch( err => {
    console.log('Error connecting to database:',err)
}
)