<script lang="ts">
    import type { Option, TurnstileSize, TurnstileTheme } from './types';
    import type { SupportedLanguages } from 'turnstile-types';
    import { createEventDispatcher, onMount } from 'svelte';
    import type { Action } from 'svelte/action';

    const dispatch = createEventDispatcher<{
        'turnstile-callback': { token: string };
        'turnstile-error': {};
        'turnstile-expired': {};
        'turnstile-timeout': {};
    }>();

    let loaded = hasTurnstile();
    let mounted = false;

    let widgetId: string;

    let siteKey: string = "0x4AAAAAAACTyQUMezKXzh3x";

    let appearance: Option<'appearance'> = 'always';
    let language: SupportedLanguages | 'auto' = 'auto';
    let formsField: string = 'cf-turnstile-response';
    let execution: Option<'execution'> = 'render';
    let action: string | undefined = undefined;
    let cData: string | undefined = undefined;
    let retryInterval: number | undefined = 2000;
    let retry: Option<'retry'> = 'auto';
    let theme: TurnstileTheme = 'dark';
    let size: TurnstileSize = "normal"
    let forms = true;
    let tabIndex = 0;

    onMount(() => {
        mounted = true;

        return () => {
            mounted = false;
        };
    });

    function hasTurnstile() {
        if (typeof window == 'undefined') return null;
        return 'turnstile' in window;
    }

    function loadCallback() {
        loaded = true;
    }

    function error() {
        dispatch('turnstile-error', {});
    }

    function expired() {
        dispatch('turnstile-expired', {});
    }

    function timeout() {
        dispatch('turnstile-timeout', {});
    }

    function callback(token: string) {
        dispatch('turnstile-callback', { token });
    }

    export function reset(): void {
        window.turnstile.reset(widgetId);
    }

    const turnstile: Action = (node) => {
        const id = window.turnstile.render(node, {
            'timeout-callback': timeout,
            'expired-callback': expired,
            'error-callback': error,
            callback,

            sitekey: siteKey,

            'response-field-name': formsField,
            'retry-interval': retryInterval,
            'response-field': forms,
            tabindex: tabIndex,
            appearance,
            execution,
            language,
            action,
            retry,
            theme,
            cData,
            size,
        });

        widgetId = id;

        return {
            destroy: () => {
                window.turnstile.remove(id);
            },
        };
    };
</script>

<svelte:head>
    {#if mounted && !loaded}
        <script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            on:load={loadCallback}
            async></script>
    {/if}
</svelte:head>

{#if loaded && mounted}
    {#key $$props}
        <div use:turnstile />
    {/key}
{/if}
