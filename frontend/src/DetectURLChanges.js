import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuthContext } from './hooks/useAuthContext'
import { useLogout } from './hooks/useLogout'

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
}

const DetectURLChanges = () => {
  // detect changes in url bar to track the path

  const location = useLocation()
  const { account } = useAuthContext()
  const { logout } = useLogout()

  useEffect(() => {
    sessionStorage.setItem('page', location.pathname)

    // logout once token is expired
    if (account && account.token && isTokenExpired(account.token))
    {
      window.alert('Your login session is expired. Please log in again')
      logout()
    }

  }, [location.pathname])

}

export default DetectURLChanges
