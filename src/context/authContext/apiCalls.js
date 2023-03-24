import axios from "../../axios"
import { loginFailure, loginStart, loginSuccess } from "./AuthAction"
// login
export const LoginCall = async(user, dispatch, navigate)=>{
    dispatch(loginStart())  
    try{
       const res = await axios.post("/auth/login", user)
       dispatch(loginSuccess(res.data.token))
       navigate("/")
    }catch(e){
        dispatch(loginFailure(e))
    }
 }
