import React, { useContext, useState, useEffect } from 'react'
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import axios from '../axios'
import { Link, useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import { Button } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import { AuthContext } from '../context/authContext/AuthContext';

export default function RightBar({ user }) {
    const navigate = useNavigate()
    const { user: currentUser, setuserr, onlineUsers } = useContext(AuthContext)
    const [followed, setfollowed] = useState(false)
    const [friends, setfriends] = useState([])
    const [aOnlineFriends, setAOnlineFriends] = useState([])

    const handleFollow = async () => {
        try {
            setfollowed(!followed)
            fetch(`http://localhost:8800/api/users/${user._id}/follow`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem("token")
                }
            }).then(response => response.json())
                .then(data => setuserr(data.user));


            await fetch(`http://localhost:8800/api/conversation/${user._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem("token")
                }
            })
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        localStorage.getItem("token") === "null" && navigate("/login")
        const getFriends = async () => {
            const res = user && await axios.get(`/users/friends/${user._id}`)
            setfriends(user && res.data)
        }
        getFriends()

        Object.keys(currentUser).length !== 0 && setfollowed(user ? (currentUser.followins?.includes(user._id) || user.followins?.includes(currentUser._id)) : false)
    }, [user, currentUser, navigate])

    useEffect(() => {
        const getOnlineUsers = async () => {
            setAOnlineFriends([])
            onlineUsers.forEach(user => {
                if (currentUser.followins.includes(user.userId)) {
                    setAOnlineFriends(prev => {
                        return [...prev, user.userId]
                    })
                }
            });
        }
        getOnlineUsers()
    }, [onlineUsers, currentUser])

    const RightbarHome = () => {
        return (
            <>
                <div className="birthdayalert">
                    <Avatar src="https://cdn-icons-png.flaticon.com/512/837/837891.png" variant="square" />
                    Jane Foster and 3 other friends have a birthday today.
                </div>
                <div className="onlinefriends">
                    <div className="onlinefriendsheading">Online Friends</div>
                    <ul className="onlinefreiendlist">
                        {aOnlineFriends.map((userId)=>(
                            <OnlineUser userId={userId} />
                        ))}
                    </ul>
                </div>
            </>
        )
    }
    const RightbarProfile = () => {
        return (
            <>
                {currentUser.username !== user.username && <Button variant="contained" onClick={handleFollow} endIcon={followed ? <RemoveIcon /> : <AddIcon />} >
                    {followed ? "Unfollow" : "Follow"}
                </Button>}
                <h4 className="rightbarProfileTitle">User Information</h4>
                <div className="profileUserInfo">
                    <div className="profileUserInfoItem">
                        <span className="infoItemKey">City</span>
                        <span className="infoItemvalue">{user.city}</span>
                    </div>
                    <div className="profileUserInfoItem">
                        <span className="infoItemKey">Relationship</span>
                        <span className="infoItemvalue">Single</span>
                    </div>
                    <div className="profileUserInfoItem">
                        <span className="infoItemKey"></span>
                        <span className="infoItemvalue">Lahore</span>
                    </div>
                    <div className="profileUserInfoItem">
                        <span className="infoItemKey">City</span>
                        <span className="infoItemvalue">Lahore</span>
                    </div>
                </div>
                <h4 className="rightbarProfileTitle">Followings</h4>
                <div className="followings">
                    {friends.map((friend) => {
                        return (
                            <Link key={friend._id} className="following" to={`/profile/${friend.username}`}>
                                <img className="followingImage" src={friend.profilePicture} alt="" />
                                <span className="followingName">{friend.username}</span>
                            </Link>
                        )
                    })}
                </div>
            </>
        )
    }
    return (
        <div className='rightBar'>
            <div className="rightbarwrapper">
                {user ? <RightbarProfile /> : <RightbarHome />}
            </div>
        </div>
    )
}

const OnlineUser = ({userId}) => {
    const [user, setUser] = useState({})

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?userId=${userId}`);
            setUser(res.data);
        };
        fetchUser();
    }, [userId])

    return (
        <li className="onlinefriend" key={userId}>
            <Badge color="primary" variant="dot">
                <Avatar src={user.profilePicture}
                    sx={{ width: 40, height: 40 }} />
            </Badge>
            <div className="onlinefriendName">{user.username}</div>
        </li>
    )
}
