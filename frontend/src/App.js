import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home';
import Words from './pages/Words/Words';
import CreateNewWords from './pages/NewWord/newWord';
import DoTest from './pages/DoTest/DoTest';
import Navbar from './components/Navbar/Navbar';
import UpdateWordForm from './pages/EditWord/wordUpdate';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Profile from './pages/Profile/Profile';
import { useAuthContext } from './hooks/useAuthContext';
import UnauthorAccess from './pages/Error/UnauthorAccess';
import RequireToLogin from './pages/Error/RequireToLogin';
import FourZeroFour from './pages/Error/FourZeroFour';
import DetectURLChanges from './DetectURLChanges';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import OtpVerification from './pages/Auth/OTP/OtpVerification';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword';
import ViewTestDetails from './pages/DoTest/view/ViewTestDetails';
import About from './pages/About/About';


function App() {

  const { account } = useAuthContext()
  const location = useLocation()

  return (
    <div className="App">
        <div className='pages'>

            <DetectURLChanges />
            <Navbar dynPathChange={location.pathname} />
            
            <Routes>
                <Route path='*' element={<FourZeroFour />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/login' element={!account ? <Login /> : <Navigate to='/' />} />
                
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />
                
                <Route path='/profile' element={(account) ? <Profile /> : <RequireToLogin page='Profile' />} >                    
                    <Route path=':email' element={(account) ? <Profile /> : <RequireToLogin page='Profile' />}  />                    
                </Route>
                <Route path='/words' element={<Words />} />
                <Route path='/newword' element={(account && account.role === 'admin') ? <CreateNewWords/> : <UnauthorAccess />} />
                <Route path='/edit' element={(account && account.role === 'admin') ? <UpdateWordForm /> : <UnauthorAccess />} />
                <Route path='/dotest' element={(account) ? <DoTest /> : <RequireToLogin page='Test' />} />
                <Route path='/leaderboard' element={(account) ? <Leaderboard /> : <RequireToLogin page='Leaderboard' />} />
                <Route path='/verify/:email' element={<OtpVerification />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='view-tests/:email' element={<ViewTestDetails />} />

            </Routes>                      
        </div>
    </div>
  );
}

export default App;
