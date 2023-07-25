import { writable } from "svelte/store";
export const instrument = writable("");
export const route = writable(window.location.pathname);

export const server = writable({
  host: "http://192.168.50.2:3087",
  status: "unknown" as
    | "connected"
    | "connecting"
    | "error"
    | "unknown",
});

server.subscribe((value) => {
  sessionStorage.setItem("serverstatus", value.status);
});
