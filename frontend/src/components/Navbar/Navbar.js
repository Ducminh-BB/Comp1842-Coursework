import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext'
import { handleConfirmation } from '../../handleAPI/Vocabs/vocabsAPI'


const Navbar = ({ dynPathChange }) => {

    const { logout } = useLogout()
    const { account } = useAuthContext()
    const navigate = useNavigate()

    const handleClick = () => {
        if (handleConfirmation('Are you sure to logout?')) {
            logout()
        }
        
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
            <div className="container-fluid">
            <div className='navbar-brand'>
                <img onClick={() => navigate('/')} src='/a-letter.png' alt='a-letter' className='d-inline-block align-middle' width='40px'></img>
                {
                    (account) ? <Link className='navbar-brand align-middle mx-auto p-2' to='/profile' >My Profile</Link> : <Link className='navbar-brand align-middle mx-auto p-2' to='/' >Vocabulary App</Link>
                }
            </div>
            
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            <div className="sidebar offcanvas offcanvas-start" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                <div className="offcanvas-header text-white border-bottom">
                    <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Vocabulary App</h5>
                    <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body d-flex flex-column flex-lg-row p-4 p-lg-0">
                    <ul className="navbar-nav justify-content-center align-items-center fs-6 flex-grow-1 pe-3">
                        <li className='nav-item mx-2'>
                            
                            <Link to='/' className={(dynPathChange === '/')?'link-info link-offset-2 link-underline-opacity-25 ':'nav-link'}>{account && account.role === 'admin' ? 'Dashboard' : 'Home'}</Link>                        
                        </li>
                        <li className="nav-item mx-2">
                            <Link to='/words' className={(dynPathChange === '/words')?'link-info link-offset-2 link-underline-opacity-25':'nav-link'}>Words</Link>
                        </li>                        
                        {
                            account && 
                            <li className="nav-item mx-2">
                                <Link to='/dotest' className={(dynPathChange === '/dotest')?'link-info link-offset-2 link-underline-opacity-25':'nav-link'}>Test</Link>
                            </li>
                        }                    
                        {
                            account && 
                            <li className="nav-item mx-2">
                                <Link to='/leaderboard' className={(dynPathChange === '/leaderboard')?'link-info link-offset-2 link-underline-opacity-25':'nav-link'} >Leaderboard</Link>
                            </li>
                        }
                        <li className="nav-item mx-2">
                            <Link to='/about' className={(dynPathChange === '/about')?'link-info link-offset-2 link-underline-opacity-25':'nav-link'}>About</Link>
                        </li>
                    </ul>
                    {
                        !account && (
                            <div className='d-flex justify-content-center align-items-center flex-lg-row gap-3'>
                                <Link to='/login'  className=' btn btn-outline-info'>Log In</Link>
                                <Link to='/signup' className='btn btn-primary'>Sign Up</Link>
                            </div>
                        )
                    }

                    {
                        account && (
                            <div className='d-flex justify-content-center align-items-center'>
                                <button onClick={handleClick} className='btn btn-outline-danger' >Log Out</button>
                            </div>
                        )
                    }
      </div>
    </div>
  </div>
</nav>
        
    )
}

export default Navbar