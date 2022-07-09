const multer = require("multer");
const path = require("path");
const CustomError = require("../../helpers/errors/CustomError");

// storage , filefilter

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        const rootDir = path.dirname(require.main.filename);
        cb(null,path.join(rootDir,"/public/uploads"));
    },
    filename : function(req,file,cb){
        // file - mimeType - image/jpg image/png ...
        const extension = file.mimetype.split("/")[1];
        req.savedProfileImage = "image_" + req.user.id + "." + extension;
        cb(null,req.savedProfileImage);
    }
});

const fileFilter = (req,file,cb) => {
    let allowedMimeTypes = ["image/jpg","image/png","image/jpeg","image/gif"];
    if(!allowedMimeTypes.includes(file.mimetype)){
        return cb(new CustomError("lutfen gecerli bir dosya turu yukleyınız",400),false);
    }
    return cb(null,true);
}

const profileImageUpload = multer({storage,fileFilter});

module.exports = profileImageUpload;