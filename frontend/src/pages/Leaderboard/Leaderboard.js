import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import './Leaderboard.css'
import { useLeaderboardContext } from '../../hooks/useLeaderboardContext'
import { fetchLeaderboard, handleDeleteField } from '../../handleAPI/Leaderboard/LeaderboardAPI'


const ENG_GER = 'eng-ger'
const GER_ENG = 'ger-eng'
const VI_ENG = 'vi-eng'

const Leaderboard = () => {

    const { ld, ldDispatch } = useLeaderboardContext()
    const { account } = useAuthContext()
    const [test, setTest] = useState(ENG_GER)

    useEffect(() => {
        
        try {
            fetchLeaderboard(ldDispatch, account.token)
        }
        catch (err)
        {
            console.error("can't fatch data")
        }

    }, [ldDispatch])
    
    const deleteOne = async (id) => {
        await handleDeleteField(id, ldDispatch, account.token)
        
    }

    return (
        <div className='leaderboard-container'>        

            <div className='category'>                
                <div>
                    <div className='test-item' onClick={() => {
                        if (ld) setTest(ENG_GER)
                    }}>
                        <div className='img-left'></div>
                        <div className='img-right'></div>
                        
                    </div>
                    <div className='caption text-center'>
                        <span className='text-primary'>English</span> - <span className='text-warning'>German</span>
                    </div>
                </div>
                
                <div>
                    <div className='test-item' onClick={() => {
                    if (ld) setTest(GER_ENG)
                }}>
                        <div className='img-right'></div>
                        <div className='img-left'></div>
                        
                    </div>
                    <div className='caption text-center'>
                        <span className='text-warning'>German</span> - <span className='text-primary'>English</span>
                    </div>
                </div>
                <div>
                    <div className='test-item' onClick={() => {
                        if (ld) setTest(VI_ENG)
                    }}>
                        <div className='img-left-vi'></div>
                        <div className='img-left'></div>
                        
                    </div>
                    <div className='caption text-center'>
                        <span className='text-danger'>Vietnamese</span> - <span className='text-primary'>English</span>
                    </div>
                </div>
            </div>            
            <div className='top-three-rank'>
                {
                    ld && ld.filter(l => l.highScore !== 0 && l.test_type === test).slice(0, 3).map((l, index) => (

                        <div className={`top-item top-${index + 1}`} key={index}>
                            <div className={`banner-${index + 1}`}>
                                {index + 1}
                            </div>
                            <div className={`email ${(account.email === l.user_email) ? 'highlight' : ''}`}>
                                {l.user_email.slice(0, 4)}
                            </div>
                            <div className='info text-dark'>                                
                                <div className='score'>
                                    Hi. Score: {l.highScore}
                                </div>
                                <div className='streak text-danger'>
                                    Streaks: {l.streaks}
                                </div>
                            </div>
                                                        
                        </div>
                        
                    ))
                }
                {
                    ld && ld.filter(l => l.highScore !== 0 && l.test_type === test).length <= 0 &&
                    (
                        <div className='fs-4 fw-bold'>
                            No Data
                        </div>
                    )
                }        
            </div>
            
            

            <div className='table-responsive'>
                
              <table className='table table-bordered border-secondary'>
                  <thead className='table-secondary'>
                      <tr>
                          <th scope="col">Rank</th>
                          <th scope="col">User</th>
                          <th scope="col">High Score</th>
                          <th scope="col">Streaks</th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                        ld && ld.filter(l => l.highScore !== 0 && l.test_type === test).slice(0, 11).map((l, index) => (
                          <tr key={index} >
                            <td className={(l.user_email === account.email) ? 'highlight' : undefined}>{index + 1}</td>
                            <td><Link to={(l.user_email === account.email) ? '/profile' : '/profile/'+l.user_email}>{l.user_email}</Link></td>
                            <td>{l.highScore}</td>
                            <td>{l.streaks}</td>
                            {
                                (account && account.role === 'admin') && (
                                    <td><span onClick={() => {
                                        deleteOne(l._id)
                                    }}>Delete</span></td>
                                )
                            }
                          </tr>
                        ))
                      }
                  </tbody>
              </table>
          </div>
        </div>
                
    )
}

export default Leaderboard