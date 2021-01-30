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

export interface StartData
{
    seed: number;
    spawn: [number, number];
}

export interface IncomeMessage
{
    id: string,
    type: MessageType
    data: SyncData | HandshakeData;
}

export interface OutcomeMessage
{
    type: MessageType,
    data: SyncData | HandshakeData | StartData;
}