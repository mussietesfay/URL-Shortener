

import {Response} from 'express';
import {StatusCodes} from 'http-status-codes'

export const handleError = (res:Response , error:unknown):void=>{
     console.error(error)
    if(error instanceof Error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "something went wrong", error:error.message})
     }else{
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "something went wrong", error:"An unknown error occurred"})
     } 
};