import { FX } from '../config'
import { Particle } from '../entities/Particle'

// 粒子系统:burst() 在指定坐标向四周均匀+随机扰动喷射粒子。
export class ParticleSystem {
  private particles: Particle[] = []

  burst(x: number, y: number, color: string, count: number = FX.particleCountOnKill): void {
    const speedRange = FX.particleSpeedMax - FX.particleSpeedMin
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4
      const speed = FX.particleSpeedMin + Math.random() * speedRange
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed
      this.particles.push(new Particle(x, y, vx, vy, FX.particleLife, color))
    }
  }

  update(dt: number): void {
    for (const p of this.particles) p.update(dt)
    this.particles = this.particles.filter((p) => p.alive)
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) p.render(ctx)
  }

  reset(): void {
    this.particles = []
  }
}
