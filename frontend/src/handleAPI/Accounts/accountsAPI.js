import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { isValidPassword } from "../../pages/Auth/InputValidation"
import { getAPIurl } from "../getAPIurl"


export const getAccount = async (email, token) => {
    try
    {
        const account = await axios.get(`${getAPIurl('production')}/accounts/${email}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return account.data
    } catch (err)
    {
        return null
    }
}

export const deleteAccount = async (id, token) => {
    try {
        await axios.delete(`${getAPIurl('production')}/accounts/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (err) {
        throw new Error()
    }
    
}

export const fetchAllAccounts = async (token) => {
    try {
        const accounts = await axios.get(`${getAPIurl('production')}/accounts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return accounts.data
    } catch (err) {
        throw new Error()
    }
}


export const useRequestVerifyOtp = () => {
    const [error_verifOtp, setError] = useState(null)
    const [isVerified, setIsVerified] = useState(false)
    const navigate = useNavigate()

    const requestVerifyOtp = async (email, otp) => {
        if (!email)
        {
            setError("The account's email is not existed")
            return
        }

        let formData = {email, otp}

        await axios.post(`${getAPIurl('production')}/verifyOTP`, formData)
            .then(res => {
                                
                setIsVerified(true)
                navigate('/login')
            })
            .catch(err => {                
                setError("The OTP is not valid. Please check the OTP again and retry.")
            })
        
    }

    const requestSendOtp = async (email) => {

        await axios.post(`${getAPIurl('production')}/sendOTP`, {email})            
            .catch(err => {                    
                setError("The account's email is not existed")
                throw new Error()                          
            })
    }

    const requestResendOtp = async (email) => {

        await axios.post(`${getAPIurl('production')}/resendOTP`, {email})           
            .catch(err => {                
                setError("Can't resend OTP to email: "+ email +". Please check again")
            })
    }

    const requestVerifiedChecker = async (email) => {
        try {
            const v = await axios.get(`${getAPIurl('production')}/check-verification/${email}`)
            setIsVerified(v.data.isVerified)
            return v.data.isVerified
        } catch (err) {
            setError("Email: "+ email +" is not verified!")
        }
    }

    return {requestVerifyOtp, requestSendOtp, requestResendOtp, requestVerifiedChecker, error_verifOtp, isVerified}
}


export const useChangePassword = () => {
    const [p_error, setError] = useState(null)  

    const changePassword = async (email, password) => {
        if (!email || !password)
        {
            setError("This account's email and password are invalid!")
            throw new Error()
        }

        if (!isValidPassword(password))
        {
            setError('Your password must be contained at least 1 lower case character (a-z), 1 upper case character (A-Z), 1 number and 1 special character. The length of password must be equal or higher than 8')
            throw new Error()
        }

        const formData = { email, password }

        await axios.post(`${getAPIurl('production')}/change-password`, formData)
            .catch(err => {
                console.log(err)
                setError('Failed to updated password')
                throw new Error()
            })
    }

    return {changePassword, p_error}
}




