<script lang="ts">
  import { onMount } from "svelte";
  interface LoopResponse {
    limit: number;
    page: number;
    totalLoops: number;
    loops: Array<{
      _id: string;
      title: string;
      author: string;
      files: string[];
      key: string;
      tempo: string;
      type: string;
      timesig: string;
      name: string;
      instrument: string;
    }>;
  }
  let response: LoopResponse = {
    limit: 0,
    page: 0,
    totalLoops: 0,
    loops: [],
  };
  let playing = "";
  let instrument =
    new URLSearchParams(window.location.search).get("instrument") || "";

  // On back button press
  window.onpopstate = () => {
    playing = "";
    instrument =
      new URLSearchParams(window.location.search).get("instrument") || "";
  };

  let instruments = [];
  onMount(async () => {
    const res = await fetch("http://localhost:3000/v1/instruments");
    instruments = await res.json();
  });

  $: if (instrument !== "") {
    fetch("http://localhost:3000/v1/loops?instrument=" + instrument)
      .then((res) => res.json())
      .then((res) => {
        response = res;
      });
  }
  // Handling arrow keys
  let i = 1;
  const cards = document.getElementsByClassName("acard");
  document.addEventListener("keydown", (e) => {
    const code = e.key;
    if (e.code == "ArrowRight") {
      if (i < cards.length) {
        i++;
      }
    }
    if (e.code == "ArrowLeft") {
      if (i > 1) {
        i--;
      }
    }
    //@ts-ignore
    cards[i - 1].focus();
  });
  // Stop handling arrow keys
</script>

<main class="m-6">
  {#if instrument === ""}
    <h1
      class="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl text-white"
    >
      Download <mark class="px-2 text-white rounded bg-green-500">FREE</mark> loops
      on Floopr
    </h1>
    <p class="text-lg font-normal lg:text-xl text-gray-400">
      To get started, select an instrument.
    </p>
    <style>
      .basic-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      }
      .card {
        display: flex;
        gap: 1rem;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 3rem;
        color: #fff;
        transition: all 500ms;
        overflow: hidden;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
    </style>
    <section class="basic-grid">
      {#each instruments as inst}
        <button
          class="acard"
          on:click={() => {
            instrument = inst;
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set("instrument", inst);
            window.history.pushState(
              {},
              "",
              window.location.pathname + "?" + urlParams.toString()
            );
          }}
        >
          <img
            class="card rounded shadow-md hover:shadow-lg hover:translate-y-[-6px]"
            src={"/img/instrument/" + inst + ".webp"}
            alt={inst}
          />
        </button>
      {/each}
    </section>
  {:else if response.loops.length === 0}
    <p>Loading...</p>
  {:else}
    <h1
      class="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl text-white"
    >
      Browsing <mark class="px-2 text-white rounded bg-green-500"
        >{instrument}</mark
      > loops
    </h1>

    <p class="text-lg font-normal lg:text-xl text-gray-400">
      We have {response.totalLoops} "{instrument}" loops available for download.
    </p>
    <table class="w-full text-sm text-left text-stone-400 bg-neutral-900">
      <thead class="text-xs bg-neutral-700 text-stone-400">
        <tr>
          <th id="title" scope="col" class="py-3 px-4">Title</th>
          <th id="contributors" scope="col" class="py-3 px-4">Contributor</th>
          <th id="timesignature" scope="col" class="py-3 px-4"
            >Time Signature</th
          >
          <th id="tempo" scope="col" class="py-3 px-4">Tempo</th>
          <th id="type" scope="col" class="py-3 px-4">Type</th>
          <th id="key" scope="col" class="py-3 px-4">Key</th>
          <th scope="col" class="py-3 px-4">Download</th>
        </tr>
      </thead>
      <tbody>
        {#each response.loops as loop}
          {#each loop.files as ft}
            {#if ft === "mp3" || ft === "wav" || ft === "ogg"}
              <audio
                id={"audioplayer-" + loop._id}
                loop
                src={"http://localhost:3000/v1/loops/" + loop._id + "." + ft}
              />
            {/if}
          {/each}
          <tr
            on:click|stopPropagation={() => {
              const audio = document.getElementById("audioplayer-" + loop._id);
              // @ts-ignore
              if (audio.paused) {
                // @ts-ignore
                audio.play();
                playing = loop._id;
              } else {
                // @ts-ignore
                audio.pause();
                playing = "";
              }
            }}
            class={"border-neutral-700 " +
              (playing === loop._id ? "bg-[#23352a]" : "bg-neutral-800")}
          >
            <th class="py-4 px-6 font-medium whitespace-nowrap text-white">
              {loop.title}
            </th>
            <td class="py-4 px-6">
              {loop.author}
            </td>
            <td class="py-4 px-6">
              {loop.timesig}
            </td>
            <td class="py-4 px-6">{loop.tempo.toString()} BPM</td>
            <td class="py-4 px-6"
              >{loop.files.includes("mid") ? "Midi" : "Audio"}</td
            >
            <td class="py-4 px-6">{loop.key}</td>
            <td class="py-4 px-6">
              {#each loop.files as ft}
                <a
                  class="transition-all mr-2 bg-stone-700 px-1 rounded hover:shadow hover:outline-green-600 hover:outline hover:outline-1"
                  on:click|preventDefault|stopPropagation={() => {
                    // dl(loop._id + "." + ft, loop.instrument);
                  }}
                  href={"https://cdn.jsdelivr.net/gh/Jontes-Tech/floopr@latest/loops/" +
                    loop.instrument +
                    "/" +
                    loop._id +
                    "." +
                    ft}>{ft}</a
                >
              {/each}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</main>
