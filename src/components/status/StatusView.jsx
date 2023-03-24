import { Close } from '@mui/icons-material'
import React from 'react'

const StatusView = () => {
  return (
    <div className='statusview-layer'>
        <div className="close">
            <Close />
        </div>
        <div className="statusview-container">
            <div className="timelines">
                <div className="bar"><div></div></div>
            </div>
            <div className="media">
                <img src="https://scontent.flhe12-1.fna.fbcdn.net/v/t39.30808-6/322872536_683840273447273_5234577518644205868_n.jpg?stp=dst-jpg_p526x296&_nc_cat=1&ccb=1-7&_nc_sid=5cd70e&_nc_ohc=Ebge1K-Bu-sAX8phuAo&_nc_ht=scontent.flhe12-1.fna&oh=00_AfD8pNSQFE_RuBETJ8GHvjHjudhKR0S0KN4KCL9G2_-38Q&oe=63B9AF6B" alt="" />
            </div>
        </div>
    </div>
  )
}

export default StatusView