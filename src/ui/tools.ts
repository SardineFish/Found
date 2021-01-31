import { Tool } from "../gameplay/player";
import { ItemName } from "../map/map-generator";
import { $ } from "./selector";


export function updateTools(tools: Tool[], activeIdx: number)
{
    const container = $("#tools");
    container.innerHTML = "";
    tools.forEach((tool, idx) =>
    {
        const element = document.createElement("li");
        element.classList.add("tool");
        if (activeIdx == idx)
            element.classList.add("active");
        element.innerHTML = `<span class="name">${ItemName[tool.type]}</span>x<span class="count">${tool.count}</span>`;
        container.appendChild(element);
    });
}