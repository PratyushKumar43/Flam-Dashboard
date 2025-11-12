#!/usr/bin/env node

/**
 * Test script to verify API endpoint responds correctly
 * Usage: node scripts/test-api.js [url]
 */

const http = require('http')
const https = require('https')

const url = process.argv[2] || 'http://localhost:3000/api/data'

console.log(`Testing API endpoint: ${url}`)

const client = url.startsWith('https') ? https : http

const startTime = Date.now()

const req = client.get(url, (res) => {
  console.log(`Status: ${res.statusCode}`)
  console.log(`Headers:`, res.headers)

  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  })

  res.on('end', () => {
    const endTime = Date.now()
    const latency = endTime - startTime

    console.log(`\nResponse time: ${latency}ms`)
    console.log(`Response body (first 500 chars):`)
    console.log(data.slice(0, 500))

    try {
      const json = JSON.parse(data)
      console.log(`\nParsed JSON keys:`, Object.keys(json))
      if (json.fps) console.log(`FPS data points: ${json.fps.length}`)
      if (json.memory) console.log(`Memory data points: ${json.memory.length}`)
      if (json.latency) console.log(`Latency data points: ${json.latency.length}`)
    } catch (e) {
      console.log('Response is not valid JSON')
    }
  })
})

req.on('error', (error) => {
  console.error('Error:', error.message)
  process.exit(1)
})

req.setTimeout(5000, () => {
  console.error('Request timeout')
  req.destroy()
  process.exit(1)
})

