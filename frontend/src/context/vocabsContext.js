import { createContext, useReducer } from "react";

export const VocabsContext = createContext()
const vocabsReducer = (state, action) => {
    switch(action.type){
        case 'VIEW_ALL_VOCABS':
            return {
                vocabs: action.payload
            }
        case 'DELETE_VOCAB':
            return {
                vocabs: state.vocabs.filter((v) => v._id !== action.payload._id)
            }
        case 'EDIT_VOCAB':
            
            return {               
                vocabs: state.vocabs.map((vocab) => 
                    vocab._id === action.payload._id 
                    ? { ...vocab,
                        english: vocab.english,
                        german: vocab.german
                    }
                    : vocab
                )
            }
        case 'CREATE_VOCAB':
            return {
                vocabs: [action.payload, ...(state.vocabs || [])]
            }
        
        default:
            return state
    }
}

export const VocabsContextProvider = ({children}) => {

    const [state, dispatch] = useReducer(vocabsReducer, {
        vocabs: null
    })

    return (
        <VocabsContext.Provider value={{...state, dispatch}}>
            {children}
        </VocabsContext.Provider>
    )
    
}