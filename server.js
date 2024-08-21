require("dotenv").config({path:'config/config.env'});
const app=require('./app');
const dbConnect = require("./config/dbConnect");
dbConnect();


const PORT=process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log(`Server listening on : ${PORT}`);
    })