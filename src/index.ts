import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()
const filler = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

app.use('*', async (c, next) => {
  await next()
  c.header('x-filler', filler)
})

app.get('/', (c) => {
  return c.text('Hello, World!')
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
