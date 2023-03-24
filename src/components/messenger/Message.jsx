// import { format } from "timeago.js"
import "./messenger.scss"
import moment from "moment"

export default function Message({message, own, recipient, user, onlineStatus}) {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img className={`shadow ${!own&&onlineStatus&&'active__now'}`} src={own?user.profilePicture:recipient.profilePicture} alt="" />
                <p className="messageText shadow">{message.text}</p>
            </div>
            <div className="messageBottom">
                {moment(message.createdAt).format('LT')}
            </div>
        </div>
    )
}
