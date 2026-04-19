import { CANVAS, PLAYER_BULLET } from '../config'
import { Entity } from './Entity'

export interface BulletOptions {
  width?: number
  height?: number
  color?: string
  damage?: number
  glow?: number
}

// 子弹:玩家与敌方共用,以 vx/vy 决定方向。出屏自动 alive=false。
// glow > 0 时使用 shadowBlur 渲染发光,用于高阶玩家子弹的视觉差异。
export class Bullet extends Entity {
  damage: number
  color: string
  glow: number

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    opts: BulletOptions = {},
  ) {
    super(
      x,
      y,
      opts.width ?? PLAYER_BULLET.width,
      opts.height ?? PLAYER_BULLET.height,
    )
    this.vx = vx
    this.vy = vy
    this.color = opts.color ?? PLAYER_BULLET.color
    this.damage = opts.damage ?? PLAYER_BULLET.damage
    this.glow = opts.glow ?? 0
  }

  update(dt: number): void {
    this.x += this.vx * dt
    this.y += this.vy * dt
    if (
      this.y + this.height < 0 ||
      this.y > CANVAS.height ||
      this.x + this.width < 0 ||
      this.x > CANVAS.width
    ) {
      this.alive = false
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.glow > 0) {
      ctx.shadowBlur = this.glow
      ctx.shadowColor = this.color
    }
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
    if (this.glow > 0) {
      ctx.shadowBlur = 0
    }
  }
}
