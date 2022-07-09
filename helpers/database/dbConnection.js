const mongoose = require("mongoose");

const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_URI,null,(err)=>{
        if(!err){
            console.log("mongo connection is created ");
        }
    });
}

module.exports = connectDatabase;

