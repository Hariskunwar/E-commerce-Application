const express=require("express");

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/api/v1/users",require("./routes/userRoute"));

module.exports=app;