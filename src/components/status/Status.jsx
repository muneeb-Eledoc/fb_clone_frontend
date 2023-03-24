import { ArrowForwardIos } from '@mui/icons-material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/authContext/AuthContext';
import { getStatus } from '../../context/statusContext/apiCalls';
import { StatusContext } from '../../context/statusContext/StatusContext';
import CreateModal from './CreateModal';
import CreateStatus from './CreateStatus'
import './status.scss'
import StatusCard from './StatusCard'
import StatusView from './StatusView';

const Status = () => {
    const scrollRef = useRef(null)
    const [index, setIndex] = useState(0)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const {dispatch, status} = useContext(StatusContext)
    const {user} = useContext(AuthContext)

    useEffect(()=>{
        const fetchStatus = ()=>{
            if(user){
                if(user?.followins){
                    getStatus([user._id, ...user?.followins], dispatch)
                }
            }
        }
        fetchStatus()
    }, [user, dispatch])

    useEffect(() => {
        scrollRef.current.scroll({
            left: index * 142,
            behavior: 'smooth'
        })
    }, [index])

    const handleForth = () => {
        setIndex(index < status.length - 3 && index + 1)

    }

    const handleBack = () => {
        setIndex(index > 0 && index - 1)
    }
    return (
        <>
            <div className='status'>
                <div className="flex" ref={scrollRef} >
                    <div onClick={()=> setShowCreateModal(prev=> !prev)}>
                    <CreateStatus />
                    </div>
                    {status?.map((s) => (
                        <StatusCard key={s.userId} status={s} />
                    ))}
                </div>
                {index !== 0 && <div className='backward' onClick={handleBack}>
                    <ArrowBackIosNewIcon />
                </div>}
                {index !== status.length - 3 && <div className='forward' onClick={handleForth}>
                    <ArrowForwardIos />
                </div>}
            </div>
            <CreateModal showCreateModal={showCreateModal} setShowCreateModal={setShowCreateModal} />
            {/* <StatusView /> */}
        </>
    )
}

export default Status