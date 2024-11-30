import axios from "axios"

export const getAllTests = async (token) => {
    try {
        const ts = await axios.get(`${getAPIurl('production')}/test`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return ts.data
    } catch (err) {
        throw new Error()
    }
}

export const getAllTestsByEmail = async (email, token) => {
    try {
        const ts = await axios.get(`${getAPIurl('production')}/test/email/${email}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return ts.data
    } catch (err) {
        throw new Error()
    }
}

export const handleAddTest = async (formData, token) => {
    try {
        const t = await axios.post(`${getAPIurl('production')}/test`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return t.data
    } catch (err) {
        throw new Error()
    }
            
}

export const handleUpdateScore = async (id, score, token) => {
    try {
        await axios.put(`${getAPIurl('production')}/test/${id}`, {
            score: score
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (err) {
        throw new Error()
    }
}

export const handleAddTestDetail = async (id, formData, token) => {
    try {
        await axios.post(`${getAPIurl('production')}/test/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (err) {
        throw new Error()
    }
            
}

export const handleDeleteTest = async (id, token) => {
    try {
        await axios.delete(`${getAPIurl('production')}/test/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (err) {
        throw new Error()
    }
}

export const handleDeleteTestsByEmail = async (email, token) => {
    try {
        await axios.delete(`${getAPIurl('production')}/test/email/${email}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (err) {
        throw new Error()
    }
}
