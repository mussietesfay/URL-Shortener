
import {Schema , model , Document, Types} from 'mongoose';
import { nanoid } from 'nanoid'

interface IUrlShorten extends Document{
    shortenUrl: string;
    longUrl: string;
    userId: Types.ObjectId;
    username:string;
}


const urlSchema = new Schema<IUrlShorten>({
   shortenUrl: {type: String , required: true, unique:true, default:()=>nanoid(6)},
   longUrl:{type: String, required: true },
   userId:{type: Schema.Types.ObjectId , ref: 'User' ,required:true},
   username:{type:String , required:true}

})


const UrlShorten = model<IUrlShorten>('UrlShorten', urlSchema);


export default UrlShorten;