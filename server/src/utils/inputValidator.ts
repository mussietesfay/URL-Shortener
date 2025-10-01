
// url input validation
export const isValidateLongUrl = (longUrl: string):boolean =>{
  return !!(longUrl && longUrl.trim() !== '');
}



//  user register  input validation
export const isValidateInput = (username:string , email:string , password:string): boolean=>{
 return username.trim() !== '' && email.trim() !== '' && password.trim() !== ''
}


// user length check

export const usernameLength = (username: string):boolean =>{
    let maxLength:number = 3;
    if(username.length < maxLength) return false;
    return true
}



//  user login  input validation
export const isValidateLogin = (email:string , password:string): boolean=>{
 return  email.trim() !== '' && password.trim() !== ''
}