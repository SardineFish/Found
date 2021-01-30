import WebSocket from "ws";
const { v4 } = require("uuid");
const uuid = v4;

export class Player
{
    id: string;
    socket: WebSocket;
    constructor(socket: WebSocket)
    {
        this.id = uuid();
        this.socket = socket;
    }

    send<T>(obj: T)
    {
        try
        {
            this.socket.send(JSON.stringify(obj));
        }
        catch (err)
        {
            console.error(err);
        }
    }
}