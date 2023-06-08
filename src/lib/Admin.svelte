<script>
  let token = localStorage.getItem("supersecrettoken");
  let items = [];
  fetch("http://localhost:3000/v1/submissions", {
    headers: {
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((json) => {
      items = json;
      console.log(items);
    });

  let active = "never-gonna-give-you-up";
  let activeItem;
  $: activeItem = items.find((item) => item._id === active);

  const approve = () => {
    fetch("http://localhost:3000/v1/approve/"+activeItem._id, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: activeItem._id,
        title: activeItem.title,
        tempo: activeItem.tempo,
        key: activeItem.key,
        instrument: activeItem.instrument,
        timesig: activeItem.timesig,
        files: activeItem.files,
        author: activeItem.author,
      }),
    }).then((response) => {
      if (response.status === 200) {
        items = items.filter((item) => item._id !== active);
        active = items[0]._id;
      }
    });
  };
  const reject = () => {
    fetch("http://localhost:3000/v1/"+activeItem._id, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    }).then((response) => {
      if (response.status === 200) {
        items = items.filter((item) => item._id !== active);
        active = items[0]._id;
      }
    });
  };
  const banandreject = () => {
    fetch("http://localhost:3001/v1/admin/ban/", {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({
        _id: activeItem._id,
        submissionIP: activeItem.submissionIP,
      }),
    }).then((response) => {
      if (response.status === 200) {
        items = items.filter((item) => item._id !== active);
        active = items[0]._id;
      }
    });
  };
</script>

{#if token}
  <h1 class="text-4xl text-white font-bold">Admin</h1>
  <div class="w-full h-full bg-neutral-950 flex rounded">
    <aside
      id="default-sidebar"
      class="relative top-0 left-0 z-40 w-64 min-h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div class="h-full px-3 py-4 overflow-y-auto bg-stone-800">
        <ul class="space-y-2 font-medium">
          {#each items as item}
            <button
              on:click={() => {
                active = item._id;
              }}
              class="hover:brightness-110 flex items-center p-2 text-white rounded-lg {active ===
              item._id
                ? 'bg-green-700'
                : 'bg-stone-700'}"
            >
              <span
                ><span class="font-bold" title={item.title}
                  >{item.title.slice(0, 11)}</span
                >
                by
                <span title={item.author}>{item.author.slice(0, 11)}</span
                ></span
              >
            </button>
          {/each}
        </ul>
      </div>
    </aside>
    <main class="m-8 text-white">
      {#if active && activeItem}
        <h1 class="text-4xl font-extrabold text-white">
          {activeItem.title}
        </h1>
        <p class="text-lg text-neutral-500">
          by {activeItem.author} from {activeItem.submissionEmail} on
          {activeItem.submissionIP}
        </p>
        <form
          class="mt-4"
          on:submit|preventDefault={() => {
            console.log("USER TRIED TO SUBMIT, BUT WE CAN'T");
          }}
        >
          {#each activeItem.files as value}
            <button
              on:click|preventDefault={() => {
                fetch(
                  "http://localhost:3001/v1/submissions/" +
                    activeItem._id +
                    "." +
                    value,
                  {
                    headers: {
                      Authorization: token,
                    },
                  }
                )
                  .then((response) => response.blob())
                  .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.target = "_blank";
                    link.click();
                  });
              }}
              class="h-10 overflow-hidden mb-4 py-2.5 px-5 text-sm font-medium focus:outline-none rounded-full border focus:z-10 focus:ring-4 focus:ring-neutral-700 bg-neutral-800 text-neutral-400 border-neutral-600 hover:text-white hover:bg-neutral-700"
              >{value.toUpperCase()}</button
            >
          {/each}
          <label for="tempo" class="block text-sm font-medium text-white"
            >Tempo</label
          >
          <input
            type="number"
            required
            name="tempo"
            id="tempo"
            class="w-64 mb-4 border text-sm rounded-lg block p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-darkGreen focus:border-darkGreen"
            value={activeItem.tempo}
          />
          <div class="mb-6">
            <label for="title" class="block text-sm font-medium text-white"
              >Title</label
            >
            <input
              name="title"
              id="title"
              class="border text-sm rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-blue-500 focus:border-blue-500"
              value={activeItem.title}
              required
            />
          </div>
          <div class="mb-6">
            <label for="timesig" class="block text-sm font-medium text-white"
              >Time Signature</label
            >
            <input
              name="timesig"
              id="timesig"
              class="border text-sm rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-blue-500 focus:border-blue-500"
              value={activeItem.timesig}
              required
            />
          </div>
          <div class="mb-6">
            <label for="key" class="block mb-2 text-sm font-medium text-white"
              >Key</label
            >
            <select
              id="key"
              name="key"
              value={activeItem.key}
              class="border text-sm rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-blue-500 focus:border-blue-500"
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
          </div>
          <div class="mb-6">
            <label
              for="instrument"
              class="block mb-2 text-sm font-medium text-white"
              >Instrument</label
            >
            <select
              id="instrument"
              name="instrument"
              value={activeItem.instrument}
              class="border text-sm rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-blue-500 focus:border-blue-500"
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
          </div>
        </form>
        <div class="bg-stone-800 p-4 rounded">
          <button
            on:click={approve}
            class="relative inline-flex items-center justify-center p-0.5 m-1 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-green-800"
          >
            <span
              class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-neutral-900 rounded-md group-hover:bg-opacity-0"
            >
              Approve
            </span>
          </button>
          <button
            on:click={reject}
            class="relative inline-flex items-center justify-center p-0.5 m-1 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 text-white hover:text-neutral-900 focus:ring-4 focus:outline-none focus:ring-lime-800"
          >
            <span
              class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-neutral-900 rounded-md group-hover:bg-opacity-0"
            >
              Decline
            </span>
          </button>
          <button
            on:click={banandreject}
            class="relative inline-flex items-center justify-center p-0.5 m-1 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white text-white focus:ring-4 focus:outline-none focus:ring-pink-800"
          >
            <span
              class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-neutral-900 rounded-md group-hover:bg-opacity-0"
            >
              Decline and Ban IP
            </span>
          </button>
        </div>
      {:else}
        Hi, I'm the admin page. I'm not sure what you're doing here, but I don't
        think you're supposed to be here.
      {/if}
    </main>
  </div>
{:else}
  <h1 class="text-4xl text-white font-bold">Not authorized</h1>
  <p class="text-stone-400">
    You are not authorized to view this page. If you actually are a Floopr
    Admin, please enter your admin key.
  </p>
  <div class="mt-6">
    <input
      id="token"
      class="border text-sm rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-blue-500 focus:border-blue-500"
      required
    />
    <button
      on:click={() => {
        let token = document.getElementById("token");
        //@ts-ignore
        localStorage.supersecrettoken = token.value;
      }}
      class="mt-6 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
      >Submit</button
    >
  </div>
{/if}
