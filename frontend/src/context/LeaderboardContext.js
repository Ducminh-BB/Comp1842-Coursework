import { createContext, useReducer } from "react";

export const LeaderboardContext = createContext()
const leaderboardReducer = (state, action) => {
    switch(action.type){
        case 'VIEW_LEADERBOARD':
            return {
                ld: action.payload
            }
        case 'UPDATE_FIELD':
            return {               
                ld: state.ld.map((l) => 
                    (l.test_type === action.payload.test_type && l.user_email === action.payload.user_email)
                    ? { ...l,
                        highScore: l.highScore,
                        streaks: l.streaks
                    }
                    : l
                )
            }
        case 'ADD_FIELD':
            return {
                ld: [action.payload, ...(state.ld || [])]
            }
        
        default:
            return state
    }
}

export const LeaderboardContextProvider = ({children}) => {

    const [state, ldDispatch] = useReducer(leaderboardReducer, {
        ld: null
    })

    return (
        <LeaderboardContext.Provider value={{...state, ldDispatch}}>
            {children}
        </LeaderboardContext.Provider>
    )
    
}