# Venice Unleashed 한글 채팅

한글 입력이 추가되었습니다. 채팅 키는 원래의 배틀필드와 같습니다.  
단 배틀필드가 자체적으로 한글 입력을 지원하지 않아, 윈도우의 입력 방식은 영어로 고정되어있어야 하며 **한/영 전환**은 *LeftShift + Space*로 합니다.

사용할 경우 꼭 `LICENSE.md` 파일을 읽어보세요.

## 기술적 요점

또한 VU의 텍스트 인코딩 처리 방식이 매우 이상해서 WebUI 사이드에서 변환을 거칩니다. 따라서 RCon 같은 걸로 채팅을 보면 텍스트 처리가 깨져보입니다. 여러가지 방안은 있겠지만 (RCon 툴을 새로 만든다던지) 당장은 `ui/src/lib/translate.ts` 파일을 참조해서 직접 재해석 하셔야 합니다.

IME의 경우 [colspan](http://colspan.net/hangulime/)에서 가져와 MIT 라이센스를 그대로 따릅니다. 단 자체 레이아웃에 맞게 수정되어있습니다.

이 아래는 원본이 된 ReadMe 입니다. 단 WebUI 사이드는 아예 새로 만들어서 작동하지 않거나 다르게 작동하는 게 있을 가능성이 높습니다.

# BetterIngameChat

Based on the [Advanced-Chat](https://github.com/EmulatorNexus/Advanced-Chat/) mod BetterIngameChat is a replacement for the default chat window.

### Features
- Responsive layout
- Color represented channels (heavily inspired by the Reality Mod's chat UI design)
  - All = Orange (enemy), Blue (teammate), Lime (squadmate)
  - Team = Blue
  - Squad = Lime
  - SquadLeader = Teal
  - DirectMessage = Purple
  - Admin = Pink
  
- Direct Messages
  - Press **Shift + Chatkey**, search for the player's name, Tab or select his name from the dropdown, type in the message and send.
- Name highlighter
  - If you send a message that contains `@PlayerNameHere`, thier name will get highlighted for them.
- Spectator chat support
- End of round chat support
- Squad Leader channel support - **Shift + AllChatkey**
- Admin support (requires gameAdmin to track if they are admin)
  - **Ctrl + AllChatkey**  - Admin message to all channel
  - **Ctrl + TeamChatkey**  - Anonymus admin message to all channel
  - **Ctrl + SquadChatkey**  - Admin direct mesage to a player
- **(SOON™)** Emoji support like: `:pog:`

### Devs
- [Flash_Hit](https://github.com/FlashHit)
- [KVN](https://github.com/kaloczikvn)

Big thanks to the original crators of the Advanced-Chat mod:
- [FoolHen](https://github.com/FoolHen)
- [OrfeasZ](https://github.com/OrfeasZ)
- [Powback](https://github.com/Powback)

*We wanted to create a Pull Request first but Vue is really not my cup of tea and I don't want to overwrite the whole ui of your project just beacuse I work in React, but we can still contribute to that project if you'd like it!*
