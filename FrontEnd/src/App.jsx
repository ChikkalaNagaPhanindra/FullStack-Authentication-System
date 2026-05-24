import './App.css'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import Login from './pages/Login/Login'
import Registration from './pages/Registration/Registration'
import { Routes,Route } from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element= {<Registration/>}/>
        <Route path='/login' element= {<Login/>}/>
        <Route path='/forgotPassword' element={<ForgotPassword/>}/>
      </Routes>
    </>
  )
}

export default App
