import { ItemType } from "../map/map-generator";

const $ = (selector: string) => document.querySelector(selector) as HTMLDivElement;

let UIShown = false;

export function craft(resources: Map<ItemType, number>): Promise<ItemType | null>
{
    if (UIShown)
        return (async () => null)();
    UIShown = true;

    const close = () =>
    {
        $("#craft").style.display = "none";
        UIShown = false;
    }

    $("#craft").style.display = "flex";
    return new Promise((resolve, reject) =>
    {
        const campfire = {
            wood: 10,
        };
        const pickaxe = {
            wood: 2,
            iron: 5,
        };
        const flashlight = {
            glass: 1,
            iron: 2,
            battery: 2,
        };
        const radio = {
            iron: 2,
            battery: 5,
            pcb: 3
        };
        let wood = resources.get(ItemType.Wood) || 0;
        let glass = resources.get(ItemType.Glass) || 0;
        let battery = resources.get(ItemType.Battery) || 0;
        let iron = resources.get(ItemType.Iron) || 0;
        let pcb = resources.get(ItemType.PCB) || 0;

        const save = () =>
        {
            resources.set(ItemType.Wood, wood);
            resources.set(ItemType.Glass, glass);
            resources.set(ItemType.Battery, battery);
            resources.set(ItemType.Iron, iron);
            resources.set(ItemType.PCB, pcb);
        }

        (document.querySelector("#craft #campfire .button") as HTMLDivElement).onclick = () =>
        {
            if (wood >= campfire.wood)
            {
                wood -= campfire.wood;
                save();
                resolve(ItemType.Campfire);
                close();
            }
        }
        $("#craft #flashlight .button").onclick = () =>
        {
            if (glass >= flashlight.glass && battery >= flashlight.battery && iron >= flashlight.iron)
            {
                glass -= flashlight.glass;
                battery -= flashlight.battery;
                iron -= flashlight.iron;
                save();
                resolve(ItemType.Campfire);
                close();
            }
        }
        $("#craft #pickaxe .button").onclick = () =>
        {
            if (wood >= pickaxe.wood && iron >= pickaxe.iron)
            {
                wood -= pickaxe.wood;
                iron -= pickaxe.iron;
                save();
                resolve(ItemType.Pickaxe);
                close();
            }
        }
        $("#craft #radio .button").onclick = () =>
        {
            if (iron >= radio.iron && battery >= radio.battery && pcb >= radio.pcb)
            {
                iron -= radio.iron;
                battery -= radio.battery;
                pcb -= radio.pcb;
                save();
                resolve(ItemType.Radio);
                close();
            }
        }
        $("#craft .close").onclick = () =>
        {
            resolve(null);
            close();
        }

        document.querySelectorAll("#craft .wood").forEach(el => el.innerHTML = wood.toString());
        document.querySelectorAll("#craft .iron").forEach(el => el.innerHTML = iron.toString());
        document.querySelectorAll("#craft .glass").forEach(el => el.innerHTML = glass.toString());
        document.querySelectorAll("#craft .pcb").forEach(el => el.innerHTML = pcb.toString());
        document.querySelectorAll("#craft .battery").forEach(el => el.innerHTML = battery.toString());
    });
}