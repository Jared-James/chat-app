// generates general message
const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}
// generates location message
const generateLocationMessage = (username, location) => {
    return {
        username,
        location, 
        createdAt: new Date().getTime()
    }
}



module.exports = {
    generateMessage,
    generateLocationMessage
}