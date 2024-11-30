import React from 'react'
import { Link } from 'react-router-dom'
import './FourZeroFour.css'

function FourZeroFour() {
  return (
    <div className='page-not-found'>
        <h1>404</h1>
        <p className='to-home'>
            Uh Oh! Page is invalid. Click <Link to='/'>here</Link> to return homepage
        </p>   
    </div>
  )
}

export default FourZeroFour
