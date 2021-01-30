import WebSocket from "ws";
import { HandshakeData, IncomeMessage, MessageType, OutcomeMessage } from "./message";
import { GameSession } from "./session";
import { Queue } from "./queue";
import { Player } from "./player";

const sessions = new Map<string, GameSession>();
const pendingQueue = new Queue<Player>(32);

const server = new WebSocket.Server({
    port: 5000,
    backlog: 1,
});

server.on("connection", (socket) =>
{
    socket.once("message", (data: WebSocket.Data) =>
    {
        const msg = JSON.parse(data as string) as IncomeMessage;
        switch (msg.type)
        {
            case MessageType.Join:
                playerJoin(socket);
                break;
            case MessageType.Reconnect:
                playerReconnect(socket);
                break;
        }
    });
});

function playerJoin(socket: WebSocket)
{
    const player = new Player(socket);
    const msg: OutcomeMessage = {
        type: MessageType.ServerHandshake,
        data: <HandshakeData>{
            id: player.id,
        }
    }
    socket.send(JSON.stringify(msg));

    if (pendingQueue.length > 0)
    {
        const another = pendingQueue.dequeue();

        const session = new GameSession(another, player);
        sessions.set(another.id, session);
        sessions.set(player.id, session);
        session.start();
    }
    else 
    {
        pendingQueue.enqueue(player);
    }
}

function playerReconnect(socket: WebSocket)
{

}