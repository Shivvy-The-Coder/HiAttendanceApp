import express from "express";
import userAuth from "../middleware/userauth";

const userRouter =express.Router();

userRouter.get('/data', userAuth,getUserData);
export default userRouter;