<script lang="ts">
  import { ChatState, ChatStateString } from '$lib/types/chat-state';
  import { onMount } from 'svelte';

  export let chatState: ChatState;

  let firstRun = true;
  let visible = false;

  onMount(() => {
    if (firstRun) {
      firstRun = false;
      return;
    }

    visible = true;

    const interval = setTimeout(() => {
      visible = false;
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  $: stateString = ChatStateString[chatState] ? ChatStateString[chatState] : '';
</script>

{#if visible}
  <div id="VuChatStatePopup">
    채팅 모드: {stateString}
  </div>
{/if}