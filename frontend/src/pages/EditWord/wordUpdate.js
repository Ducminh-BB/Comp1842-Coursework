import React, { useState } from 'react'
import { useVocabsContext } from '../../hooks/useVocabContext'
import { handleUpdate } from '../../handleAPI/Vocabs/vocabsAPI'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'

const UpdateWordForm = () => {

    const location = useLocation()
    const { vocab } = location.state
    const { account } = useAuthContext()

    const navigate = useNavigate()

    const { dispatch } = useVocabsContext()
    const [formData, setFormData] = useState({
        _id: vocab._id,
        english: vocab.english || '',
        german: vocab.german || '',
        vietnamese: vocab.vietnamese || ''
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
            await handleUpdate(formData._id, dispatch, formData, account.token)
            navigate('/words')
            alert('Update a word successfully')
        }
        catch (err)
        {
            console.error('failed to update')
        }
        
    }

    return (
        <div className='container wrapper'>
            <div className='form-container'>
                <h1 className='mb-4 text-center'>Update A Word</h1>
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
                        name='german' value={formData.german} required />
                    </div>
                    <div className='input-group w-100'>
                        <span className="input-group-text">
                        <img
                            src="https://flagcdn.com/w40/vn.png"
                            width="30"
                            alt="Vietnam" className="flag-icon" />
                        </span>
                        <input className='form-control' type='text' onChange={handleChange} placeholder="Vietnamese"
                        name='vietnamese' value={formData.vietnamese} required />
                    </div>

                    <button className='btn-fabulous'>Update</button>
                </form>
            </div>
            
        </div>
    )
}

export default UpdateWordForm