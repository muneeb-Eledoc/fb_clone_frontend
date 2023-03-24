import axios from '../axios'
import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/authContext/AuthContext'
import Feed from './Feed'
import Navbar from './navbar/Navbar'
import RightBar from './RightBar'
import Sidebar from './Sidebar'

export default function Home() {
    const { user } = useContext(AuthContext)

    useEffect(() => {
        if (user?._id) regSw(user)
    }, [user])

    return (
        <div>
            <Navbar />
            <div className="mainContainer">
                <Sidebar />
                <Feed />
                <RightBar />
            </div>
        </div>
    )
}

async function regSw(user) {
    if ('serviceWorker' in navigator) {
        let url = process.env.PUBLIC_URL + '/sw.js';
        navigator.serviceWorker.register(url, { scope: '/' }).then((res) => {
            return res.pushManager.getSubscription().then(async (subscription) => {
                if (subscription === null) {
                    subscription = await res.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: 'BHD-irDuWfPkFu3FXdKXBJT-k7BUq_0mtgNt1Xg6UCfZfSxLHiudprK2YjkxVZb0KHiN-BZ6BCbJPc0lo1-2Go0',
                    })
                }
                let endPoints = []
                user.subscriptions?.forEach(sub => {
                    endPoints.push(sub.endpoint)
                });
                if (!endPoints.includes(subscription.endpoint)) {
                    await axios.post('users/subscribe/'+user._id, subscription,  {
                        headers: {
                            token: localStorage.getItem("token")
                        }
                    })
                }

            })

        })
    } else {
        throw Error('serviceworker not supported');
    }
}
