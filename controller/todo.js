const Todo = require("../models/Todo");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const {validateTodoInputs} = require("../helpers/input/validateInput");
const CustomError = require("../helpers/errors/CustomError");

const getSingleTodo = asyncHandler(async(req,res,next) => {

    const todoId = req.params.id;

    const todo = await Todo.findById(todoId);
    
    if(!todo){
        return next(new CustomError("Todo bulunamadı !",400));
    }

    res.status(200)
    .json({
        success : true,
        todo : todo
    });


});
const getAllTodo = asyncHandler(async(req,res,next) => {

    const user = await User.findOne({username : req.user.username});
    
    if(!user){
        return next(new CustomError("Kullanıcı çekme hatası !",500));
    }

    const todos = [];
    for(let todoId of user.todos){
        let todo = await Todo.findById(todoId);
        todos.push(todo);
    }

    res.status(200)
    .json({
        success : true,
        todos : todos
    });


});
const createTodo = asyncHandler(async(req,res,next) => {
    const {title,todoDetail} = req.body;
    const owner = req.user.id;
    if(!validateTodoInputs(title,todoDetail)){
        return next(new CustomError("Baslik ve detay kisimlarini bos birakma !",400));
    }

    const todo = await Todo.create({title,todoDetail,owner});
    
    if(!todo) {
        return next(new CustomError("Todo olusturma hatasi !",500));
    }

    res.status(200)
    .json({
        success : true,
        data : todo
    });

        
});

const deleteTodo = asyncHandler(async(req,res,next) => {
    
    const id = req.params.id;

    const deleteProcess = await Todo.findByIdAndRemove(id);
    
    if(!deleteProcess){
        return next(new CustomError("Silme hatasi !",400));
    }
    
    const user = await User.findById(req.user.id);
    
    user.todos.splice(user.todos.indexOf(id),1);
    
    await user.save();

    res.status(200)
    .json({
        success : true,
        message : "todo silindi !"
    });


});
const updateTodo = asyncHandler(async(req,res,next) => {
    const {title,todoDetail} = req.body;
    const todoId = req.params.id;

    if(!validateTodoInputs(title,todoDetail)){
        return next(new CustomError("Baslik ve detay kisimlarini bos birakma !",400));
    }

    const todo = await Todo.findByIdAndUpdate(todoId,{title,todoDetail},{new:true});

    res.status(200)
    .json({
        success : true,
        data : todo
    });

        
});
const completeTodo = asyncHandler(async(req,res,next) => {

    const todoId = req.params.id;


    const todo = await Todo.findById(todoId);
    
    if(!todo){
        return next(new CustomError("Todo bulunamadı !",400));
    }

    if(!todo.isFinished){
        todo.isFinished = true;
        await todo.save();
    }else{
        return next(new CustomError("Todo zaten tamamlanmis. Baska bir todoyu tamamlayiniz !",400));
    }

    res.status(200)
    .json({
        success : true,
        data : todo
    });

        
});
module.exports = {
    createTodo,
    deleteTodo,
    getSingleTodo,
    getAllTodo,
    updateTodo,
    completeTodo
}