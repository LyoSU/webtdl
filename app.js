const { Client } = require('tdl')
const fastify = require('fastify')({
  logger: true,
})


const client = new Client({
  apiId: process.env.TG_API_ID,
  apiHash: process.env.TG_API_HASH,
})

client.connect()

client.login(() => ({
  phoneNumber: process.env.PHONE_NUMBER,
}))

async function tdlInvoke(method, parm) {
  const invoke = await client.invoke(Object.assign({ _: method }, parm))

  return invoke
}

fastify.all('/:method', async (request, reply) => {
  const parm = Object.assign(request.body || {}, request.query || {})
  const invoke = await tdlInvoke(request.params.method, parm)

  reply.send(invoke)
})

fastify.listen(8085, '0.0.0.0', (err, address) => {
  if (err) throw err
  console.log(`server tdl starting on ${address}`)
})
