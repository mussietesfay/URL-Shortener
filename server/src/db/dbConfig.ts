
import mongoose from "mongoose";

const url:string = process.env.MONGODB_URI || '';


const dbConfig = async ():Promise<void> =>{

    try {
       await mongoose.connect(url);
    } catch (error) {
       console.error(error)
       throw new Error(`something went Wrong: ${error}`) 
    }
}

process.on('unhandledRejection', (error)=>{
    console.error(`unhandleRejection: ${error}`);
    process.exit(1)
});


export default dbConfig;