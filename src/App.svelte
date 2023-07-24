<script lang="ts">
  import Main from "./lib/Main.svelte";
  import Admin from "./lib/Admin.svelte";
  import Contribute from "./lib/Contribute.svelte";
  import { route, server } from "./lib/stores";
  import { goto } from "./main";
  import { instrument } from "./lib/stores";
  import ChooseInstrument from "./lib/ChooseInstrument.svelte";
  import Contact from "./lib/Contact.svelte";

  import { SvelteToast } from "@zerodevx/svelte-toast";
  const handlepopstate = () => {
    route.set(window.location.pathname);
  };
  window.addEventListener("popstate", handlepopstate);

  // Set the $instrument store to the instrument query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const inst = urlParams.get("instrument");
  if (instrument) {
    instrument.set(inst);
  }

  server.subscribe(async (val) => {
    if (val.status === "unknown") {
      server.set({ ...val, status: "connecting" });
      try {
        const res = await fetch(val.host + "/v1/health");
        if (!res.ok || res.status !== 200) {
          server.set({ ...val, status: "error" });
        } else {
          server.set({ ...val, status: "connected" });
        }
      } catch (e) {
        server.set({ ...val, status: "error" });
      }
    }
  });
</script>

<div class="bg-stone-800 flex flex-row gap-x-4 text-white px-4">
  <img class="h-6 w-auto block" src="/img/floopr-static.svg" alt="Floopr" />
  <a
    class="hover:underline hover:text-green-400"
    href="/"
    on:click|preventDefault={() => {
      goto("/");
    }}>Home</a
  >
  <a
    class="hover:underline hover:text-green-400"
    href="/contribute"
    on:click|preventDefault={() => {
      goto("/contribute");
    }}>Contribute</a
  >
  <div class="flex-grow" />
  <p title={$server.host}>Server {$server.status}</p>
  <a
    class="hover:underline hover:text-green-400"
    href="/contact"
    on:click|preventDefault={() => {
      goto("/contact");
    }}>Contact</a
  >
</div>
<SvelteToast />
{#if $server.status === "error"}
<p class="text-4xl text-center text-white font-bold">Server's down, Jonte messed up.</p>
{:else if $route === "/"}
  <ChooseInstrument />
{:else if $route.startsWith("/browse")}
  <Main />
{:else if $route === "/contribute"}
  <Contribute />
{:else if $route === "/admin"}
  <Admin />
{:else if $route === "/contact"}
  <Contact />
{:else}
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold text-white">404</h1>
    <p class="text-xl text-gray-200">Page not found</p>
  </div>
{/if}
