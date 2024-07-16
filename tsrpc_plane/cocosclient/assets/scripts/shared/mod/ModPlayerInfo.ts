export interface PlayerInfo
{
    id: string
    name: string
    avatar?: string
    state:PlayerStatus
}

export enum PlayerStatus
{
    Online,
    Offline,
}