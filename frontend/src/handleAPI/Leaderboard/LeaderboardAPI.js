import axios from "axios"
import { handleConfirmation } from "../Vocabs/vocabsAPI"
import { getAPIurl } from "../getAPIurl"

export const fetchLeaderboard = async (dispatch, token) => {
    await axios.get(`${getAPIurl('production')}/leaderboard`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        dispatch({type: 'VIEW_LEADERBOARD', payload: res.data})
    })
    .catch(err => {
        throw new Error()
    })
}

export const isFieldAvailable = async (email, test_type, token) => {
    try
    {
        const data = await axios.get(`${getAPIurl('production')}/leaderboard/${test_type}/${email}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return (data && data.data.test_type === test_type) ? true : false
    } catch (err)
    {
        return false
    }
}

export const handleAddField = async (dispatch, formData, token) => {
    await axios.post(`${getAPIurl('production')}/leaderboard`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => 
            dispatch({type: 'ADD_FIELD', payload: formData})
        )
        .catch(err => {
            throw new Error()
        })
}

export const handleUpdateField = async (email, dispatch, formData, token) => {
    await axios.put(`${getAPIurl('production')}/leaderboard/${formData.test_type}/${email}`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => 
            dispatch({type: 'UPDATE_FIELD', payload: formData})
        )
        .catch(err => {
            throw new Error()
        })
}

export const handleDeleteField = async (email, test_type, dispatch, token) => {
    if (handleConfirmation('Are you sure to delete this user record?')){
        await axios.delete(`${getAPIurl('production')}/leaderboard/${test_type}/${email}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => 
                dispatch({type: 'DELETE_FIELD', payload: {email, test_type}})
            )
            .catch(err => {
                throw new Error()
            })
    }
}

