<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import Turnstile from "./Turnstile.svelte";

  let tos = false;
  let captcha = false;

  function onloadTurnstileCallback() {
    captcha = true;
  }

  let reset: () => void | undefined;
</script>

<main class="m-6">
  <h1 class="text-white text-4xl font-bold">Contribute to Floopr</h1>
  <p class="text-gray-400">
    Thank you for considering making a contribution to Floopr. We are powered of
    heroes like you.
  </p>
  <form
    on:submit|preventDefault={() => {
      toast.push("Uploading your loop...");

      // Post as multipart/form-data to the API
      const form = document.querySelector("form");
      const formData = new FormData(form);

      fetch(get(server).host+"/v1/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            toast.push("Thank you for your contribution!");
          } else {
            toast.push(res.message || "There was an error uploading your loop.");
          }
        })
        .catch((err) => {
          toast.push("There was an error uploading your loop.");
        });
    }}
  >
    <button type="reset" on:click={reset} class="text-red-500">Clear</button>
    <label for="submissionEmail" class="block text-sm font-medium text-white"
      >Your email</label
    >
    <input
      type="email"
      required
      name="submissionEmail"
      class="w-64 border text-sm rounded-lg block p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-darkGreen focus:border-darkGreen"
      placeholder="anonymous@floopr.org"
    />
    <p id="helper-text-explanation" class="mt-2 text-sm text-neutral-400">
      We never share your email, but we do store it securely.
    </p>
    <label for="title" class="block text-sm font-medium text-white"
      >The Title of the loop</label
    >
    <input
      type="text"
      required
      name="title"
      class="w-64 border text-sm rounded-lg block p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-darkGreen focus:border-darkGreen"
      placeholder="Never Gonna Give You Up"
    />
    <label for="creator" class="block text-sm font-medium text-white"
      >Creator</label
    >
    <input
      type="text"
      required
      name="author"
      class="w-64 border text-sm rounded-lg block p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-darkGreen focus:border-darkGreen"
      placeholder="Rick Astley"
    />
    <label for="tempo" class="block text-sm font-medium text-white"
      >Tempo of the loop (in BPM, if unsure, select 0)</label
    >
    <input
      type="number"
      required
      name="tempo"
      class="w-64 border text-sm rounded-lg block p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-darkGreen focus:border-darkGreen"
      placeholder="113"
    />
    <label for="key" class="block mb-2 text-sm font-medium text-white"
      >Key of the loop</label
    >
    <select
      required
      name="key"
      class="w-64 border text-sm rounded-lg block p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-darkGreen focus:border-darkGreen"
    >
      <option>None</option>
      <option>A-Minor</option>
      <option>A-Major</option>
      <option>A#-Minor</option>
      <option>A#-Major</option>
      <option>B-Minor</option>
      <option>B-Major</option>
      <option>C-Minor</option>
      <option>C-Major</option>
      <option>C#-Minor</option>
      <option>C#-Major</option>
      <option>D-Minor</option>
      <option>D-Major</option>
      <option>D#-Minor</option>
      <option>D#-Major</option>
      <option>E-Minor</option>
      <option>E-Major</option>
      <option>F-Minor</option>
      <option>F-Major</option>
      <option>F#-Minor</option>
      <option>F#-Major</option>
      <option>G-Minor</option>
      <option>G-Major</option>
      <option>G#-Minor</option>
    </select>
    <label for="category" class="block mb-2 text-sm font-medium text-white"
      >Category</label
    >
    <select
      required
      name="instrument"
      class="w-64 border text-sm rounded-lg block p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-darkGreen focus:border-darkGreen"
    >
      <option value="other">Other or Don't Know</option>
      <option value="bass">Bass</option>
      <option value="drums">Drums</option>
      <option value="fx">Fx</option>
      <option value="guitar">Guitar</option>
      <option value="keys">Keys</option>
      <option value="orchestral">Orchestal</option>
      <option value="vocals">Vocal</option>
    </select>
    <label for="timesig" class="block text-sm font-medium text-white"
      >Time Signature</label
    >
    <div class="flex" id="timesig">
      <input
        type="number"
        required
        name="timesig1"
        class="mr-2 w-16 border text-sm rounded-lg block p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-darkGreen focus:border-darkGreen"
        placeholder="4"
      />
      <span
        class="border text-sm rounded-lg block p-2.5 bg-neutral-600 border-neutral-600"
        >/</span
      >
      <input
        type="number"
        required
        name="timesig2"
        class="ml-2 w-16 border text-sm rounded-lg block p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-darkGreen focus:border-darkGreen"
        placeholder="4"
      />
    </div>
    <label class="block mb-2 text-sm font-medium text-white" for="audio"
      >Upload file (mp3, wav, ogg, mid)</label
    >
    <input
      name="audio"
      required
      accept="audio/mpeg, audio/ogg, audio/wav, audio/midi, audio/x-midi"
      class="p-2 block w-full text-sm rounded-lg border cursor-pointer text-neutral-400 focus:outline-none bg-neutral-700 border-neutral-600"
      type="file"
    />
    <div class="my-2">
    <Turnstile bind:reset/>
  </div>
    <div class="flex items-start mb-6">
      <div class="flex items-center h-5">
        <input
          type="checkbox"
          bind:checked={tos}
          value=""
          class="w-4 h-4 rounded border focus:ring-3 bg-gray-700 border-gray-600 focus:ring-darkGreen ring-offset-gray-800"
          required
        />
      </div>
      <label for="terms" class="ml-2 text-sm font-medium text-gray-300"
        >I agree with the
        <a href="/terms.txt" class="text-lightGreen hover:underline">terms</a> and
        the fact that we store your entered details and Internet Protocol Adress
        (securely).</label
      >
    </div>
    <button
      type="submit"
      on:click={(e) => {
        if (!tos) {
          e.preventDefault();
        }
      }}
      class={"text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-green-800 " +
        (tos
          ? "bg-green-900"
          : "outline outline-neutral-200 cursor-not-allowed")}
    >
      Upload to Floopr.org
    </button>
  </form>
</main>
