import React, { useEffect, useRef, useState } from 'react'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { getAllTestsByEmail, handleDeleteTest } from '../../../handleAPI/Tests/testsAPI'
import { _formatDate } from '../../../formatString/_formatDate'
import { handleConfirmation } from '../../../handleAPI/Vocabs/vocabsAPI'
import TableFooter from '../../../components/Footer/Table/TableFooter'
import { useParams } from 'react-router-dom'
import FourZeroFour from '../../Error/FourZeroFour'
import './ViewTestDetails.css'
import { sliceData } from '../../../hooks/useTableFooter'

const ROWS_PER_PAGE = 10
const ROWS_PER_PAGE_DETAIL = 6

// test types

const ENG_GER = 'eng-ger'
const GER_ENG = 'ger-eng'
const VI_ENG = 'vi-eng'

function ViewTestDetails() {
    const { account } = useAuthContext()
    const {email} = useParams()
    const [tests, setTests] = useState([])
    const [testDetails, setTestDetails] = useState([])
    const [testId, setTestId] = useState('')
    const [enableViewDetail, toggleEnableViewDetail] = useState(false)
    const [correctAns, setCorrectAns] = useState(0)
    const [wrongAns, setwrongAns] = useState(0)

    const testsRef = useRef()

    // table footer
    const [page, setPage] = useState(1)
    const [pageDetail, setPageDetail] = useState(1)

    const fetchTestsByEmail = async () => {
        try {
            testsRef.current = await getAllTestsByEmail(account.email, account.token)
            setTests(testsRef.current)
        } catch (err) {
            alert("Can't get all tests")
        }
    }

    const handleDelete = async (id) => {        
        try {
            await handleDeleteTest(id, account.token)
            
        } catch (err) {
            alert("Can't delete the test")
        }
        
    }

    // test-type reformat

    const TestType = (_type) => {
        switch (_type)
        {
            case ENG_GER:
                return 'English - German'
            case GER_ENG:
                return 'German - English'
            case VI_ENG:
                return 'Vietnamese - English'
            default:
                return null
        }
    }

    useEffect(() => {

        if (account)
        {
            fetchTestsByEmail()
        }
       
    }, [account])

    const setCorrectAndWrongAnsQuantities = (details) => {
        const correct = details.filter((d) => d.correctAns.toLowerCase() === d.ans.toLowerCase()).length
        const wrong = details.filter((d) => d.correctAns.toLowerCase() !== d.ans.toLowerCase()).length
        setCorrectAns(correct)
        setwrongAns(wrong)    
    }

    useEffect(() => {
        if (tests && testId)
        {
            tests
                .filter((t) => t._id === testId)
                .map((t) => setTestDetails(t.test_detail))            
        }

                    
    }, [testId])

    useEffect (() => {
        if (testDetails)
            setCorrectAndWrongAnsQuantities(testDetails)         
    }, [testDetails])
    
  return (
    (account && account.email === email && tests)
    ?(
        <div className='tests-container'>
            <div className='header'>
                {!enableViewDetail && <h1>{account.email}'s Completed Tests</h1>}
                {enableViewDetail && (
                    <div onClick={() => {
                        toggleEnableViewDetail(false)
                        setTestId('')
                        setPageDetail(1)
                    }} className='d-inline-flex align-items-center mx-4 view-all fs-5'>
                        <span className="material-symbols-outlined">
                            arrow_back_ios
                        </span>
                        <span>Back</span>
                    </div>
                )}

            </div>

            {
                (!enableViewDetail && (
                    <table className='table table-bordered mt-4'>
                        <thead>
                            <tr>
                                <th scope='col'></th>
                                <th scope='col'>Type</th>                                
                                <th scope='col'>Score</th>                                
                                <th scope='col'>Completed Date</th>
                            </tr>
                        </thead>
                        <tbody>                
                            {
                                tests && sliceData(tests, page, ROWS_PER_PAGE).map((ts, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{(ts.test_type) ? TestType(ts.test_type) : 'None'}</td>
                                        <td>{ts.score}</td>
                                        <td>{_formatDate(ts.createdAt, 'en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                        })}
                                        </td>
                                        <td>
                                            <span onClick={() => {
                                            toggleEnableViewDetail(true)
                                            setTestId(ts._id)
                                            setPage(1)
                                            }} className='mx-2 link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover view-test'>View</span>
                                            <span onClick={() => {
                                                if (handleConfirmation("Are you sure to delete the test?"))
                                                {
                                                    handleDelete(ts._id)
                                                    setTests(tests.filter((tss) => tss._id !== ts._id))
                                                }
                                                 
                                            }} className='delete-test'>Delete</span>
                                        </td>
                                    </tr>
                                )                                    
                                )
                            }
                        </tbody>
                    </table>
                ))                
            }            
            {
                (tests && testId && 
                    (
                        <div className='container mt-4'>                            
                            {
                                tests
                                .filter((t) => t._id === testId)
                                .map((t, index) => (
                                    <div key={index}>
                                        <h1 className='d-flex justify-content-center'>Test Detail</h1>
                                        <div className='d-flex justify-content-evenly align-items-center fs-5'>
                                            <span>Date: {_formatDate(t.createdAt, 'en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                            })}</span>
                                            <span>Test: {(t.test_type) ? TestType(t.test_type) : 'None'}</span>
                                            <span>Score: {t.score}</span>
                                            <div className='d-flex flex-column'>
                                                <div className='d-flex align-items-center'>
                                                    <span className='material-symbols-outlined text-success mx-2'>
                                                        check_circle
                                                    </span>
                                                    <span>{correctAns}</span>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <span className="material-symbols-outlined text-danger mx-2">
                                                        cancel
                                                    </span>
                                                    <span>
                                                        <span>{wrongAns}</span>
                                                    </span>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        
                                        <div className='border border-1 mt-2'></div>
                                    </div>
                                ))
                            }
                            <div className='mt-5 row justify-content-center'>
                                {
                                    sliceData(testDetails, pageDetail, ROWS_PER_PAGE_DETAIL).map((t_dt, index) => (
                                        <div style={{maxWidth: "40%"}} key={index}>
                                            {t_dt.correctAns.toLowerCase() === t_dt.ans.toLowerCase()
                                                    ?(<div className='border rounded-1 border-success bg-success bg-gradient text-white text-center' style={{"--bs-border-opacity": ".5"}}>Correct</div>)
                                                    :(<div className='border border-danger rounded-1 bg-danger bg-gradient text-white text-center' style={{"--bs-border-opacity": ".5"}}>Incorrect</div>)
                                            }
                                            <div className='border rounded-1' style={{backgroundColor: "rgb(255, 255, 153)"}}>
                                                <h4 className='d-flex flex-column align-items-center'>Question: {t_dt.question}</h4>
                                                <div className='mx-4'>
                                                    <p>Correct Answer: {t_dt.correctAns}</p>
                                                    <p>Your Answer: {!t_dt.ans ? 'No Answer' : t_dt.ans}</p>
                                                </div>
                                                
                                            </div>
                                            <div className='border border-1 my-3'></div>
                                        </div>
                                    ))
                                }
                            </div>                            
                        </div>
                    )                    
                )
            }
            {!testId && tests && tests.length > ROWS_PER_PAGE && (
                <TableFooter data={tests} setPage={setPage} page={page} rows_per_page={ROWS_PER_PAGE} />
            )}
            {testId && testDetails && testDetails.length > ROWS_PER_PAGE && (
                <TableFooter data={testDetails} setPage={setPageDetail} page={pageDetail} rows_per_page={ROWS_PER_PAGE_DETAIL} />
            )}
        </div>
    )
    :(
        <FourZeroFour />
    )
  )
}

export default ViewTestDetails
