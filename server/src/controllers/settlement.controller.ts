import zod from "zod"
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import httpStatus, { NOT_ACCEPTABLE, OK } from "http-status";
import { validationErrorMessage } from "../utils/ValidationError";
import prisma from "../client";
import { SettlementStatus } from "../utils/Globals";


const createSettlement = zod.object({
    user_id: zod.string(validationErrorMessage('User id')),
    amount: zod.string(validationErrorMessage('Amount'))
});
const updateSettlement = zod.object({
    id: zod.string(validationErrorMessage('Settlement id')),
    amount: zod.string(validationErrorMessage('Amount'))
});
const receiverUpdateSettlement = zod.object({
    id: zod.string(validationErrorMessage('Settlement id')),
    status: zod.string(validationErrorMessage('Status'))
});

//@desc   Get Settlements
//@route  Get settlement/
//@access restricted
export const getSettlements = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const settled = await prisma?.settlements.findMany({
            where:{
                status: SettlementStatus.SETTLED
            }
        });
        const not_settled = await prisma?.settlements.findMany({
            where:{
                OR: [
                    {status: SettlementStatus.DISPUTED},
                    {status: SettlementStatus.SUBMITTED}
                ]   
            }
        });

        return res.status(OK).json({settled,not_settled})
    } catch (err) {
      return next(new ApiError(httpStatus.BAD_REQUEST, "Some error occurred"));
    }
};

//@desc   Create Settlements
//@route  POST settlement/
//@access restricted
export const createSettlements = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bodyParse = createSettlement.safeParse(req.body);
        if (!bodyParse.success) {
          return res.status(400).json({
            message: "Invalid Body",
            error: bodyParse.error.formErrors.fieldErrors,
          });
        }
        const { user_id, amount } = req.body;
        const response = await prisma?.settlements.create({
            data:{
                submitter_id: user_id,
                amount: amount,
                status: SettlementStatus.SUBMITTED
            }
        });
        return res.status(OK).json(response)
    } catch (err) {
      return next(new ApiError(httpStatus.BAD_REQUEST, "Some error occurred"));
    }
};

//@desc   Update Settlements
//@route  PATCH settlement/
//@access restricted
export const updateSettlements = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bodyParse = updateSettlement.safeParse(req.body);
        if (!bodyParse.success) {
          return res.status(400).json({
            message: "Invalid Body",
            error: bodyParse.error.formErrors.fieldErrors,
          });
        }
        const { id, amount } = req.body;
        const settlement = await prisma.settlements.findFirst({
            where:{
                id
            }
        });

        if (settlement?.status === SettlementStatus.SETTLED) {
            return res.status(NOT_ACCEPTABLE).json({message: 'This is already settled, cannot update anymore.'})
        }
        if (settlement?.status === SettlementStatus.DISPUTED) {
            res.json({message: 'This settlement is disputed.', type:'warn'})
        }

        const response = await prisma?.settlements.update({
            where: {
                id
            },
            data:{
                amount,
                status: SettlementStatus.SUBMITTED
            }
        });
        return res.status(OK).json(response)
    } catch (err) {
      return next(new ApiError(httpStatus.BAD_REQUEST, "Some error occurred"));
    }
};

//@desc   Update Settlements By Receiver
//@route  POST settlement/update
//@access restricted
export const updateSettlementsByReceiver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bodyParse = receiverUpdateSettlement.safeParse(req.body);
        if (!bodyParse.success) {
          return res.status(400).json({
            message: "Invalid Body",
            error: bodyParse.error.formErrors.fieldErrors,
          });
        }
        const { id, status } = req.body;
        const response = await prisma?.settlements.update({
            where: {
                id,
            },
            data:{
                status,
            }
        });
        return res.status(OK).json(response)
    } catch (err) {
      return next(new ApiError(httpStatus.BAD_REQUEST, "Some error occurred"));
    }
};