const express = require('express')
const next = require('next')
const EventSource = require('eventsource')
require('dotenv').config()

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const PORT = process.env.PORT || 3000

const backendUrl = process.env.BACKEND_URL

const handleSSe = (res, req, url) => {
  const cookies = req.headers.cookie
  let authToken = ''

  if (cookies) {
    cookies.split(';').forEach((cookie) => {
      const [name, value] = cookie.split('=').map((c) => c.trim())
      if (name === 'session-token') {
        authToken = value
      }
    })
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  })
  res.flushHeaders()

  const eventSource = new EventSource(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
  eventSource.onmessage = (e) => {
    res.write(`data: ${e.data}\n\n`)
  }

  // Heartbeat mechanism
  const heartbeatInterval = setInterval(() => {
    res.write(': keep-alive\n\n')
  }, 10000) // every 10 seconds

  eventSource.onerror = (e) => {
    console.error('EventSource failed:', e)
    clearInterval(heartbeatInterval)
    eventSource.close()
    res.end()
  }

  req.on('close', () => {
    clearInterval(heartbeatInterval)
    eventSource.close()
    res.end()
  })
}

app.prepare().then(() => {
  const server = express()
  server.get('/activity-stream', (req, res) => handleSSe(res, req, `${backendUrl}/activity/stream`))
  server.get('/validator-logs', (req, res) => handleSSe(res, req, `${backendUrl}/logs/validator`))
  server.get('/beacon-logs', (req, res) => handleSSe(res, req, `${backendUrl}/logs/beacon`))

  // Handling all other requests with Next.js
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
