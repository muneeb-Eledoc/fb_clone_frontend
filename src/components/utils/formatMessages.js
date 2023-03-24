import moment from "moment"

export const formatMessages = (messages) => {
    let timeStamps = new Set()
    messages.forEach(message => {
        if(!message.createdAt) return
        if(!message.text) return
        timeStamps.add(moment(message.createdAt).format('LL'))
    });
    let newMessages = []
    timeStamps.forEach((timeStamp) => {
        newMessages.push({
            timeStamp,
            messages: messages.filter((m) => moment(m.createdAt).format('LL') === timeStamp)
        })
    })
    
    return newMessages
}