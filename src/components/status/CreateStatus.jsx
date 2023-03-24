import AddIcon from '@mui/icons-material/Add';
import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/authContext/AuthContext'

const CreateStatus = () => {
    const { user } = useContext(AuthContext)
    return (
        <div className='create-status-container'>
            <div className='create-status-content'>
                <img className='create-status-user-image' src={user.profilePicture} alt="" />
                <div className='create-status-icon'>
                    <div className='create-status-container'>
                        <div className='create-status-icon-icon'>
                            <AddIcon className='icon' />
                        </div>
                        <div className="text">Create status</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateStatus