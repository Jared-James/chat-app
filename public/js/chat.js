const socket = io()

// Elements
const $MessageForm = document.getElementById('myForm')
const $messageFormInput = document.getElementById('messageFormInput')
const $messageFormbutton = document.getElementById('messageFormButton')
const $sendLocation = document.getElementById('sendLocation')
const $messages = document.getElementById('messages')

// Templates
const messageTemplate = document.getElementById('message-template').innerHTML
const locationTemplate = document.getElementById('location-template').innerHTML
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
	// New message element
	const $newMessage = $messages.lastElementChild

	// Height of the new message
	const newMessageStyles = getComputedStyle($newMessage)
	const newMessageMargin = parseInt(newMessageStyles.marginBottom)
	const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

	// Visible height
	const visibleHeight = $messages.offsetHeight

	// Height of messages containeer
	const containerHeight = $messages.scrollHeight

	// How far have i scrolled?
	const scrollOffset = $messages.scrollTop + visibleHeight

	if (containerHeight - newMessageHeight <= scrollOffset) {
			$messages.scrollTop = $messages.scrollHeight
	}


}

socket.on('message', (welcome) => {
	const html = Mustache.render(messageTemplate, {
		username: welcome.username,
		message: welcome.text,
		createdAt: moment(welcome.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML('beforeend', html)
	autoscroll()
})

socket.on('location', (location) => {
	console.log(location)
	const html = Mustache.render(locationTemplate, {
		username: location.username,
		location: location.location,
		createdAt: moment(location.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML('beforeend', html)
	autoscroll()

})

socket.on('roomData', ({ room, users }) => {
	const html = Mustache.render(sidebarTemplate, {
		room,
		users
	})
	document.getElementById('sidebar').innerHTML = html
})


$MessageForm.addEventListener('submit', (e) => {
	e.preventDefault()

	// Disable button
	$messageFormbutton.setAttribute('disabled', 'disabled')

	const sendMessage = e.target.elements.message.value

	socket.emit('sendMessage', sendMessage, (error) => {
		// Enable button
		$messageFormbutton.removeAttribute('disabled')
		$messageFormInput.value = ''
		if (error) {
			return console.log(error)
		} else {
			console.log('Message Delivered')
		}
	})
})

$sendLocation.addEventListener('click', () => {
	if (!navigator.geolocation) {
		return alert('Geolocation is not supported by your browser')
	}
	$sendLocation.setAttribute('disabled', 'disabled')


	navigator.geolocation.getCurrentPosition((position) => {

		const location = `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`

		socket.emit('sendLocation', location, (error) => {
			if (error) {
				return console.log(error)
			} else {
				console.log('Location sent!')
				$sendLocation.removeAttribute('disabled')
			}
		})
	})
})

socket.emit('join', { username, room }, (error) => {
	if (error) {
		alert(error)
		location.href = '/'
	}
})