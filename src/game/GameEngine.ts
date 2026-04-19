import { useGameStore } from '../store/gameStore'
import { CANVAS, FX } from './config'
import { Bullet } from './entities/Bullet'
import type { Enemy } from './entities/Enemy'
import { Player } from './entities/Player'
import { CollisionSystem } from './systems/CollisionSystem'
import { DifficultySystem } from './systems/DifficultySystem'
import { EffectSystem } from './systems/EffectSystem'
import { InputSystem } from './systems/InputSystem'
import { ParticleSystem } from './systems/ParticleSystem'
import { SpawnSystem } from './systems/SpawnSystem'
import type { GamePhase } from './types'

// 游戏引擎:rAF 主循环 + delta time;只在 phase==='playing' 时 update,始终 render。
// 暂停/退出由 InputSystem 边沿触发,经 store 切换 phase。
// 检测 phase 重新进入 'playing' 时调用 resetRun(),用于初次开局与游戏结束后重开。
export class GameEngine {
  private ctx: CanvasRenderingContext2D
  private input = new InputSystem()
  private player = new Player()
  private playerBullets: Bullet[] = []
  private enemies: Enemy[] = []
  private enemyBullets: Bullet[] = []
  private spawnSystem = new SpawnSystem()
  private difficulty = new DifficultySystem()
  private particles = new ParticleSystem()
  private effects = new EffectSystem()
  private rafId = 0
  private lastTime = 0
  private running = false
  private prevPhase: GamePhase = 'menu'

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to acquire 2D context')
    this.ctx = ctx
    this.effects.init()
  }

  start(): void {
    if (this.running) return
    this.running = true
    this.input.attach()
    this.lastTime = performance.now()
    this.prevPhase = useGameStore.getState().phase
    this.rafId = requestAnimationFrame(this.tick)
  }

  destroy(): void {
    this.running = false
    cancelAnimationFrame(this.rafId)
    this.input.detach()
  }

  private tick = (now: number): void => {
    if (!this.running) return
    const dt = Math.min((now - this.lastTime) / 1000, 0.05)
    this.lastTime = now

    this.handleEdgeInputs()
    this.handlePhaseTransition()

    if (useGameStore.getState().phase === 'playing') {
      this.update(dt)
    }
    this.render()
    this.rafId = requestAnimationFrame(this.tick)
  }

  // 处理 Space 暂停切换、Esc 打开退出确认(确认弹窗显示时忽略 Space)。
  private handleEdgeInputs(): void {
    const store = useGameStore.getState()
    if (this.input.consumePauseToggle()) {
      if (!store.showQuitConfirm) {
        if (store.phase === 'playing') store.setPhase('paused')
        else if (store.phase === 'paused') store.setPhase('playing')
      }
    }
    if (this.input.consumeEscape()) {
      store.openQuitConfirm()
    }
  }

  // 当 phase 由非 playing 进入 playing(开局或重开),清场并复位玩家/生成器。
  // paused → playing 不触发(prevPhase 是 paused 而不是 menu/gameover)。
  private handlePhaseTransition(): void {
    const cur = useGameStore.getState().phase
    if (cur === 'playing' && this.prevPhase !== 'playing' && this.prevPhase !== 'paused') {
      this.resetRun()
    }
    this.prevPhase = cur
  }

  private resetRun(): void {
    this.player.reset()
    this.playerBullets = []
    this.enemies = []
    this.enemyBullets = []
    this.spawnSystem.reset()
    this.difficulty.reset()
    this.particles.reset()
    this.effects.reset()
  }

  private update(dt: number): void {
    this.player.update(dt, this.input.getState(), this.playerBullets)

    for (const b of this.playerBullets) b.update(dt)
    for (const e of this.enemies) e.update(dt, this.enemyBullets)
    for (const b of this.enemyBullets) b.update(dt)

    this.difficulty.update(dt)
    this.spawnSystem.update(dt, this.enemies, {
      spawn: this.difficulty.getSpawnMul(),
      speed: this.difficulty.getSpeedMul(),
    })
    this.particles.update(dt)
    this.effects.update(dt)

    const kills = CollisionSystem.playerBulletsVsEnemies(
      this.playerBullets,
      this.enemies,
    )
    if (kills.length > 0) {
      const store = useGameStore.getState()
      for (const k of kills) {
        store.addScore(k.score)
        const cx = k.x + k.width / 2
        const cy = k.y + k.height / 2
        const burstCount = k.kind === 'boss' ? FX.particleCountOnKill * 4 : FX.particleCountOnKill
        this.particles.burst(cx, cy, k.color, burstCount)
        if (k.kind === 'boss') {
          this.effects.shake(FX.shakeDuration * 6, FX.shakeMagnitude * 2.5)
        } else {
          this.effects.shake()
        }
      }
    }

    const hitByEnemy = CollisionSystem.playerVsEnemies(this.player, this.enemies)
    const hitByBullet = !hitByEnemy &&
      CollisionSystem.playerVsEnemyBullets(this.player, this.enemyBullets)
    if (hitByEnemy || hitByBullet) {
      this.handlePlayerHit()
    }

    this.playerBullets = this.playerBullets.filter((b) => b.alive)
    this.enemyBullets = this.enemyBullets.filter((b) => b.alive)
    this.enemies = this.enemies.filter((e) => e.alive)
  }

  // 玩家被击中:扣命(loseLife 内部决定是否进入 gameover)、清空敌方子弹避免连击、复活并进入无敌。
  // 同时在玩家位置爆炸粒子并触发更强震动。
  private handlePlayerHit(): void {
    const cx = this.player.x + this.player.width / 2
    const cy = this.player.y + this.player.height / 2
    this.particles.burst(cx, cy, '#bde6ff', FX.particleCountOnKill * 2)
    this.effects.shake(FX.shakeDuration * 4, FX.shakeMagnitude * 2)
    useGameStore.getState().loseLife()
    this.enemyBullets = []
    this.player.respawn()
  }

  private render(): void {
    const ctx = this.ctx
    ctx.fillStyle = CANVAS.bgColor
    ctx.fillRect(0, 0, CANVAS.width, CANVAS.height)
    this.effects.renderStars(ctx)

    const offset = this.effects.consumeOffset()
    if (offset) {
      ctx.save()
      ctx.translate(offset.x, offset.y)
    }
    for (const b of this.enemyBullets) b.render(ctx)
    for (const e of this.enemies) e.render(ctx)
    for (const b of this.playerBullets) b.render(ctx)
    this.player.render(ctx)
    this.particles.render(ctx)
    if (offset) ctx.restore()
  }
}
