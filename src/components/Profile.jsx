import React, {useEffect, useState } from 'react'
import Feed from './Feed'
import Navbar from './navbar/Navbar'
import RightBar from './RightBar'
import Sidebar from './Sidebar'
import axios from "../axios";
import { useParams } from 'react-router-dom'

export default function Profile() {
    const [user, setUser] = useState({})
    const username = useParams().username
    useEffect(() => {
        const fetchuser = async ()=>{
            try {
                const res = await axios.get(`/users?username=${username}`);
                setUser(res.data)
                
            } catch (error) {
                
            }
        }
        fetchuser()
     }, [username])

    return (
        <div>
            <Navbar/>
            <div className="profile">
                <Sidebar/>
                <div className="profileRight">
                    <div className="profileRightTop">
                           <div className="profileCover">
                               <img className='profilecoverImg' src={user.coverPicture?user.coverPicture:'https://marketplace.canva.com/EAEmBit3KfU/1/0/1600w/canva-black-flatlay-photo-motivational-finance-quote-facebook-cover-myVl9DXwcjQ.jpg'}  alt="" />
                               <img className='profileAvatar' src={user.profilePicture} alt="" />
                           </div>
                           <div className="profileInfo">
                               <h4 className="profileInfoName">{user.username}</h4>
                               <span className="profileInfoDesc"></span>
                           </div>
                    </div>
                    <div className="profileRightBottom">
                        <Feed username={username}/>
                        <RightBar user={user}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
