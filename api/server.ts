import fs from "fs";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import FastifySocketIO from "fastify-socket.io";
import cors from "@fastify/cors";
import { Socket } from "socket.io";

import { getRandomHexColor, parseLinks, saveLinks } from "./utils";
import { CustomFastifyInstance, IMessage, SocketType } from "../types";

const server = fastify({ logger: true }) as CustomFastifyInstance;
const messages: IMessage[] = [];
const savedMessages: IMessage[] = [];
const userColors: { [key: string]: string } = {};

server.register(cors, {
    origin: true,
});

server.register(FastifySocketIO, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

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

let reactSocket: Socket | null = null;
let extensionSocket: Socket | null = null;

server.ready((serverError) => {
    if (serverError) {
        console.log(serverError);
        process.exit(1);
    }

    server.io?.on("connection", (socket: Socket) => {
        socket.on("register", (type) => {
            if (type === SocketType.REACT) {
                reactSocket = socket;
            } else if (type === SocketType.EXTENSION) {
                extensionSocket = socket;
            }
        });

        socket.on("message", async (message) => {
            if (socket === reactSocket) {
                extensionSocket?.emit("message", message);
            } else if (socket === extensionSocket) {
                if (!userColors[message.author]) {
                    userColors[message.author] = getRandomHexColor();
                }

                const links = parseLinks(message.content);
                if (links.length > 0) {
                    await saveLinks(links);
                }

                reactSocket?.emit("message", {
                    ...message,
                    authorColor: userColors[message.author],
                });
            }
        });
    });
});

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
