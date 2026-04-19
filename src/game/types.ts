// 游戏共享类型

export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover'

export type EnemyKind = 'small' | 'medium' | 'boss'

export interface Vector2 {
  x: number
  y: number
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface InputState {
  left: boolean
  right: boolean
  up: boolean
  down: boolean
}

export interface ShakeState {
  duration: number
  magnitude: number
}
