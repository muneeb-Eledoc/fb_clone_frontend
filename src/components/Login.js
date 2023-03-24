import { CircularProgress } from '@mui/material';
import React, {useRef, useContext, useState, useEffect}from 'react'
import { Link } from 'react-router-dom';
import { LoginCall } from '../context/authContext/apiCalls';
import { AuthContext } from '../context/authContext/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate()
    const { isFetching, dispatch } = useContext(AuthContext)
    const email = useRef()
    const password = useRef()
    const handleSubmit = (e)=>{
        e.preventDefault()
       LoginCall({
           email: email.current.value,
           password: password.current.value
       }, dispatch, navigate)
    }
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginTitle">Eledoc</h3>
                    <span className="loginDesc">Eledoc helps you connect and share with the people in your life.</span>
                </div>
                <div className="loginRight">
                    <form onSubmit={handleSubmit}>
                        <div className="loginBox" >
                            <input type="text" placeholder='Email' ref={email}/>
                            <input type="password" placeholder='Password' ref={password}/>
                            <button className="loginButton" type='submit'>{isFetching? <CircularProgress sx={{color: "white", marginTop: '6px'}} size={24}/> : "Login"}</button>
                            <span className="loginForgotpass">Forgotten password!</span>
                            <Link to="/register" style={{textDecoration:"none", textAlign:"center"}} className="signupButton" >{isFetching? <CircularProgress sx={{color: "white", marginTop: '6px'}} size={24}/> : "Sign Up"}</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
