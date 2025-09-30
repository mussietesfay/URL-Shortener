
import express , {Request , Response} from 'express';

const app = express();

const port = 5050;


app.get('/', (req:Request , res:Response)=>{
    res.send(`this is for test`)
});


app.listen(port , ()=>{
    console.log(`server ruuning on port: ${port}`)
})