
import validator from 'validator';

export const isValidPassword = (password:string):boolean =>{
    let minLength:number = 8;

    return validator.isLength(password , {min:minLength})
}