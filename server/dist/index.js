"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var message_1 = require("./message");
var session_1 = require("./session");
var queue_1 = require("./queue");
var player_1 = require("./player");
var sessions = new Map();
var pendingQueue = new queue_1.Queue(32);
var server = new ws_1.default.Server({
    port: 5000,
    host: "0.0.0.0",
    backlog: 1,
});
server.on("connection", function (socket) {
    console.log("Client connected");
    socket.once("message", function (data) {
        var msg = JSON.parse(data);
        switch (msg.type) {
            case message_1.MessageType.Join:
                playerJoin(socket);
                break;
            case message_1.MessageType.Reconnect:
                playerReconnect(socket);
                break;
        }
    });
});
function playerJoin(socket) {
    var player = new player_1.Player(socket);
    var msg = {
        type: message_1.MessageType.ServerHandshake,
        data: {
            id: player.id,
        }
    };
    socket.send(JSON.stringify(msg));
    if (pendingQueue.length > 0) {
        var another = pendingQueue.dequeue();
        var session = new session_1.GameSession(another, player);
        sessions.set(another.id, session);
        sessions.set(player.id, session);
        session.start();
    }
    else {
        pendingQueue.enqueue(player);
    }
}
function playerReconnect(socket) {
}
//# sourceMappingURL=index.js.map