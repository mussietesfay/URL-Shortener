 import { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../axiosConfig';
import './UrlList.css'
import axios from 'axios';
import { AppState } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';



const UrlList = () => {
    const [urls, setUrls] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const appState = useContext(AppState);
    const navigate = useNavigate();
    
    if (!appState || !appState?.user) {
        return null; 
    }

    const { user } = appState as { user: string | null };

    useEffect(() => {
        const fetchUrls = async () => {

            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axiosInstance.get('/urls', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
               
                setUrls(response?.data?.data || []); 
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(error.response.data.msg || 'An error occurred');
                } else {
                    setError('An error occurred');
                }
            }
        };

        fetchUrls();
    }, []); 

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/login'); 
    };
      
    const handleBackToShorten = () => {
        navigate('/shorten'); 
    };


    return (
        <div className="url-list">
            <h2>Your Shortened URLs</h2>
            {error && <p className="error">{error}</p>}
            {user && <p>Logged in as: <strong>{user}</strong></p>} 
            <div className="button-group">
                <button onClick={handleBackToShorten}>Back to Shorten</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
            {urls.length === 0 ? ( 
                <p>No shortened URLs found. Please add some URLs.</p> 
            ) : (
                <ul>
                    {urls.slice().reverse().map((url) => (
                        <li key={url._id}>
                            <div>
                                <strong>Long URL:</strong> {url.longUrl}
                            </div>
                            <div>
                                <strong>Shortened URL:</strong> {url.shortenUrl}
                            </div>
                            <div>
                                <strong>User:</strong> {url.username}
                            </div>
                            <hr /> 
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UrlList;