
import express from 'express';
import dbConfig from './db/dbConfig.js';
import urlRoutes from './route/urlRoute.js';

const app = express();
const port:number = Number(process.env.SERVER_PORT);
app.use(express.json());

app.use(urlRoutes)

const start = async():Promise<void> =>{
    try {
     await dbConfig();
     console.log(`database connected successfully`);

     app.listen(port , ()=>{
        console.log(`server ruuning on port: ${port}`)
        });
    } catch (error) {
       console.error(error);
       throw new Error(`something went wrong: ${error}`)
    }
}

start();




