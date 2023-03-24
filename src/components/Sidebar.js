import React, {useContext} from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authContext/AuthContext"
import Friends from './friends/Friends';
export default function Sidebar() {
    const { user, showSideBar } = useContext(AuthContext)
    const navigate = useNavigate()
    const handleLogout = ()=>{
       localStorage.removeItem("token")
       navigate("/login")
    } 
    return (
        <div className={`sideBar ${showSideBar&&'show__sidebar'}`}> 
            <div className="sideBarWrapper">
            <ul className="sidebarList">
                    <li className="sidebarlistItem">
                         <Avatar className="sidebarIcon"
                            alt="Remy Sharp"
                            src={user.profilePicture}
                            sx={{ width: 40, height: 40 }}
                        />
                         <span className="sidebarlistItemText">
                            <strong>{user.username}</strong>
                         </span>
                    </li>
                    <li className="sidebarlistItem">
                         <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/S0U5ECzYUSu.png" alt="" />
                         <span className="sidebarlistItemText">
                             Friends
                         </span>
                    </li>
                    <li className="sidebarlistItem">
                         <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/PrjLkDYpYbH.png" alt="" />
                         <span className="sidebarlistItemText">
                             Groups
                         </span>
                    </li>
                    <li className="sidebarlistItem">
                         <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/duk32h44Y31.png" alt="" />
                         <span className="sidebarlistItemText">
                             Watch
                         </span>
                    </li>
                    <li className="sidebarlistItem">
                         <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y8/r/he-BkogidIc.png" alt="" />
                         <span className="sidebarlistItemText">
                             Memories
                         </span>
                    </li>
                    <li className="sidebarlistItem">
                         <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/lVijPkTeN-r.png" alt="" />
                         <span className="sidebarlistItemText">
                             Saved
                         </span>
                    </li>
                    <li className="sidebarlistItem">
                         <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yH/r/kyCAf2jbZvF.png" alt="" />
                         <span className="sidebarlistItemText">
                             Pages
                         </span>
                    </li>
                    <li className="sidebarlistItem">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="1em" height="1em"><g fillRule="evenodd" transform="translate(-448 -544)"><path fillRule="nonzero" d="M452.707 549.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L456 552.586l-3.293-3.293z"/></g></svg>
                         <span className="sidebarlistItemText">
                             Show More
                         </span>                    
                    </li>
                    <li className="sidebarlistItem">
                    <Button startIcon={<LogoutIcon />} variant='danger' onClick={handleLogout}>
                        Log out
                    </Button>
                    </li>
                </ul>
                <div className='divider' ></div>
                <h3 className='followings__head'>Followings</h3>
                    <Friends />
                <span className='divider' ></span>
            </div>
        </div>
    )
}
