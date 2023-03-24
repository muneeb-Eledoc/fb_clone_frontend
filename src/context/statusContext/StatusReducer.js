const StatusReducer = (state, action) => {
    switch (action.type) {
        case "GET_STATUS_START":
            return {
                status: [],
                isFetching: true,
                error: null
            }
        case "GET_STATUS_SUCCESS":
            return {
                status: action.payload,
                isFetching: false,
                error: null
            }
        case "GET_STATUS_FAILURE":
            return {
                status: [],
                isFetching: false,
                error: action.payload
            }
        case "ADD_STATUS_START":
            return {
                status: state.status,
                isFetching: false,
                error: null
            }
        case "ADD_STATUS_SUCCESS":
            return {
                status: [...state.status, action.payload],
                isFetching: false,
                error: null
            }
        case "ADD_STATUS_FAILURE":
            return {
                status: state.status,
                isFetching: false,
                error: action.payload
            }
        default:
            return { ...state }
    }
}

export default StatusReducer