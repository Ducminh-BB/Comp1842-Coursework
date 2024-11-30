import React, { useState } from 'react'
import { useVocabsContext } from '../../hooks/useVocabContext'
import { handleUpdate } from '../../handleAPI/Vocabs/vocabsAPI'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import './WordUpdate.css'

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
        <form className="update-form" onSubmit={handleSubmit}>
            <h3>Update A Word</h3>

            <label>English:</label>
            <input type='text' onChange={handleChange}
            name='english' value={formData.english} />

            <label>German:</label>
            <input type='text' onChange={handleChange}
            name='german' value={formData.german} />

            <label>Vietnamese:</label>
            <input type='text' onChange={handleChange}
            name='vietnamese' value={formData.vietnamese} />

            <button>Update</button>
        </form>
    )
}

export default UpdateWordForm