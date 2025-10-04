
import { useState, type FormEvent } from 'react';
import './Register.css'; 
import axiosInstance from '../../axiosConfig';
import axios from 'axios';
import {useNavigate , Link} from 'react-router-dom'

const Register = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    
    setErrorMessage(null);
    setSuccessMessage(null);

    if(!username || !email || !password){
     setErrorMessage("Please fill in all fields.");
      return;
    }
     
    try {
      const response = await axiosInstance.post('/register',{
        username,
        email,
        password
      });
      setSuccessMessage(response?.data?.msg)

      setTimeout(()=>{
        navigate('/login')
      }, 2000)
    } catch (error:any) {
      if(axios.isAxiosError(error) && error.response){
        setErrorMessage(error.response.data.msg || "Registration failed.");
      }else{
        setErrorMessage("An unknown error occurred.");
      }
    }

  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
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
          />
        </div>
        <button type="submit">Register</button>
      </form>
        <div className="login-link">
           Already have an account? <Link to="/login">Login here</Link>
        </div>
    </div>
  );
};

export default Register;