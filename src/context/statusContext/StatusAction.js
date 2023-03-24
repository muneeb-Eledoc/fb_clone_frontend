export const statusStart = ()=>(
    {
        type: "GET_STATUS_START"
    }
)

export const statusSuccess = (status)=>(
    {
        type: "GET_STATUS_SUCCESS",
        payload: status
    }
)

export const statusFailure = (error)=>(
    {
        type: "GET_STATUS_FAILURE",
        payload: error
    }
)

export const addstatusStart = ()=>(
    {
        type: "ADD_STATUS_START"
    }
)

export const addstatusSuccess = (status)=>(
    {
        type: "ADD_STATUS_SUCCESS",
        payload: status
    }
)

export const addstatusFailure = (error)=>(
    {
        type: "ADD_STATUS_FAILURE",
        payload: error
    }
)

