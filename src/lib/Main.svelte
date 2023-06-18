<script lang="ts">
  import { randpix, Symmetry } from "randpix";
  import { scale, slide } from "svelte/transition";
  import { instrument } from "./stores";
  import { onMount } from "svelte";
  import { toast } from "@zerodevx/svelte-toast";
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

  const urlParams = new URLSearchParams(window.location.search);
  const inst = urlParams.get("instrument");
  if (instrument) {
    instrument.set(inst);
  }

  onMount(async () => {
    fetch("http://localhost:3000/v1/loops?instrument=" + $instrument)
      .then((res) => res.json())
      .then((res) => {
        response = res;
      });
  });

  let playing = "";
  let lastplayed = "";
  let player: HTMLAudioElement;
  let dataURL = "";

  // On back button press
  window.onpopstate = () => {
    playing = "";
    instrument.set(
      new URLSearchParams(window.location.search).get("instrument") || ""
    );
  };

  $: if (playing !== "") {
    const generate = randpix({
      size: 8,
      scale: 32,
      symmetry: Symmetry.VERTICAL,
      color: [255, 100, 50],
      seed: playing,
      colorBias: 15,
      grayscaleBias: false,
    });

    const art = generate(); // Generating the pixel art
    dataURL = art.toDataURL();
    setTimeout(() => {
      const img = document.getElementById("art") as HTMLImageElement;
      img.src = dataURL;
      img.alt = playing;
    }, 10);
  }
  let download = [];

  const download2Blob = (extension: string) => {
    fetch("http://localhost:3000/v1/loops/" + lastplayed + "." + extension)
      .then((response) => response.blob())
      .then((blob) => {
        // Do something with the downloaded file blob
        console.log("File downloaded successfully", blob);
        // Create a link element
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        if (!lastplayed) lastplayed = playing;
        const name = response.loops.find(
          (loop) => loop._id === lastplayed
        )?.name;
        link.download = "floopr.org-" + +name + "." + extension;

        // Programmatically click the link to trigger the download
        link.click();
        download = [];
        toast.push("Successfully downloaded " + name + "." + extension);
      })
      .catch((error) => {
        console.error("Error downloading file", error);
        alert("Error downloading file, check console for more details");
      });
  };
</script>

<main class="m-6">
  {#if response.loops.length === 0}
    <p class="text-white m-10">Loading...</p>
  {:else}
    <h1
      class="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl text-white"
    >
      Browsing <mark class="px-2 text-white rounded bg-green-500"
        >{$instrument}</mark
      > loops
    </h1>

    <p class="text-lg font-normal lg:text-xl text-gray-400">
      We have {response.totalLoops} loop{response.totalLoops === 1 ? "" : "s"} matching
      your selection.
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
            tabindex="0"
            on:keydown={(e) => {
              if (e.code == "Enter" || e.code == "Space") {
                const audio = document.getElementById(
                  "audioplayer-" + loop._id
                );
                // @ts-ignore
                if (audio.paused) {
                  document.querySelectorAll("audio").forEach((a) => {
                    a.pause();
                  });
                  // @ts-ignore
                  audio.play();
                  playing = loop._id;
                  lastplayed = loop._id;
                  //@ts-ignore
                  player = audio;
                } else {
                  // @ts-ignore
                  audio.pause();
                  playing = "";
                  setTimeout(() => {
                    if (playing === "" && lastplayed === loop._id) {
                      lastplayed = "";
                    }
                  }, 15000);
                }
              }
            }}
            on:click|stopPropagation={() => {
              const audio = document.getElementById("audioplayer-" + loop._id);
              // @ts-ignore
              if (audio.paused) {
                document.querySelectorAll("audio").forEach((a) => {
                  a.pause();
                });
                // @ts-ignore
                audio.play();
                playing = loop._id;
                lastplayed = loop._id;
                //@ts-ignore
                player = audio;
              } else {
                // @ts-ignore
                audio.pause();
                playing = "";
                setTimeout(() => {
                  if (playing === "" && lastplayed === loop._id) {
                    lastplayed = "";
                  }
                }, 15000);
              }
            }}
            class={"border-1 border-b border-neutral-700 " +
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
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</main>
{#if lastplayed !== ""}
  <div
    in:slide={{ duration: 300 }}
    class="bg-neutral-800 p-4 bottom-0 left-0 w-full flex items-center justify-between fixed shadow-lg border-t border-1 border-neutral-400"
  >
    <div class="flex items-center">
      <img class="w-12 h-12 rounded-full hue-rotate-60" alt="" id="art" />
      <div class="ml-4">
        <p class="text-white font-bold">
          {response.loops.find((loop) => loop._id === lastplayed)?.title || ""}
        </p>
        <p class="text-gray-400">
          {response.loops.find((loop) => loop._id === lastplayed)?.author || ""}
        </p>
      </div>
    </div>
    <div class="flex items-center gap-x-5 fill-white">
      <button
        on:click={() => {
          if (player.paused) {
            player.play();
            playing = lastplayed;
          } else {
            player.pause();
            playing = "";
          }
        }}
      >
        {#if playing !== ""}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 320 512"
            ><path
              d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"
            /></svg
          >
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 384 512"
            ><path
              d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
            /></svg
          >
        {/if}
      </button>
      <button
        on:click={() => {
          download = response.loops.find(
            (loop) => loop._id === lastplayed
          )?.files;
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
          ><path
            d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
          /></svg
        >
      </button>
    </div>
  </div>
{/if}
{#if download.length > 0}
  <div
    in:scale={{ duration: 300 }}
    out:scale={{ duration: 300 }}
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <div class="bg-neutral-800 p-6 w-full max-w-md mx-auto rounded shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-white">Floopr Download</h2>
      <p class="mb-4 text-gray-200">Download brought to you by V3XLabs</p>
      <div class="grid grid-cols-2 gap-4">
        {#if download.includes("mp3")}
          <button
            on:click={() => {
              download2Blob("mp3");
            }}
            class="hover:brightness-110 bg-green-800 text-white p-4 rounded"
          >
            <div class="text-xl font-bold">MP3</div>
            <div class="text-sm">
              Compressed and small size, great for sharing
            </div>
          </button>
        {/if}
        {#if download.includes("wav")}
          <button
            on:click={() => {
              download2Blob("wav");
            }}
            class="hover:brightness-110 bg-green-800 text-white p-4 rounded"
          >
            <div class="text-xl font-bold">Wav</div>
            <div class="text-sm">Uncompressed giant files, better quality</div>
          </button>
        {/if}
        {#if download.includes("mid")}
          <button
            on:click={() => {
              download2Blob("mid");
            }}
            class="hover:brightness-110 bg-green-800 text-white p-4 rounded"
          >
            <div class="text-xl font-bold">Midi</div>
            <div class="text-sm">Just the notes, nothing else.</div>
          </button>
        {/if}
      </div>
      <div class="text-right mt-4">
        <button
          on:click={() => {
            download = [];
          }}
          class="text-white bg-neutral-900 px-4 py-2 rounded">Cancel</button
        >
      </div>
    </div>
  </div>
{/if}
