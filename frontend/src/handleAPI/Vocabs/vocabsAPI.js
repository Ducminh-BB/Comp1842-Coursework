import axios from 'axios'
import { getAPIurl } from '../getAPIurl'

export const handleConfirmation = (message) => {
    const isAccepted = window.confirm(message)

    return isAccepted ? true : false
}

export const fetchVocabs = async (dispatch) => {
    await axios.get(`${getAPIurl('production')}/vocabs`)
        .then(res => {
            dispatch({type: 'VIEW_ALL_VOCABS', payload: res.data})
        })
        .catch(err => {
            throw new Error()
        })
}

export const fetchOneVocab = async (vocab) => {
    try {
        const res = await axios.get(`${getAPIurl('production')}/vocabs/${vocab._id}`)
        return res.data
    } catch (err) {
        throw new Error()
    }
}


export const handleDelete = async (vocab, dispatch, token) => {
    
    if (handleConfirmation('Are you sure to delete this row?'))
    {
        await axios.delete(`${getAPIurl('production')}/vocabs/${vocab._id}`, {
            headers: 
            {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => 
                dispatch({type: 'DELETE_VOCAB', payload: res.data})
            )
            .catch(err => {
                throw new Error()
            })
    }
}

export const handleUpdate = async (vocabId, dispatch, formData, token) => {
    await axios.put(`${getAPIurl('production')}/vocabs/${vocabId}`, formData, {
        headers: 
        {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => 
            dispatch({type: 'EDIT_VOCAB', payload: formData})
        )
        .catch(err => {
            throw new Error()
        })
}

export const handleAdd = async (dispatch, formData, token) => {
    
    await axios.post(`${getAPIurl('production')}/vocabs`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => 
            dispatch({type: 'CREATE_VOCAB', payload: formData})
        )
        .catch(err => {
            throw new Error()
        })

}

