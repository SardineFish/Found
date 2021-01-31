export const $ = (selector: string) => document.querySelector(selector) as HTMLDivElement;
export const $$ = (selector: string) => Array.from(document.querySelectorAll(selector)) as HTMLDivElement[];