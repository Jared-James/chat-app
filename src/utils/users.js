const users = []

const addUser = ({id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username already exists'
        }
    }

    // Store users
    const user = { id, username, room}
    users.push(user)

    return { user}

}

// remove user
const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

// get user
const getUser = (id) => {
    const user = users.find(user => user.id === id)
    if (!user) {
        return {
            error: 'No user with that ID'
        }
    }
    return user
}

// get all users in room
const getUsersInRoom = (room) => {
    const usersInRoom = users.filter(user => user.room === room)
    
    if (usersInRoom.length === 0) {
        return {
            error: 'No users in this room'
        }
    }
    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}