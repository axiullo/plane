export interface PlayerInfo
{
    id: string
    name: string
    avatar?: string
    state:PlayerState
}

export enum PlayerState
{
    Online,
    Offline,
}