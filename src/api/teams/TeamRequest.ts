
export interface TeamRequest {
  name: string
  logoUrl: string
  coach: string
  shortCode: string
  colorCode: string
  captainId: number
  bgImage: string
  viceCaptainId: number | undefined
  players: number[]
}

export interface TeamInfo {
  id: number
  name: string
  shortCode: string
  logoUrl?: string
  colorCode?: string
  coach?: string
  bgImage?: string
  players: {
    id: number,
    name: string,
    role: string
  }[]
  captainName: string
  captainId: number
  viceCaptainId?: number
}
