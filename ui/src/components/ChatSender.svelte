<script lang="ts">
	import { onMount, createEventDispatcher, tick } from 'svelte';
  import { MessageTarget, MessageTargetString } from '$lib/types/message-target';
  import Svelecte from 'svelecte';
  import { isVU } from '../lib/vu';

  export let target: MessageTarget;
  export let isTypingActive: boolean;
  export let playerList: string[];
  export let input: HTMLInputElement;

  let message = '';
  let message1 = '';
  let targetName: string = null;
  let inKorean = true;

  const dispatch = createEventDispatcher();

  declare const JS_IM, JS_IM_hangul;
  declare const WebUI: any;

  function attachIME(element) {
    // new JS_IM(element, JS_IM_hangul);
  }

  onMount(async () => {
    console.log('is vu?:', isVU())

    if (targetName) {
      message = '';
    }

    if (isTypingActive && input) {
      return;
    }

    targetName = null;
    resetKeyboardAndMouse();
  })

  function checkIME() {
    inKorean = input?.getAttribute('ko') === 'true';
  }

  let imeSet = false;
  function onKeydown(event: KeyboardEvent) {
    if (!imeSet) {
      imeSet = true;
      new JS_IM(input, JS_IM_hangul);
    }
    checkIME();

    // console.log((<any>event.target).value)

    if (event.isComposing || event.keyCode === 229) {
      return;
    }

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        onSubmit(event.target as HTMLInputElement);
        break;
      case 'Escape':
        targetName = null;
        resetInputMessage();
        resetKeyboardAndMouse();
        dispatch('escape');
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        break;
    }
  }

  function onBlur(typeHead = false) {
    setTimeout(() => {
      if (typeHead && targetName) {
        return;
      } else {
        resetInputMessage();
      }

      targetName = null;
      resetKeyboardAndMouse();
    }, 100);
  }

  async function onSubmit(inputElem: HTMLInputElement) {
    if ((target === MessageTarget.CctPlayer || target === MessageTarget.CctAdminPlayer) && !targetName) {
      return;
    }

    message = inputElem.value;

    if (message.trim().length > 0 && isVU()) {
      WebUI.Call('DispatchEventLocal', 'WebUI:OutgoingChatMessage', JSON.stringify({
        message,
        target,
        targetName,
      }));
    } else {
      console.log({
        message,
        target,
        targetName,
      })
    }

    targetName = null;
    await tick();
    input.blur()
    await resetInputMessage();
    resetKeyboardAndMouse();
  }

  async function resetInputMessage() {
    await tick();
    message = '';
  }

  function resetKeyboardAndMouse() {
    dispatch('sent');
  }

  async function selected() {
    targetName = MessageTarget.CctSayAll;
    // await tick();
    message = `${message} `;
    await tick();
    input.focus();
  }

  $: options = playerList.map((name) => ({id: name, name}));
  $: TargetString = MessageTargetString[target] ? MessageTargetString[target] : ''
  $: cond = (target === MessageTarget.CctPlayer || target === MessageTarget.CctAdminPlayer) && !targetName;

  const allowEditing = true;
</script>
<div class="w-full shadow-md shadow-gray-100 bg-white/75 border-b flex mt-4">
  <div id="chatForm" class="{TargetString} w-12 p2 min-w-[2rem] text-center pt-1">
    <label for="sender">{targetName ? targetName : TargetString}</label>
  </div>
  <input id="sender" type="text" maxLength="127" bind:value={message} on:keydown={onKeydown} on:keyup={checkIME}
         class:hidden={cond}
         on:blur={() => onBlur(false)} spellCheck="false" bind:this={input} use:attachIME
         class="p-2 w-full focus:outline-none flex-auto flex-shrink-1 text-sm scroll-y-auto bg-transparent" />
  <div class="min-w-[2.5rem] border-2 border-gray/25 text-sm flex-shrink-0 text-center pt-1">
    {inKorean ? '한' : '영'}
  </div>
</div>
{#if isTypingActive}
  {#if cond}
    <Svelecte {options} bind:value={message} max='3' {allowEditing} on:change={selected}
              on:blur={() => onBlur(true)} placeholder='플레이어를 검색...' class="w-full p-2 shadow-md shadow-gray-100" />
  {:else}
  {/if}
{/if}