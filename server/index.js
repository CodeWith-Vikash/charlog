const express= require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const postroute= require('./routes/post')
const userroute= require('./routes/user')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const compression = require('compression')

const app=express()

app.use(cors({
    origin: "https://charlog.vercel.app",
    credentials: true, // Allow cookies and credentials to be sent
}));

app.use(compression({
    level:6,
    threshold:10*1000
}))
app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser())



mongoose.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.DB_PASSWORD}@cluster0.w7gbj.mongodb.net/`).then(()=>{
    console.log('mongodb connected');
})

app.use(postroute)
app.use(userroute)

app.listen(3000,()=>{
    console.log('server is running on port 3000');
})
