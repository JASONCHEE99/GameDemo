import { CANVAS, PLAYER, PLAYER_BULLET } from '../config'
import type { InputState } from '../types'
import { Bullet } from './Bullet'
import { Entity } from './Entity'

const DIAGONAL = 1 / Math.SQRT2

// 玩家飞机:键盘控制移动 + 200ms 自动开火。垂直活动范围限制在屏幕底部 1/4。
// 命中后通过 respawn() 复位坐标并启动 1.5s 无敌(渲染期间闪烁)。
export class Player extends Entity {
  private fireCooldown = 0
  private flameTimer = 0
  private invincibleTimer = 0

  constructor() {
    super(
      CANVAS.width / 2 - PLAYER.width / 2,
      CANVAS.height * 0.85,
      PLAYER.width,
      PLAYER.height,
    )
  }

  reset(): void {
    this.x = CANVAS.width / 2 - PLAYER.width / 2
    this.y = CANVAS.height * 0.85
    this.fireCooldown = 0
    this.invincibleTimer = 0
    this.alive = true
  }

  respawn(): void {
    this.reset()
    this.invincibleTimer = PLAYER.invincibleTime
  }

  isInvincible(): boolean {
    return this.invincibleTimer > 0
  }

  update(dt: number, input: InputState, bullets: Bullet[]): void {
    if (this.invincibleTimer > 0) this.invincibleTimer -= dt

    let dx = 0
    let dy = 0
    if (input.left) dx -= 1
    if (input.right) dx += 1
    if (input.up) dy -= 1
    if (input.down) dy += 1
    if (dx !== 0 && dy !== 0) {
      dx *= DIAGONAL
      dy *= DIAGONAL
    }
    this.x += dx * PLAYER.speed * dt
    this.y += dy * PLAYER.speed * dt

    if (this.x < 0) this.x = 0
    if (this.x + this.width > CANVAS.width) this.x = CANVAS.width - this.width
    const minY = CANVAS.height * PLAYER.minYRatio
    const maxY = CANVAS.height * PLAYER.maxYRatio - this.height
    if (this.y < minY) this.y = minY
    if (this.y > maxY) this.y = maxY

    this.fireCooldown -= dt
    if (this.fireCooldown <= 0) {
      bullets.push(
        new Bullet(
          this.x + this.width / 2 - PLAYER_BULLET.width / 2,
          this.y - PLAYER_BULLET.height,
          0,
          -PLAYER_BULLET.speed,
        ),
      )
      this.fireCooldown = PLAYER.fireInterval
    }

    this.flameTimer += dt
  }

  render(ctx: CanvasRenderingContext2D): void {
    // 无敌时按 ~10Hz 闪烁(每 0.05s 切换显示)
    if (this.isInvincible() && Math.floor(this.invincibleTimer * 20) % 2 === 0) {
      return
    }

    const cx = this.x + this.width / 2
    const flameY = this.y + this.height
    const flicker = (Math.sin(this.flameTimer * 30) + 1) * 2
    ctx.fillStyle = '#ff8c1a'
    ctx.fillRect(cx - 7, flameY, 4, 6 + flicker)
    ctx.fillRect(cx + 3, flameY, 4, 6 + flicker)
    ctx.fillStyle = '#ffd24d'
    ctx.fillRect(cx - 2, flameY, 4, 4 + flicker)

    ctx.fillStyle = PLAYER.color
    ctx.beginPath()
    ctx.moveTo(cx, this.y)
    ctx.lineTo(this.x, this.y + this.height)
    ctx.lineTo(this.x + this.width, this.y + this.height)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#bde6ff'
    ctx.fillRect(cx - 3, this.y + this.height * 0.45, 6, 6)
  }
}
