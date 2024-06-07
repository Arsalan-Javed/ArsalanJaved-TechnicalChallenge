import zod from "zod"
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import httpStatus, { OK } from "http-status";
import { validationErrorMessage } from "../utils/ValidationError";
import prisma from "../client";
import { UserRoles } from "../utils/Globals";

const signInBody = zod.object({
    username: zod.string(validationErrorMessage('User name')),
    password: zod.string(validationErrorMessage('Password'))
});

//@desc   SignIn User
//@route  POST user/signin
//@access public
export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bodyParse = signInBody.safeParse(req.body);
    if (!bodyParse.success) {
      return res.status(400).json({
        message: "Error when logging in",
        error: bodyParse.error.formErrors.fieldErrors,
      });
    }
    const { username, password } = req.body;
    const user = await prisma?.user.findFirst({
          where: {
              username,
              password,
          }
      })
      if (user) {
          return res.status(OK).json({user})
      }else{
          new ApiError(httpStatus.BAD_REQUEST, "Some error occured")
      }
  } catch (err) {
    return next(new ApiError(httpStatus.BAD_REQUEST, "Some error occured"));
  }
};

//@desc   SignUp User
//@route  GET user/signup
//@access public
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.user.createMany({
        data:[
            { username: 'partyA', password:'123', user_role:UserRoles.SUBMITTER },
            { username: 'partyB', password:'123', user_role:UserRoles.RECEIVER },
        ]
    });
    return res.status(OK).json({msg: 'Users added'})
  } catch (err) {
    return next(new ApiError(httpStatus.BAD_REQUEST, "Some error occured"));
  }
};
  