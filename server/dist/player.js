"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var v4 = require("uuid").v4;
var uuid = v4;
var Player = /** @class */ (function () {
    function Player(socket) {
        this.id = uuid();
        this.socket = socket;
    }
    Player.prototype.send = function (obj) {
        try {
            this.socket.send(JSON.stringify(obj));
        }
        catch (err) {
            console.error(err);
        }
    };
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=player.js.map