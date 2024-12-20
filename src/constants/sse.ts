export const SSE_HEADER = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
  'X-Accel-Buffering': 'no',
}

export const KEEP_ALIVE_MESSAGE = ': keep-alive\n\n'
