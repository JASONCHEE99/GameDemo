import type { Bullet } from '../entities/Bullet'
import type { Enemy } from '../entities/Enemy'
import { Entity } from '../entities/Entity'
import type { Player } from '../entities/Player'

function aabb(a: Entity, b: Entity): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}

// 集中碰撞处理:三组 AABB。命中后即修改 alive/hp(同一帧 filter 在引擎中统一执行)。
export class CollisionSystem {
  // 玩家子弹 vs 敌机:返回本帧被击杀的敌机列表(供引擎计分)。
  static playerBulletsVsEnemies(bullets: Bullet[], enemies: Enemy[]): Enemy[] {
    const kills: Enemy[] = []
    for (const b of bullets) {
      if (!b.alive) continue
      for (const e of enemies) {
        if (!e.alive) continue
        if (aabb(b, e)) {
          e.hp -= b.damage
          b.alive = false
          if (e.hp <= 0) {
            e.alive = false
            kills.push(e)
          }
          break
        }
      }
    }
    return kills
  }

  // 玩家 vs 敌机:无敌期间忽略;非 boss 敌机撞击同时销毁(神风),boss 不死。
  static playerVsEnemies(player: Player, enemies: Enemy[]): boolean {
    if (player.isInvincible()) return false
    for (const e of enemies) {
      if (!e.alive) continue
      if (aabb(player, e)) {
        if (e.kind !== 'boss') e.alive = false
        return true
      }
    }
    return false
  }

  // 玩家 vs 敌方子弹:无敌期间忽略;命中后子弹销毁。
  static playerVsEnemyBullets(player: Player, bullets: Bullet[]): boolean {
    if (player.isInvincible()) return false
    for (const b of bullets) {
      if (!b.alive) continue
      if (aabb(player, b)) {
        b.alive = false
        return true
      }
    }
    return false
  }
}
