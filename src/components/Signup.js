import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axios';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';

export default function Signup() {
    const navigate = useNavigate()
    const [file, setfile] = useState(null)
    const [userc, setUserc] = useState({email: "", username: "", password: "", cpassword: "", profilePicture: ""});
    const handleSignUp = async ()=>{
        if(userc.password === userc.cpassword){
            if(file){
                // const data = new FormData();
                // const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + file.name;
                // data.append("name", filename)
                // data.append("file", file);
                let filename = (new Date().getTime()).toString() + file.name
                const storageRef = ref(storage, '/' + filename);
                const uploadTask = uploadBytesResumable(storageRef, file);
    
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // const fprogress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    },
                    (error) => {
    
                    },
                    async () => {
                        const url = await getDownloadURL(uploadTask.snapshot.ref)
                       
                        try{
                           const dataraw = {profilePicture: url, p: filename, username: userc.username, email: userc.email, password: userc.password, }
                           const res = await axios.post(`/auth/register`, dataraw);  
                           res && navigate("/login")
        
                             }catch(e){console.log(e)}
                    }
                )
      
            }
        }else{
            alert("Password Doesn't Match")
        }
    }
   const onChange = (e)=>{
       setUserc({...userc, [e.target.name]: e.target.value,})
   }
    return (
        <>
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginTitle">Eledoc</h3>
                    <span className="loginDesc">Eledoc helps you connect and share with the people in your life.</span>
                </div>
                <div className="loginRight">
                      <div className="loginBox" style={{height: "400px"}}>
                        {file && (
                            <div className='pre-image-container-signup'>
                                <img src={URL.createObjectURL(file)} alt="pro" className='pre-image' style={{width: 60, height: 60, borderRadius: "50%"}}/>
                                <CancelPresentationIcon className="pre-cancell" onClick={()=> setfile(null)}/>
                            </div>
                        )}
                      {!file && <label htmlFor='profilepic' className='profileLabel'><PermMediaIcon className='profileLabelIcon' htmlColor="tomato"/> Choose Profile</label>}
                      <input type="file" id='profilepic' accept='image/*' style={{display: "none"}}  onChange={(e)=> setfile(e.target.files[0])}/>                          
                      <input  type="username" placeholder='Username' name='username' onChange={onChange}/>
                          <input type="email" placeholder='Email' name='email' onChange={onChange}/>
                          <input type="password" placeholder='Password' name='password' onChange={onChange}/>
                          <input type="password" placeholder='Confirm Password' name='cpassword' onChange={onChange}/>
                          <button className="loginButton" onClick={handleSignUp}>Sign Up</button>
                          <Link to="/login" style={{textDecoration:"none", textAlign:"center"}} className="signupButton">Already have an Account</Link>
                      </div>
                </div>
            </div>
        </div>
        </>
    )
}
