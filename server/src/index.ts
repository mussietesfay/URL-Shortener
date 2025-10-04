
import express from 'express';
import dbConfig from './db/dbConfig.js';
import urlRoute from './route/urlRoute/urlRoute.js';
import userRoute from './route/userRoute/userRoute.js';
import {authMiddle} from './middleware/userMiddleware.js'
import {rateLimiter} from './utils/rateLimit.js'
import cors from 'cors'


const app = express();
const port:number = Number(process.env.SERVER_PORT);
const frontend_port:number = Number(process.env.FRONTEND_PORT)


console.log(`Server port: ${port}, Frontend port: ${frontend_port}`);
app.use(cors({
    origin: `http://localhost:${frontend_port}`,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true
}));
app.use(express.json());


app.use(rateLimiter)
app.use(userRoute)
app.use(authMiddle,urlRoute)

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




