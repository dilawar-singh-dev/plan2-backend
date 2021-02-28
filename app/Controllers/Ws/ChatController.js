'use strict'

class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  onMessage (message) {
    this.socket.broadcastToAll('message', message)
  }

  onClose () {
    console.log('okk')
    // same as: socket.on('close')
  }

  onError () {
    console.log('okk')
    // same as: socket.on('error')
  }

}

module.exports = ChatController