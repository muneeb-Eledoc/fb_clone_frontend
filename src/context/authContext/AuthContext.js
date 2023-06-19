import AuthReducer from "./AuthReducer";
import { createContext, useEffect, useReducer, useState } from "react"
import axios from "../../axios"
import { io } from "socket.io-client";
import { useRef } from "react";

const INITIAL_STATE = {
    token: localStorage.getItem("token") || null,
    isFetching: false,
    error: null
}
export const AuthContext = createContext(INITIAL_STATE)

const socket = io("http://localhost:8901")

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [userr, setuserr] = useState({})
    const [showSideBar, setShowSideBar] = useState(false)
    const [showMiniMessenger, setShowMiniMessenger] = useState(false)
    const [arrivedMessage, setArrivedMessage] = useState(null)
    const [miniChat, setMiniChat] = useState({})
    const audio = useRef(new Audio('/activetone.mp3'))

    useEffect(() => {
        state.token && localStorage.setItem("token", state.token)
    }, [state.token])

    useEffect(() => {
        const getUser = async (token) => {
            try {
                const res = await axios.get("/users/current", {
                    headers: {
                        token: token
                    }
                })
                setuserr(res.data.user)
                socket.emit("addUser", res.data.user._id)
                socket.on("getUsers", (users) => {
                    setOnlineUsers(users)
                })
            } catch (e) { }
        }
        getUser(localStorage.getItem("token"))
    }, [state.token])

    useEffect(() => {
        try {
            socket.on("getMessage", (data) => {
                setArrivedMessage({
                    _id: Date.now(),
                    sender: data.sender,
                    text: data.text,
                    createdAt: Date.now(),
                    receiverId: data.receiverId
                })
                if (window.location.pathname !== '/messenger' && !showMiniMessenger) {
                    setShowMiniMessenger(true)
                }
                // setTimeout(() => {
                //     try {
                //         // eslint-disable-next-line
                //         audio.current?.play()
                //     } catch (e) {
                //     }
                // }, 200);
            })
        } catch (e) { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AuthContext.Provider value={
            {
                user: userr,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
                setuserr,
                socket,
                onlineUsers,
                showSideBar,
                setShowSideBar,
                showMiniMessenger,
                setShowMiniMessenger,
                setArrivedMessage,
                arrivedMessage,
                miniChat,
                setMiniChat,
                audio
            }
        }>
            {children}
        </AuthContext.Provider>
    )
}