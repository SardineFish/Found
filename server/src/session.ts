import WebSocket from "ws";
import { ClientMessage, MessageType, ServerMessage, StartData } from "./message";
import { Player } from "./player";

const Distance = 32;

export class GameSession
{
    seed: number;
    playerA: Player;
    playerB: Player;
    started: boolean = false;

    constructor(playerA: Player, playerB: Player)
    {
        this.playerA = playerA;
        this.playerB = playerB;
        this.seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        try
        {
            this.playerA.socket.on("message", this.playerAMsg.bind(this));
            this.playerB.socket.on("message", this.playerBMsg.bind(this));
        }
        catch (err)
        {
            console.error(err);
        }
    }

    playerAMsg(data: WebSocket.Data)
    {
        let obj = JSON.parse(data as string) as ClientMessage;
        this.playerB.send(<ServerMessage>{
            type: obj.type,
            data: obj.data,
        });
    }

    playerBMsg(data: WebSocket.Data)
    {
        let obj = JSON.parse(data as string) as ClientMessage;
        this.playerA.send(<ServerMessage>{
            type: obj.type,
            data: obj.data,
        });
    }

    start()
    {
        this.started = true;

        let offset = [Math.random(), Math.random()];
        let len = Math.hypot(offset[0], offset[1]);
        offset = [offset[0] / len * Distance, offset[1] / len * Distance];
        
        const startA: ServerMessage = {
            type: MessageType.Start,
            data: <StartData>{
                seed: this.seed.toString(),
                spawn: [0, 0]
            }
        };
        const startB: ServerMessage = {
            type: MessageType.Start,
            data: <StartData>{
                seed: this.seed.toString(),
                spawn: offset
            }
        }

        this.playerA.send(startA);
        this.playerB.send(startB);

    }
}