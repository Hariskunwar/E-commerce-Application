const express=require("express");
const errorHandler=require("./middlewares/errorHandler");
const CustomError=require("./utils/CustomError");
const rateLimit=require("express-rate-limit");
const helmet=require("helmet");

const limiter=rateLimit({
    max:100,
    windowMs:15*60*1000,
    message:"Too many request, Please try after one hour"
});

const app=express();

app.use(helmet());
app.use(express.json({limit:"20kb"}));
app.use(express.urlencoded({extended:false}));

//apply rate limiter
app.use("/api",limiter);

app.use("/api/v1/users",require("./routes/userRoute"));
app.use("/api/v1/products",require("./routes/productRoute"));
app.use("/api/v1/categories",require("./routes/categoryRoute"));
app.use("/api/v1/carts",require("./routes/cartRoute"));
app.use("/api/v1/coupons",require("./routes/couponRoute"));
app.use("/api/v1/orders",require("./routes/orderRoute"));

//default route handler
app.all("*",(req,res,next)=>{
    const err=new CustomError(`${req.originalUrl} route not found`,404);
    next(err);
});

app.use(errorHandler);

module.exports=app;