import React, { useState } from 'react'
import './ForgotPassword.css'
import { useChangePassword, useRequestVerifyOtp } from '../../../handleAPI/Accounts/accountsAPI'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getAPIurl } from '../../../handleAPI/getAPIurl'

const ForgotPassword = () => {
    const EMAIL_FORM = 'EMAIL_FORM'
    const OTP_PASSWORD_FORM = 'OTP_PASSWORD_FORM'

    const { account } = useAuthContext()
    const [currentForm, setCurrentForm] = useState((account) ? OTP_PASSWORD_FORM : EMAIL_FORM)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [fp_error, setFpError] = useState('')
    const [passwordDisplay, togglePasswordDisplay] = useState(false)
    const {changePassword, p_error } = useChangePassword()
    const {requestSendOtp, requestResendOtp, error_verifOtp} = useRequestVerifyOtp()
    const [isSendOtp, setIsSendOtp] = useState(false)
    const navigate = useNavigate()

    // support methods for submit //////////
    const handleResendOTP = async () => {
        const em = (account && account.email) ? account.email : (email) ? email : null        

        if (!em) {
            setFpError('Email is not valid')
            return
        }
        await requestResendOtp(em)        
    }


    const handleRequestOTP = async (email) => {

        // request an otp to the defined email
        try {
            await requestSendOtp(email)
            if (currentForm !== OTP_PASSWORD_FORM)
            {
                setCurrentForm(OTP_PASSWORD_FORM)
            }
            setFpError('')
        } catch (err) {
            setFpError(error_verifOtp)
        }
        
    }
    /////////

    // verify otp for user-input account
    const handleSubmitVerify = async (e) => {
        e.preventDefault()

        const em = (account && account.email) ? account.email : (email) ? email : null

        if (!em)
        {
            setFpError("The account's email is not existed")
            return
        }
        
        await handleRequestOTP(email)
                       
    }

    // after changing the password
    const handleSubmitChangePass = async (e) => {
        e.preventDefault()

        if (!otp || !password || !confirmPassword)
        {
            setFpError("Please fill in all the required field")
            return
        }

        if (password !== confirmPassword)
        {
            setFpError("Password and Confirm Password must be matched")
            return
        }

        const em = (account && account.email) ? account.email : (email) ? email : null

        if (!em) {
            setFpError("The account's email is not existed")
            return
        }

        const formData = {email: em, otp: otp}

        // verify otp

        await axios.post(`${getAPIurl('production')}/verifyOTP`, formData)
            .then (res => {
                // change pass

                changePassword(em, password)
                    .then(res => {                        
                        (account) ? navigate('/') : navigate('/login')
                    })
                    .catch(err => {
                        setFpError(p_error)
                    })
            })
            .catch(err => {
                console.log(err)          
                setFpError("The OTP is not valid. Please check the OTP again and retry")
            })

    }

    // user requests a new otp
    const getOtp = () => {
        const em = (account && account.email) ? account.email : (email) ? email : null

        if (!em)
        {
            setFpError("Email is not valid")
            return
        }

        handleRequestOTP(em)
    }

    return (
    <div className='forgot-password-container'>
      {
        currentForm === EMAIL_FORM && !account &&
        (<div className='wrapper'>
            <div className='forgot-password'>
            <h1>Confirm your email</h1>
            {fp_error && 
            <div className='fp_error error alert alert-danger'>
                {fp_error + '.'}
                {fp_error === 'Your account is not available' && 
                <Link to='/signup'>
                    Sign Up
                </Link>}
            </div>}
            <form onSubmit={handleSubmitVerify}>
                <div className='input-box'>
                    <input
                    type='email'
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    />
                </div>
                
                <div className='submit-btn'>
                    <button className='btn btn-primary'>Confirm</button>
                </div>
                
            </form>
            
            </div>
            
        </div>)
      }
      {
        (currentForm === OTP_PASSWORD_FORM || account) &&
        (
            <div className='wrapper'>
                <div className='forgot-password'>
                    <h1>Change Password</h1>
                    {fp_error && 
                        <div className='error alert alert-danger'>
                            {fp_error + '.'}
                        </div>}                    
                    <form onSubmit={handleSubmitChangePass}>
                        <div className='input-box'>
                            <input
                            type='text'
                            placeholder='OTP'
                            onChange={(e) => setOtp(e.target.value)}
                            className={(!otp) ? 'input-glow' : undefined}
                            value={otp}
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

                        <div className='submit-btn'>
                            {
                                isSendOtp
                                ?(<button className='btn btn-primary'>Confirm</button>)
                                :(<span className='btn btn-primary' onClick={() => {
                                    getOtp()
                                    setIsSendOtp(true)
                                }}>Get OTP</span>)
                            }
                            
                        </div>                        
                        </form>
                        {isSendOtp && 
                        (
                            <div className='resend-otp'>
                                <span>Can't receive an OTP? <span className='resend-btn' onClick={handleResendOTP}>Resend</span></span>
                            </div>
                        )
                        }
                        
                        
                </div>
                
            </div>
        )
      }
    </div>
  )
}

export default ForgotPassword
