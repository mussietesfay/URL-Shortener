
import { useState, useEffect, type FormEvent, useContext } from 'react';
import axiosInstance from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UrlShortener.css'; 
import {AppState} from '../../context/AppContext'


const UrlShortener = () => {
    const [longUrl, setLongUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isShortening, setIsShortening] = useState(false);
    const [isFetchingOriginal, setIsFetchingOriginal] = useState(false);

    const appState = useContext(AppState);
    const navigate = useNavigate();

    
    useEffect(() => {
    if (!appState || !appState.user) {
      navigate('/login', { replace: true }); 
    }
  }, [appState, navigate]);


  if (!appState || !appState.user) {
    return null; 
  }

 
    
    const user:string|null = appState.user ;
   


     const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setShortenedUrl(null);
        setOriginalUrl(null);
        setIsShortening(true);
        
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login' , {replace:true});
            setIsShortening(false);
            return;
        }


        try {
            const response = await axiosInstance.post<{ shortenUrl: string }>('/shorten', 
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
        } finally{
            setIsShortening(false);
        }
        
    };

   const fetchOriginalUrl = async () => {
        if (!shortenedUrl){
            setError('No shortened URL available to fetch original for.');
            return;
        }
          
        setError(null);
        setOriginalUrl(null);
        setIsFetchingOriginal(true);
        
       const token = localStorage.getItem('token');

       if (!token) {
          navigate('/login', { replace: true });
           setIsFetchingOriginal(false);
           return;
        }
        
         if (!shortenedUrl) {
            setError('Could not extract short code from the shortened URL.');
            setIsFetchingOriginal(false);
            return;
           }

        try {
            const response = await axiosInstance.get(`/url/${shortenedUrl}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOriginalUrl(response?.data?.longUrl); 
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.msg || 'An error occurred while fetching the original URL');
            } else {
                setError('An error occurred while fetching the original URL');
            }
        }finally {
          setIsFetchingOriginal(false);
          }
    };

  const handleCopyShortUrl = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl)
        .then(() => alert('Short URL copied to clipboard!'))
        .catch(err => {
          console.error('Failed to copy text:', err);
          alert('Failed to copy URL. Please copy it manually.');
        });
    }
  };



    const handleLogout = () => {
        localStorage.removeItem('token');
        if (appState.setUser) {
           appState.setUser(null);
          }
        navigate('/login', { replace: true }); 
    };

    return (
        

       <div className="url-shortener-container">
      <h1>URL Shortener</h1>
      {user && user && <p className="welcome-message">Welcome, {user}!</p>}
      <p className="instruction-text">Enter the URL to shorten:</p>
      <form onSubmit={handleSubmit} className="shorten-form">
        <input
          type="url"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Enter the Long URL (e.g., https://example.com)"
          required
          disabled={isShortening}
        />
        <button type="submit" disabled={isShortening}>
          {isShortening ? 'Shortening...' : 'Shorten'}
        </button>
      </form>

      {isShortening && <p className="loading-message">Shortening URL...</p>}
      {isFetchingOriginal && <p className="loading-message">Fetching original URL...</p>}
      {error && <p className="error-message">{error}</p>}

      {shortenedUrl && (
        <div className="result-card">
          <p>Success! Here’s your short URL:</p>
          <p className="shortened-url-display">
            <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">
              {shortenedUrl}
            </a>
          </p>
          <div className="result-actions">
            <button className="copy-button" onClick={handleCopyShortUrl}>
              Copy Short URL
            </button>
            <button className="fetch-original-button" onClick={fetchOriginalUrl} disabled={isFetchingOriginal}>
              {isFetchingOriginal ? 'Fetching...' : 'Get Original URL'}
            </button>
          </div>
          {originalUrl && (
            <p className="original-url-display">
              Original URL: <a href={originalUrl} target="_blank" rel="noopener noreferrer">{originalUrl}</a>
            </p>
          )}
        </div>
      )}

      <div className="footer-actions">
        <button className="view-urls-button" onClick={() => navigate('/urls')}>
          View My Shortened URLs
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div> 
    );
};

export default UrlShortener;