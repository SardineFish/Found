export enum MessageType
{
    Join = "join",
    ServerHandshake = "handshake",
    Reconnect = "reconnect",
    Sync = "sync",
    Start = "start",
}

export interface SyncData
{
    pos: number[],
    velocity: number[],
}

export interface HandshakeData
{
    id: string;
}

export interface JoinData
{
    name: String, 
}

export interface StartData
{
    seed: string;
    spawn: [number, number];
}

export interface ClientMessage
{
    id: string,
    type: MessageType
    data: SyncData | JoinData;
}

export interface ServerMessage
{
    type: MessageType,
    data: SyncData | HandshakeData | StartData;
}