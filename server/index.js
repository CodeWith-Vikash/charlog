const express= require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const postroute= require('./routes/post')
const userroute= require('./routes/user')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')

const app=express()
app.use(cors({
    origin: "https://charlog.vercel.app", // Allow requests from your frontend domain
    credentials: true, // Allow cookies to be sent
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed methods
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
    optionsSuccessStatus: 200 // For legacy browser support
}));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
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
