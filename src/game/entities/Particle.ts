import { Entity } from './Entity'

// 粒子:由 ParticleSystem 在击毁敌机时批量生成。life 递减,渲染时按比例淡出。
export class Particle extends Entity {
  life: number
  private maxLife: number
  color: string
  private size: number

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    life: number,
    color: string,
    size = 3,
  ) {
    super(x, y, size, size)
    this.vx = vx
    this.vy = vy
    this.life = life
    this.maxLife = life
    this.color = color
    this.size = size
  }

  update(dt: number): void {
    this.x += this.vx * dt
    this.y += this.vy * dt
    this.life -= dt
    if (this.life <= 0) this.alive = false
  }

  render(ctx: CanvasRenderingContext2D): void {
    const alpha = Math.max(0, this.life / this.maxLife)
    ctx.globalAlpha = alpha
    ctx.fillStyle = this.color
    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size)
    ctx.globalAlpha = 1
  }
}
