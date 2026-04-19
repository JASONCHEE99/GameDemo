import { CANVAS, PLAYER_BULLET } from '../config'
import { Entity } from './Entity'

export interface BulletOptions {
  width?: number
  height?: number
  color?: string
  damage?: number
}

// 子弹:玩家与敌方共用,以 vx/vy 决定方向。出屏自动 alive=false。
export class Bullet extends Entity {
  damage: number
  color: string

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
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}
