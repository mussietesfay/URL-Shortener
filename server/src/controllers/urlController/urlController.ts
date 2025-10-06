

import {Request , Response} from "express";
import   UrlShorten from '../../model/urlSchema.js'
import {StatusCodes} from 'http-status-codes'
import {isValidUrl} from '../../utils/urlValidator.js'
import {isValidateLongUrl} from '../../utils/inputValidator.js'
import {handleError} from '../../utils/errorHandler.js'



// post request-responed for shortenUrl
const shortenUrl = async(req:Request , res:Response):Promise<void>=>{
  const {user , id} = req.user || {};
  const {longUrl} = req.body;
    
    
   

    if(!isValidateLongUrl(longUrl)){
        res.status(StatusCodes.BAD_REQUEST).json({msg:"url is required"});
        return;
    }
     
    if(!isValidUrl(longUrl)){
      res.status(StatusCodes.BAD_REQUEST).json({msg:"inValid url"});
        return;
    }

    try {
       const url = await UrlShorten.findOne({longUrl});
       if(url){
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: "url already exist",
          shortenUrl: url.shortenUrl,
          username: url.username
        });
        return;
       }

       const newUrl = new UrlShorten({
        longUrl,
        userId:id, 
        username:user
      });
       await newUrl.save();
       res.status(StatusCodes.CREATED).json({
        msg:'Success! Here is your short URL:', 
        shortenUrl:newUrl.shortenUrl,
        username: newUrl.username
      })
    } catch (error:unknown) {
       handleError(res , error) 
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
        res.status(StatusCodes.NOT_FOUND).json({msg:"Not-Found"});
        return; 
        }
     res.status(StatusCodes.OK).json({
      msg: "Here is your longUrl" , 
      longUrl:getUrl.longUrl
    })

    } catch (error:unknown) {
      handleError(res , error);
    }
    
}



// get request-responed for listUrls
const listUrls = async(req:Request , res:Response):Promise<void>=>{
    
    try {
     const allUrls = await UrlShorten.find({});
     const formattedUrls = allUrls.map(url =>({
        longUrl: url.longUrl,
        shortenUrl: url.shortenUrl,
        username: url.username
     }));
     
     res.status(StatusCodes.OK).json({
      msg: "Here is all list of urls", 
      data:formattedUrls
    });
        
    } catch (error:unknown) {
      handleError(res , error)
    }
}


export {shortenUrl , getOriginalUrl , listUrls}