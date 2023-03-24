import { Avatar } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../axios'

const Friends = () => {
    const [friends, setFriends] = useState([])

    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get(`/users/friends`, {
                headers: {
                    token: localStorage.getItem("token")
                }
            })
            setFriends(res.data)
        }
        getFriends()
    }, [])

    return (
        <ul className="sidebarListFriends">
            {friends?.map((friend) => (
                <Link key={friend._id} to={'/profile/'+friend.username} className='link'>
                    <li className="sidebarlistItem">
                        <Avatar className="sidebarIcon"
                            alt="Remy Sharp"
                            src={friend.profilePicture}
                            sx={{ width: 40, height: 40 }}
                        />
                        <span className="sidebarlistItemText">
                            {friend.username}
                        </span>
                    </li>
                </Link>
            ))}
        </ul>

    )
}

export default Friends