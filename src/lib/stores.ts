import { writable } from "svelte/store";
export const instrument = writable("");
export const route = writable(window.location.pathname);

export const server = writable({
  host: "https://api.floopr.org",
  status: "unknown" as
    | "connected"
    | "connecting"
    | "error"
    | "unknown",
});

server.subscribe((value) => {
  sessionStorage.setItem("serverstatus", value.status);
});
