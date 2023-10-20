const fastify = require('fastify')({ logger: true });

const cors = require('@fastify/cors');
const fs = require('fs');

fastify.register(cors, {
  origin: true 
});

const messages = [];
const savedMessages = [];

fastify.post('/api/messages', async (request, reply) => {
  messages.push(request.body);
  reply.code(201).send();
});

fastify.get('/api/messages', async (_, reply) => {
  reply.send(messages);
});

fastify.post('/api/save-message', async (request, reply) => {
  savedMessages.push(request.body);

  fs.writeFile('messages.json', JSON.stringify(savedMessages), (err) => {
    if (err) {
      console.log(err);
    }
  });

  reply.send(savedMessages);
});


const start = async () => {
  try {
    await fastify.listen({
        port: 3000,
        host: "::",
    })
    fastify.log.info(`Server listening on http://localhost:3000/`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
