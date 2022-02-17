<script context="module" lang="ts">
  declare const WebUI: any;
  declare const username;

</script>
<script lang="ts">

  import { ChatState } from '$lib/types/chat-state';
  import { MessageTarget, MessageTargetString } from '$lib/types/message-target';
  import type { Message, MessagePayload } from '$lib/types/message';
  import { translate } from '$lib/translate';
  import { onMount, tick } from 'svelte';
  import Highlight from '../components/Highlight.svelte';
  import ChatSender from '../components/ChatSender.svelte';
  import ChatStatePopup from '../components/ChatStatePopup.svelte';
  import { isVU } from '../lib/vu';


  const timeout = 2750;

  let debugMode = true;

  let hasMouse = false;
  let messages: Message[] = [];
  let showChat = false;
  let chatState: ChatState = ChatState.Popup;
  let isTypingActive = false;
  let chatTarget = MessageTarget.CctSayAll;
  let playerName: string = null;
  let playerList: string[] = [];
  let messageWrapper: HTMLDivElement;
  let scroller: HTMLElement = null;
  let stillForce = true;
  let input: HTMLInputElement;

  export const ssr = false;

  let shouldChatScroll = false;
  let scrollingToBottom = false;

  async function scrollUpdate() {
    // const st = scroller.scrollTop, sh = scroller.scrollHeight, ch = scroller.clientHeight;
    // console.log('shouldChatScroll:', shouldChatScroll, ch + st === sh);
    await scrollToBottom(stillForce);
    scrollingToBottom = false;
  }

  function scrollUpdated() {
    if (!scrollingToBottom) {
      const { scrollTop, scrollHeight, clientHeight } = scroller;
      const currentPosition = clientHeight + scrollTop;
      shouldChatScroll = currentPosition === scrollHeight;
      // console.log('max:', scrollHeight, ', current:', currentPosition, shouldChatScroll);

      if (!shouldChatScroll) {
        stillForce = false;
      }
    }
  }

  onMount(() => {
    // for debug
    if (!isVU()) {
      playerList = ['UZQueen', 'ellipsi2', 'youseeme'];
    }

    console.log('appending functions');
    (<any>window).OnFocus = onFocus;
    (<any>window).OnMessage = onMessage;
    (<any>window).OnChangeType = onChangeType;
    (<any>window).OnUpdatePlayerName = onUpdatePlayerName;
    (<any>window).OnUpdatePlayerList = onUpdatePlayerList;
    (<any>window).OnClearChat = clearChat;

    window.addEventListener('resize', () => {
      // if (messageWrapper) {
      // scrollToBottom(messageWrapper);
      //}
      if (scroller) {
        scrollUpdate();
      }
    });

    // let interval: any;

    /*
    if (!isTypingActive) {
      if (chatState === ChatState.Popup) {
        if (interval) {
          clearTimeout(interval);
        }
        showChat = true;
        interval = setTimeout(() => {
          showChat = false;
        }, 5000);

        return () => {
          clearTimeout(interval);
        };
      } else if (chatState === ChatState.Always) {
        showChat = true;
      } else {
        showChat = false;
      }
    } else {
      clearTimeout(interval);
    } */

    if (messageWrapper && !isTypingActive) {
      scrollToBottom(stillForce);
    }
    if (!isVU()) {
      if (!window.location || (<any>window.location).ancestorOrigins[0] !== 'webui://main') {
        debugMode = true;
      }
    }

  });


  function setRandomMessages() {
    addMessage({
      message: Math.random().toString() + Math.random().toString(),
      senderName: !isVU() ? 'TESTNAME' : username(),
      messageTarget: MessageTarget.CctSayAll,
      playerRelation: 'none',
      targetName: null,
    });

    messageReceived();
  }

  function addMessage(newMessage: Message) {
    if (messages.length >= 50) {
      const prev = messages.slice(1, 50);
      prev.push(newMessage);
      messages = prev;
    } else {
      messages = [...messages, newMessage];
    }

    // message updated
    scrollUpdate();
  }

  function getChatItemClasses(message: Message): string {
    let classes = `chatItem chatType${MessageTargetString[message.messageTarget]}`;

    switch (message.playerRelation) {
      case 'localPlayer':
        classes += ' chatLocalPlayer';
        break;
      case 'squadMate':
        classes += ' chatSquadMate';
        break;
      case 'spectator':
        classes += ' chatSpectator';
        break;
    }

    return classes;
  }

  function getChatItemTarget(message: Message): string {
    const target = message.messageTarget;
    if (target === MessageTarget.CctPlayer || target === MessageTarget.CctAdminPlayer) {
      if (message.playerRelation === 'localPlayer') {
        return message.targetName !== undefined ? `${message.targetName}에게` : '받음';
      } else {
        return '받음';
      }
    } else if (target === MessageTarget.CctEnemy) {
      return '전체';
    } else {
      return MessageTargetString[target];
    }
  }

  function getChatSenderName(name: string) {
    return name;
  }

  async function scrollToBottom(force = false/*element: HTMLElement*/) {
    // element.scroll({ top: messageWrapper.scrollHeight, behavior: 'auto' });
    if (shouldChatScroll || force) {
      scrollingToBottom = true;
      await tick();
      scroller.scrollTo(0, scroller.scrollHeight);
    }
  }

  function onFocus(target: MessageTarget) {
    if (isVU()) {
      WebUI.Call('BringToFront');
      WebUI.Call('EnableKeyboard');
      WebUI.Call('EnableMouse');
    }

    if (prevTimeoutEvent) {
      clearTimeout(prevTimeoutEvent);
    }

    showChat = true;
    chatTarget = target;
    isTypingActive = true;
    hasMouse = true;
    tick().then(() => input.focus());
  }

  // console.log((<any>window).OnFocus);
  // console.log(window);

  function onMessage(data: MessagePayload) {
    // console.log(data);
    let messageText: string;
    if (data.target === MessageTarget.CctSquadLeader) {

    }
    addMessage({
      message: translate(data.content.toString()),
      senderName: data.author.toString(),
      messageTarget: data.target,
      playerRelation: data.playerRelation,
      targetName: data.targetName,
    });

    messageReceived();
  }

  let prevTimeoutEvent;
  function messageReceived() {
    if (chatState !== ChatState.Hidden) {
      console.log('show')
      showChat = true;
    }

    if (prevTimeoutEvent) {
      clearTimeout(prevTimeoutEvent);
    }

    if (chatState !== ChatState.Always) {
      prevTimeoutEvent = setTimeout(() => {
        showChat = false;
        prevTimeoutEvent = undefined;
      }, timeout);
    }
  }

  function onChangeType() {
    if (chatState === ChatState.Popup) {
      chatState = ChatState.Always;
    } else if (chatState === ChatState.Always) {
      chatState = ChatState.Hidden;
    } else {
      chatState = ChatState.Popup;
    }
  }

  function onUpdatePlayerName(newName: any) {
    playerName = `@${newName.toString()}`;
  }


  function onUpdatePlayerList(players: Record<string, string>) {
    /*
    const playerNames = Object.values(players);
    if (playerNames.length > 0) {
      playerList = playerNames;
    } // */

    // ????

    playerList = Object.values(players).filter(v => typeof v === 'string');
  }

  function clearChat() {
    messages = [];
  }

  function close(slow = true) {
    if (isVU()) {
      WebUI.Call('DispatchEventLocal', 'WebUI:SetCursor');
    }

    if (prevTimeoutEvent) {
      clearTimeout(prevTimeoutEvent);
    }

    if (slow) {
      prevTimeoutEvent = setTimeout(() => {
        showChat = false;
        clearTimeout(prevTimeoutEvent);
      }, timeout);
    } else {
      showChat = false;
    }

    hasMouse = false;
    isTypingActive = false;
  }

  function getColor(target: MessageTarget) {
    switch (target) {
      case MessageTarget.CctAdmin:
      case MessageTarget.CctAdminAnonym:
        return 'decoration-red-500';
      case MessageTarget.CctPlayer:
      case MessageTarget.CctAdminPlayer:
        return 'decoration-lime-500';
      case MessageTarget.CctTeam:
        return 'decoration-sky-400';
      case MessageTarget.CctSquad:
      case MessageTarget.CctSquadLeader:
        return 'decoration-green-500';
      case MessageTarget.CctEnemy:
      case MessageTarget.CctSayAll:
      case MessageTarget.CctSpectator:
        return 'decoration-neutral-50';
    }
  }

  function getBorderColor(target: MessageTarget) {
    switch (target) {
      case MessageTarget.CctAdmin:
      case MessageTarget.CctAdminAnonym:
        return 'border-red-500';
      case MessageTarget.CctPlayer:
      case MessageTarget.CctAdminPlayer:
        return 'border-lime-500';
      case MessageTarget.CctTeam:
        return 'border-sky-400';
      case MessageTarget.CctSquad:
      case MessageTarget.CctSquadLeader:
        return 'border-green-500';
      case MessageTarget.CctEnemy:
      case MessageTarget.CctSayAll:
      case MessageTarget.CctSpectator:
        return 'border-neutral-50';
    }
    console.log(target);
    return 'border-neutral-50';
  }

  export let name: string;
  const dev = !isVU();

  $: showChatClass = showChat ? 'showChat' : 'hideChat';
  $: isTypingActiveOrAlways = isTypingActive || chatState === ChatState.Always;
  // $: console.log({ isTypingActiveOrAlways, isTypingActive, chatState })

</script>

<div id="class-placeholder" class="hidden opacity-0
            decoration-red-500 decoration-lime-500 decoration-green-500 decoration-sky-400  decoration-neutral-50
            border-red-500 border-lime-500 border-green-500 border-sky-400 border-neutral-50"></div>

<main>
  {#if dev}

    <div id="" style="opacity: 0.75;">
      <button on:click="{setRandomMessages}">랜덤 메시지 발송</button>
      <button on:click="{() => onFocus(MessageTarget.CctSayAll)}">isTypingActive</button>
      <button on:click="{() => onFocus(MessageTarget.CctPlayer)}">isTypingActive2</button>
      <button onClick={onChangeType}>OnChangeType</button>
      <button onClick={clearChat}>OnClearChat</button>
      <button onClick={() => close(true)}>OnCloseChat</button>

    </div>
  {/if}

  <div class="absolute left-[3vw] top-[6vh]">
    <div id="vu-chat"
         class="relative text-sm shadow-md shadow-gray-500 w-[25.2vw] h-[28.15vh]
              bg-black/50 border-t border-sky-500 select-none text-white transition transition-all ease-in-out delay-150"
          class:hasMouse={hasMouse} class:opacity-0={!showChat}>
      <div class="scroller absolute w-full inset-0 overflow-x-hidden overflow-y-scroll"
           on:scroll={scrollUpdated} bind:this={scroller}>
        <div class="scroller-content justify-end min-h-0 items-stretch">
          {#each messages as msg}
            <div class="{getChatItemClasses(msg)} block bg-white/25 shadow-md p-1 m-1 border-l-2 {getBorderColor(msg.messageTarget)}">
            <span class="chatMessageTarget">
              [{getChatItemTarget(msg)}]
            </span>
              <span class="chatSender underline decoration-2 font-semibold {getColor(msg.messageTarget)}">
              {getChatSenderName(msg.senderName)}</span>:
              <span class="chatMessage break-all">
              {#if playerName}
                <Highlight search={playerName} text={msg.message} />
              {:else}
                {msg.message}
              {/if}
            </span>
            </div>
          {/each}
        </div>
      </div>
    </div>
    <div class:opacity-0={!isTypingActive} class="transition transition-all ease-in-out delay-150">
      <ChatSender bind:isTypingActive={isTypingActive} bind:target={chatTarget}
                  on:sent={() => close(true)} on:escape={() => close(false)} bind:playerList={playerList} bind:input={input} />
    </div>
    <ChatStatePopup bind:chatState={chatState} />
  </div>
</main>

<style>
  ::-webkit-scrollbar {
    width: 0.5rem;
    background-color: transparent;
  }

  ::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
  }

  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #4a4d52;
    border: 2px solid #282a2d;
    border-radius: 10px;
    margin: 0.25rem 0;
    right: 0.25rem;
  }
</style>