import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import cors from "@fastify/cors";
import fs from "fs";

export interface IMessage {
  id: string;
  platform: string;
  content: string;
  emojis: string[];
  author: string;
  badge: string;
}

const server: FastifyInstance = fastify({ logger: true });

const messages: IMessage[] = [];
const savedMessages: IMessage[] = [];

server.register(cors, {
  origin: true,
});

server.post(
  "/api/messages",
  async (request: FastifyRequest, reply: FastifyReply) => {
    const message = request.body as IMessage;
    messages.push(message);
    reply.code(201).send();
  }
);

server.get("/api/messages", async (_: FastifyRequest, reply: FastifyReply) => {
  reply.send(messages);
});

server.post(
  "/api/save-message",
  async (request: FastifyRequest, reply: FastifyReply) => {
    const message = request.body as IMessage;
    savedMessages.push(message);

    fs.writeFile("messages.json", JSON.stringify(savedMessages), (err) => {
      if (err) {
        console.log(err);
      }
    });

    reply.send(savedMessages);
  }
);

const start = async () => {
  try {
    await server.listen({
      port: 3000,
      host: "::",
    });
    server.log.info(`Server listening on http://localhost:3000/`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
