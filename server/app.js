 
const express = require('express')
const cors = require('cors')
const app = express()



app.use(express.json())
app.use(cors({
    origin: "*",
    credentials: true 
}))



const transaction = require('./routes/transactionRoute')


app.use("/api/v1",transaction);



app.get('/',(req,res)=>{
    res.json("I am working")
})


module.exports = app ;