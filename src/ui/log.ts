import { ItemType } from "../map/map-generator";

const container = document.querySelector("#logs") as HTMLDivElement;
const $ = (selector: string) => document.querySelector(selector) as HTMLDivElement;

export function showLog(text: string)
{
    const p = document.createElement('p');
    p.innerText = text;
    container.appendChild(p);
    setTimeout(() => {
        p.remove();
    }, 3000);
}
