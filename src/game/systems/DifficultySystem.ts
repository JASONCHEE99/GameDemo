import { DIFFICULTY } from '../config'

// 难度系统:每存活 stepSeconds 秒提升一档。
// spawnMul 收缩出怪间隔(更密),speedMul 加快敌机移动。两者各有上下限防止变态。
export class DifficultySystem {
  private elapsed = 0

  reset(): void {
    this.elapsed = 0
  }

  update(dt: number): void {
    this.elapsed += dt
  }

  getElapsed(): number {
    return this.elapsed
  }

  getSpawnMul(): number {
    const steps = Math.floor(this.elapsed / DIFFICULTY.stepSeconds)
    return Math.max(
      DIFFICULTY.spawnMulMin,
      Math.pow(DIFFICULTY.spawnMulPerStep, steps),
    )
  }

  getSpeedMul(): number {
    const steps = Math.floor(this.elapsed / DIFFICULTY.stepSeconds)
    return Math.min(
      DIFFICULTY.speedMulMax,
      Math.pow(DIFFICULTY.speedMulPerStep, steps),
    )
  }
}
