import { CANVAS, FX } from '../config'

interface Star {
  x: number
  y: number
  speed: number
  size: number
}

interface ShakeOffset {
  x: number
  y: number
}

// 视觉效果系统:滚动星空背景 + 屏幕震动偏移。
// 星空在 init/reset 时一次性生成;震动由 shake() 触发,引擎渲染前 consumeOffset()。
export class EffectSystem {
  private stars: Star[] = []
  private shakeTimer = 0
  private shakeMagnitude = 0

  init(): void {
    this.stars = []
    const speedRange = FX.starSpeedMax - FX.starSpeedMin
    for (let i = 0; i < FX.starCount; i++) {
      this.stars.push({
        x: Math.random() * CANVAS.width,
        y: Math.random() * CANVAS.height,
        speed: FX.starSpeedMin + Math.random() * speedRange,
        size: Math.random() < 0.3 ? 2 : 1,
      })
    }
  }

  reset(): void {
    this.shakeTimer = 0
    this.shakeMagnitude = 0
    this.init()
  }

  shake(duration: number = FX.shakeDuration, magnitude: number = FX.shakeMagnitude): void {
    if (duration > this.shakeTimer) this.shakeTimer = duration
    if (magnitude > this.shakeMagnitude) this.shakeMagnitude = magnitude
  }

  update(dt: number): void {
    for (const s of this.stars) {
      s.y += s.speed * dt
      if (s.y > CANVAS.height) {
        s.y = -s.size
        s.x = Math.random() * CANVAS.width
      }
    }
    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt
      if (this.shakeTimer <= 0) {
        this.shakeTimer = 0
        this.shakeMagnitude = 0
      }
    }
  }

  renderStars(ctx: CanvasRenderingContext2D): void {
    for (const s of this.stars) {
      ctx.fillStyle = s.size > 1 ? '#ffffff' : '#7d8fb3'
      ctx.fillRect(s.x, s.y, s.size, s.size)
    }
  }

  // 返回当前帧应施加的位移偏移(无震动时返回 null)。
  consumeOffset(): ShakeOffset | null {
    if (this.shakeTimer <= 0) return null
    return {
      x: (Math.random() * 2 - 1) * this.shakeMagnitude,
      y: (Math.random() * 2 - 1) * this.shakeMagnitude,
    }
  }
}
