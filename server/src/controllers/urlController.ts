

import {Request , Response} from "express";
import   UrlShorten from '../model/schema.js'
import {StatusCodes} from 'http-status-codes'



// post request-responed for shortenUrl
const shortenUrl = async(req:Request , res:Response):Promise<void>=>{
    const {longUrl} = req.body;

    if(!longUrl){
        res.status(StatusCodes.BAD_REQUEST).json({msg:"longUrl is required"});
        return;
    }

    try {
       const url = await UrlShorten.findOne({longUrl});
       if(url){
        res.status(StatusCodes.BAD_REQUEST).json({msg: "longUrl already exist"});
        return;
       }

       const newUrl = new UrlShorten({longUrl});
       await newUrl.save();
       res.status(StatusCodes.CREATED).json({msg:'Success! Here is your short URL:', shortenUrl:newUrl.shortenUrl})
    } catch (error:unknown) {
        console.error(error)
     if(error instanceof Error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "something went wrong", error:error.message})
     }else{
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "something went wrong", error:"An unknown error occurred"})
     }  
    }
};


 // get request-responed for getOriginalUrl
const getOriginalUrl = async(req:Request , res:Response):Promise<void>=>{
    const {shortUrl} = req.params;
    if(!shortUrl){
        res.status(StatusCodes.BAD_REQUEST).json({msg:"shortUrl is required"});
        return;
    }
   
    try {
        const getUrl = await UrlShorten.findOne({shortenUrl:shortUrl});
        if(!getUrl){
        res.status(StatusCodes.BAD_REQUEST).json({msg:"please enter valid shortUrl"});
        return; 
        }
     res.status(StatusCodes.OK).json({msg: "Here is your longUrl" , longUrl:getUrl.longUrl})

    } catch (error:unknown) {
     console.error(error)
     if(error instanceof Error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "something went wrong", error:error.message})
     }else{
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "something went wrong", error:"An unknown error occurred"})
     }  
    }
    
}



// get request-responed for listUrls
const listUrls = async(req:Request , res:Response):Promise<void>=>{
    
    try {
     const allUrls = await UrlShorten.find({});
     const formattedUrls = allUrls.map(url =>({
        longUrl: url.longUrl,
        shortenUrl: url.shortenUrl
     }));
     
     res.status(StatusCodes.OK).json({msg: "Here is all list of urls", data:formattedUrls})
        
    } catch (error:unknown) {
    console.error(error)
     if(error instanceof Error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "something went wrong", error:error.message})
     }else{
       res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "something went wrong", error:"An unknown error occurred"})
     }  
        
    }
}


export {shortenUrl , getOriginalUrl , listUrls}