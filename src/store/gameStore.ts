import { create } from 'zustand'
import { PLAYER, STORAGE } from '../game/config'
import type { GamePhase } from '../game/types'

// 读取本地存储的最高分,失败时返回 0
function readHighScore(): number {
  try {
    const raw = localStorage.getItem(STORAGE.highScoreKey)
    const n = raw ? Number.parseInt(raw, 10) : 0
    return Number.isFinite(n) ? n : 0
  } catch {
    return 0
  }
}

function writeHighScore(value: number): void {
  try {
    localStorage.setItem(STORAGE.highScoreKey, String(value))
  } catch {
    /* ignore quota / privacy errors */
  }
}

interface GameStore {
  phase: GamePhase
  score: number
  lives: number
  highScore: number
  showQuitConfirm: boolean
  setPhase: (phase: GamePhase) => void
  addScore: (delta: number) => void
  loseLife: () => void
  resetRun: () => void
  openQuitConfirm: () => void
  cancelQuitConfirm: () => void
  confirmQuit: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'menu',
  score: 0,
  lives: PLAYER.initialLives,
  highScore: readHighScore(),
  showQuitConfirm: false,

  setPhase: (phase) => set({ phase }),

  addScore: (delta) => set({ score: get().score + delta }),

  loseLife: () => {
    const next = get().lives - 1
    if (next <= 0) {
      const score = get().score
      const high = get().highScore
      if (score > high) {
        writeHighScore(score)
        set({ lives: 0, phase: 'gameover', highScore: score })
      } else {
        set({ lives: 0, phase: 'gameover' })
      }
    } else {
      set({ lives: next })
    }
  },

  resetRun: () =>
    set({
      score: 0,
      lives: PLAYER.initialLives,
      phase: 'playing',
      showQuitConfirm: false,
    }),

  // Esc 在 playing/paused 时打开退出确认,游戏暂停在背后等待。
  openQuitConfirm: () => {
    const phase = get().phase
    if (phase === 'playing' || phase === 'paused') {
      set({ showQuitConfirm: true, phase: 'paused' })
    }
  },

  cancelQuitConfirm: () => set({ showQuitConfirm: false, phase: 'playing' }),

  confirmQuit: () => set({ showQuitConfirm: false, phase: 'menu' }),
}))
