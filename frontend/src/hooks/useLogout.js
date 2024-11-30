import { useNavigate } from "react-router-dom"
import { useAuthContext } from "./useAuthContext"

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const navigate = useNavigate()

    const logout = () => {
        // remove account from storage

        localStorage.removeItem('account')
        sessionStorage.removeItem('account')
        
        //dispatch logout action
        dispatch({type: 'LOGOUT'})

        // navigate to login page
        navigate('/login')
    }

    return {logout}
}