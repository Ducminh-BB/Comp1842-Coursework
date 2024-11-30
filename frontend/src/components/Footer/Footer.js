import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'

function Footer() {

  const { account } = useAuthContext()

  return (
    <footer id="footer" className="footer position-relative dark-background fixed-bottom">

    <div className="container footer-top">
      <div className="row gy-3">
        <div className="col-lg-8 col-md-12 footer-about">
          <span className="fs-1">Vocabulary App</span>
          <p className='subtitle'>Strengthen your knowledge.</p>          
        </div>

        <div className="col-lg-2 col-6 footer-links">
          <h2>Navigations</h2>
          <ul>
            <li><a className='link-info link-offset-2 link-underline-opacity-25' href="#">Home</a></li>
            <li><Link className='link-info link-offset-2 link-underline-opacity-25' to='/about'>About Us</Link></li>
            <li><Link className='link-info link-offset-2 link-underline-opacity-25' to='/words'>Words</Link></li>
            <li><Link className='link-info link-offset-2 link-underline-opacity-25' to={account ? '/dotest' : '/login'}>Test</Link></li>
            <li><Link className='link-info link-offset-2 link-underline-opacity-25' to={account ? '/leaderboard' : '/login'}>Leaderboard</Link></li>            
          </ul>
        </div>        

        <div className="col-lg-2 col-6 footer-contact text-center text-md-start">
          <h2>Contact Us</h2>
          <p>Ha Noi, Viet Nam</p>      
        </div>

      </div>
    </div>

    <div className="container copyright text-center mt-4">
      <div className="credits">
        ©️ 2024 - Pham Nguyen Duc Minh
      </div>
    </div>

  </footer>
  )
}

export default Footer
