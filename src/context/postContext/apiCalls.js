import axios from "../../axios"
import { addpostFailure, addpostStart, addpostSuccess, postFailure, postStart, postSuccess } from "./PostAction"

// getting Timeline posts
export const getPosts = async(username, id, dispatch)=>{
    dispatch(postStart())  
    try{
        const res = username?
        await axios.get("/post/profile/" + username)
        : await axios.get(`/post/timeline/${id}`);
       dispatch(postSuccess(res.data))
    }catch(e){
        dispatch(postFailure(e))
    }
 }

 export const addPost = async(post, dispatch)=>{
dispatch(addpostStart())  
try{
    const res = await axios.post(`/post`, post, {
       headers: {
           token: localStorage.getItem("token")
       }
   })
   dispatch(addpostSuccess(res.data))
   return res.data
}catch(e){
    dispatch(addpostFailure(e))
}
}