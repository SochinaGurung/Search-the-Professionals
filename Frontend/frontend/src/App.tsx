/*import './App.css'
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
*/

import './App.css'
import { Route, Routes} from 'react-router-dom'
import Login from './features/login/login'
import Register from './features/register/register'
import HomePage from './features/home/homepage'
import LoginGuard from './shared/guards/loginGuard'
import AuthGuard from './shared/guards/authGuard'
import Profile from './features/Profile/Profile'
import ProfileForm from './features/ProfileForm/ProfileForm'

//import RoleGuard from './shared/guards/roleguard';


function App() {
  
//functionality
  return (
    <Routes>
      <Route path= '/' element={
      <LoginGuard>
        <Login />
      </LoginGuard>
      }/>
      <Route path= '/Register' element={<Register />}/>
      <Route path='/profile/:id' element={
        <AuthGuard>
          <Profile />
        </AuthGuard>
      } />
      <Route path='/profileForm' element={
        <AuthGuard>
          <ProfileForm />
        </AuthGuard>
      } />
      <Route path='/home' element={
        <AuthGuard>
          <HomePage />
        </AuthGuard>
      } />
    </Routes>
  )
    
}
export default App;

