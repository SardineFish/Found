import { MessageType, ServerMessage, StartData } from "./message";

export class FakeServer
{
    onmessage?: (ev: MessageEvent<string>) => void;
    onopen?: () => void;
    send(data: string)
    {
        
    }

    constructor()
    {
        setTimeout(() => {
            this.onopen?.();
            this.onmessage?.(<MessageEvent<string>>{
                data: JSON.stringify(<ServerMessage>{
                    type: MessageType.ServerHandshake,
                    data: {
                        id: "ID",
                    }
                })
            } as any);

            this.sendToClient({
                type: MessageType.Start,
                data: <StartData>{
                    seed: Math.floor(Math.random() * (1 << 30)).toString(),
                    spawn: [0, 0]
                }
            });
            
        }, 100);
    }

    sendToClient(msg: ServerMessage)
    {
        this.onmessage?.(<MessageEvent<string>>{
            data: JSON.stringify(msg)
        } as any);
    }
}