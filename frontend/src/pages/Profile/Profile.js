import React, { useEffect, useRef, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { deleteAccount, getAccount } from '../../handleAPI/Accounts/accountsAPI'
import './Profile.css'
import { Link, useParams } from 'react-router-dom'
import { useLogout } from '../../hooks/useLogout'
import { handleConfirmation } from '../../handleAPI/Vocabs/vocabsAPI'

const Profile = () => {

  const { account } = useAuthContext()
  const { email } = useParams()
  const { logout } = useLogout()

  const [acc, setAcc] = useState(null)
  let accountRef = useRef(null)

  const acc_res = async (email) => {
      try
      {
          accountRef.current = await getAccount(email, account.token)
          setAcc(accountRef.current)
      } catch (err)
      {
          console.log('loading...')
      }
      
  }

  useEffect(() => {
      if (account)
      {
          acc_res((email) ? email : account.email)
      }
  }, [account])

  const deleteAcc = () => {
    if (handleConfirmation('Are you sure to delete your account? You will be logged out immediately.')){
      try {
        deleteAccount(acc._id, account.token)
        logout()
      } catch (error) {
        alert("Something error preventing to delete account")
      }
      
    }
  }

  return (
    (account)
    ?(
      (acc)
      ?
      (
        <div className='profile'>
          <div className="card text-dark bg-light mb-3" style={{maxWidth: "25rem"}}>
            <div className="card-body">
              <h5 className="card-title">{acc.name}</h5>
              <p className="card-text">{acc.email}</p>
              {
              (account.role === 'admin' && (
                <div className='developer'>
                  <h1>For Administrator</h1>
                  <span className='acc-id'>UserId: {acc._id}</span>      
                </div>
              ))
              }
            </div>
            {
              // owned account => /profile. otherwise, /profile/{email_account}
              account && acc && !email && (
                <ul className="list-group list-group-flush">
                  <li className="list-group-item"><Link to={'/view-tests/'+acc.email} className="card-link">View Test Results</Link></li>
                  <li className="list-group-item"><Link to='/forgot-password' className='card-link'  >Change Password</Link></li>
                  <li className="list-group-item"><span onClick={deleteAcc} className="card-link delete">Delete Account</span></li>
                </ul>
              )
            }
                      
            </div>
        </div>
      )
      :(
        <div>loading...</div>
      )
      
    )
    :(
      <div className='err-profile'>
          {
            (account.email !== email)
            ?(
              <p>Something error in your account. Please contact admin or <Link onClick={logout} to='/signup'>sign up a new account</Link></p>
            )
            :(
              <p>This account is not available</p>
            )
          }          
      </div>
    )
      
  )
}

export default Profile
