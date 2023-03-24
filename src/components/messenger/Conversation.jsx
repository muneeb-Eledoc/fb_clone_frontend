import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import "./messenger.scss"
import instance from '../../axios'
import { format } from "timeago.js"

export default function Conversation({ currentChat, chat, sentByMe, currentUser, arrivedMessage, setRecipient, setCurrentChat, setMessages, onlineStatus }) {
    const [indiviualRecipient, setIndiviualRecipient] = useState({})
    const [lastMessage, setLastMessage] = useState({})

    useEffect(() => {
        const getMem = async () => {
            setIndiviualRecipient({})
            if(!currentUser._id) return
            const res = await instance.get(`/users?userId=${chat?.members?.find(m => m !== currentUser._id)}`);
            setIndiviualRecipient(res.data)
        }
        getMem()
    }, [chat, currentUser])

    useEffect(()=>{
        const fetchLastMessage = async ()=>{
            const res = await instance.get('/message/lastmessage/'+chat._id)
            setLastMessage(res.data)
        }
        fetchLastMessage()
    }, [chat._id])

    useEffect(()=>{
        if(arrivedMessage?.sender===chat?.members?.find(m => m !== currentUser._id)){
            setLastMessage(arrivedMessage)
        }
    }, [arrivedMessage, chat, currentUser?._id])

    useEffect(()=>{
        if(sentByMe?.receiverId===chat?.members?.find(m => m !== currentUser._id)){
            setLastMessage(sentByMe)
        }
    }, [sentByMe, chat, currentUser?._id])

    return (
        <div onClick={() => {
            if(currentChat?._id!==chat._id){
                setMessages([]); 
            }
            setCurrentChat(chat);
            setRecipient(indiviualRecipient)
            }}>
            <div className={`conversation ${currentChat?._id===chat?._id&&' active'}`}>
                {onlineStatus && <span className="online__indicator"></span>}
                <img className={`${onlineStatus?'active__now':''}`} src={indiviualRecipient.profilePicture ? indiviualRecipient.profilePicture : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} alt="" />
                <div className='conversation__info'>
                    <span>{indiviualRecipient.username}</span>
                    <span className='last__message'>{lastMessage?.text}</span>
                </div>
                {lastMessage&&<span className="time__stamp">{format(lastMessage.createdAt)}</span>}
            </div>
        </div>
    )
}
