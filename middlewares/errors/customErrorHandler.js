const CustomError = require("../../helpers/errors/CustomError");
const customErrorHandler = (err,req,res,next) => {
    let customError = err;
    
    if(customError.name == "SyntaxError"){
        customError = new CustomError(customError.message,400);
    }
    if(customError.name == "ValidationError"){
        customError = new CustomError(customError.message,400);
    }
    if(customError.name == "CastError"){
        customError = new CustomError("Geçerli bir id giriniz ",400);
    }
    if(customError.code == "11000"){
        // duplicate error
        customError = new CustomError("Duplicate Key Found : Check your inputs",400);
    }
    
    res.status(customError.status || 500).json({
        "success" : false,
        "message":customError.message
    })
};


module.exports = customErrorHandler;
