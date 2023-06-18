<script>
  import { toast } from "@zerodevx/svelte-toast";
</script>

<!-- Centered contact form, posting JSON data to the backend -->
<section>
  <div class="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
    <h2
      class="mb-4 text-4xl tracking-tight font-extrabold text-center text-white"
    >
      Contact Us
    </h2>
    <p class="mb-8 lg:mb-16 font-light text-center text-neutral-400 sm:text-xl">
      Got a technical issue or want to report copyright infringement, or
      anything else, fill out this form.
    </p>
    <form
      on:submit|preventDefault={async () => {
        const data = new FormData(document.querySelector("form"));
        const json = Object.fromEntries(data.entries());
        const fetched = await fetch("http://localhost:3000/v1/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(json),
        });
        // On success, show a success message
        // On error, show an error message
        fetched.status === 429
          ? toast.push(
              "You're sending too many messages! Please wait until " +
                new Date(fetched.headers.get("X-RateLimit-Rese")).toDateString()
            )
          : fetched.status === 200
          ? toast.push("Message sent!")
          : toast.push(
              "Something went wrong, we're sorry! We've hopefully logged your message. No guarantees though."
            );
      }}
      class="space-y-8"
    >
      <div>
        <label
          for="email"
          class="block mb-2 text-sm font-medium text-neutral-300"
          >Your email</label
        >
        <input
          type="email"
          id="email"
          name="email"
          class="shadow-sm border text-sm rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-green-500 focus:border-green-500 shadow-sm-light"
          placeholder="hi@floopr.org"
          required
        />
      </div>
      <div>
        <label
          for="subject"
          class="block mb-2 text-sm font-medium text-neutral-300">Subject</label
        >
        <input
          type="text"
          id="subject"
          name="subject"
          class="block p-3 w-full text-sm rounded-lg border shadow-sm bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-green-500 focus:border-green-500 shadow-sm-light"
          placeholder="Let us know how we can help you"
          required
        />
      </div>
      <div class="sm:col-span-2">
        <label
          for="message"
          class="block mb-2 text-sm font-medium text-neutral-400"
          >Your message</label
        >
        <textarea
          id="message"
          name="message"
          rows="6"
          class="block p-2.5 w-full text-sm rounded-lg shadow-sm border bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-green-500 focus:border-green-500"
          placeholder="Leave a comment..."
        />
      </div>
      <div class="cf-turnstile my-4" data-sitekey="0x4AAAAAAACTyQUMezKXzh3x" />
      <button
        type="submit"
        class="py-3 px-5 text-sm font-medium text-center text-white rounded-lg sm:w-fit focus:ring-4 focus:outline-none bg-green-600 hover:bg-green-700 focus:ring-green-800"
        >Send message</button
      >
    </form>
  </div>
  <script
    src="https://challenges.cloudflare.com/turnstile/v0/api.js"
    defer
  ></script>
</section>
