const express = require('express');
const dbConnect = require('./config/dbConfig');
const cors = require('cors');
const router = require('./routes');

const app = express();
require('dotenv').config();
app.use(express.urlencoded({extended: false}));

dbConnect();
app.get('/',(req,res)=>{
    res.send(`Server is running on PORT ${process.env.PORT}`);
});

//middlewares
app.use(express.json());
app.use(cors())


//auth, admin & user Routes
app.use('/api/v1',router);

app.listen(process.env.PORT,()=>{
    console.log(`Server running on PORT ${process.env.PORT}`);
});