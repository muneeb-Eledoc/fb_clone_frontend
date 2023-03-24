const PostReducer = (state, action)=>{
    switch (action.type){
        case "GET_POSTS_START":
           return {
                posts: [],
                isFetching: true,
                error: null
            }
        case "GET_POSTS_SUCCESS":
        return {
            posts: action.payload,
            isFetching: false,
            error: null
        }
        case "GET_POSTS_FAILURE":
        return {
            posts: [],
            isFetching: false,
            error: action.payload
        }
        case "ADD_POST_START":
            return {
                 posts: state.posts,
                 isFetching: true,
                 error: null
             }
         case "ADD_POST_SUCCESS":
         return {
             posts: [...state.posts, action.payload],
             isFetching: false,
             error: null
         }
         case "ADD_POST_FAILURE":
         return {
             posts: state.posts,
             isFetching: false,
             error: action.payload
         }
        default: 
        return { ...state }
    }
}

export default PostReducer