import { useContext, useState, type FormEvent } from 'react';
import './Login.css' 
import axiosInstance from '../../axiosConfig'
import axios from 'axios'; 
import { useNavigate, Link } from 'react-router-dom';
import {AppState} from '../../context/AppContext'


const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const appState = useContext(AppState)
  const navigate = useNavigate();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    let isMounted = true;

    try {
      const response = await axiosInstance.post('/login', { email, password }); 

      if(isMounted){
      setSuccessMessage(response?.data?.msg);
      if(appState){
         appState.setUser(response?.data?.user?.username)
       }
       
      localStorage.setItem('token', response?.data?.user?.token);
      
      setTimeout(() => {
          navigate('/shorten');
      }, 2000); 
    }
    } catch (error: any) {

        if(isMounted){
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.msg || "Login failed.");
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
    }finally {
        isMounted = false;
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="register-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};

export default Login;