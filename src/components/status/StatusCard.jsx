import React, { useState } from 'react'
import { useEffect } from 'react'
import { fetchUser } from '../utils/getUser'

const StatusCard = ({status}) => {
    const [user, setUser] = useState({})

    useEffect(()=>{
        const getUser = async ()=>{
            try {
                
                const statusUser = await fetchUser(status.userId)
                setUser(statusUser)
            } catch (error) {
                
            }
        }
        getUser()
    }, [status])
    return (
        <div className='status-container'>
            <div className='status-content'>
                <img className='status-user-image' src={status.status[0].media} alt="" />
                <div className='status-layer'>
                    <div className='status-info'>
                        <div className="profile">
                            <img className='status-user-image' src={user.profilePicture} alt="" />
                        </div>
                        <div className="title">{user.username}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatusCard