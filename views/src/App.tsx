

import Home from "./pages/home/Home";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import {Routes , Route} from 'react-router-dom'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
      
    </div>
  )
}

export default App