import { useState, type FormEvent } from 'react';
import './Login.css' 
import axiosInstance from '../../axiosConfig'
import axios from 'axios'; 
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await axiosInstance.post('/login', { email, password }); 
      setSuccessMessage(response?.data?.msg);
      localStorage.setItem('token', response?.data?.token)
      
      setTimeout(() => {
        navigate('/'); 
      }, 2000); 
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.msg || "Login failed.");
      } else {
        setErrorMessage("An unknown error occurred.");
      }
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
        <button type="submit">Login</button>
      </form>
      <div className="register-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};

export default Login;