import { Router } from "express";
import { getUsers,createUser,updateUser,deleteUser,getUser } from "../controller/userController.js";

const router = Router()

router.get("/",getUsers)
router.get("/:id",getUser)
router.post("/",createUser)

router.put("/:id",updateUser)

router.delete("/:id",deleteUser)

export default router