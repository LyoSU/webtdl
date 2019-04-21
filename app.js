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
  const invoke = await tdlInvoke(request.params.method, {
    username: request.query.username,
  })

  reply.send(invoke)
})

fastify.listen(3000, (err, address) => {
  if (err) throw err
  console.log(`server tdl starting on ${address}`)
})
