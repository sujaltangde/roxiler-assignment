 
const app = require('./app.js')
const dotenv = require('dotenv')
dotenv.config({path:"./config/config.env"})
const connectDatabase = require('./config/database.js')


connectDatabase() ;




const server = app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})