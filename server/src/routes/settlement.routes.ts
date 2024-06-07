import express from "express";
import { createSettlements, getSettlements, updateSettlements, updateSettlementsByReceiver } from "../controllers/settlement.controller";

export const settlementRouter = express.Router();

settlementRouter
    .route("/")
    .get(getSettlements)
    .post(createSettlements)
    .patch(updateSettlements)

settlementRouter
    .route("/update")
    .post(updateSettlementsByReceiver)
