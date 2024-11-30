import React, {useState} from 'react'
import { useLogin } from '../../hooks/useLogin'
import './Login.css'
import { Link } from 'react-router-dom'

function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordDisplay, togglePasswordDisplay] = useState(false)
    
    const [rMe, setrMe] = useState(false)
    const { login, error, isLoading, isVerified, NOT_VERIFIED} = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await login(email, password, rMe)
    }

  return (
    <div className='wrapper'>
        
        <form className='login' onSubmit={handleSubmit}>
            <h3>Log In</h3>

            <div className='input-box'>
                <input 
                    type='email'
                    
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                    className={(!email) ?'input-glow' : undefined}
                    value={email}
                />
            </div>
            <div className='input-box'>
                <input 
                    type={passwordDisplay ? 'text' : 'password'}
                    id='password'
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                    className={(!password)?'input-glow':undefined}
                    value={password}
                />
                <span className="toggle-password material-symbols-outlined" onClick={() => togglePasswordDisplay(!passwordDisplay)}>
                    {passwordDisplay ? 'visibility' : 'visibility_off'}
                </span>
            </div>

            <div className='remember-forgot'>
                <label><input type='checkbox' checked={rMe} onChange={() => setrMe(!rMe)} />Remember me</label>
                <a href='/forgot-password'>Forgot password?</a>
            </div>

            {error && <div className='error alert alert-danger'>
                    {error}{error === NOT_VERIFIED && !isVerified && 
                        <Link to={'/verify/'+email}>Verify your account.</Link>
                    }   
            </div>}

            <div className='submit-btn'>
                <button disabled={isLoading} className='btn btn-primary'>Log In</button>
            </div>
            
            <div className='signup-link'>
                <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
            </div>
        
        </form>
    </div>
    
  )
}

export default Login
