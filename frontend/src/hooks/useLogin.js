import { useState } from "react"
import { useAuthContext } from "./useAuthContext"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useRequestVerifyOtp } from "../handleAPI/Accounts/accountsAPI"
import { isValidEmail, isValidPassword } from "../pages/Auth/InputValidation"
import { getAPIurl } from "../handleAPI/getAPIurl"

export const useLogin = () => {
    const NOT_FILL_IN = "Please fill in all the required fields."
    const NOT_VALID_EMAIL = "Provide an invalid email address."
    const NOT_VALID_PASSWORD = "Your password must be contained at least 1 lower case character (a-z), 1 upper case character (A-Z), 1 number and 1 special character. The length of password must be equal or higher than 8."
    const NOT_VERIFIED = "Your account is not verified."
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()
    const navigate = useNavigate()
    const {requestVerifiedChecker, requestSendOtp, error_verifOtp, isVerified} = useRequestVerifyOtp()

    const login = async (email, password, rMe) => {
        setIsLoading(true)
        setError(null)

        if (!password || !email)
        {
            setIsLoading(false)
            setError(NOT_FILL_IN)
            return
        }

        if (!isValidEmail(email))
        {
            setIsLoading(false)
            setError(NOT_VALID_EMAIL)
            return
        }

        if (!isValidPassword(password))
        {
            setIsLoading(false)
            setError(NOT_VALID_PASSWORD)
            return
        }
        
        let formData = {email, password}

        try {            
            if (await requestVerifiedChecker(email) === false) {
                await requestSendOtp(email)
                setIsLoading(false)
                setError(NOT_VERIFIED)
                return
            }
        } catch (err) {
            setIsLoading(false)
            setError(error_verifOtp)
            return
        }

        await axios.post(`${getAPIurl('production')}/login`, formData)
            .then(res => {

                // save the account to local storage if remember me is ticked. otherwise, save to session storage (web close -> logout)

                (rMe) ? localStorage.setItem('account', JSON.stringify(res.data)) : sessionStorage.setItem('account', JSON.stringify(res.data))

                // update the auth context
                dispatch({type: 'LOGIN', payload: res.data})                

                setIsLoading(false)
                
                navigate('/')
                
            }
            )
            .catch(err => {
                    setIsLoading(false)
                    setError(err.response.data.error)
                    console.clear()
                }

            )
    }

    return {login, isLoading, error, isVerified, NOT_VERIFIED}
}