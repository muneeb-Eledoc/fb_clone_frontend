import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/authContext/AuthContext"
import Navbar from '../navbar/Navbar'
import Conversation from "./Conversation"
import Message from "./Message"
import axios from "../axios"
import "./messenger.scss"
import { formatMessages } from "../utils/formatMessages"
import { CircularProgress } from "@mui/material"


export default function Messenger() {
    const { user, socket, onlineUsers, arrivedMessage } = useContext(AuthContext)
    const [formatedMessages, setFormatedMessages] = useState([])
    const [conversation, setConversation] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [recipient, setRecipient] = useState({})
    const [sentByMe, setSentByMe] = useState(null)
    const [isTyping, setIsTyping] = useState(false)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const observer = useRef()
    const stayRef = useRef()
    const scrollRef = useRef(null)
    const typingRef = useRef(null)
    
    let options = {
        root: null,
        rootMargin: '0px',
        threshold: 0
    }

    const callback = (enteries) => {
        if (enteries[0].isIntersecting) {
            const getMessages = async () => {
                if (page === total) return
                setLoading(true)
                const res = await axios.get("/message/" + currentChat?._id + '?page=' + page)
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
        arrivedMessage && currentChat?.members?.includes(arrivedMessage.sender) && setFormatedMessages(formatMessages([...messages, arrivedMessage])); setMessages([...messages, arrivedMessage]); scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arrivedMessage, currentChat])

    useEffect(() => {
        const fetch__conversation = async () => {
            try {
                const res = await axios.get("/conversation", {
                    headers: {
                        token: localStorage.getItem("token")
                    }
                })
                setConversation(res.data.conversation)
            } catch (e) {
                console.log(e)
            }
        }
        fetch__conversation()
    }, [])

    useEffect(() => {
        const getMessages = async () => {
            setFormatedMessages([])
            setMessages([])
            setPage(1)
            setLoading(true)
            const res = await axios.get("/message/" + currentChat?._id)
            if (res.data) {
                setFormatedMessages(formatMessages(res.data.messages))
                setTotal(res.data.total)
                setMessages(res.data.messages)
                scrollRef.current?.scrollIntoView({})
            }
            setLoading(false)
        }
        getMessages()
    }, [currentChat])

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

    useEffect(() => {
        !loading && scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formatedMessages, isTyping])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newMessage) return

        const message = {
            sender: user._id,
            conversationId: currentChat._id,
            text: newMessage
        }
        const receiverId = currentChat.members.find(m => m !== user._id)
        socket.emit("sendMessage", {
            sender: user._id,
            receiverId,
            text: newMessage
        })
        setSentByMe({ ...message, createdAt: Date.now(), receiverId })
        try {
            const res = await axios.post("/message", message)
            setFormatedMessages(formatMessages([...messages, res.data]))
            setMessages([...messages, res.data])
            fetch('http://localhost:8800/api/subscribe', {
                method: 'POST',
                body: JSON.stringify({
                    subscription: recipient.subscriptions,
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
        } catch (e) {
            console.log(e)
        }
    }

    const getOnlineUser = (recipientId) => {
        return onlineUsers.find((user) => user.userId === recipientId) ? true : false
    }

    return (
        <>
            <Navbar />
            <div className="wrapper">

                <div className="messenger">
                    <div className="chatMenu">
                        <div className="chatMenuWrapper">
                            <input type="text" placeholder='Search chat' />
                            {conversation?.map((chat) => (
                                <Conversation sentByMe={sentByMe} arrivedMessage={arrivedMessage} onlineStatus={getOnlineUser(chat.members.find(m => m !== user._id))} currentChat={currentChat} key={chat._id} setMessages={setMessages} setRecipient={setRecipient} setCurrentChat={setCurrentChat} recipient={recipient} chat={chat} currentUser={user} />
                            ))}
                        </div>
                    </div>
                    <div className="chatConversations">
                        {currentChat ? <div className="chatConversationsWrappper">
                            <div className="chatBoxTop">
                                <div className="recipient_profile">
                                    <img src={recipient.profilePicture} alt="" />
                                </div>
                                <p className="default__message">It's the beginning of direct messages with <b>{recipient.username}</b></p>
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
                                            {mess.messages.sort((p1, p2) => {
                                                return new Date(p1.createdAt) - new Date(p2.createdAt)
                                            }).map((m, messIndex) => (
                                                <div key={m._id}>
                                                    {index === 0 && messIndex === 0 && <div ref={containerRef}></div>}
                                                    <div ref={scrollRef} key={m._id}>
                                                        <Message onlineStatus={getOnlineUser(currentChat.members.find(m => m !== user._id))} recipient={recipient} user={user} message={m} own={m.sender === user._id} />
                                                    </div>
                                                    {index === 0 && messIndex === 2 && <div ref={stayRef}></div>}
                                                </div>
                                            ))}
                                        </div>
                                    )
                                })}
                                {isTyping && <div ref={typingRef} className="typing__status">
                                    <img src={recipient.profilePicture} alt="" />
                                    <div className="loading">
                                        <div className="dot1"> </div>
                                        <div className="dot2"></div>
                                        <div className="dot3"></div>
                                    </div>
                                </div>}
                            </div>
                            <form onSubmit={handleSubmit} className="chatBoxBottom">
                                <input type='text' className="messageTextInput" placeholder="Write something..." onChange={(e) => {
                                    setNewMessage(e.target.value)
                                    socket.emit('typing', { userId: recipient._id })
                                }} value={newMessage} />
                                <button type='submit'>Send</button>
                            </form>
                        </div> : <p className="defaultMessage">Open a conversation.</p>}
                    </div>
                    {/* <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        right
                    </div>
                </div> */}
                </div>
            </div>
        </>
    )
}
