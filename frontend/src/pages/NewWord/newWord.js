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
        <form className="update-form" onSubmit={handleSubmit}>
            <h3>Add A Word</h3>

            <label>English:</label>
            <input type='text' onChange={handleChange}
            name='english' value={formData.english} required />

            <label>German:</label>
            <input type='text' onChange={handleChange}
            name='german' value={formData.german} required />

            <label>Vietnamese:</label>
            <input type='text' onChange={handleChange}
            name='vietnamese' value={formData.vietnamese} required />

            <button>Add</button>
        </form>
    )
}

export default CreateNewWords