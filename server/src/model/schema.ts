
import {Schema , model , Document} from 'mongoose';
import { nanoid } from 'nanoid'

interface urlShorten extends Document{
    shortenUrl: string,
    longUrl: string
}


const urlSchema = new Schema<urlShorten>({
   shortenUrl: {type: String , required: true, unique:true, default:()=>nanoid(6)},
   longUrl:{type: String, required: true }

})


const UrlShorten = model<urlShorten>('UrlShorten', urlSchema);


export default UrlShorten;