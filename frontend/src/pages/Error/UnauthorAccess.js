import React from 'react'
import { Link } from 'react-router-dom'
import './UnauthorAccess.css'

function UnauthorAccess() {
  return (
    <div className='access-denied'>
        <h1>403</h1>
        <p className='mssg'>
            Access Denied: You don't have permission to access this page.
        </p>
        <p className='to-home'>
            Click <Link to='/'>here</Link> to return homepage
        </p>   
    </div>
  )
}

export default UnauthorAccess
