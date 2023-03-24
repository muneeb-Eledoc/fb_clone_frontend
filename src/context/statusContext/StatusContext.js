import { createContext, useReducer} from "react"
import StatusReducer from "./StatusReducer";

const INITIAL_STATE = {
    status: [],
    isFetching: false,
    error: null
}
export const StatusContext = createContext(INITIAL_STATE)

export const StatusContextProvider =({children})=>{
    const [state, dispatch] = useReducer(StatusReducer, INITIAL_STATE)
 
    return(
        <StatusContext.Provider value={
           {
               status: state.status,
               isFetching: state.isFetching,
               error: state.error,
               dispatch
           }
        }>
            {children}
        </StatusContext.Provider>
    )
}