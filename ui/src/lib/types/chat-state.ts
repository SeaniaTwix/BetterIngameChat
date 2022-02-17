export enum ChatState {
  Popup,
  Always,
  Hidden,
}

export const ChatStateString = {
  [ChatState.Popup]: '팝업',
  [ChatState.Always]: '고정',
  [ChatState.Hidden]: '숨김',
}