<script>
  import { route, server } from "./stores";
  import { get } from "svelte/store";

  const token = localStorage.getItem("supersecrettoken");
  let contacts = [];
  if (!token) {
    route.set("/admin");
  } else {
    // (async () => {
    //   const res = await fetch("http://localhost:3000/v1/contacts", {
    //     headers: {
    //       Authorization: token,
    //     },
    //   });
    //   if (res.ok) {
    //     contacts = await res.json();
    //   } else {
    //     route.set("/admin");
    //   }
    // });
    // Do this but using promises
    fetch("http://localhost:3000/v1/contacts", {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          route.set("/admin");
        }
      })
      .then((res) => {
        contacts = res.contacts;
      });
  }
</script>

{#if contacts.length > 0}
  <ul class="m-4 text-neutral-400">
    {#each contacts as contact}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        class="my-2"
        on:click={() => {
          alert(contact.message);
          if (
            confirm(
              "Do you want to delete this message? Cancel to not, OK to delete."
            )
          ) {
            fetch("http://localhost:3000/v1/contacts/" + contact._id, {
              method: "DELETE",
              headers: {
                Authorization: token,
              },
            }).then(() => {
              route.set("/admin");
            });
          }
        }}
      >
        "<span class="text-white font-bold">{contact.subject}</span>" from
        <span class="text-white font-bold">{contact.email}</span>
      </li>
    {/each}
  </ul>
{:else}
    <p class="text-white text-4xl font-bold">No messages</p>
{/if}
