const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;
const asyncHandler = require("express-async-handler");

const todoSchema = new Schema({
    title : {
        type : String,
        required : [true,"lutfen bir todo basligi giriniz"]
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    isFinished : {
        type : Boolean,
        default : false
    },
    owner : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    todoDetail : {
        type : String
    }
});

todoSchema.pre("save",async function (next) {
    try{
         // sadece oluşturulduğunda eklenecek değiştirildğinde bu işlem yapılmayacak aşagıda o ifade ediliyor !!
    
        if(!this.isModified("owner")) return next();

        const user = await User.findById(this.owner);

        user.todos.push(this._id);

        await user.save();

        next();
    }catch(err){
        return next(err);
    }
   
});


const todo = mongoose.model("Todo",todoSchema);

module.exports = todo;