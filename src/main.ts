import App from "./App.svelte";
import "./index.css";
import { route } from './lib/stores'

const app = new App({
  target: document.getElementById("app"),
});

export const goto = (newpath: string) => {
  window.history.pushState({}, null, newpath);
  route.set(newpath);
};

export default app;
