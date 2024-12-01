import React, { useState, useEffect, useRef } from 'react'
import { useVocabsContext } from '../../hooks/useVocabContext'
import { fetchVocabs, handleConfirmation } from '../../handleAPI/Vocabs/vocabsAPI'
import './DoTest.css'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { isFieldAvailable, handleUpdateField, handleAddField, fetchLeaderboard } from '../../handleAPI/Leaderboard/LeaderboardAPI'
import { useLeaderboardContext } from '../../hooks/useLeaderboardContext'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { handleAddTest, handleAddTestDetail, handleDeleteTest, handleUpdateScore } from '../../handleAPI/Tests/testsAPI'
import { decapitalize } from '../../formatString/_formatLang'
import { useFloating, useHover, useInteractions } from "@floating-ui/react"


// test types

const ENG_GER = 'eng-ger'
const GER_ENG = 'ger-eng'
const VI_ENG = 'vi-eng'
const TEST_MAX_TIME = 30
const TEST_MIN_TIME = 5
const MAX_ATTEMPT = 5
const CORRECT = 'Correct'
const INCORRECT = 'Incorrect'
const TIME_OUT = 'Timed Out'
const SHUFFLE_VOCABS = 2 // indicates the vocabs need to reshuffle when their length is remaining X times. Min is 1

const getRandomVocab = (vocabs, test) => {
    const keys = Object.keys(vocabs) // get key of vocabs object
    const vocab = vocabs[keys[ keys.length * Math.random() << 0]] // shorthand of parseInt(keys.length * Math.random(), 0)

    switch (test)
    {
        case ENG_GER:
            return vocab.english
        case GER_ENG:
            return vocab.german
        case VI_ENG:
            return vocab.vietnamese
        default:
            return null
    }
}



const DoTest = () => {

    const { vocabs, dispatch } = useVocabsContext()
    const { account } = useAuthContext()
    const { ld, ldDispatch } = useLeaderboardContext()
    const [answer, setAnswer] = useState('')
    const [feedback, setFeedback] = useState('')
    const [isDone, setIsDone] = useState(false)
    const [attempts, setAttempts] = useState(MAX_ATTEMPT)
    const [points, setPoints] = useState(0)
    const [streaks, setStreaks] = useState(0)
    const [test, setTest] = useState(null)
    const [timerKey, setTimerKey] = useState(0)
    const [maxTime, setMaxTime] = useState(TEST_MAX_TIME)
    const [ldError, setLdError] = useState(null)
    const [gainAttemptsTime, scaleGainAttemptsTime] = useState(1)
    
    // track user leaving page
    const [testStarted, setTestStarted] = useState(false)

    // track animation of element

    const [isAnimatedOverlay, setIsAnimatedOverlay] = useState(false)
    const [isAnimatedEndingScreen, setIsAnimatedEndingScreen] = useState(false)
    
    const handleAnimationEndingStart = ({setAnim}, timeOut) => {
        setAnim(false)
        setTimeout(() => {
            setAnim(true)
        }, timeOut)
    }

    const handleAnimationStart = ({anim, setAnim}) => {
        setAnim(!anim)
    }

    const handleAnimationEnd = ({anim, setAnim}) => {
        setAnim(!anim)
    }


    // tooltip

    // streaks tooltip
    const [isStreaksOpen, setIsStreaksOpen] = useState(false);

    const { refs: stRef, 
        floatingStyles: stFloatingStyles, 
        context: stContext } = useFloating({
        open: isStreaksOpen,
        onOpenChange: setIsStreaksOpen,
        
    });

    const hover = useHover(stContext);

    const { getReferenceProps: streaksTooltipRef, 
        getFloatingProps: streaksTooltipFloatingProps } = useInteractions([hover]);

    //////////

    const vocabRef = useRef()
    const streaksRef = useRef(0)
    const testDetail = useRef(null)

    const [duplVocabs, setDuplVocabs] = useState([])
    const [changeQuestionFlag, setChangeQuestionFlag] = useState(0)

    useEffect(() => {

        const fetchData = async () => {
            await fetchVocabs(dispatch)
            await fetchLeaderboard(ldDispatch, account.token)
        }

        try {
            fetchData()
            setDuplVocabs(vocabs)
        }
        catch (err)
        {
            console.error("can't fatch data")
        }

    }, [dispatch, ldDispatch])

    const pushDataToLd = async () => {
        // check the user existing in db
        // you can update the field manually. Add and update are automatically called once user complete the test
    
        if (account && points > 0)
            {
                if (await isFieldAvailable(account.email, test, account.token))
                    {
                        // update the user's data                        
    
                        // find the exact field by comparing email
                        const field = ld.find(l => l.user_email === account.email)
                        const data = {
                            email: field.user_email,
                            highScore: field.highScore,
                            streaks: field.streaks,
                            type: test
                        }
                        try{
                            if (points > data.highScore)
                            {
                                await handleUpdateField(data.email, dispatch, {
                                    highScore: points,
                                    streaks: (streaksRef.current < data.streaks) ? data.streaks : streaksRef.current,
                                    test_type: data.type
                                }, account.token)
                            }                            
                        }
                        catch (err)
                        {
                            setLdError("Can't save the test info (500)")
                        }
                        
                    }
                
                    // if not, add the user to ld db
                    else {
                        try {
                            await handleAddField(dispatch, {
                                user_email: account.email,
                                highScore: points,
                                streaks: streaksRef.current,
                                test_type: test
                            }, account.token)
                        } catch (err) {
                            setLdError("Can't add the test info (500)")
                        }
                        
                    }
            }
    }

    const renderTime = ({ remainingTime }) => {      
        return (
          <div className="timer">
            <div className="value">{remainingTime}</div>
          </div>
        )
    }

    useEffect(() => {
        if (duplVocabs.length === SHUFFLE_VOCABS)
        {
            setDuplVocabs(vocabs)
        }
        if (test)
        {
            let randVocab = getRandomVocab(duplVocabs, test)
            vocabRef.current = randVocab
        }
    }, [test, changeQuestionFlag])

    useEffect(() => {

        if (isDone)
        {
            const updateScore = async () => {
                try {
                    await handleUpdateScore(testDetail.current._id, points, account.token)
                } catch (err) {
                    alert("Can't update score")
                }
            }

            updateScore()
            pushDataToLd()
        }

    }, [isDone])

    const refreshPage = () => {
        window.location.reload(false); // Reloads the page from the cache
    }

    const restart = (current_test) => {
        setIsDone(false)
        startTest(current_test)
        setAttempts(MAX_ATTEMPT)
        setFeedback('')
        setMaxTime(TEST_MAX_TIME)
        setStreaks(0)
        setPoints(0)
        setDuplVocabs(vocabs)
        setIsAnimatedEndingScreen(false)
        setIsAnimatedOverlay(false)
        scaleGainAttemptsTime(1)
        setTimerKey(0)
    }

    const completeTest = () => {
        handleAnimationEndingStart({setAnim: setIsAnimatedEndingScreen}, 4000)
        setTestStarted(false)
        setIsDone(true)
        setFeedback('')
    }

    const correctAnswerRes = () => {
        setFeedback(CORRECT)
        
        const newStreaks = streaks + 1
        setStreaks(newStreaks)
        setPoints(p => (p + newStreaks))
        if (streaksRef.current < newStreaks)
        {
            streaksRef.current = newStreaks
        }

        // each time player reach a gaining point, scale gaining point to double time
        if (newStreaks >= gainAttemptsTime * 5 )
        {
            scaleGainAttemptsTime(s => s*2)       
            // each time player gaining 5 streaks (if the newStreaks is higher than streaksRef), plus 1 health.

            if (newStreaks >= streaksRef.current && newStreaks % 5 === 0 && attempts < MAX_ATTEMPT)
            {
                setAttempts(a => a + 1)
            }
        }

        // decrease the maxTime

        const newMaxTime = maxTime - 0.2 * newStreaks
        setMaxTime(newMaxTime)
        if (newMaxTime < TEST_MIN_TIME)
        {
            setMaxTime(TEST_MIN_TIME)
        }
    }

    const wrongAnswerRes = () => {
        maxTime === 0 ? setFeedback(TIME_OUT) : setFeedback(INCORRECT)
        const newAttempts = attempts - 1        
        setAttempts(newAttempts)
        setStreaks(0)

        if (newAttempts === 0)
        {
            completeTest()                
            return
        }
        const newMaxTime = maxTime + 0.5
        setMaxTime(newMaxTime)

        if (newMaxTime > TEST_MAX_TIME)
        {
            setMaxTime(TEST_MAX_TIME)
        }
    }

    const checkAnswer = (answer, correctAns) => {
        if (answer && decapitalize(answer) === correctAns)
        {            
            correctAnswerRes()
        }
        else
        {
            wrongAnswerRes()
        }
    }

    const checkAnswerResult = async () => {
        var index;
        var correct_ans;

       switch (test) {
            case ENG_GER:
                index = duplVocabs.findIndex(vocab => vocab.english === vocabRef.current)
                correct_ans = duplVocabs[index].german                
                checkAnswer(answer, correct_ans)
                break
            case GER_ENG:
                index = duplVocabs.findIndex(vocab => vocab.german === vocabRef.current)
                correct_ans = duplVocabs[index].english
                checkAnswer(answer, correct_ans)
                break
            case VI_ENG:
                index = duplVocabs.findIndex(vocab => vocab.vietnamese === vocabRef.current)
                correct_ans = duplVocabs[index].english
                checkAnswer(answer, correct_ans)
                break
       }             

        await handleAddTestDetail(testDetail.current._id, {
            question: vocabRef.current,
            correctAns: correct_ans,
            ans: answer,
            test: testDetail.current._id
        }, account.token)

        if (index !== -1) {
            duplVocabs.splice(index, 1);
        }
        
        // toggle overlay animation
        if (feedback) {
            handleAnimationStart({
                anim: isAnimatedOverlay, setAnim: setIsAnimatedOverlay, 
            })
        }

        setAnswer('')
        setChangeQuestionFlag(c => c + 1)
        setTimerKey(k => k + 1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (attempts - 1 === 0) {
            completeTest()
            return
        }

        await checkAnswerResult()
        
    }

    const startTest = (t) => {
        setTest(t)
        setTestStarted(true)
    }

    useEffect(() => {

        if (testStarted)
        {
            
            const addT = async () => {
                try {
                    testDetail.current = await handleAddTest({
                        user_email: account.email,
                        test_type: test                
                    }, account.token)
                    
                } catch (err) {
                    alert("We can't add test")
                }
            }

            const deleteT = async () => {
                try {
                    await handleDeleteTest(testDetail.current._id, account.token)
                } catch (err) {
                    alert("Can't delete test")
                }
            }
            
            addT()

            // need help
            const handleBeforeUnload = (e) => {
                e.preventDefault()
                              
            }

            const handleLinkClick = (e) => {                 
                if(handleConfirmation('You are leaving the test!? Are you sure you want to LOSEEEE!?'))
                {
                    deleteT()
                }
                else{
                    e.preventDefault()
                }
            }
            
            const links = document.querySelectorAll("a")
            links.forEach((link) => link.addEventListener("click", handleLinkClick))
            window.addEventListener('beforeunload', handleBeforeUnload)
            
            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload)

                links.forEach((link) => link.removeEventListener("click", handleLinkClick))
            };
            ///////
        }        

    }, [testStarted])

    return (
        (account)
        ?(
            <div className='do-test'>
                {
                    !test && (
                        <div className='select-test'>
                            <span className='fs-1 text-center'>
                                <span className='text-primary'>Choose </span>
                                <span className='text-warning'> Your </span>
                                <span className='text-danger'>Challenge</span>
                            </span>
                            <div className='test-options'>
                                <div>
                                    <div className='test-item' onClick={() => startTest(ENG_GER)}>
                                        <div className='img-left'></div>
                                        <div className='img-right'></div>
                                        
                                    </div>
                                    <div className='caption text-center'>
                                        <span className='text-primary'>English</span> - <span className='text-warning'>German</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className='test-item' onClick={() => startTest(GER_ENG)}>
                                        <div className='img-right'></div>
                                        <div className='img-left'></div>
                                        
                                    </div>
                                    <div className='caption text-center'>
                                        <span className='text-warning'>German</span> - <span className='text-primary'>English</span>
                                    </div>
                                </div>
                                <div>
                                    <div className='test-item' onClick={() => startTest(VI_ENG)}>
                                        <div className='img-left-vi'></div>
                                        <div className='img-left'></div>
                                        
                                    </div>
                                    <div className='caption text-center'>
                                        <span className='text-danger'>Vietnamese</span> - <span className='text-primary'>English</span>
                                    </div>
                                </div>                                               
                            </div>                                
                        </div>
                        
                    )
                }
                {
                    test && (
                        (attempts !== 0 && !isDone)
                        ?(
                        
                            <div>
                                <div className='container'>
                                    <div className='row align-items-center'>
                                        <div className='col'>
                                            <CountdownCircleTimer key={timerKey}
                                            isPlaying
                                            duration={maxTime}
                                            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                                            colorsTime={[maxTime, Math.floor(maxTime / 3), Math.floor(maxTime / 6), 0]}   
                                            size={100}
                                            onComplete={() => {
                                                // restart timer and give new question
                                                checkAnswerResult()
                                                return { shouldRepeat: true, delay: 1.8 }
                                            }}
                                            >
                                            {renderTime}
                                            </CountdownCircleTimer>
                                        </div>
                                        <div className='col'>
                                        <span className='d-inline-flex align-items-center' style={{cursor:'default'}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 16.00 16.00" fill="none" stroke="#ffffff" strokeWidth="0.00016">

                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"/>

                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#ffffff" strokeWidth="0.032"/>

                                            <g id="SVGRepo_iconCarrier"> <path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" fill="#db1a1a"/> </g>

                                            </svg>
                                                <span className='mx-3' style={{fontSize: "3vw"}}>
                                                    <span className={`mx-1 ${attempts === Math.floor(MAX_ATTEMPT / 2 - 1) && 'blinking-health'}`}>{attempts}</span>
                                                    /{MAX_ATTEMPT}
                                                </span>
                                            </span> 
                                        </div>
                                        
                                        <div className='col col-lg-4 text-end d-flex justify-content-between align-items-center flex-wrap' style={{cursor:'default'}}> 
                                            <span className='border border-info rounded-2 text-end px-2' style={{fontSize: "3vw"}}>{points}</span>
                                            <span className='d-inline-flex align-items-center' ref={stRef.setReference} {...streaksTooltipRef}>
                                                <img width="48" height="48" src="https://img.icons8.com/doodle/48/fire-element--v1.png" alt="fire-element--v1"/> 
                                                <span style={{fontSize: "3vw"}}>{streaks}</span>
                                            </span>
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                                
                                
                                <div className='position-relative'>
                                    
                                <form className='position-absolute top-50 start-50 translate-middle-x mt-5 p-2' style={{ width: '65vw'}} onSubmit={handleSubmit}>
                                        {
                                            (test === GER_ENG) && (
                                                <div>

                                                    <div className='border border-warning border-3 rounded-2 position-relative' style={{ height: "200px"}}>
                                                        <div className='position-absolute' style={{translate: "3px 3px"}}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#cc2b1d" d="M1 11H31V21H1z"></path><path d="M5,4H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z"></path><path d="M5,20H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" transform="rotate(180 16 24)" fill="#f8d147"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path></svg>
                                                        </div>
                                                        
                                                        <span className='position-absolute top-50 start-50 translate-middle fs-1' style={{userSelect:'none'}}>{vocabRef.current}</span>
                                                        
                                                    </div>

                                                    <div className='border border-primary border-3 rounded-2 position-relative mt-4' style={{ height: "200px"}}>
                                                        <div className='position-absolute' style={{translate: "3px 3px"}}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" ><rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65"></rect><path d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z" fill="#fff"></path><path d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z" fill="#b92932"></path><path d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z" fill="#b92932"></path><path d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z" fill="#fff"></path><rect x="13" y="4" width="6" height="24" fill="#fff"></rect><rect x="1" y="13" width="30" height="6" fill="#fff"></rect><rect x="14" y="4" width="4" height="24" fill="#b92932"></rect><rect x="14" y="1" width="4" height="30" transform="translate(32) rotate(90)" fill="#b92932"></rect><path d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z" fill="#b92932"></path><path d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z" fill="#b92932"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path></svg>
                                                        </div>
                                                        
                                                        <div className='position-absolute top-50 start-50 translate-middle'>
                                                            
                                                            <input className='fs-4 form-control border border-primary border-2 rounded-3 text-center text-primary' style={{width: '35vw'}} type='text' onChange={(e) => setAnswer(e.target.value)} value={answer} autoFocus />
                                                            
                                                        </div>
                                                        <div className='position-absolute bottom-0 start-50 translate-middle-x'>
                                                            <button className='ans-btn'>Answer</button>
                                                        </div>
                                                        
                                                    </div>
                                                    
                                                </div>
                                            )
                                        }
                                        {
                                            (test === ENG_GER) && (
                                                <div>

                                                    <div className='border border-primary border-3 rounded-2 position-relative' style={{ height: "200px"}}>
                                                        <div className='position-absolute' style={{translate: "3px 3px"}}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65"></rect><path d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z" fill="#fff"></path><path d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z" fill="#b92932"></path><path d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z" fill="#b92932"></path><path d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z" fill="#fff"></path><rect x="13" y="4" width="6" height="24" fill="#fff"></rect><rect x="1" y="13" width="30" height="6" fill="#fff"></rect><rect x="14" y="4" width="4" height="24" fill="#b92932"></rect><rect x="14" y="1" width="4" height="30" transform="translate(32) rotate(90)" fill="#b92932"></rect><path d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z" fill="#b92932"></path><path d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z" fill="#b92932"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path></svg>
                                                        </div>
                                                        
                                                        <span className='position-absolute top-50 start-50 translate-middle fs-1' style={{userSelect:'none'}}>{vocabRef.current}</span>
                                                        
                                                    </div>

                                                    <div className='border border-warning border-3 rounded-2 position-relative mt-4' style={{ height: "200px"}}>
                                                        <div className='position-absolute' style={{translate: "3px 3px"}}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#cc2b1d" d="M1 11H31V21H1z"></path><path d="M5,4H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z"></path><path d="M5,20H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" transform="rotate(180 16 24)" fill="#f8d147"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path></svg>
                                                        </div>
                                                        
                                                        <div className='position-absolute top-50 start-50 translate-middle'>
                                                            
                                                            <input className='fs-4 border border-warning border-2 rounded-3 text-center text-warning form-control ' style={{width: '35vw', padding: "8px"}} type='text' onChange={(e) => setAnswer(e.target.value)} value={answer} autoFocus />
                                                            
                                                        </div>
                                                        <div className='position-absolute bottom-0 start-50 translate-middle-x'>
                                                            <button className='ans-btn'>Answer</button>
                                                        </div>
                                                        
                                                    </div>
                                                    
                                                </div>
                                            )
                                        }
                                        {
                                            (test === VI_ENG) && (
                                                <div>

                                                    <div className='border border-danger border-3 rounded-2 position-relative' style={{ height: "200px"}}>
                                                        <div className='position-absolute' style={{translate: "3px 3px"}}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#c93728"></rect><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path><path fill="#ff5" d="M18.008 16.366L21.257 14.006 17.241 14.006 16 10.186 14.759 14.006 10.743 14.006 13.992 16.366 12.751 20.186 16 17.825 19.249 20.186 18.008 16.366z"></path></svg>
                                                        </div>
                                                        
                                                        <span className='position-absolute top-50 start-50 translate-middle fs-1' style={{userSelect:'none'}}>{vocabRef.current}</span>
                                                        
                                                    </div>

                                                    <div className='border border-primary border-3 rounded-2 position-relative mt-4' style={{ height: "200px"}}>
                                                        <div className='position-absolute' style={{translate: "3px 3px"}}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" ><rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65"></rect><path d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z" fill="#fff"></path><path d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z" fill="#b92932"></path><path d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z" fill="#b92932"></path><path d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z" fill="#fff"></path><rect x="13" y="4" width="6" height="24" fill="#fff"></rect><rect x="1" y="13" width="30" height="6" fill="#fff"></rect><rect x="14" y="4" width="4" height="24" fill="#b92932"></rect><rect x="14" y="1" width="4" height="30" transform="translate(32) rotate(90)" fill="#b92932"></rect><path d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z" fill="#b92932"></path><path d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z" fill="#b92932"></path><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path></svg>
                                                        </div>
                                                        
                                                        <div className='position-absolute top-50 start-50 translate-middle'>
                                                            
                                                            <input className='fs-4 form-control border border-primary border-2 rounded-3 text-center text-primary' style={{width: '35vw'}} type='text' onChange={(e) => setAnswer(e.target.value)} value={answer} autoFocus />
                                                            
                                                        </div>
                                                        <div className='position-absolute bottom-0 start-50 translate-middle-x'>
                                                            <button className='ans-btn'>Answer</button>
                                                        </div>
                                                        
                                                    </div>
                                                    
                                                </div>
                                            )
                                        }                                    
                                        
                                </form>
                                    {!isAnimatedOverlay && feedback &&
                                    (
                                        <div className='box-overlay' style={{background: feedback === CORRECT ? 'rgba(120, 187, 123, .7)' : 'rgba(211, 9, 9, .7)'}} onAnimationEnd={
                                            () => {
                                                handleAnimationEnd({
                                                    anim:isAnimatedOverlay, setAnim: setIsAnimatedOverlay
                                                })
                                            }
                                        }>
                                        <div className={`d-flex flex-column align-items-center justify-content-center border border-2 rounded-2 shadow p-3 mb-5 ${feedback === CORRECT ? 'border-success' : 'border-danger'}`} style={{width: '30vw', height: '150px', background: "rgb(var(--bs-light-rgb))"}}>
                                                <span className='material-symbols-outlined my-3 fs-1' style={{color: feedback === CORRECT ? 'rgb(var(--bs-success-rgb))' : 'rgb(var(--bs-danger-rgb))'}}>
                                                    {feedback === CORRECT ? 'check_circle' :  'cancel'}
                                                </span>
                                                <span className='fs-4'>{feedback}</span>
                                            </div>
                                        </div>
                                    )
                                    }
                                </div>

                                {isStreaksOpen && (
                                    <div                                    
                                    ref={stRef.setFloating}
                                    style={stFloatingStyles}
                                    {...streaksTooltipFloatingProps}
                                    >
                                    Streaks
                                    </div>
                                )}
                            </div>                    
                        )
                        :(
                            (!ldError)
                            ?(
                                (!isAnimatedEndingScreen 
                                    ?(                                        
                                        <div className='quiz-complete fade-in-out'>
                                            <div className="left-half me-2">TEST</div>
                                            <div className="right-half">OVER</div>
                                        </div>
                                    )
                                    :(
                                        <div className='container p-3 aos-init aos-animate' style={{backgroundColor: 'var(--bs-gray-200)', maxWidth: '400px', width: '50vw', userSelect: 'none'}}>
                                            <h1 className='mb-4 text-center'>Test Over</h1>
                                            <div className='d-flex justify-content-around align-items-center'>
                                                <span  style={{fontSize: "2vw"}}>Score: {points}</span>
                                                <span className='d-inline-flex align-items-center'>
                                                    <img width="48" height="48" src="https://img.icons8.com/doodle/48/fire-element--v1.png" alt="fire-element--v1"/> 
                                                    <span style={{fontSize: "3vw"}}>{streaks}</span>
                                                </span>
                                            </div>

                                            <div className='d-flex justify-content-around' style={{margin: '8vh 0'}}>
                                                <div className='d-inline-flex flex-column align-items-center' onClick={() => {
                                                    refreshPage()
                                                }}>
                                                    <span className="material-symbols-outlined text-white bg-primary bg-gradient rounded-5 p-1" style={{fontSize: '3vw', cursor:'pointer'}}>
                                                        home
                                                    </span>
                                                    <span className='text-primary'>Home</span>
                                                </div>
                                                <div className='d-inline-flex flex-column align-items-center' onClick={() => {
                                                    restart(test)
                                                }}>
                                                <span className="material-symbols-outlined text-white bg-danger bg-gradient rounded-5 p-1" style={{fontSize: '3vw', cursor:'pointer'}}>
                                                    directory_sync
                                                </span>
                                                <span className='text-danger'>Restart</span>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    )
                                )
                            )
                            :(
                                <p style={{margin: "20vh 0"}}>{ldError}</p>
                            )
                            
                            
                        )
                    )
                    
                }
                
                
            </div>
        )
        :(
            <div className='login-required'>
                <p>You need to <Link to='/login'>login</Link> to do the test</p>
            </div>
        )
    )
}

export default DoTest