export class Queue<T>
{
    list: Array<T | undefined> = [];
    size: number;
    length: number = 0;
    private tailIdx: number = 0;
    private headIdx: number = 0;
    get head() { return this.list[this.headIdx] }
    get tail() { return this.list[(this.tailIdx - 1 + this.length) % this.size] }
    constructor(size: number)
    {
        this.list = new Array(size);
        this.list.length = size;
        this.size = size;
    }
    enqueue(element: T)
    {
        if (this.length >= this.size)
        {
            throw new Error("The queue is full. ");
        }
        this.list[this.tailIdx] = element;
        this.length++;
        this.tailIdx = (this.tailIdx + 1) % this.size;
    }
    dequeue(): T
    {
        if (this.length <= 0)
        {
            throw new Error("The queue is empty. ");
        }
        let element = this.list[this.headIdx];
        this.list[this.headIdx] = undefined;
        this.headIdx = (this.headIdx + 1) % this.size;
        this.length--;
        return element as T;
    }

}