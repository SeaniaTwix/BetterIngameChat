import type { MessageTarget } from '$lib/types/message-target';

export type PlayerRelation = 'localPlayer' | 'squadMate' | 'spectator' | 'none';

export interface Message {
  message: string;
  senderName: string;
  messageTarget: MessageTarget;
  playerRelation: PlayerRelation;
  targetName: string | null;
}

export interface MessagePayload {
  content: any;
  author: any;
  target: MessageTarget;
  playerRelation: PlayerRelation;
  targetName: string | null;
}
