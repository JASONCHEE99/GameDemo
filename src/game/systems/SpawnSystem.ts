import { CANVAS, ENEMY_BOSS, ENEMY_MEDIUM, ENEMY_SMALL } from '../config'
import { BossEnemy, MediumEnemy, type Enemy, SmallEnemy } from '../entities/Enemy'

export interface DifficultyMul {
  spawn: number
  speed: number
}

// 敌机生成系统:三类计时器独立递减。Boss 存活期间压制中型/Boss 生成,小型保持节奏。
// 难度倍率在每次重置计时器时即时应用 — spawn 收缩间隔,speed 注入到敌机构造。
export class SpawnSystem {
  private smallTimer: number = ENEMY_SMALL.spawnInterval
  private mediumTimer: number = ENEMY_MEDIUM.spawnInterval
  private bossTimer: number = ENEMY_BOSS.spawnInterval

  reset(): void {
    this.smallTimer = ENEMY_SMALL.spawnInterval
    this.mediumTimer = ENEMY_MEDIUM.spawnInterval
    this.bossTimer = ENEMY_BOSS.spawnInterval
  }

  update(dt: number, enemies: Enemy[], mul: DifficultyMul): void {
    const bossAlive = enemies.some((e) => e.kind === 'boss')

    this.smallTimer -= dt
    if (this.smallTimer <= 0) {
      this.smallTimer = ENEMY_SMALL.spawnInterval * mul.spawn
      this.spawnSmallWave(enemies, mul.speed)
    }

    this.mediumTimer -= dt
    if (this.mediumTimer <= 0) {
      this.mediumTimer = ENEMY_MEDIUM.spawnInterval * mul.spawn
      if (!bossAlive) this.spawnMedium(enemies, mul.speed)
    }

    this.bossTimer -= dt
    if (this.bossTimer <= 0) {
      this.bossTimer = ENEMY_BOSS.spawnInterval * mul.spawn
      if (!bossAlive) enemies.push(new BossEnemy(mul.speed))
    }
  }

  private spawnSmallWave(enemies: Enemy[], speedMul: number): void {
    const span = ENEMY_SMALL.perWaveMax - ENEMY_SMALL.perWaveMin + 1
    const count = ENEMY_SMALL.perWaveMin + Math.floor(Math.random() * span)
    for (let i = 0; i < count; i++) {
      const x = Math.random() * (CANVAS.width - ENEMY_SMALL.width)
      enemies.push(new SmallEnemy(x, speedMul))
    }
  }

  private spawnMedium(enemies: Enemy[], speedMul: number): void {
    const baseX =
      ENEMY_MEDIUM.amplitude +
      Math.random() *
        (CANVAS.width - ENEMY_MEDIUM.width - ENEMY_MEDIUM.amplitude * 2)
    enemies.push(new MediumEnemy(baseX, speedMul))
  }
}
