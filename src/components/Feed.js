import React, { lazy, Suspense, useContext, useEffect } from 'react'
// import Post from './Post/Post'
import Share from './share/Share'
import { AuthContext } from '../context/authContext/AuthContext';
import { PostContext } from '../context/postContext/PostContext';
import { getPosts } from '../context/postContext/apiCalls';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { addpostSuccess } from '../context/postContext/PostAction';
import Status from './status/Status';
const Post = lazy(() => import('./Post/Post'));

export default function Feed({ username }) {
    const { user, socket } = useContext(AuthContext)
    const { isFetching, posts, dispatch } = useContext(PostContext)
    const [onLike, setOnLike] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        Object.keys(user).length !== 0 && getPosts(username, user._id, dispatch)
    }, [username, user, dispatch, navigate])

    useEffect(() => {
        socket.on('getLike', (data) => {
            setOnLike(data)
        })
    }, [socket])

    useEffect(() => {
        socket.on('getPost', (data) => {
            dispatch(addpostSuccess(data))
        })
    }, [socket, dispatch])

    return (
        <div className='feed'>
            <div className="feedWrapper">
                {username ? username === user.username && <Status /> : <Status />}
                {username ? username === user.username && <Share /> : <Share />}
                <Suspense fallback={<CircularProgress sx={{ display: "block", margin: "auto" }} />}>
                    {posts?.sort((p1, p2) => {
                        return new Date(p2.createdAt) - new Date(p1.createdAt);
                    })?.map((post, i) => <Post key={i} post={post} onLike={onLike} setOnLike={setOnLike} />)}
                </Suspense>
                {isFetching && <CircularProgress sx={{ display: "block", margin: "auto" }} />}
            </div>
        </div>
    )
}
