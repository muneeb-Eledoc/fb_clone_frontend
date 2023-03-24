import axios from "../../axios"
import { statusFailure, statusStart, statusSuccess } from "./StatusAction"

export const getStatus = async (users, dispatch) => {
    dispatch(statusStart())
    try {
        let q = ''
        users.forEach((userId, i)=>{
            if((i+1)===users.length){
                q = q + userId
            }else{
                q = q + userId+'_'
            }
        })
        const res = await axios.get(`/status?users=${q}`,
        {
            headers: {
                token: localStorage.getItem("token"),
            }
        })
        dispatch(statusSuccess(res.data))
    } catch (e) {
        dispatch(statusFailure())
    }
}

// export const addPost = async(post, dispatch)=>{
//     dispatch(addpostStart())  
//     try{
//         const res = await axios.post(`/post`, post, {
//            headers: {
//                token: localStorage.getItem("token")
//            }
//        })
//        dispatch(addpostSuccess(res.data))
//        return res.data
//     }catch(e){
//         dispatch(addpostFailure(e))
//     }
//     }