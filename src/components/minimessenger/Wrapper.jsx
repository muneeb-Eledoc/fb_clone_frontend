import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/authContext/AuthContext'
import MiniMessenger from './MiniMessenger'

const Wrapper = () => {
    const {showMiniMessenger} = useContext(AuthContext)
  return (
    <div>
        {showMiniMessenger&&<MiniMessenger />}
    </div>
  )
}

export default Wrapper