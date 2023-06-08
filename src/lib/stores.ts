import { writable } from "svelte/store";
export const instrument = writable("");
export const route = writable(window.location.pathname);