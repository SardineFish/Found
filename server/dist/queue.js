"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
var Queue = /** @class */ (function () {
    function Queue(size) {
        this.list = [];
        this.length = 0;
        this.tailIdx = 0;
        this.headIdx = 0;
        this.list = new Array(size);
        this.list.length = size;
        this.size = size;
    }
    Object.defineProperty(Queue.prototype, "head", {
        get: function () { return this.list[this.headIdx]; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "tail", {
        get: function () { return this.list[(this.tailIdx - 1 + this.length) % this.size]; },
        enumerable: false,
        configurable: true
    });
    Queue.prototype.enqueue = function (element) {
        if (this.length >= this.size) {
            throw new Error("The queue is full. ");
        }
        this.list[this.tailIdx] = element;
        this.length++;
        this.tailIdx = (this.tailIdx + 1) % this.size;
    };
    Queue.prototype.dequeue = function () {
        if (this.length <= 0) {
            throw new Error("The queue is empty. ");
        }
        var element = this.list[this.headIdx];
        this.list[this.headIdx] = undefined;
        this.headIdx = (this.headIdx + 1) % this.size;
        this.length--;
        return element;
    };
    return Queue;
}());
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map