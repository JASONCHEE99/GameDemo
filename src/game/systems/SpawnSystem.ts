import { CANVAS, ENEMY_BOSS, ENEMY_MEDIUM, ENEMY_SMALL } from '../config'
import { BossEnemy, MediumEnemy, type Enemy, SmallEnemy } from '../entities/Enemy'

// 敌机生成系统:三类计时器独立递减。Boss 存活期间压制中型/Boss 生成,小型保持节奏。
export class SpawnSystem {
  private smallTimer = ENEMY_SMALL.spawnInterval
  private mediumTimer = ENEMY_MEDIUM.spawnInterval
  private bossTimer = ENEMY_BOSS.spawnInterval

  reset(): void {
    this.smallTimer = ENEMY_SMALL.spawnInterval
    this.mediumTimer = ENEMY_MEDIUM.spawnInterval
    this.bossTimer = ENEMY_BOSS.spawnInterval
  }

  update(dt: number, enemies: Enemy[]): void {
    const bossAlive = enemies.some((e) => e.kind === 'boss')

    this.smallTimer -= dt
    if (this.smallTimer <= 0) {
      this.smallTimer = ENEMY_SMALL.spawnInterval
      this.spawnSmallWave(enemies)
    }

    this.mediumTimer -= dt
    if (this.mediumTimer <= 0) {
      this.mediumTimer = ENEMY_MEDIUM.spawnInterval
      if (!bossAlive) this.spawnMedium(enemies)
    }

    this.bossTimer -= dt
    if (this.bossTimer <= 0) {
      this.bossTimer = ENEMY_BOSS.spawnInterval
      if (!bossAlive) enemies.push(new BossEnemy())
    }
  }

  private spawnSmallWave(enemies: Enemy[]): void {
    const span = ENEMY_SMALL.perWaveMax - ENEMY_SMALL.perWaveMin + 1
    const count = ENEMY_SMALL.perWaveMin + Math.floor(Math.random() * span)
    for (let i = 0; i < count; i++) {
      const x = Math.random() * (CANVAS.width - ENEMY_SMALL.width)
      enemies.push(new SmallEnemy(x))
    }
  }

  private spawnMedium(enemies: Enemy[]): void {
    const baseX =
      ENEMY_MEDIUM.amplitude +
      Math.random() *
        (CANVAS.width - ENEMY_MEDIUM.width - ENEMY_MEDIUM.amplitude * 2)
    enemies.push(new MediumEnemy(baseX))
  }
}
