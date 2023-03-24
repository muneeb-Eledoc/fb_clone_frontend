export const postStart = ()=>(
    {
        type: "GET_POSTS_START"
    }
)

export const postSuccess = (posts)=>(
    {
        type: "GET_POSTS_SUCCESS",
        payload: posts
    }
)

export const postFailure = (error)=>(
    {
        type: "GET_POSTS_FAILURE",
        payload: error
    }
)

export const addpostStart = ()=>(
    {
        type: "ADD_POST_START"
    }
)

export const addpostSuccess = (post)=>(
    {
        type: "ADD_POST_SUCCESS",
        payload: post
    }
)

export const addpostFailure = (error)=>(
    {
        type: "ADD_POST_FAILURE",
        payload: error
    }
)

