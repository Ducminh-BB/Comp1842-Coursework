import { createContext, useReducer, useEffect} from 'react'

export const AuthContext = createContext()

const authReducer = (state, action) => {
    switch (action.type)
    {
        case 'LOGIN':
            return { account: action.payload }
        case 'LOGOUT':
            return { account: null}
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        account: null
    })

    useEffect(() => {

        if (localStorage.getItem('account'))
        {
            sessionStorage.removeItem('account')
        }

        const item = (localStorage.getItem('account')) ? localStorage.getItem('account') : sessionStorage.getItem('account')

        const account = JSON.parse(item)

        if (account) {
            dispatch({type: 'LOGIN', payload: account})
        }
    }, [])

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}