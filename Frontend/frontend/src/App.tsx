import './App.css'
import  Login  from './features/login/login';
import { Routes , Route} from "react-router-dom";
import Register from './features/register/register';
import Home from './features/home/homepage';
import Profile from './features/Profile/Profile';
import ProfileForm from './features/ProfileForm/ProfileForm';

function App() {
  return(
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/profile' element={<Profile />} />
      <Route path='/profile/:id' element={<Profile />} />
      <Route path='/profileForm' element={<ProfileForm />} />

    </Routes>
  )
}


export default App