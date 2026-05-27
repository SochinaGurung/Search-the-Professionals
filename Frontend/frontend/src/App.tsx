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
import AuthGuard from './shared/guards/authGuard'
import Profile from './features/Profile/Profile'
import ProfileForm from './features/ProfileForm/ProfileForm'
import FirstPage from './features/firstpage/firstpage'
import RockPaperScissors from './features/games/rockpaperscissor'
import DiceRollGame from './features/games/diceroll'
import TicTacToe from './features/games/tictactoe'

//import RoleGuard from './shared/guards/roleguard';


export default function App() {
  
//functionality
  return (
    <Routes>
      <Route path= '/' element={<FirstPage />}/>
      {/* <Route path= '/Login' element={
      <LoginGuard>
        <Login />
      </LoginGuard>
      }/> */}
      <Route path= '/Login' element={<Login />}/>
      <Route path="/games/rockpaperscissor" element={<RockPaperScissors />} />
      <Route path="/games/diceroll" element={<DiceRollGame />} />
      <Route path="/games/tictactoe" element={<TicTacToe />} />
      <Route path='/Register' element={<Register />}/>
      <Route path='/register' element={<Register />}/>
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

