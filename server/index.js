const express= require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const postroute= require('./routes/post')
const userroute= require('./routes/user')
const uploadroute= require('./routes/upload')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const dotenv= require('dotenv')

const app=express()
dotenv.config();
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET','POST','PATCH','DELETE'],
    credentials: true
}));

app.use(bodyParser.json());
app.use(express.json())
app.use(cookieParser())



mongoose.connect(process.env.CONNECTION_URI).then(()=>{
    console.log('mongodb connected');
})

app.use(postroute)
app.use(userroute)
app.use(uploadroute)

const port= process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
