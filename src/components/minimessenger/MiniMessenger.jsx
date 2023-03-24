import { Close, EmojiEmotions, Send } from '@mui/icons-material'
import { Avatar, CircularProgress } from '@mui/material'
import { useCallback, useState } from 'react'
import { useRef } from 'react'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/authContext/AuthContext'
import axios from "../axios"
import './style.scss'
import moment from 'moment'
import { formatMessages } from '../utils/formatMessages'
import EmojiPicker from 'emoji-picker-react';

const MiniMessenger = () => {
    const { user, showMiniMessenger, arrivedMessage, setMiniChat, miniChat, onlineUsers, socket, setShowMiniMessenger } = useContext(AuthContext)
    const [messages, setMessages] = useState([])
    const [formatedMessages, setFormatedMessages] = useState([])
    const [indiviualRecipient, setIndiviualRecipient] = useState({})
    const [newMessage, setNewMessage] = useState('')
    const [showPicker, setShowPicker] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const ref = useRef(null)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const observer = useRef()
    const stayRef = useRef()

    let options = {
        root: null,
        rootMargin: '-30px',
        threshold: 0
    }

    useEffect(() => {
        const fetch__conversation = async () => {
            try {
                if (arrivedMessage?.receiverId && Object.keys(miniChat).length === 0) {
                    const res = await axios.get("/conversation/" + arrivedMessage?.sender, {
                        headers: {
                            token: localStorage.getItem("token")
                        }
                    })
                    setMiniChat(res.data)
                }
            } catch (e) {
                console.log(e)
            }
        }
        fetch__conversation()
    }, [arrivedMessage, setMiniChat, miniChat])

    const callback = (enteries) => {
        if (enteries[0].isIntersecting) {
            const getMessages = async () => {
                if (page === total) return
                setLoading(true)
                const res = await axios.get("/message/" + miniChat?._id + '?page=' + page)
                if (res.data.messages.length > 0) {
                    stayRef.current?.scrollIntoView({})
                    setFormatedMessages(formatMessages([...messages, ...res.data.messages]))
                    setMessages([...messages].concat(res.data.messages))
                    setPage(prev => prev + 1)
                }
                setLoading(false)
            }
            getMessages()
        }
    }

    const containerRef = useCallback((node) => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(callback, options);

        if (node) observer.current.observe(node)
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options])

    useEffect(() => {
        arrivedMessage && miniChat?.members?.includes(arrivedMessage.sender) && setFormatedMessages(formatMessages([...messages, arrivedMessage])); setMessages([...messages, arrivedMessage])

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arrivedMessage, miniChat])

    useEffect(() => {
        const getMessages = async () => {
            setFormatedMessages([])
            setMessages([])
            setPage(1)
            setLoading(true)
            const res = await axios.get("/message/" + miniChat?._id)
            if (res.data) {
                setFormatedMessages(formatMessages(res.data.messages))
                setTotal(res.data.total)
                setMessages(res.data.messages)
                ref.current?.scrollIntoView({})
            }
            setLoading(false)
        }
        getMessages()
    }, [miniChat])

    useEffect(() => {
        const getMem = async () => {
            const res = await axios.get(`/users?userId=${miniChat?.members?.find(m => m !== user._id)}`);
            setIndiviualRecipient(res.data)
        }
        getMem()
    }, [miniChat, user])

    useEffect(() => {
        if (!showMiniMessenger) return
        !loading && ref.current.scrollIntoView({
            behavior: "smooth",
        })
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formatedMessages, showMiniMessenger])

    const getOnlineUser = (recipientId) => {
        return onlineUsers.find((user) => user.userId === recipientId) ? true : false
    }

    const handleMessageSend = async (e) => {
        e.preventDefault();
        if (!newMessage) return

        let text = newMessage.trim()
        const message = {
            sender: user._id,
            conversationId: miniChat._id,
            text
        }
        const receiverId = miniChat.members.find(m => m !== user._id)
        try {
            const res = await axios.post("/message", message)
            setFormatedMessages(formatMessages([...messages, res.data]))
            setMessages([...messages, res.data])
            socket.emit("sendMessage", {
                sender: user._id,
                receiverId,
                text
            })
            fetch('http://localhost:8800/api/subscribe', {
                method: 'POST',
                body: JSON.stringify({
                    subscription: indiviualRecipient.subscriptions,
                    message: {
                        title: 'New Message by '+user.username,
                        icon: user.profilePicture,
                        description: newMessage
                    }
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            setNewMessage("")
            setShowPicker(false)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        socket.on('getTyping', (data) => {
            setIsTyping(data)
        })
    }, [socket])

    useEffect(() => {
        if (isTyping) {
            setTimeout(() => {
                setIsTyping(false)
            }, 2000);
        }
    }, [isTyping])

    return showMiniMessenger ? window.location.pathname !== '/messenger' && (
        <div className='mini_messenger'>
            <div className="header">
                <div className="header_left">
                    <div className='avatar_container'>
                        <Avatar className="avatar"
                            alt="Remy Sharp"
                            src={indiviualRecipient.profilePicture}
                            sx={{ width: 32, height: 32 }}
                        />
                        {getOnlineUser(indiviualRecipient._id) && <span className="active_dot"></span>}
                    </div>
                    <div className="header_info">
                        <span className='username'>{indiviualRecipient.username ? indiviualRecipient.username : '...'}</span>
                        <span className='active_status'>{getOnlineUser(indiviualRecipient._id) ? isTyping? <span className='active_status_active'>typing...</span> : <span className='active_status_active'>Active now</span> : 'Offline'}</span>
                    </div>
                </div>
                <div className="header_right" onClick={()=>{ setMiniChat({}); setShowMiniMessenger(false)}}>
                    <Close  />
                </div>
            </div>
            <div className="main_screen">
                {loading &&
                    <div className="loadingContainer">
                        <CircularProgress />
                    </div>}
                {formatedMessages.sort((m1, m2) => {
                    return new Date(m1.timeStamp) - new Date(m2.timeStamp)
                }).map((mess, index) => {
                    return (
                        <div key={mess.timeStamp}>
                            <div className="date_time_stamp-wrapper">
                                <div className="date_time_stamp">{mess.timeStamp}</div>
                            </div>
                            {mess.messages.sort((m1, m2) => { return new Date(m1.createdAt) - new Date(m2.createdAt) }).map((m, messIndex) => (
                                <div key={m._id}>
                                    {index === 0 && messIndex === 1 && <div ref={containerRef}></div>}
                                    <Message message={m} own={m.sender === user._id} indiviualRecipient={indiviualRecipient} />
                                    {index === 0 && messIndex === 2 && <div ref={stayRef}></div>}
                                </div>
                            ))}
                        </div>
                    )
                })}
                <span ref={ref}></span>
            </div>
            <div className="bottom">
                <form className="send_bar" onSubmit={handleMessageSend}>
                    <div className="send_bar_left">
                        <input type="text" placeholder='Message' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                        <div className='emoji'>
                            <EmojiEmotions onClick={() => setShowPicker(!showPicker)} />
                            {showPicker && <div className="picker-w">
                                <div className="picker">
                                    <EmojiPicker height={450} width={340} onEmojiClick={(e) => setNewMessage(prev => prev + e.emoji)} />
                                </div>
                            </div>}
                        </div>
                    </div>
                    <div className="send_bar_right">
                        <button className="send_btn" type='submit'>
                            <Send />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null
}

function Message({ own, message, indiviualRecipient }) {

    return (
        <>
            <div className={own ? 'message own' : 'message'}>
                <div className="text">
                    {!own && <span className='avatar'>
                        <Avatar
                            alt="Remy Sharp"
                            src={indiviualRecipient.profilePicture}
                            sx={{ width: 25, height: 25 }}
                        />
                    </span>}
                    {message.text}
                    <span className='timestamp'>{moment(message.createdAt).format('LT')}</span>
                </div>
            </div>
        </>
    )
}

export default MiniMessenger