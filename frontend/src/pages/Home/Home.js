import React, { useEffect, useRef, useState } from 'react'
import './Home.css'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'
import { deleteAccount, fetchAllAccounts } from '../../handleAPI/Accounts/accountsAPI'
import { getAllTests, handleDeleteTestsByEmail } from '../../handleAPI/Tests/testsAPI'
import { _formatDate } from '../../formatString/_formatDate'
import { handleConfirmation } from '../../handleAPI/Vocabs/vocabsAPI'

// animate component
import AOS from "aos"
import "aos/dist/aos.css"

// counter the number animation
import CountUp from 'react-countup';

const Home = () => {

    const { account } = useAuthContext()
    const navigate = useNavigate()

    // admin section //

    const [acc, setAcc] = useState(null)
    const [tests, setTests] = useState(null)
    const [enableAccTbl, toggleEnableAccTbl] = useState(true)
    const [enableTestsTbl, toggleEnableTestsTbl] = useState(true)

    const accountRef = useRef(null)
    const testsRef = useRef(null)

    /////////////////

    // for go up page button while scrolling

    const [scrolling, setScrolling] = useState(false)

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleScroll = () => {
        if (window.scrollY > 20) {
        setScrolling(true)
        } else {
        setScrolling(false)
        }
    }

    useEffect(() => {
        AOS.init({
            disable: 'phone',
            once: true
        });
        AOS.refresh();
    }, []);

    //////////////////

    const handleGetStarted = () => {
        if (account)
        {
            navigate('/words')            
        }
        else {
            navigate('/login')            
        }
    }
    const fetchAllAccs = async () => {
        try {
            accountRef.current = await fetchAllAccounts(account.token)
            setAcc(accountRef.current)
        } catch (err) {
            alert("Can't get all accounts")
        }
    }

    const fetchAllTests = async () => {
        try {
            testsRef.current = await getAllTests(account.token)
            setTests(testsRef.current)
        } catch (err) {
            alert("Can't get all tests")
        }
    }

    const deleteAcc = async (id) => {
        try {
            await deleteAccount(id, account.token)
        } catch (error) {
            alert('Something error preventing to delete account')
        }
    }

    const deleteTests = async (email) => {
        try {
            await handleDeleteTestsByEmail(email, account.token)
        } catch (error) {
            alert('Something error preventing to delete all tests of this account')
        }
    }

    useEffect(() => {

        if (account && account.role === 'admin')
        {
            fetchAllAccs()
            fetchAllTests()
        }
       
    }, [account])

    return (
        // admin dashboard
        (account && account.role === 'admin')
        ?(
            (acc && tests) 
            ? (
                <div className='statistic-container'>
                <div className='container'>
                    <div className='row'>
                        <div className='col'>
                            <div className="card-body text-primary">
                                <h2 className="card-title">Total Account</h2>
                                <p className="card-text">{acc.length}</p>
                            </div>
                           
                        </div>
                        <div className='col'>
                            <div className="card-body text-primary">
                                <h2 className="card-title">Total completed test</h2>
                                <p className="card-text">{tests.length}</p>
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div className='view-datatable'>
                    <div className='view-accounts'>
                        <div className='header'>
                            <h1 onClick={() => toggleEnableAccTbl(!enableAccTbl)}>All Accounts</h1>                            
                        </div>
                        {
                            enableAccTbl && (
                                <table className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th scope='col'></th>
                                            <th scope='col'>Email</th>
                                            <th scope='col'>Role</th>
                                            <th scope='col'>Verified</th>
                                            <th scope='col'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        acc && acc.map((a, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{a.email}</td>
                                                <td>{a.role}</td>
                                                <td>{(a.verified) ? 'Yes' : 'No'}</td>
                                                {a.email !== account.email && <td onClick={() => {
                                                    if (handleConfirmation('Are you sure to delete this account ?'))
                                                    {                       
                                                        tests.filter((t) => t.user_email === a.email).map((t) => {
                                                            try {
                                                                deleteTests(t.user_email)
                                                                setTests(tests.filter((tss) => tss.user_email !== t.user_email))
                                                                deleteAcc(a._id)
                                                                setAcc(acc.filter((ac) => ac._id !== a._id))
                                                            } catch (error) {
                                                                alert('Something error preventing to delete this account')
                                                            }
                                                            return null
                                                        })
                                                    }
                                                        
                                                }}>Delete</td>}
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>
                            )
                        }
                        
                    </div>

                    <div className='view-tests'>
                    <div className='header'>
                            <h1 onClick={() => toggleEnableTestsTbl(!enableTestsTbl)}>All Tests</h1>                            
                        </div>
                        
                        {
                            enableTestsTbl && (
                                <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th scope='col'></th>
                                        <th scope='col'>Email</th>
                                        <th scope='col'>Score</th>
                                        <th scope='col'>Type</th>
                                        <th scope='col'>Completed Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        tests && tests.map((t, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{t.user_email}</td>
                                                <td>{t.score}</td>
                                                <td>{t.test_type}</td>
                                                <td>{_formatDate(t.createdAt, 'en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            )
                        }
                        
                    </div>
                </div>
                
            </div>
            )
            :(
                <div>loading...</div>
            )
            
        )
        :(
            <main data-aos-easing='ease-in-out' data-aos-duration="600" data-aos-delay="0" className={scrolling ? 'scrolled' : ''}>
                {/* hero section */}
                <section className={'hero section dark-background'}>
                    <img className='cover-img' data-aos='fade-in' src='/vocab-wallpaper.jpg' alt='vocab-wallpaper' loading="eager" />
                    <div className='container'>
                        <div className='row gy-4'>
                            <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center ">
                                <h1 data-aos='fade-up' data-aos-delay="100" className='mb-2'  >Vocabulary App</h1>
                                <p data-aos='fade-up' data-aos-delay="200">Strengthen your knowledge.</p>
                                <div className="d-flex" data-aos='fade-up' data-aos-delay="400">
                                    <div className='fs-4 btn btn-primary' onClick={handleGetStarted}>{(account) ? "Let's learn" : 'Join Us'}</div>
                                </div>
                            </div>
                            <div className="col-lg-6 hero-img order-1 order-lg-2" data-aos='fade-up' data-aos-delay="100">
                                <img src="/a-letter.png" className="img-fluid animated mx-auto d-block align-items-center" alt="a-letter" />
                            </div>
                        </div>
                    </div>
                </section>
                {/* end section */}

                {/* word access section */}
                <section className='details mt-lg-2'>
                    <div className='container'>
                        <div className="row gy-4 align-items-center features-item">
                            <div className="col-md-5 d-flex align-items-center aos-init aos-animate" data-aos="zoom-out" data-aos-delay="100">
                                <img src="/vocab-books.jpg" className="img-fluid mb-4" alt="" />
                            </div>
                            <div className="col-md-7 d-flex align-items-center flex-column aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                                <h1>Explore <CountUp duration={10} className="counter text-info" end={1000} />+ vocabularies</h1>
                                <p className="fw-light">
                                    Help you strengthen your knowledge.
                                </p>
                                <div onClick={() => {navigate('/words')}} className='btn btn-outline-primary explore'>
                                    <span>Explore</span>
                                    <span className="material-symbols-outlined">
                                        font_download
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="row gy-4 align-items-center features-item">
                            <div className="order-2 order-lg-2 col-md-5 d-flex align-items-center" data-aos="zoom-out" data-aos-delay="200">
                                <img src="/hold-books.jpg" className="img-fluid mb-4" alt="" />
                            </div>

                            <div className="order-1 order-lg-1 col-md-7 d-flex align-items-center flex-column" data-aos="fade-up" data-aos-delay="200">
                                <h1>Take the test</h1>
                                <p className="fw-light">
                                    Assess your true value.
                                </p>
                                <div onClick={() => {(account) ? navigate('/dotest') : navigate('/login')}} className='btn btn-outline-primary explore'>
                                    <span>Test Now</span>
                                    <span className="material-symbols-outlined">
                                        quiz
                                    </span>
                                </div>
                            </div>
                            
                            
                        </div>
                    </div>
                    
                    <a href='#' className={`scroll-top d-flex align-items-center justify-content-center text-decoration-none ${scrolling ? 'scroll-active' : ''}`}>
                        <span className="material-symbols-outlined">
                            uppercase
                        </span>
                    </a>                    
                </section>
                
            </main>
            


        )
        
    )
}

export default Home