import React from 'react'
import { Link } from 'react-router-dom'
import './RequireToLogin.css'

function RequireToLogin({ page }) {
  return (
    <div className='login-required'>
        <h1>401</h1>
        <p className='to-home'>
            Please <Link to='/login'>Log In</Link> to access { page } page
        </p>   
    </div>
  )
}

export default RequireToLogin
