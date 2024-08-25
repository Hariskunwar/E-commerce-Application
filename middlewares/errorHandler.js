const CustomError=require("../utils/CustomError");

const developmentError=(res,error)=>{
    res.status(error.statusCode).json({
        status:error.status,
        message:error.message,
        stackTrace:error.stack,
        error:error
    });
}

const productionError=(res,error)=>{
    if(error.isOperational){
        res.status(error.statusCode).json({
            status:error.status,
            message:error.message
        })
    }else{
        res.status(500).json({
            status:"error",
            message:"Something went wrong, please try later"
        })
    }
}

const castErrorHandler=(error)=>{
    const msg=`Invalid value for ${error.path} : ${error.value}`;
    return new CustomError(msg,400);
}

const duplicateKeyErrorHandler=(error)=>{
    if(error.keyValue.email){
        const msg=`There is already a user with email ${error.keyValue.email}`;
        return new CustomError(msg,400);
    }
    else if(error.keyValue.phone){
        const msg=`There is already a user with mobile ${error.keyValue.phone}`;
        return new CustomError(msg,400);
    }
}

const validationErrorHandler=(error)=>{
    const errorMessage=Object.values(error.errors).map(val=>val.message)[0];
    const msg=`Invalid input data : ${errorMessage}`;
    return new CustomError(msg,400);
}

const handleExpiredJwt=(err)=>{
    return new CustomError("Jwt has expired",401);
}

const handleJwtError=(err)=>{
return new CustomError("Invalid token, please login again",401);
}

module.exports=(error,req,res,next)=>{
    error.statusCode=error.statusCode||500;
    error.status=error.status||"error";
    if(process.env.NODE_ENV==='development'){
        developmentError(res,error);
    }
    else if(process.env.NODE_ENV==='production'){
        
        if(error.name==="CastError"){
            error=castErrorHandler(error)
        }

        if(error.code===11000){
            error=duplicateKeyErrorHandler(error);
        }

        if(error.name==='ValidationError'){
            error=validationErrorHandler(error);
        }

        if(error.name==='TokenExpiredError'){
            error=handleExpiredJwt(error);
        }
        if(error.name==='JsonWebTokenError'){
            error=handleJwtError(error)
        }

        productionError(res,error);
    }
}