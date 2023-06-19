import React, { useEffect, useState, useContext } from 'react'
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertCommentSharpIcon from '@mui/icons-material/InsertCommentSharp';
import axios from "../axios";
import { format } from "timeago.js"
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext/AuthContext';
import { IconButton } from '@mui/material';

export default function Post({ post, onLike }) {
    const [barMenu, setBarMenu] = useState("none")
    const { user: currentUser, socket } = useContext(AuthContext)
    const [user, setUser] = useState({});
    const [like, setLike] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        user && setIsLiked(post.likes.includes(currentUser._id));
    }, [currentUser._id, post.likes, user]);

    useEffect(() => {
        setLike(post.likes.length)
        const fetchUser = async () => {
            try {
                const res = await axios.get(`/users?userId=${post.userId}`);
                setUser(res.data);
            } catch (error) {
                
            }
        };
        fetchUser();
    }, [post])

    useEffect(() => {
        if (onLike?.postId === post?._id) {
            setLike(like => like + (onLike.like))
        }
    }, [onLike, post._id])

    const likeHandler = async () => {
        setLike(isLiked ? like - 1 : like + 1);
        socket.emit('likeUpdate', {
            postId: post._id,
            like: isLiked ? -1 : 1
        })
        setIsLiked(!isLiked);
        try {
            // await fetch('https://fd-clone-backend.vercel.app/api/post/' + post._id + "/like", {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'token': localStorage.getItem("token")
            //     }
            // })
            await fetch('http://localhost:8800/api/post/' + post._id + "/like", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem("token")
                }
            })
        } catch (err) { }
    }

    const handleBarMenu = () => {
        setBarMenu(prev => prev === "none" ? "inline" : "none")
    }

    return (
        <div className='post'>
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${user.username}`} style={{ textDecoration: "none" }} className="postTopLeft">
                            <Avatar
                                alt={user.username}
                                src={user.profilePicture}
                                sx={{ width: 40, height: 40 }}
                            />
                            <span className="postName">{user.username}</span>
                        </Link>
                        <span className='postDate'>{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        <IconButton aria-label="delete" size="small" onClick={handleBarMenu}>
                            <MoreVertIcon className='postMorevert' />
                        </IconButton>
                        <div className="postMenuModal" style={{ display: barMenu }}>
                            <Button sx={{ color: "#d63031", width: "100%" }} startIcon={<DeleteIcon />}>
                                Delete
                            </Button>
                            <Button startIcon={<EditIcon />} sx={{ width: "100%" }}>
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="postCenter">
                    <img src={post.img} alt="" />
                    <div className="postText">
                        {post.desc}
                    </div>
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img onClick={likeHandler} src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e" alt="" />
                        <img onClick={likeHandler} src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23FF6680'/%3e%3cstop offset='100%25' stop-color='%23E61739'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.710144928 0 0 0 0 0 0 0 0 0 0.117780134 0 0 0 0.349786932 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 100 16A8 8 0 008 0z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M10.473 4C8.275 4 8 5.824 8 5.824S7.726 4 5.528 4c-2.114 0-2.73 2.222-2.472 3.41C3.736 10.55 8 12.75 8 12.75s4.265-2.2 4.945-5.34c.257-1.188-.36-3.41-2.472-3.41'/%3e%3c/g%3e%3c/svg%3e" alt="" />
                        <span className="likeCounter">{like} people liked</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postComment">
                            <InsertCommentSharpIcon />
                            <span>9 comments</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
