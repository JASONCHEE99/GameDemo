import {
  CANVAS,
  ENEMY_BOSS,
  ENEMY_BULLET,
  ENEMY_MEDIUM,
  ENEMY_SMALL,
} from '../config'
import type { EnemyKind } from '../types'
import { Bullet } from './Bullet'
import { Entity } from './Entity'

// 敌机基类:hp / score / kind 由子类在构造时确定。子类自行实现 update 与 render。
// update 接受可选的 enemyBullets 数组(供 Boss 写入开火),其他敌机忽略此参数。
export abstract class Enemy extends Entity {
  hp: number
  score: number
  kind: EnemyKind
  color: string

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    hp: number,
    score: number,
    kind: EnemyKind,
    color: string,
  ) {
    super(x, y, width, height)
    this.hp = hp
    this.score = score
    this.kind = kind
    this.color = color
  }

  abstract update(dt: number, enemyBullets: Bullet[]): void
  abstract render(ctx: CanvasRenderingContext2D): void
}

// 小型:垂直下落,出底部即销毁。
export class SmallEnemy extends Enemy {
  constructor(x: number) {
    super(
      x,
      -ENEMY_SMALL.height,
      ENEMY_SMALL.width,
      ENEMY_SMALL.height,
      ENEMY_SMALL.hp,
      ENEMY_SMALL.score,
      'small',
      ENEMY_SMALL.color,
    )
  }

  update(dt: number): void {
    this.y += ENEMY_SMALL.speed * dt
    if (this.y > CANVAS.height) this.alive = false
  }

  render(ctx: CanvasRenderingContext2D): void {
    const cx = this.x + this.width / 2
    ctx.fillStyle = ENEMY_SMALL.color
    ctx.beginPath()
    ctx.moveTo(cx, this.y + this.height)
    ctx.lineTo(this.x, this.y)
    ctx.lineTo(this.x + this.width, this.y)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#ffe1e1'
    ctx.fillRect(cx - 2, this.y + this.height * 0.35, 4, 4)
  }
}

// 中型:之字形(基于初始 x 与 sin 时间)。
export class MediumEnemy extends Enemy {
  private baseX: number
  private timer = 0

  constructor(baseX: number) {
    super(
      baseX,
      -ENEMY_MEDIUM.height,
      ENEMY_MEDIUM.width,
      ENEMY_MEDIUM.height,
      ENEMY_MEDIUM.hp,
      ENEMY_MEDIUM.score,
      'medium',
      ENEMY_MEDIUM.color,
    )
    this.baseX = baseX
  }

  update(dt: number): void {
    this.timer += dt
    this.y += ENEMY_MEDIUM.speed * dt
    const offset =
      Math.sin(this.timer * ENEMY_MEDIUM.frequency * Math.PI * 2) *
      ENEMY_MEDIUM.amplitude
    this.x = this.baseX + offset
    if (this.x < 0) this.x = 0
    if (this.x + this.width > CANVAS.width) this.x = CANVAS.width - this.width
    if (this.y > CANVAS.height) this.alive = false
  }

  render(ctx: CanvasRenderingContext2D): void {
    const cx = this.x + this.width / 2
    const cy = this.y + this.height / 2
    ctx.fillStyle = ENEMY_MEDIUM.color
    ctx.beginPath()
    ctx.moveTo(cx, this.y)
    ctx.lineTo(this.x + this.width, cy)
    ctx.lineTo(cx, this.y + this.height)
    ctx.lineTo(this.x, cy)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#1a0a2a'
    ctx.fillRect(cx - 4, cy - 4, 8, 8)
  }
}

// Boss:入场下落 → 巡航 + 周期三向散射(±25° 与 0°)。
type BossPhase = 'entering' | 'patrol'

export class BossEnemy extends Enemy {
  private phase: BossPhase = 'entering'
  private fireTimer = ENEMY_BOSS.fireInterval
  private patrolDir = 1
  private maxHp: number

  constructor() {
    super(
      CANVAS.width / 2 - ENEMY_BOSS.width / 2,
      -ENEMY_BOSS.height,
      ENEMY_BOSS.width,
      ENEMY_BOSS.height,
      ENEMY_BOSS.hp,
      ENEMY_BOSS.score,
      'boss',
      ENEMY_BOSS.color,
    )
    this.maxHp = ENEMY_BOSS.hp
  }

  update(dt: number, enemyBullets: Bullet[]): void {
    if (this.phase === 'entering') {
      this.y += ENEMY_BOSS.enterSpeed * dt
      if (this.y >= ENEMY_BOSS.hoverY) {
        this.y = ENEMY_BOSS.hoverY
        this.phase = 'patrol'
      }
      return
    }

    this.x += ENEMY_BOSS.patrolSpeed * this.patrolDir * dt
    if (this.x <= 0) {
      this.x = 0
      this.patrolDir = 1
    } else if (this.x + this.width >= CANVAS.width) {
      this.x = CANVAS.width - this.width
      this.patrolDir = -1
    }

    this.fireTimer -= dt
    if (this.fireTimer <= 0) {
      this.fireTimer = ENEMY_BOSS.fireInterval
      this.fire(enemyBullets)
    }
  }

  private fire(enemyBullets: Bullet[]): void {
    const cx = this.x + this.width / 2 - ENEMY_BULLET.width / 2
    const muzzleY = this.y + this.height
    const spreadDeg = ENEMY_BOSS.bulletSpread
    const angles = [-spreadDeg, 0, spreadDeg]
    for (const deg of angles) {
      const rad = (deg * Math.PI) / 180
      const vx = Math.sin(rad) * ENEMY_BOSS.bulletSpeed
      const vy = Math.cos(rad) * ENEMY_BOSS.bulletSpeed
      enemyBullets.push(
        new Bullet(cx, muzzleY, vx, vy, {
          width: ENEMY_BULLET.width,
          height: ENEMY_BULLET.height,
          color: ENEMY_BULLET.color,
          damage: ENEMY_BULLET.damage,
        }),
      )
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const cx = this.x + this.width / 2
    ctx.fillStyle = ENEMY_BOSS.color
    ctx.fillRect(this.x, this.y + 12, this.width, this.height - 20)
    ctx.fillRect(this.x + 8, this.y, this.width - 16, 16)
    ctx.fillStyle = '#a36a00'
    ctx.fillRect(this.x - 6, this.y + 24, 10, 24)
    ctx.fillRect(this.x + this.width - 4, this.y + 24, 10, 24)
    ctx.fillStyle = '#fff7c4'
    ctx.fillRect(cx - 6, this.y + 28, 12, 12)
    ctx.fillStyle = '#3a1a00'
    ctx.fillRect(cx - 4, this.y + this.height - 8, 8, 10)

    const barW = this.width
    const barH = 4
    const barY = this.y - 10
    ctx.fillStyle = '#3a1010'
    ctx.fillRect(this.x, barY, barW, barH)
    ctx.fillStyle = '#ff5050'
    ctx.fillRect(this.x, barY, barW * (this.hp / this.maxHp), barH)
  }
}
