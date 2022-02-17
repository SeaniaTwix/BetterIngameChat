
export enum MessageTarget {
  CctSayAll = 'all',
  CctTeam = 'team',
  CctSquad = 'squad',
  CctSquadLeader = 'squadLeader',
  CctAdmin = 'admin',
  CctPlayer = 'player',
  CctEnemy = 'enemy',
  CctSpectator = 'spectator',
  CctAdminAnonym = 'adminAnonym',
  CctAdminPlayer = 'adminPlayer',
}

export const MessageTargetString = {
  [MessageTarget.CctSayAll]: '전체',
  [MessageTarget.CctTeam]: '팀',
  [MessageTarget.CctSquad]: '분대',
  [MessageTarget.CctSquadLeader]: '리더',
  [MessageTarget.CctAdmin]: '관리자',
  [MessageTarget.CctPlayer]: '플레이어',
  [MessageTarget.CctEnemy]: '적',
  [MessageTarget.CctSpectator]: '관전자',
  [MessageTarget.CctAdminAnonym]: '관리자',
  [MessageTarget.CctAdminPlayer]: '관리자',
}
