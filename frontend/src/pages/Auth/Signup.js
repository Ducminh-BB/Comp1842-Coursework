import React, {useState} from 'react'
import { useSignup } from '../../hooks/useSignup'
import './Signup.css'
import { Link, Navigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'

function Signup() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordDisplay, togglePasswordDisplay] = useState(false)
    const { account } = useAuthContext()
    const { signup, error, isAccountSignedIn } = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await signup(email, password, confirmPassword)
    }

  return (
    (!account)
    ?(
            <div className='wrapper'>
            
            <form className='signup' onSubmit={handleSubmit}>
                <h3>Sign up</h3>
                
                <div className='input-box'>
                    <input 
                        type='email'
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                        className={(!email) ? 'input-glow' : undefined}
                        value={email}
                    />
                </div>

                <div className='input-box'>
                    <input 
                        type={passwordDisplay ? 'text' : 'password'}
                        id='password'
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        className={(!password) ? 'input-glow' : undefined}
                        value={password}
                    />
                    <span className="toggle-password material-symbols-outlined" onClick={() => togglePasswordDisplay(!passwordDisplay)}>
                        {passwordDisplay ? 'visibility' : 'visibility_off'}
                    </span>
                </div>

                <div className='input-box'>
                    <input 
                        type='password'
                        id='confirm-password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder='Confirm Password'
                        className={(!confirmPassword) ? 'input-glow' : undefined}
                        value={confirmPassword}
                    />
                </div>
                
                {isAccountSignedIn && 
                <div className='success'>
                    <p className='alert alert-info'>We just sent you a OTP via your email.<br></br> Please<Link to={'/verify/'+email}>verify</Link>your account</p>
                </div>}
                {error && <p className='error alert alert-danger'>{error}</p>}
                
                <div className='submit-btn'>
                    <button disabled={isAccountSignedIn} className='btn btn-primary'>Sign Up</button>
                </div>

                <div className='login-link'>
                    <p>Already have an account? <Link to='/login'>Log In</Link></p>
                </div>
            
                </form>
            </div>
    )
    :(
        <Navigate to='/' />
    )
    
    
  )
}

export default Signup
