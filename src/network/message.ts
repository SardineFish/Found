// import { vec2 } from "zogra-renderer";

type vec2 = [number, number];

export enum MessageType
{
    Join = "join",
    ServerHandshake = "handshake",
    Reconnect = "reconnect",
    Sync = "sync",
    Start = "start",
    SetObject = "setobj"
}

export interface SyncData
{
    pos: vec2,
    velocity: vec2,
    flashlight: boolean,
    flashlightDir: vec2;
}

export interface SetObject
{
    pos: vec2,
    type: "mark" | "campfire",
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
    spawn: vec2;
}

export interface ClientMessage
{
    id: string,
    type: MessageType
    data: SyncData | JoinData | SetObject;
}

export interface ServerMessage
{
    type: MessageType,
    data: SyncData | HandshakeData | StartData | SetObject;
}