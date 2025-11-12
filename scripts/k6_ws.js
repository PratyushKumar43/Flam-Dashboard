/**
 * k6 WebSocket stress test script
 * Usage: k6 run --vus 100 --duration 60s scripts/k6_ws.js
 */

import ws from 'k6/ws'
import { check } from 'k6'
import { Counter } from 'k6/metrics'

const messagesReceived = new Counter('ws_messages_received')

export const options = {
  vus: 100,
  duration: '60s',
}

export default function () {
  const url = 'ws://localhost:3000/api/realtime'
  const params = { tags: { name: 'WebSocket' } }

  const res = ws.connect(url, params, function (socket) {
    socket.on('open', () => {
      console.log('WebSocket connection opened')
    })

    socket.on('message', (data) => {
      messagesReceived.add(1)
      // Optionally log message
      // console.log('Message received:', data)
    })

    socket.on('close', () => {
      console.log('WebSocket connection closed')
    })

    socket.on('error', (e) => {
      console.error('WebSocket error:', e)
    })

    socket.setTimeout(() => {
      socket.close()
    }, 60000)
  })

  check(res, { 'status is 101': (r) => r && r.status === 101 })
}

