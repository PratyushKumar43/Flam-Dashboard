#!/usr/bin/env node

/**
 * Spawn multiple WebSocket clients for stress testing
 * Usage: node scripts/spawn-ws-clients.js [count]
 */

const { fork } = require('child_process')
const path = require('path')

const N = parseInt(process.argv[2]) || 200
const wsClientScript = path.join(__dirname, 'ws-client.js')

console.log(`Spawning ${N} WebSocket clients...`)

const clients = []

async function spawnClients() {
  for (let i = 0; i < N; i++) {
    const client = fork(wsClientScript)
    clients.push(client)

    client.on('exit', (code) => {
      console.log(`Client ${i} exited with code ${code}`)
    })

    // Stagger connections slightly
    if (i % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
}

spawnClients()

console.log(`Spawned ${clients.length} clients`)

// Cleanup after 5 minutes
setTimeout(() => {
  console.log('Terminating all clients...')
  clients.forEach(client => client.kill())
  process.exit(0)
}, 300000)

