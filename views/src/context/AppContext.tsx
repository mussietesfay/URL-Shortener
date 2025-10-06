
import { createContext, type Dispatch, type SetStateAction } from 'react';



export const AppState = createContext<{
    user: string | null;
    setUser: Dispatch<SetStateAction<string | null>>;
} | null>(null);