import { ClientMessage, HandshakeData, JoinData, MessageType, ServerMessage, SetObject, StartData, SyncData } from "./message";

export class GameSession
{
    id: string = "";
    socket: WebSocket;
    name: string;
    seed: string = "seed";
    onError: (err: Error) => void = () => { };
    onSync: (data: SyncData) => void = () => { };
    onStart: (data: StartData) => void = () => { };
    onSetObj: (data: SetObject) => void = () => { };

    constructor(url: string, name: string)
    {
        this.name = name;
        this.socket = new WebSocket(url);
        this.socket.onmessage = this.handshake.bind(this);
        this.socket.onopen = this.start.bind(this);
    }
    sendSync(data: SyncData)
    {
        const msg: ClientMessage = {
            id: this.id,
            type: MessageType.Sync,
            data: data
        }
        this.sendMsg(msg);
    }
    setObj(data: SetObject)
    {
        const msg: ClientMessage = {
            id: this.id,
            type: MessageType.SetObject,
            data: data,
        };
        this.sendMsg(msg);
    }
    handshake(ev: MessageEvent<string>)
    {
        const msg = JSON.parse(ev.data) as ServerMessage;
        switch (msg.type)
        {
            case MessageType.ServerHandshake:
                this.id = (msg.data as HandshakeData).id;
                break;
            case MessageType.Start:
                this.socket.onmessage = this.serverSync.bind(this);
                this.seed = (msg.data as StartData).seed;
                this.onStart(msg.data as StartData);
                break;
            default:
                throw new Error("Invalid server message");
        }
    }
    serverSync(ev: MessageEvent<string>)
    {
        const msg = JSON.parse(ev.data) as ServerMessage;
        switch (msg.type)
        {
            case MessageType.Sync:
                this.onSync(msg.data as SyncData);
                break;
            case MessageType.SetObject:
                this.onSetObj(msg.data as SetObject);
                break;
            default:
                throw new Error("Invalid server message");
        }
    }
    private sendMsg(msg: ClientMessage)
    {
        try
        {
            this.socket.send(JSON.stringify(msg));
        }
        catch (err)
        {
            console.error(err);
        }
    }
    private start()
    {
        const msg: ClientMessage = {
            id: "",
            type: MessageType.Join,
            data: <JoinData>{
                name: this.name
            }
        };
        this.socket.send(JSON.stringify(msg));
    }

    
}