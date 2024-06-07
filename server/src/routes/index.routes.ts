import express from "express";
import { authRouter } from "./auth.routes";
import { settlementRouter } from "./settlement.routes";
const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/settlement", settlementRouter);

export default rootRouter