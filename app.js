const express=require("express");
const errorHandler=require("./middlewares/errorHandler");
const CustomError=require("./utils/CustomError");

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/api/v1/users",require("./routes/userRoute"));

//default route handler
app.all("*",(req,res,next)=>{
    const err=new CustomError(`${req.originalUrl} route not found`,404);
    next(err);
});

app.use(errorHandler);

module.exports=app;