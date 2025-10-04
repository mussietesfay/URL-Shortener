import { Link } from 'react-router-dom';
import './Home.css'; 

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome</h1>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
    </div>
  );
}

export default Home;