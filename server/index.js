const express= require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const postroute= require('./routes/post')
const userroute= require('./routes/user')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')

const app=express()
app.use(bodyParser.json({ limit: '100mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["https://charlog.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true
}));

mongoose.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.DB_PASSWORD}@cluster0.w7gbj.mongodb.net/`).then(()=>{
    console.log('mongodb connected');
})

app.use(postroute)
app.use(userroute)

app.listen(3000,()=>{
    console.log('server is running on port 3000');
})