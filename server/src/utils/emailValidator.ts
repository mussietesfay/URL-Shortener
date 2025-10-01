
import validator from 'validator';

export const isValidEmail = (email:string): boolean =>{
    if(!validator.isEmail(email)){
        return false;
    }

    const domainParts = email.split('@')[1]?.split('.');

    if(!domainParts || domainParts.length < 2){
        return false
    }

   return true;
}