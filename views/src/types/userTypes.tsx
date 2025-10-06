

export interface User {
    email: string;
    username: string;
    token?:string;
    id?:string;
}

export interface CheckUserResponse {
    user: {
        user: User & {token: string}; 
        id: string; 
    };
}