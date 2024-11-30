import React, { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import './OtpVerification.css'
import FourZeroFour from '../../Error/FourZeroFour'
import { useRequestVerifyOtp } from '../../../handleAPI/Accounts/accountsAPI'

const OtpVerification = () => {

    const { email } = useParams()
    const [otpInput, setOtpInput] = useState('')
    const {requestVerifyOtp, requestResendOtp, error_verifOtp, isVerified} = useRequestVerifyOtp()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await requestVerifyOtp(email, otpInput)
    }

    const handleResendOTP = async () => {
        await requestResendOtp(email)
    }

  return (
    (email)
    ?(
        (!isVerified)
        ?(
            <div className='otp-verif'>
                <h1>Verify Your Email</h1>
                <form onSubmit={handleSubmit}>                
                    <input 
                    
                    placeholder='OTP'
                    onChange={(e) => setOtpInput(e.target.value)}
                    value={otpInput}
                    
                    />
                    

                    <button>Verify</button>
                </form>

                <span>Can't receive an OTP? <button onClick={handleResendOTP}>Resend</button></span>
                {error_verifOtp && <div className='error'>{error_verifOtp}</div>}                
            </div>
        )
        :(
            <Navigate to='/login' />
        )
        
    )
    :(
        <FourZeroFour />
    )
  )
}

export default OtpVerification
