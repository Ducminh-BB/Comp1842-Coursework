import { useContext } from "react";
import { LeaderboardContext } from "../context/LeaderboardContext";


export const useLeaderboardContext = () => {
    const context = useContext(LeaderboardContext)

    if (!context){
        throw Error('useLeaderboardContext must be used inside an LeaderboardContextProvider!')
    }

    return context
}