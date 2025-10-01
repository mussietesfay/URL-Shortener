
/// <reference path="../@types/express.d.ts"/>

import {Request , Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';
import jwt from 'jsonwebtoken';
const {TokenExpiredError , JsonWebTokenError, NotBeforeError} = jwt;

export const authMiddle = async(req:Request , res:Response , next:NextFunction):Promise<void> =>{
  
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
       res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Unauthorized: No token provided." });
        return;
    }
  
    const token:string = authHeader.split(' ')[1] as string;

    if(!token){
     res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Unauthorized: Token is missing."});
      return;  
    }

    try {
        const decode = jwt.verify(token , process.env.SECRET_KEY as string ) as {user:string, id:string}
       req.user ={
        user:decode.user,
        id:decode.id
       }
       console.log(req.user)
       next();
    } catch (error:unknown) {
     if(error instanceof TokenExpiredError){
            res.status(StatusCodes.BAD_REQUEST).json({msg:"Unauthorized: Token has expired."});
            return;
        }
       if(error instanceof JsonWebTokenError){
            res.status(StatusCodes.UNAUTHORIZED).json({msg: "Unauthorized: Invalid token."});
            return;
        }  
       if(error instanceof NotBeforeError){
            res.status(StatusCodes.FORBIDDEN).json({msg: "Forbidden: Token is not active yet."});
            return;
        }
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "An unexpected error occurred" , error: String(error)});
     return;
    
    }
}