const AuthReducer = (state, action)=>{
    switch (action.type){
        case "LOGIN_START":
           return {
                token: null,
                isFetching: true,
                error: null
            }
        case "LOGIN_SUCCESS":
        return {
            token: action.payload,
            isFetching: false,
            error: null
        }
        case "LOGIN_FAILURE":
        return {
            token: null,
            isFetching: false,
            error: action.payload
        };
        case "LOGOUT":
            return {
                token: null,
                isFetching: false,
                error: false
        };  
        default: 
        return { ...state }
    }
}

export default AuthReducer