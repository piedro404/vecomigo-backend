import { User } from "./user.types"
import { Video } from "./video.types"

export enum RoomStatus {
  WAITING = 'WAITING',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
}

export type Room = {
  id: string
  name: string
  users: Map<string, User>
  playlist: Video[]
  currentVideoIndex: number
  status: RoomStatus
  createdAt: Date
}