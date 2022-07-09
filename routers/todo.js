const express = require("express");
const {getAccessToRouter,ownerControl} = require("../middlewares/authorization/auth");
const {createTodo,deleteTodo,getSingleTodo,getAllTodo,updateTodo,completeTodo} = require("../controller/todo");
const router = express.Router();


router.get("/show/:id",[getAccessToRouter,ownerControl],getSingleTodo);
router.get("/all",[getAccessToRouter],getAllTodo); // her kullanıcı kendi todo listesini gorecek
router.post("/create",[getAccessToRouter],createTodo);
router.delete("/delete/:id",[getAccessToRouter,ownerControl],deleteTodo);
router.put("/update/:id",[getAccessToRouter,ownerControl],updateTodo);
router.get("/complete/:id",[getAccessToRouter,ownerControl],completeTodo);

module.exports = router;