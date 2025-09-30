

import {Request , Response} from "express";

import   UrlShorten from '../model/schema.js'


const shortenUrl = async(req:Request , res:Response):Promise<void>=>{
  res.send(`this is from shortenUrl`)
};



const getOriginalUrl = async(req:Request , res:Response):Promise<void>=>{
    res.send(`this is from getOriginalUrl `)
}

const listUrls = async(req:Request , res:Response):Promise<void>=>{
    res.send(`this is from listUrls `)
}


export {shortenUrl , getOriginalUrl , listUrls}