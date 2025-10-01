
import {Request , Response} from 'express';
import User from '../../model/userSchema.js';
import {StatusCodes} from 'http-status-codes';
import bcrypt from 'bcrypt'
import {handleError} from '../../utils/errorHandler.js';
import {isValidateInput , usernameLength , isValidateLogin} from '../../utils/inputValidator.js';
import {isValidEmail} from '../../utils/emailValidator.js';
import {isValidPassword} from '../../utils/passwordValidator.js';
import jwt from 'jsonwebtoken';



// user registeration
const register = async(req:Request , res:Response):Promise<void>=>{
    const {username , email, password} = req.body;

    if(!isValidateInput(username , email, password)){
     res.status(StatusCodes.BAD_REQUEST).json({msg: "Please enter all required fields." })
     return;
    }
    if(!usernameLength(username)){
     res.status(StatusCodes.BAD_REQUEST).json({msg: "Username must be greater than three characters."})
     return;   
    }
   
    if(!isValidEmail(email)){
       res.status(StatusCodes.BAD_REQUEST).json({msg: "Please enter a valid email address." })
       return;  
    }

    if(!isValidPassword(password)){
        res.status(StatusCodes.BAD_REQUEST).json({msg: "Password must be at least 8 characters long."});
        return;
    };

    try {
        const user = await User.findOne({$or: [{email:email}, {username:username}]});

        if(user){
            res.status(StatusCodes.BAD_REQUEST).json({msg: "User already registered." })
            return;
        }
   const salt = await bcrypt.genSalt(10);
   const hashPassword = await bcrypt.hash(password , salt);
    
    const newUser = new User({
        username:username,
        email:email,
        password:hashPassword
    });
    await newUser.save();
    res.status(StatusCodes.CREATED).json({msg: "User registered successfully." , username:newUser.username , email:newUser.email});
    return;

    } catch (error) {
        handleError(res, error);
    }
};



// user login 
const login = async(req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!isValidateLogin(email , password)) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please enter all required fields." });
        return;
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            res.status(StatusCodes.UNAUTHORIZED).json({ msg:"Invalid email or password." });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password , user.password) ;

        if (!isPasswordMatch) {
            res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid email or password." });
            return;
        }

        const payload = {user: user.username , id: user._id};
        const token= jwt.sign(payload, process.env.SECRET_KEY  as string, {expiresIn:"1d"});

     res.status(StatusCodes.OK).json({
         msg: "login successful", 
         user: { 
            email:user.email, 
            username: user.username , 
            token:token
        } });
        return;

    } catch (error) {
        handleError(res, error)
    }
};



const checkUser = async (req:Request , res:Response):Promise<void> =>{
     const {user , id} = req.user || {};

     res.status(StatusCodes.OK).json({
        msg:"this is from checkUser",
        user:user,
        id:id
    })
}

export {register , login , checkUser}