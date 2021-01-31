"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSession = void 0;
var message_1 = require("./message");
var Distance = 32;
var GameSession = /** @class */ (function () {
    function GameSession(playerA, playerB) {
        this.started = false;
        this.playerA = playerA;
        this.playerB = playerB;
        this.seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        try {
            this.playerA.socket.on("message", this.playerAMsg.bind(this));
            this.playerB.socket.on("message", this.playerBMsg.bind(this));
        }
        catch (err) {
            console.error(err);
        }
    }
    GameSession.prototype.playerAMsg = function (data) {
        var obj = JSON.parse(data);
        this.playerB.send({
            type: obj.type,
            data: obj.data,
        });
    };
    GameSession.prototype.playerBMsg = function (data) {
        var obj = JSON.parse(data);
        this.playerA.send({
            type: obj.type,
            data: obj.data,
        });
    };
    GameSession.prototype.start = function () {
        this.started = true;
        var offset = [Math.random(), Math.random()];
        var len = Math.hypot(offset[0], offset[1]);
        offset = [offset[0] / len * Distance, offset[1] / len * Distance];
        var startA = {
            type: message_1.MessageType.Start,
            data: {
                seed: this.seed.toString(),
                spawn: [0, 0]
            }
        };
        var startB = {
            type: message_1.MessageType.Start,
            data: {
                seed: this.seed.toString(),
                spawn: offset
            }
        };
        this.playerA.send(startA);
        this.playerB.send(startB);
    };
    return GameSession;
}());
exports.GameSession = GameSession;
//# sourceMappingURL=session.js.map