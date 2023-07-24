<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "../main";
  import { server } from "./stores";
  import { get } from "svelte/store";
  let instruments = [];
  onMount(async () => {
    const res = await fetch(get(server).host+"/v1/instruments");
    instruments = await res.json();
  });
</script>

<main class="m-6">
  <h1
    class="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl text-white"
  >
    Download <mark class="px-2 text-white rounded bg-green-500">FREE</mark> loops
    on Floopr
  </h1>
  <p class="text-lg font-normal lg:text-xl text-gray-400">
    To get started, select an instrument.
  </p>
  <section class="flex flex-wrap gap-4">
    {#each instruments as inst}
      <button
        class="inline-block bg-green-900 hover:shadow-md hover:scale-105 h-[145px] w-[290px] transition-all uppercase font-bold"
        on:click={() => {
          if (!localStorage.getItem("prefers-silence")) {
            new Audio("https://cdn.jsdelivr.net/gh/hainguyents13/mechvibes@bbdbf0f872ee990850b4c20c7901ebb4cb47b9e2/src/audio/nk-cream/a.wav").play();
          }
          goto("/browse?instrument=" + inst);
        }}
      >
        <img
          class="block card"
          src={"/img/instrument/" + inst + ".webp"}
          alt={inst}
        />
      </button>
    {/each}
  </section>
  <style>
    .card {
      gap: 1rem;
      justify-content: center;
      align-items: center;
      font-size: 3rem;
      color: #fff;
      overflow: hidden;
    }
  </style>
</main>
