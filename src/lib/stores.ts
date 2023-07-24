import { writable } from "svelte/store";
export const instrument = writable("");
export const route = writable(window.location.pathname);

export const server = writable({
  host: "http://localhost:3000",
  status: "unknown" as
    | "connected"
    | "connecting"
    | "error"
    | "unknown",
});

server.subscribe((value) => {
  sessionStorage.setItem("serverstatus", value.status);
});
