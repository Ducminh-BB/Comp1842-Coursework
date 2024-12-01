import React, { useState } from 'react'
import { useVocabsContext } from '../../hooks/useVocabContext'
import { handleAdd } from '../../handleAPI/Vocabs/vocabsAPI'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import './NewWord.css'


const CreateNewWords = () => {
    const navigate = useNavigate()
    const { account } = useAuthContext()

    const { dispatch } = useVocabsContext()
    const [formData, setFormData] = useState({
        english: '',
        german: '',
        vietnamese: ''
      });

    const handleChange = async (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try
        {
            await handleAdd(dispatch, formData, account.token)
            navigate('/words')
            alert("Added a word successfully")
        }
        catch (err)
        {
            alert("Can't add a word to table")
            navigate('/words')
        }
        
    }

    return (
        <div className='container wrapper'>
            <div className='form-container'>
                <h1 className='mb-4 text-center'>Add A Word</h1>
                <form className="d-flex flex-column align-items-center" onSubmit={handleSubmit}>
                    <div className='input-group w-100'>
                        <span className="input-group-text">
                        <img
                            src="https://flagcdn.com/gb.svg"
                            width="30"
                            alt="United Kingdom" className="flag-icon" />
                        </span>
                        <input className='form-control' type='text' onChange={handleChange} placeholder="English"
                        name='english' value={formData.english} required />
                    </div>
                    <div className='input-group w-100'>
                        <span className="input-group-text">
                        <img
                            src="https://flagcdn.com/w40/de.png"
                            width="30"
                            alt="Germany" className="flag-icon" />
                        </span>
                        <input className='form-control' type='text' onChange={handleChange} placeholder="German"
                        name='english' value={formData.german} required />
                    </div>
                    <div className='input-group w-100'>
                        <span className="input-group-text">
                        <img
                            src="https://flagcdn.com/w40/vn.png"
                            width="30"
                            alt="Vietnam" className="flag-icon" />
                        </span>
                        <input className='form-control' type='text' onChange={handleChange} placeholder="Vietnamese"
                        name='english' value={formData.vietnamese} required />
                    </div>

                    <button className='btn-fabulous'>Add</button>
                </form>
            </div>
            
        </div>
        
    )
}

export default CreateNewWords