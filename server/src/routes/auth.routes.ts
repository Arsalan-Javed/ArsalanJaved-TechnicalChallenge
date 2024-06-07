import express from "express";
import { signin, signup } from "../controllers/auth.controller";

export const authRouter = express.Router();

authRouter
    .route("/signin")
    .post(signin);

authRouter
    .route("/signup")
    .get(signup);