const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {
        type: String,
        required : [true,"lutfen bir kullanici adi belirleyiniz"],
        minLength : [6,"lutfen en az 6 karakter kullanici adi belirleyiniz "],
        unique : true
    },
    email : {
        type : String,
        required : [true,"lutfen bir email belirleyiniz "],
        unique : true,
        match : [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,"lutfen gecerli bir email adresi belirleyiniz "]
    },
    password : {
        type : String,
        required : [true,"lutfen bir sifre belirtiniz "],
        minLength : [6,"lutfen en az 6 karakter sifre belirleyin "],
        select : false
    }, 
    todos : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Todo"
        }
    ],
    isActive : {
        type : Boolean,
        default : false
    },
    createdAt : {
        type : Date,
    },
    profileImage : {
        type : String,
        default : "default.png"
    },
    resetPasswordToken: {
        type : String
    },
    resetPasswordExpıre : {
        type : Date
    }
});

userSchema.methods.generateJWTFromUser = function(){
    const {JWT_EXPIRE,JWT_SECRET_KEY} = process.env;

    const payload = {
        id : this.id,
        username : this.username,
        email : this.email
    };

    const access_token = jwt.sign(payload,JWT_SECRET_KEY,{
        expiresIn : JWT_EXPIRE
    });
    return access_token;
}

userSchema.pre("save",function(next){
    if(!this.isModified("password")){
        next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if(err) next(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
            // Store hash in your password DB.
            if(err) next(err);
        
            this.password = hash;
            next();
        });
    });
});


const user = mongoose.model("User",userSchema);


module.exports = user;
