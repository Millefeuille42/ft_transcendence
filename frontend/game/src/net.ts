import {io, Socket} from "socket.io-client";

interface connection {
	socket: Socket
	hasError: boolean
}

let net: connection = {
	socket: io("http://localhost:3000"), // TODO Set to env
	hasError: false
}

net.socket.on('connect', () => {
	console.log("Connected")
	net.hasError = false
})

net.socket.on('disconnect', () => {
	console.log("Disconnected")
})

net.socket.on('connect_error', () => {
	console.log("Error while establishing connection")
})

export const getOnlineText = () => {
	return net.socket.connected ? "ONLINE" : "OFFLINE"
}

export default net
