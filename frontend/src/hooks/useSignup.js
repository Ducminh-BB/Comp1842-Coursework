import { useState } from "react"
import { isValidEmail, isValidPassword } from "../pages/Auth/InputValidation"
import axios from "axios"
import { getAPIurl } from "../handleAPI/getAPIurl"

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isAccountSignedIn, setIsAccountSignedIn] = useState(false)

    const signup = async (email, password, confirmPassword) => {
        setError(null)

        if (!confirmPassword || !password || !email)
        {
            setError('Please fill in all the required fields')
            return
        }

        if (!isValidEmail(email))
        {
            setError('Provide an invalid email address')
            return
        }

        if (password !== confirmPassword) {
            setError('Password and Confirm Password must be matched')
            return
        }

        if (!isValidPassword(password))
        {
            setError('Your password must be contained at least 1 lower case character (a-z), 1 upper case character (A-Z), 1 number and 1 special character. The length of password must be equal or higher than 8')
            return
        }
        let formData = {email, password}

        await axios.post(`${getAPIurl('production')}/signup`, formData)
            .then(res => {

                setIsAccountSignedIn(true)
            }
            )
            .catch(err => {
                    setIsAccountSignedIn(false)
                    setError(err.response.data.error)
                    console.clear()
                }

            )
    }

    return {signup, isAccountSignedIn, error}
}