
import { useState, useEffect, type FormEvent, useContext } from 'react';
import axiosInstance from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UrlShortener.css'; 
import {AppState} from '../../context/AppContext'


const UrlShortener = () => {
    const [longUrl, setLongUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const appState = useContext(AppState);
    const navigate = useNavigate();

    
    useEffect(() => {
    if (!appState || !appState.user) {
      console.log("AppState is null or user not logged in, navigating to login.");
      navigate('/login', { replace: true }); 
    }
  }, [appState, navigate]);


  if (!appState || !appState.user) {
    return null; 
  }

 
    
    const user:string|null = appState.user ;
   
    console.log(user)

     const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setShortenedUrl(null)
        
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login' , {replace:true});
            return;
        }


        try {
            const response = await axiosInstance.post('/shorten', 
                { longUrl},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setShortenedUrl(response.data.shortenUrl);
            setLongUrl('')
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.msg || 'An error occurred');
            } else {
                setError('An error occurred');
            }
        }
        
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/login'); 
    };

    return (
        <div className="url-shortener">
            <h1>URL Shortener</h1>
            {user && user && <p>Welcome, {user}!</p>}
            <p>Enter the URL to shorten</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    placeholder="Enter the Long URL "
                    required
                />
                <button type="submit">Shorten</button>
            </form>
             {shortenedUrl ? (
                <div className="result">
                    <p>Success! Here’s your short URL:</p>
                    <p className="shortened-url">{shortenedUrl}</p>
                    <button className="copy-button" 
                    onClick={() => {
                        navigator.clipboard.writeText(shortenedUrl);
                         alert('URL copied to clipboard!')
                        }}>
                        Copy
                    </button>
                </div>
            ) : error ? (
                <p className="error">{error}</p>
            ) : null}

            <button className="view-urls-button" onClick={() => navigate('/urls')}>
                View My Shortened URLs
            </button>

            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default UrlShortener;