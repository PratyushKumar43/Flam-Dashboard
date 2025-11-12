#!/usr/bin/env node

/**
 * WebSocket client for testing real-time connections
 * Usage: node scripts/ws-client.js [url]
 */

const WebSocket = require('ws')

const url = process.argv[2] || 'ws://localhost:3000/api/realtime'

console.log(`Connecting to: ${url}`)

const ws = new WebSocket(url)

let messageCount = 0
const startTime = Date.now()

ws.on('open', () => {
  console.log('Connected to WebSocket server')
})

ws.on('message', (data) => {
  messageCount++
  const message = data.toString()
  console.log(`[${messageCount}] Message (first 200 chars):`, message.slice(0, 200))
  
  if (messageCount % 100 === 0) {
    const elapsed = (Date.now() - startTime) / 1000
    const rate = messageCount / elapsed
    console.log(`Rate: ${rate.toFixed(2)} messages/sec`)
  }
})

ws.on('error', (error) => {
  console.error('WebSocket error:', error.message)
})

ws.on('close', () => {
  const elapsed = (Date.now() - startTime) / 1000
  console.log(`\nConnection closed. Total messages: ${messageCount} in ${elapsed.toFixed(2)}s`)
  console.log(`Average rate: ${(messageCount / elapsed).toFixed(2)} messages/sec`)
  process.exit(0)
})

// Close after 60 seconds
setTimeout(() => {
  console.log('\nClosing connection after 60 seconds...')
  ws.close()
}, 60000)

